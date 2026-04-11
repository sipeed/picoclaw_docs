---
id: provider-refactoring
title: Provider 架构重构设计
---

# Provider 架构重构设计

> Issue: #283
> Discussion: #122
> Branch: feat/refactor-provider-by-protocol

## 1. 当前问题

### 1.1 配置结构问题

**现状**：每个 Provider 都需要在 `ProvidersConfig` 中预定义字段

```go
type ProvidersConfig struct {
    Anthropic     ProviderConfig `json:"anthropic"`
    OpenAI        ProviderConfig `json:"openai"`
    DeepSeek      ProviderConfig `json:"deepseek"`
    Qwen          ProviderConfig `json:"qwen"`
    Cerebras      ProviderConfig `json:"cerebras"`
    VolcEngine    ProviderConfig `json:"volcengine"`
    // ... 每增加一个新 Provider 都需要在这里修改
}
```

**问题**：
- 添加新 Provider 需要修改 Go 代码（结构体定义）
- `http_provider.go` 中的 `CreateProvider` 函数有 200+ 行 switch-case
- 大多数 Provider 兼容 OpenAI 协议，但代码大量重复

### 1.2 代码膨胀趋势

近期 PR 说明了这个问题：

| PR | Provider | 代码变更 |
| --- | --- | --- |
| #365 | Qwen | http_provider.go +17 行 |
| #333 | Cerebras | http_provider.go +17 行 |
| #368 | Volcengine | http_provider.go +18 行 |

每个 OpenAI 兼容 Provider 都需要：
1. 修改 `config.go` 添加配置字段
2. 修改 `http_provider.go` 添加 switch case
3. 更新文档

### 1.3 Agent 与 Provider 的耦合

```json
{
  "agents": {
    "defaults": {
      "provider": "deepseek",  // 需要知道 provider 名称
      "model": "deepseek-chat"
    }
  }
}
```

问题：Agent 需要同时知道 `provider` 和 `model`，增加了使用复杂度。

---

## 2. 新方案：model_list

### 2.1 核心原则

参考 [LiteLLM](https://docs.litellm.ai/docs/proxy/configs) 设计理念：

1. **以模型为中心**：用户关心的是模型，而不是提供商
2. **协议前缀**：使用 `协议/模型名` 格式，如 `openai/gpt-5.4`、`anthropic/claude-sonnet-4.6`
3. **配置驱动**：添加新 Provider 只需修改配置，无需改代码

### 2.2 新配置结构

```json
{
  "model_list": [
    {
      "model_name": "deepseek-chat",
      "model": "openai/deepseek-chat",
      "api_base": "https://api.deepseek.com/v1",
      "api_key": "sk-xxx"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "sk-xxx"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_key": "sk-xxx"
    },
    {
      "model_name": "gemini-3-flash",
      "model": "antigravity/gemini-3-flash",
      "auth_method": "oauth"
    },
    {
      "model_name": "my-company-llm",
      "model": "openai/company-model-v1",
      "api_base": "https://llm.company.com/v1",
      "api_key": "xxx"
    }
  ],
  "agents": {
    "defaults": {
      "model": "deepseek-chat",
      "max_tokens": 8192,
      "temperature": 0.7
    }
  }
}
```

### 2.3 Go 结构体定义

```go
type Config struct {
    ModelList []ModelConfig `json:"model_list"`  // 新
    Providers ProvidersConfig `json:"providers"`  // 旧，已废弃

    Agents   AgentsConfig   `json:"agents"`
    Channels ChannelsConfig `json:"channels"`
    // ...
}

type ModelConfig struct {
    // 必填
    ModelName string `json:"model_name"`  // 用户侧别名
    Model     string `json:"model"`       // 协议/模型，如 openai/gpt-5.4

    // 通用配置
    APIBase   string `json:"api_base,omitempty"`
    APIKey    string `json:"api_key,omitempty"`
    Proxy     string `json:"proxy,omitempty"`

    // 特殊 Provider 配置
    AuthMethod  string `json:"auth_method,omitempty"`   // oauth, token
    ConnectMode string `json:"connect_mode,omitempty"`  // stdio, grpc

    // 可选优化
    RPM            int    `json:"rpm,omitempty"`              // 限速
    MaxTokensField string `json:"max_tokens_field,omitempty"` // max_tokens 或 max_completion_tokens
}
```

### 2.4 协议识别

通过 `model` 字段中的前缀识别协议：

| 前缀 | 协议 | 说明 |
| --- | --- | --- |
| `openai/` | OpenAI 兼容 | 最常用，包括 DeepSeek、Qwen、Groq 等 |
| `anthropic/` | Anthropic | Claude 系列专用 |
| `antigravity/` | Antigravity | Google Cloud Code Assist |
| `gemini/` | Gemini | Google Gemini 原生 API |

---

## 3. 设计合理性

### 3.1 解决的问题

| 问题 | 旧方案 | 新方案 |
| --- | --- | --- |
| 添加 OpenAI 兼容 Provider | 需要改 3 处代码 | 只需添加一条配置 |
| Agent 指定模型 | 需要 provider + model | 只需 model |
| 代码重复 | 每个 Provider 重复逻辑 | 共享协议实现 |
| 多 Agent 支持 | 复杂 | 天然兼容 |

### 3.2 多 Agent 兼容性

```json
{
  "model_list": [...],
  "agents": {
    "defaults": {
      "model": "deepseek-chat"
    },
    "coder": {
      "model": "gpt-5.4",
      "system_prompt": "You are a coding assistant..."
    },
    "translator": {
      "model": "claude-sonnet-4.6"
    }
  }
}
```

每个 Agent 只需指定 `model`（对应 `model_list` 中的 `model_name`）。

### 3.3 业界对比

**LiteLLM**（最成熟的开源 LLM Proxy）采用类似设计：

```yaml
model_list:
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-5.4
      api_key: xxx
  - model_name: my-custom
    litellm_params:
      model: openai/custom-model
      api_base: https://my-api.com/v1
```

---

## 4. 迁移计划

### 第一阶段：兼容期（v1.x）

同时支持 `providers` 和 `model_list`：

```go
func (c *Config) GetModelConfig(modelName string) (*ModelConfig, error) {
    // 优先使用新配置
    if len(c.ModelList) > 0 {
        return c.findModelByName(modelName)
    }

    // 向后兼容旧配置
    if !c.Providers.IsEmpty() {
        logger.Warn("'providers' config is deprecated, please migrate to 'model_list'")
        return c.convertFromProviders(modelName)
    }

    return nil, fmt.Errorf("model %s not found", modelName)
}
```

### 第二阶段：警告期（v1.x 后期）

- 在启动时打印更醒目的废弃警告
- 提供自动迁移脚本
- 在文档中将 `providers` 标记为已废弃

### 第三阶段：移除期（v2.0）

- 完全移除 `providers` 支持
- 移除 `agents.defaults.provider` 字段
- 只支持 `model_list`

---

## 5. 实现清单

### 5.1 配置层

- [ ] 添加 `ModelConfig` 结构体
- [ ] 添加 `Config.ModelList` 字段
- [ ] 实现 `GetModelConfig(modelName)` 方法
- [ ] 实现旧配置兼容转换
- [ ] 添加 `model_name` 唯一性校验

### 5.2 Provider 层

- [ ] 创建 `pkg/providers/factory/` 目录
- [ ] 实现 `CreateProviderFromModelConfig()`
- [ ] 将 `http_provider.go` 重构为 `openai/provider.go`
- [ ] 保持旧版 `CreateProvider()` 向后兼容

### 5.3 测试

- [ ] 新配置单元测试
- [ ] 旧配置兼容性测试
- [ ] 集成测试

### 5.4 文档

- [ ] 更新 README
- [ ] 更新 config.example.json
- [ ] 编写迁移指南

---

## 6. 风险与缓解

| 风险 | 缓解措施 |
| --- | --- |
| 现有配置破坏 | 兼容期保持旧配置可用 |
| 用户迁移成本 | 提供自动迁移脚本 |
| 特殊 Provider 不兼容 | 保留 `auth_method` 等扩展字段 |

---

## 7. 参考资料

- [LiteLLM 配置文档](https://docs.litellm.ai/docs/proxy/configs)
- [One-API GitHub](https://github.com/songquanpeng/one-api)
- Discussion #122：Provider 架构重构

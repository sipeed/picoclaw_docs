---
id: model-list-migration
title: 迁移指南：providers → model_list
---

# 迁移指南：从 `providers` 迁移到 `model_list`

本指南介绍如何从旧版 `providers` 配置迁移到新的 `model_list` 格式。

## 为什么要迁移？

新版 `model_list` 配置有以下优势：

- **零代码接入新提供商**：只需修改配置即可添加 OpenAI 兼容的提供商
- **负载均衡**：为同一模型配置多个端点
- **协议前缀路由**：使用 `openai/`、`anthropic/` 等前缀
- **更清晰的配置结构**：以模型为中心，而非以厂商为中心

## 版本时间线

| 版本 | 状态 |
| --- | --- |
| v1.x | 引入 `model_list`，`providers` 已废弃但仍可用 |
| v1.x+1 | 显著的废弃警告，提供迁移工具 |
| 配置 schema v2 | 活跃 schema 中移除 `providers`，旧配置会自动迁移 |

## 迁移前后对比

### 迁移前：旧版 `providers` 配置

```json
{
  "providers": {
    "openai": {
      "api_key": "sk-your-openai-key",
      "api_base": "https://api.openai.com/v1"
    },
    "anthropic": {
      "api_key": "sk-ant-your-key"
    },
    "deepseek": {
      "api_key": "sk-your-deepseek-key"
    }
  },
  "agents": {
    "defaults": {
      "provider": "openai",
      "model": "gpt-5.4"
    }
  }
}
```

### 迁移后：新版 `model_list` 配置（配置 schema v2）

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-your-openai-key"],
      "api_base": "https://api.openai.com/v1"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_keys": ["sk-ant-your-key"]
    },
    {
      "model_name": "deepseek",
      "model": "deepseek/deepseek-chat",
      "api_keys": ["sk-your-deepseek-key"]
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt4"
    }
  }
}
```

:::note `enabled` 字段
`enabled` 字段可以省略 -- 在 V1 到 V2 迁移期间会自动推断（有 API 密钥或名为 `local-model` 的模型默认启用）。对于新配置，你可以显式设置 `"enabled": false` 来禁用模型条目而不删除它。
:::

## 协议前缀

`model` 字段使用 `[协议前缀/]模型标识符` 格式：

| 前缀 | 说明 | 示例 |
| --- | --- | --- |
| `openai/` | OpenAI API（默认） | `openai/gpt-5.4` |
| `anthropic/` | Anthropic API | `anthropic/claude-opus-4` |
| `antigravity/` | Google Cloud（OAuth） | `antigravity/gemini-2.0-flash` |
| `gemini/` | Google Gemini API | `gemini/gemini-2.0-flash-exp` |
| `openrouter/` | OpenRouter | `openrouter/anthropic/claude-sonnet-4.6` |
| `groq/` | Groq API | `groq/llama-3.1-70b` |
| `deepseek/` | DeepSeek API | `deepseek/deepseek-chat` |
| `cerebras/` | Cerebras API | `cerebras/llama-3.3-70b` |
| `qwen/` | 通义千问 | `qwen/qwen-max` |
| `zhipu/` | 智谱 AI | `zhipu/glm-4` |
| `nvidia/` | NVIDIA NIM | `nvidia/llama-3.1-nemotron-70b` |
| `ollama/` | Ollama（本地） | `ollama/llama3` |
| `vllm/` | vLLM（本地） | `vllm/my-model` |
| `moonshot/` | Moonshot（Kimi） | `moonshot/moonshot-v1-8k` |
| `volcengine/` | 火山引擎 | `volcengine/doubao-pro-32k` |
| `shengsuanyun/` | 神算云 | `shengsuanyun/deepseek-v3` |

**注意**：如果不指定前缀，默认使用 `openai/`。

## ModelConfig 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `model_name` | 是 | 模型别名（在 `agents.defaults.model_name` 中引用） |
| `model` | 是 | 协议前缀 + 模型标识符（如 `openai/gpt-5.4`） |
| `api_base` | 否 | API 地址 URL |
| `api_keys` | 视情况* | API 认证密钥（数组；支持多个密钥用于负载均衡） |
| `enabled` | 否 | 该模型条目是否启用。迁移期间默认为 `true`（有 API 密钥或名为 `local-model` 的模型自动启用）。设为 `false` 可禁用。 |
| `proxy` | 否 | HTTP 代理地址 |
| `auth_method` | 否 | 认证方式：`oauth`、`token` |
| `connect_mode` | 否 | CLI 提供商连接模式：`stdio`、`grpc` |
| `rpm` | 否 | 每分钟请求数限制 |
| `request_timeout` | 否 | HTTP 请求超时时间（秒）；`<=0` 使用默认值 `120s` |

*基于 HTTP 的协议需要 `api_keys`，除非 `api_base` 指向本地服务。

:::note API Key 格式变更
在配置 schema V2 中，`api_key`（单数）已**移除**，仅支持 `api_keys`（数组）。从 V0/V1 迁移时，`api_key` 和 `api_keys` 会自动合并为新的 `api_keys` 数组。
:::

## 负载均衡

有两种方式配置负载均衡：

### 方式一：`api_keys` 中使用多个密钥（推荐）

```json
{
  "model_list": [
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key1", "sk-key2", "sk-key3"],
      "api_base": "https://api.openai.com/v1"
    }
  ]
}
```

或通过 `.security.yml`：

```yaml
model_list:
  gpt4:
    api_keys:
      - "sk-key1"
      - "sk-key2"
      - "sk-key3"
```

### 方式二：多个模型条目

```json
{
  "model_list": [
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key1"],
      "api_base": "https://api1.example.com/v1"
    },
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key2"],
      "api_base": "https://api2.example.com/v1"
    },
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key3"],
      "api_base": "https://api3.example.com/v1"
    }
  ]
}
```

请求 `gpt4` 时，会通过轮询方式分发到三个端点。

## 添加 OpenAI 兼容的新提供商

使用 `model_list` 接入新提供商**无需改动代码**：

```json
{
  "model_list": [
    {
      "model_name": "my-custom-llm",
      "model": "openai/my-model-v1",
      "api_keys": ["your-api-key"],
      "api_base": "https://api.your-provider.com/v1"
    }
  ]
}
```

只需将协议指定为 `openai/`（或省略以使用默认值），并提供该提供商的 API 地址即可。

## 向后兼容

迁移期间，已有的 V0/V1 配置会自动迁移到 V2：

1. 如果 `model_list` 为空而 `providers` 有数据，系统会在内部自动转换
2. V0/V1 配置中的 `api_key`（单数）和 `api_keys`（数组）会自动合并为新的 `api_keys` 数组
3. 会输出废弃警告：`"providers config is deprecated, please migrate to model_list"`
4. 所有现有功能保持不变

## 迁移检查清单

- [ ] 确认当前使用的所有提供商
- [ ] 为每个提供商创建 `model_list` 条目
- [ ] 使用正确的协议前缀
- [ ] 将 `agents.defaults.model_name` 更新为新的 `model_name`
- [ ] 测试所有模型正常工作
- [ ] 删除或注释掉旧的 `providers` 配置段

## 故障排查

### 模型未找到

```
model "xxx" not found in model_list or providers
```

**解决**：确认 `model_list` 中的 `model_name` 与 `agents.defaults.model_name` 中的值一致。

### 未知协议错误

```
unknown protocol "xxx" in model "xxx/model-name"
```

**解决**：使用支持的协议前缀，参考上方[协议前缀表](#协议前缀)。

### 缺少 API Key

```
api_key or api_base is required for HTTP-based protocol "xxx"
```

**解决**：为基于 HTTP 的提供商提供 `api_keys` 和/或 `api_base`。

## 需要帮助？

- [GitHub Issues](https://github.com/sipeed/picoclaw/issues)
- [GitHub Discussions](https://github.com/sipeed/picoclaw/discussions)

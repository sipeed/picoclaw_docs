---
id: model-list
title: 模型配置（model_list）
---

# 模型配置

PicoClaw 采用**以模型为中心**的配置方式。只需指定 `vendor/model` 格式即可接入新的提供商——**零代码改动！**

这种设计还支持**多 Agent** 灵活调用：

- **不同 Agent 使用不同提供商**：每个 Agent 可以有自己的 LLM 提供商
- **模型备用（Fallback）**：配置主要模型和备用模型，提高可靠性
- **负载均衡**：将请求分发到多个端点
- **集中管理**：所有提供商配置在同一个地方

## 支持的提供商

| 提供商 | `model` 前缀 | 默认 API 地址 | 协议 | 获取 API Key |
| --- | --- | --- | --- | --- |
| **OpenAI** | `openai/` | `https://api.openai.com/v1` | OpenAI | [获取](https://platform.openai.com) |
| **Anthropic** | `anthropic/` | `https://api.anthropic.com/v1` | Anthropic | [获取](https://console.anthropic.com) |
| **Venice AI** | `venice/` | `https://api.venice.ai/api/v1` | OpenAI | [获取](https://venice.ai) |
| **智谱 AI（GLM）** | `zhipu/` | `https://open.bigmodel.cn/api/paas/v4` | OpenAI | [获取](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys) |
| **DeepSeek** | `deepseek/` | `https://api.deepseek.com/v1` | OpenAI | [获取](https://platform.deepseek.com) |
| **Google Gemini** | `gemini/` | `https://generativelanguage.googleapis.com/v1beta` | OpenAI | [获取](https://aistudio.google.com/api-keys) |
| **Groq** | `groq/` | `https://api.groq.com/openai/v1` | OpenAI | [获取](https://console.groq.com) |
| **Moonshot（Kimi）** | `moonshot/` | `https://api.moonshot.cn/v1` | OpenAI | [获取](https://platform.moonshot.cn) |
| **通义千问（Qwen）** | `qwen/` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI | [获取](https://dashscope.console.aliyun.com) |
| **NVIDIA** | `nvidia/` | `https://integrate.api.nvidia.com/v1` | OpenAI | [获取](https://build.nvidia.com) |
| **Ollama（本地）** | `ollama/` | `http://localhost:11434/v1` | OpenAI | 无需 Key |
| **LM Studio（本地）** | `lmstudio/` | `http://localhost:1234/v1` | OpenAI | 可选（本地默认无需密钥） |
| **OpenRouter** | `openrouter/` | `https://openrouter.ai/api/v1` | OpenAI | [获取](https://openrouter.ai/keys) |
| **vLLM（本地）** | `vllm/` | `http://localhost:8000/v1` | OpenAI | 无需 Key |
| **Cerebras** | `cerebras/` | `https://api.cerebras.ai/v1` | OpenAI | [获取](https://cerebras.ai) |
| **火山引擎** | `volcengine/` | `https://ark.cn-beijing.volces.com/api/v3` | OpenAI | [获取](https://console.volcengine.com) |
| **BytePlus** | `byteplus/` | `https://ark.ap-southeast.bytepluses.com/api/v3` | OpenAI | [获取](https://console.byteplus.com) |
| **Mistral** | `mistral/` | `https://api.mistral.ai/v1` | OpenAI | [获取](https://console.mistral.ai) |
| **LiteLLM** | `litellm/` | `http://localhost:4000/v1` | OpenAI | 本地代理 |
| **神算云** | `shengsuanyun/` | `https://router.shengsuanyun.com/api/v1` | OpenAI | [获取](https://router.shengsuanyun.com) |
| **Antigravity** | `antigravity/` | Google Cloud | 自定义 | 仅 OAuth |
| **GitHub Copilot** | `github-copilot/` | `localhost:4321` | gRPC | — |
| **MiMo** | `mimo/` | `https://api.xiaomimimo.com/v1` | OpenAI | [获取](https://platform.xiaomimimo.com) |

## 基础配置

```json
{
  "model_list": [
    {
      "model_name": "ark-code-latest",
      "model": "volcengine/ark-code-latest",
      "api_key": "sk-your-api-key"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "sk-your-openai-key"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6",
      "api_key": "sk-ant-your-key"
    },
    {
      "model_name": "glm-4.7",
      "model": "zhipu/glm-4.7",
      "api_key": "your-zhipu-key"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt-5.4"
    }
  }
}
```

## 模型条目字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model_name` | string | 是 | 别名（在 `agents.defaults.model_name` 中引用） |
| `model` | string | 是 | `vendor/model-id` 格式 |
| `api_key` | string | 视情况 | 提供商 API Key |
| `api_base` | string | 否 | 覆盖默认 API 地址 |
| `auth_method` | string | 否 | 认证方式（如 `oauth`） |
| `proxy` | string | 否 | 该模型 API 调用的 HTTP/SOCKS 代理 |
| `user_agent` | string | 否 | API 请求的自定义 `User-Agent` 请求头 |
| `request_timeout` | int | 否 | 请求超时时间（秒），默认 120 |
| `rpm` | int | 否 | 速率限制 — 每分钟请求数（参见[速率限制](../rate-limiting)） |

## 各提供商示例

### OpenAI

```json
{
  "model_name": "gpt-5.4",
  "model": "openai/gpt-5.4",
  "api_key": "sk-..."
}
```

### 火山引擎（Doubao）

```json
{
  "model_name": "ark-code-latest",
  "model": "volcengine/ark-code-latest",
  "api_key": "sk-..."
}
```

### Anthropic（Claude）

```json
{
  "model_name": "claude",
  "model": "anthropic/claude-sonnet-4-6",
  "api_key": "sk-ant-your-key"
}
```

> 也可运行 `picoclaw auth login --provider anthropic` 粘贴 API Token。

### Venice AI

```json
{
  "model_name": "venice-uncensored",
  "model": "venice/venice-uncensored",
  "api_key": "your-venice-api-key"
}
```

### DeepSeek

```json
{
  "model_name": "deepseek-chat",
  "model": "deepseek/deepseek-chat",
  "api_key": "sk-..."
}
```

### LM Studio（本地部署）

```json
{
  "model_name": "lmstudio-local",
  "model": "lmstudio/openai/gpt-oss-20b"
}
```

`api_base` 默认为 `http://localhost:1234/v1`。除非 LM Studio 服务器启用了认证，否则无需 API Key。PicoClaw 发送请求前会去掉 `lmstudio/` 前缀。

### Ollama（本地部署）

```json
{
  "model_name": "llama3",
  "model": "ollama/llama3"
}
```

### LiteLLM 代理

```json
{
  "model_name": "my-model",
  "model": "litellm/gpt-5.4",
  "api_base": "http://localhost:4000/v1"
}
```

PicoClaw 会去掉 `litellm/` 前缀，将裸模型名转发到你的 LiteLLM 代理。

### 自定义代理 / API

```json
{
  "model_name": "my-custom-model",
  "model": "openai/custom-model",
  "api_base": "https://my-proxy.com/v1",
  "api_key": "sk-..."
}
```

### 模型级请求超时

```json
{
  "model_name": "slow-model",
  "model": "openai/o1-preview",
  "api_key": "sk-...",
  "request_timeout": 300
}
```

## 负载均衡

为同一个 `model_name` 配置多个端点，PicoClaw 会自动轮询：

```json
{
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_base": "https://api1.example.com/v1",
      "api_key": "sk-key1"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_base": "https://api2.example.com/v1",
      "api_key": "sk-key2"
    }
  ]
}
```

## 从旧版 `providers` 迁移

旧版 `providers` 配置已**废弃**，但仍向后兼容。

**旧配置（已废弃）：**

```json
{
  "providers": {
    "zhipu": {
      "api_key": "your-key",
      "api_base": "https://open.bigmodel.cn/api/paas/v4"
    }
  },
  "agents": {
    "defaults": {
      "provider": "zhipu",
      "model_name": "glm-4.7"
    }
  }
}
```

**新配置（推荐）：**

```json
{
  "model_list": [
    {
      "model_name": "glm-4.7",
      "model": "zhipu/glm-4.7",
      "api_key": "your-key"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "glm-4.7"
    }
  }
}
```

详细迁移步骤请参考[迁移指南](../migration/model-list-migration)。

## 语音转文字

:::note
Groq 提供**免费语音转写**（Whisper）。配置后，Telegram 语音消息将自动转文字。
:::

```json
{
  "model_list": [
    {
      "model_name": "whisper",
      "model": "groq/whisper-large-v3",
      "api_key": "gsk_..."
    }
  ]
}
```

---
id: model-list
title: Model Configuration (model_list)
---

# Model Configuration

PicoClaw uses a **model-centric** configuration approach. Simply specify `vendor/model` format to add new providers — **zero code changes required!**

This enables **multi-agent support** with flexible provider selection:

- **Different agents, different providers**: Each agent can use its own LLM provider
- **Model fallbacks**: Configure primary and fallback models for resilience
- **Load balancing**: Distribute requests across multiple endpoints
- **Centralized configuration**: Manage all providers in one place

## Supported Vendors

| Vendor | `model` Prefix | Default API Base | Protocol | API Key |
| --- | --- | --- | --- | --- |
| **OpenAI** | `openai/` | `https://api.openai.com/v1` | OpenAI | [Get Key](https://platform.openai.com) |
| **Anthropic** | `anthropic/` | `https://api.anthropic.com/v1` | Anthropic | [Get Key](https://console.anthropic.com) |
| **Venice AI** | `venice/` | `https://api.venice.ai/api/v1` | OpenAI | [Get Key](https://venice.ai) |
| **Zhipu AI (GLM)** | `zhipu/` | `https://open.bigmodel.cn/api/paas/v4` | OpenAI | [Get Key](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys) |
| **DeepSeek** | `deepseek/` | `https://api.deepseek.com/v1` | OpenAI | [Get Key](https://platform.deepseek.com) |
| **Google Gemini** | `gemini/` | `https://generativelanguage.googleapis.com/v1beta` | OpenAI | [Get Key](https://aistudio.google.com/api-keys) |
| **Groq** | `groq/` | `https://api.groq.com/openai/v1` | OpenAI | [Get Key](https://console.groq.com) |
| **Moonshot** | `moonshot/` | `https://api.moonshot.cn/v1` | OpenAI | [Get Key](https://platform.moonshot.cn) |
| **Qwen** | `qwen/` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI | [Get Key](https://dashscope.console.aliyun.com) |
| **NVIDIA** | `nvidia/` | `https://integrate.api.nvidia.com/v1` | OpenAI | [Get Key](https://build.nvidia.com) |
| **Ollama** | `ollama/` | `http://localhost:11434/v1` | OpenAI | Local (no key needed) |
| **LM Studio** | `lmstudio/` | `http://localhost:1234/v1` | OpenAI | Optional (local default: no key) |
| **OpenRouter** | `openrouter/` | `https://openrouter.ai/api/v1` | OpenAI | [Get Key](https://openrouter.ai/keys) |
| **VLLM** | `vllm/` | `http://localhost:8000/v1` | OpenAI | Local |
| **Cerebras** | `cerebras/` | `https://api.cerebras.ai/v1` | OpenAI | [Get Key](https://cerebras.ai) |
| **VolcEngine** | `volcengine/` | `https://ark.cn-beijing.volces.com/api/v3` | OpenAI | [Get Key](https://console.volcengine.com) |
| **BytePlus** | `byteplus/` | `https://ark.ap-southeast.bytepluses.com/api/v3` | OpenAI | [Get Key](https://console.byteplus.com) |
| **Mistral** | `mistral/` | `https://api.mistral.ai/v1` | OpenAI | [Get Key](https://console.mistral.ai) |
| **LiteLLM** | `litellm/` | `http://localhost:4000/v1` | OpenAI | Local proxy |
| **ShengSuanYun** | `shengsuanyun/` | `https://router.shengsuanyun.com/api/v1` | OpenAI | [Get Key](https://router.shengsuanyun.com) |
| **Antigravity** | `antigravity/` | Google Cloud | Custom | OAuth only |
| **GitHub Copilot** | `github-copilot/` | `localhost:4321` | gRPC | — |
| **MiMo** | `mimo/` | `https://api.xiaomimimo.com/v1` | OpenAI | [获取](https://platform.xiaomimimo.com) |

## Basic Configuration

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

## Model Entry Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `model_name` | string | Yes | Alias used in `agents.defaults.model_name` |
| `model` | string | Yes | `vendor/model-id` format |
| `api_key` | string | Depends | API key for the provider |
| `api_base` | string | No | Override default API base URL |
| `auth_method` | string | No | Authentication method (e.g., `oauth`) |
| `proxy` | string | No | HTTP/SOCKS proxy for this model's API calls |
| `user_agent` | string | No | Custom `User-Agent` header for API requests |
| `request_timeout` | int | No | Request timeout in seconds (default: 120) |
| `rpm` | int | No | Rate limit — requests per minute (see [Rate Limiting](../rate-limiting)) |

## Vendor Examples

### OpenAI

```json
{
  "model_name": "gpt-5.4",
  "model": "openai/gpt-5.4",
  "api_key": "sk-..."
}
```

### VolcEngine (Doubao)

```json
{
  "model_name": "ark-code-latest",
  "model": "volcengine/ark-code-latest",
  "api_key": "sk-..."
}
```

### Anthropic

```json
{
  "model_name": "claude",
  "model": "anthropic/claude-sonnet-4-6",
  "api_key": "sk-ant-your-key"
}
```

> Run `picoclaw auth login --provider anthropic` to paste your API token.

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

### LM Studio (Local)

```json
{
  "model_name": "lmstudio-local",
  "model": "lmstudio/openai/gpt-oss-20b"
}
```

`api_base` defaults to `http://localhost:1234/v1`. API key is optional unless your LM Studio server enables authentication. PicoClaw strips the `lmstudio/` prefix before sending requests.

### Ollama (Local)

```json
{
  "model_name": "llama3",
  "model": "ollama/llama3"
}
```

### LiteLLM Proxy

```json
{
  "model_name": "my-model",
  "model": "litellm/gpt-5.4",
  "api_base": "http://localhost:4000/v1"
}
```

PicoClaw strips the `litellm/` prefix and forwards the bare model name to your LiteLLM proxy.

### Custom Proxy/API

```json
{
  "model_name": "my-custom-model",
  "model": "openai/custom-model",
  "api_base": "https://my-proxy.com/v1",
  "api_key": "sk-..."
}
```

### Per-Model Request Timeout

```json
{
  "model_name": "slow-model",
  "model": "openai/o1-preview",
  "api_key": "sk-...",
  "request_timeout": 300
}
```

## Load Balancing

Configure multiple endpoints for the same model name — PicoClaw will automatically round-robin between them:

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

## Migration from Legacy `providers`

The old `providers` configuration is **deprecated** but still supported.

**Old Config (deprecated):**

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

**New Config (recommended):**

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

See the full [Migration Guide](../migration/model-list-migration) for details.

## Voice Transcription

:::note
Groq provides **free voice transcription** via Whisper. If configured, Telegram voice messages will be automatically transcribed.
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

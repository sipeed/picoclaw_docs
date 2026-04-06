---
id: index
title: Providers Overview
sidebar_label: Overview
---

# Providers

PicoClaw supports 20+ LLM providers through its `model_list` configuration.

## Supported Providers

| Provider | Purpose | Get API Key |
| --- | --- | --- |
| **OpenAI** | GPT models | [platform.openai.com](https://platform.openai.com) |
| **Anthropic** | Claude models | [console.anthropic.com](https://console.anthropic.com) |
| **Venice AI** | Venice AI models | [venice.ai](https://venice.ai) |
| **Google Gemini** | Gemini models | [aistudio.google.com](https://aistudio.google.com) |
| **Zhipu AI** | GLM models (CN) | [bigmodel.cn](https://bigmodel.cn) |
| **Z.AI** | Z.AI Coding Plan (GLM) | [z.ai](https://z.ai/manage-apikey/apikey-list) |
| **DeepSeek** | DeepSeek models | [platform.deepseek.com](https://platform.deepseek.com) |
| **Groq** | Fast inference + Whisper | [console.groq.com](https://console.groq.com) |
| **OpenRouter** | Access to all models | [openrouter.ai](https://openrouter.ai) |
| **Moonshot** | Kimi models | [platform.moonshot.cn](https://platform.moonshot.cn) |
| **Qwen** | Tongyi Qianwen | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) |
| **NVIDIA** | NVIDIA AI models | [build.nvidia.com](https://build.nvidia.com) |
| **Mistral** | Mistral models | [console.mistral.ai](https://console.mistral.ai) |
| **Avian** | Avian models | [avian.io](https://avian.io) |
| **Xiaomi MiMo** | MiMo models | [platform.xiaomimimo.com](https://platform.xiaomimimo.com) |
| **Ollama** | Local model server | Local (no key needed) |
| **LM Studio** | Local model server (OpenAI-compatible) | Local (default no key) |
| **vLLM** | Local model server (OpenAI-compatible) | Local |
| **LiteLLM** | LiteLLM proxy | Local proxy |
| **Cerebras** | Fast inference | [cerebras.ai](https://cerebras.ai) |
| **VolcEngine** | Doubao models, CodingPlan (CN) | [console.volcengine.com](https://console.volcengine.com) |
| **BytePlus** | CodingPlan (International) | [console.byteplus.com](https://console.byteplus.com) |
| **Antigravity** | Google Cloud Code Assist | OAuth only |
| **Minimax** | MiniMax models | [platform.minimaxi.com](https://platform.minimaxi.com) |
| **GitHub Copilot** | Copilot models | — |

## Quick Setup

```json
{
  "model_list": [
    {
      "model_name": "my-model",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-..."]
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "my-model"
    }
  }
}
```

See [Model Configuration](../configuration/model-list.md) for full details.

## Z.AI Coding Plan Example

Z.AI and Zhipu AI are two brands of the same provider. For the Z.AI Coding Plan, use the `openai` model prefix with the Z.AI API base:

```json
{
  "model_name": "glm-4.7",
  "model": "openai/glm-4.7",
  "api_keys": ["your-z.ai-key"],
  "api_base": "https://api.z.ai/api/coding/paas/v4"
}
```

If the standard Zhipu endpoint returns 429 (insufficient balance), the Z.AI Coding Plan endpoint may have available balance since they use separate billing.

## Voice Transcription

You can configure a dedicated model for audio transcription with `voice.model_name`. This lets you reuse existing multimodal providers that support audio input instead of relying only on Groq Whisper.

If `voice.model_name` is not configured, PicoClaw falls back to Groq transcription when a Groq API key is available.

```json
{
  "voice": {
    "model_name": "voice-gemini",
    "echo_transcription": false
  }
}
```

## Model Failover Cascade

PicoClaw supports automatic failover when you configure a primary model with fallback models. The runtime retries the next candidate for retriable failures such as HTTP 429, quota/rate-limit errors, and timeouts. It also applies cooldown tracking per candidate to avoid immediately retrying a recently failed target.

```json
{
  "model_list": [
    {
      "model_name": "qwen-main",
      "model": "openai/qwen3.5:cloud",
      "api_base": "https://api.example.com/v1",
      "api_keys": ["sk-main"]
    },
    {
      "model_name": "deepseek-backup",
      "model": "deepseek/deepseek-chat",
      "api_keys": ["sk-backup-1"]
    },
    {
      "model_name": "gemini-backup",
      "model": "gemini/gemini-2.5-flash",
      "api_keys": ["sk-backup-2"]
    }
  ],
  "agents": {
    "defaults": {
      "model": {
        "primary": "qwen-main",
        "fallbacks": ["deepseek-backup", "gemini-backup"]
      }
    }
  }
}
```

If you use key-level failover for the same model (multiple keys in `api_keys`), PicoClaw can chain through additional key-backed candidates before moving to cross-model backups.

## Special Providers

- **[Antigravity](./antigravity.md)** — Google Cloud Code Assist, uses OAuth instead of API keys
- **Groq** — also provides free voice transcription (Whisper) for Telegram voice messages

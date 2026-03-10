---
id: index
title: Providers Overview
sidebar_label: Overview
---

# Providers

PicoClaw supports 19+ LLM providers through its `model_list` configuration.

## Supported Providers

| Provider | Purpose | Get API Key |
| --- | --- | --- |
| **OpenAI** | GPT models | [platform.openai.com](https://platform.openai.com) |
| **Anthropic** | Claude models | [console.anthropic.com](https://console.anthropic.com) |
| **Google Gemini** | Gemini models | [aistudio.google.com](https://aistudio.google.com) |
| **Zhipu AI** | GLM models (CN) | [bigmodel.cn](https://bigmodel.cn) |
| **DeepSeek** | DeepSeek models | [platform.deepseek.com](https://platform.deepseek.com) |
| **Groq** | Fast inference + Whisper | [console.groq.com](https://console.groq.com) |
| **OpenRouter** | Access to all models | [openrouter.ai](https://openrouter.ai) |
| **Moonshot** | Kimi models | [platform.moonshot.cn](https://platform.moonshot.cn) |
| **Qwen** | Tongyi Qianwen | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) |
| **NVIDIA** | NVIDIA AI models | [build.nvidia.com](https://build.nvidia.com) |
| **Mistral** | Mistral models | [console.mistral.ai](https://console.mistral.ai) |
| **Ollama** | Local models | Local (no key needed) |
| **vLLM** | Local OpenAI-compatible | Local |
| **LiteLLM** | LiteLLM proxy | Local proxy |
| **Cerebras** | Fast inference | [cerebras.ai](https://cerebras.ai) |
| **VolcEngine** | ByteDance models (CN) | [console.volcengine.com](https://console.volcengine.com) |
| **Antigravity** | Google Cloud Code Assist | OAuth only |
| **Minimax** | MiniMax models | [platform.minimaxi.com](https://platform.minimaxi.com) |
| **GitHub Copilot** | Copilot models | — |

## Quick Setup

```json
{
  "model_list": [
    {
      "model_name": "my-model",
      "model": "openai/gpt-5.2",
      "api_key": "sk-..."
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

## Special Providers

- **[Antigravity](./antigravity.md)** — Google Cloud Code Assist, uses OAuth instead of API keys
- **Groq** — also provides free voice transcription (Whisper) for Telegram voice messages

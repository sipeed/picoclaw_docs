---
id: index
title: 提供商概览
sidebar_label: 概览
---

# 提供商

PicoClaw 通过 `model_list` 配置支持 19+ 个 LLM 提供商。

## 支持的提供商

| 提供商 | 用途 | 获取 API Key |
| --- | --- | --- |
| **OpenAI** | GPT 系列模型 | [platform.openai.com](https://platform.openai.com) |
| **Anthropic** | Claude 系列模型 | [console.anthropic.com](https://console.anthropic.com) |
| **Google Gemini** | Gemini 系列模型 | [aistudio.google.com](https://aistudio.google.com) |
| **智谱 AI** | GLM 系列模型 | [bigmodel.cn](https://bigmodel.cn) |
| **DeepSeek** | DeepSeek 系列模型 | [platform.deepseek.com](https://platform.deepseek.com) |
| **Groq** | 高速推理 + Whisper 语音转写 | [console.groq.com](https://console.groq.com) |
| **OpenRouter** | 聚合多种模型 | [openrouter.ai](https://openrouter.ai) |
| **Moonshot（Kimi）** | Kimi 系列模型 | [platform.moonshot.cn](https://platform.moonshot.cn) |
| **通义千问（Qwen）** | 阿里云 Qwen 系列 | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) |
| **NVIDIA** | NVIDIA AI 模型 | [build.nvidia.com](https://build.nvidia.com) |
| **Mistral** | Mistral 系列模型 | [console.mistral.ai](https://console.mistral.ai) |
| **Ollama** | 本地模型 | 本地部署，无需 Key |
| **vLLM** | 本地 OpenAI 兼容服务 | 本地部署 |
| **LiteLLM** | LiteLLM 代理 | 本地代理 |
| **Cerebras** | 高速推理 | [cerebras.ai](https://cerebras.ai) |
| **火山引擎** | 字节跳动模型 | [console.volcengine.com](https://console.volcengine.com) |
| **Antigravity** | Google Cloud Code Assist | 仅 OAuth |
| **Minimax** | MiniMax 系列模型 | [platform.minimaxi.com](https://platform.minimaxi.com) |
| **GitHub Copilot** | Copilot 模型 | — |

## 快速配置

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

完整配置说明请参考[模型配置](../configuration/model-list.md)。

## 特殊提供商

- **[Antigravity](./antigravity.md)** — Google Cloud Code Assist，使用 OAuth 而非 API Key
- **Groq** — 同时提供免费语音转写（Whisper），可用于 Telegram 语音消息自动转文字

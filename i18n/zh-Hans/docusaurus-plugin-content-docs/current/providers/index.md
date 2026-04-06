---
id: index
title: 提供商概览
sidebar_label: 概览
---

# 提供商

PicoClaw 通过 `model_list` 配置支持 20+ 个 LLM 提供商。

## 支持的提供商

| 提供商 | 用途 | 获取 API Key |
| --- | --- | --- |
| **OpenAI** | GPT 系列模型 | [platform.openai.com](https://platform.openai.com) |
| **Anthropic** | Claude 系列模型 | [console.anthropic.com](https://console.anthropic.com) |
| **Venice AI** | Venice AI 系列模型 | [venice.ai](https://venice.ai) |
| **Google Gemini** | Gemini 系列模型 | [aistudio.google.com](https://aistudio.google.com) |
| **智谱 AI** | GLM 系列模型 | [bigmodel.cn](https://bigmodel.cn) |
| **Z.AI** | Z.AI Coding Plan（GLM） | [z.ai](https://z.ai/manage-apikey/apikey-list) |
| **DeepSeek** | DeepSeek 系列模型 | [platform.deepseek.com](https://platform.deepseek.com) |
| **Groq** | 高速推理 + Whisper 语音转写 | [console.groq.com](https://console.groq.com) |
| **OpenRouter** | 聚合多种模型 | [openrouter.ai](https://openrouter.ai) |
| **Moonshot（Kimi）** | Kimi 系列模型 | [platform.moonshot.cn](https://platform.moonshot.cn) |
| **通义千问（Qwen）** | 阿里云 Qwen 系列 | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) |
| **NVIDIA** | NVIDIA AI 模型 | [build.nvidia.com](https://build.nvidia.com) |
| **Mistral** | Mistral 系列模型 | [console.mistral.ai](https://console.mistral.ai) |
| **Avian** | Avian 系列模型 | [avian.io](https://avian.io) |
| **小米 MiMo** | MiMo 系列模型 | [platform.xiaomimimo.com](https://platform.xiaomimimo.com) |
| **Ollama** | 本地模型服务 | 本地部署，无需 Key |
| **LM Studio** | 本地模型服务（OpenAI 兼容） | 本地部署（默认无需 Key） |
| **vLLM** | 本地模型服务（OpenAI 兼容） | 本地部署 |
| **LiteLLM** | LiteLLM 代理 | 本地代理 |
| **Cerebras** | 高速推理 | [cerebras.ai](https://cerebras.ai) |
| **火山引擎** | 豆包模型、CodingPlan | [console.volcengine.com](https://console.volcengine.com) |
| **BytePlus** | CodingPlan（国际版） | [console.byteplus.com](https://console.byteplus.com) |
| **Antigravity** | Google Cloud Code Assist | 仅 OAuth |
| **Minimax** | MiniMax 系列模型 | [platform.minimaxi.com](https://platform.minimaxi.com) |
| **GitHub Copilot** | Copilot 模型 | — |

## 快速配置

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

完整配置说明请参考[模型配置](../configuration/model-list.md)。

## Z.AI Coding Plan 示例

Z.AI 和智谱 AI 是同一提供商的两个品牌。使用 Z.AI Coding Plan 时，使用 `openai` 模型前缀和 Z.AI 的 API 地址：

```json
{
  "model_name": "glm-4.7",
  "model": "openai/glm-4.7",
  "api_keys": ["your-z.ai-key"],
  "api_base": "https://api.z.ai/api/coding/paas/v4"
}
```

如果标准智谱端点返回 429（余额不足），Z.AI Coding Plan 端点可能仍有可用额度，因为它们使用独立的计费系统。

## 语音转写

你可以通过 `voice.model_name` 配置专用的音频转写模型。这允许你复用已有的支持音频输入的多模态提供商，而不仅仅依赖 Groq Whisper。

如果未配置 `voice.model_name`，PicoClaw 会在有 Groq API Key 时回退到 Groq 转写。

```json
{
  "voice": {
    "model_name": "voice-gemini",
    "echo_transcription": false
  }
}
```

## 模型故障转移级联

PicoClaw 支持在配置了主模型和备用模型时自动故障转移。运行时会在遇到可重试的失败（如 HTTP 429、配额/速率限制错误和超时）时尝试下一个候选。它还会对每个候选进行冷却跟踪，以避免立即重试最近失败的目标。

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

如果你对同一模型使用密钥级故障转移（`api_keys` 中的多个密钥），PicoClaw 会先尝试完所有密钥，然后再切换到跨模型备用。

## 特殊提供商

- **[Antigravity](./antigravity.md)** — Google Cloud Code Assist，使用 OAuth 而非 API Key
- **Groq** — 同时提供免费语音转写（Whisper），可用于 Telegram 语音消息自动转文字

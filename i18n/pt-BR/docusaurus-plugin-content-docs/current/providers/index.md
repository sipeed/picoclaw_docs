---
id: index
title: Visão geral dos provedores
sidebar_label: Visão geral
---

# Provedores

O PicoClaw suporta várias famílias de protocolo de LLM através de `model_list`.

Para uma experiência de configuração mais fluida e intuitiva, recomendamos usar a Web UI como forma principal de configurar modelos.

![Configuração de modelo na Web UI](/img/providers/webuimodel.png)

## Provedores suportados

| Provedor | Finalidade | Obter chave de API |
| --- | --- | --- |
| **OpenAI** | Modelos GPT | [platform.openai.com](https://platform.openai.com) |
| **Anthropic** | Modelos Claude | [console.anthropic.com](https://console.anthropic.com) |
| **Anthropic Messages** | API Anthropic Messages nativa | [console.anthropic.com](https://console.anthropic.com) |
| **Venice AI** | Modelos Venice AI | [venice.ai](https://venice.ai) |
| **Google Gemini** | Modelos Gemini | [aistudio.google.com](https://aistudio.google.com) |
| **Zhipu AI** | Modelos GLM (CN) | [bigmodel.cn](https://bigmodel.cn) |
| **Z.AI** | Z.AI Coding Plan (GLM) | [z.ai](https://z.ai/manage-apikey/apikey-list) |
| **DeepSeek** | Modelos DeepSeek | [platform.deepseek.com](https://platform.deepseek.com) |
| **Groq** | Inferência rápida + Whisper | [console.groq.com](https://console.groq.com) |
| **OpenRouter** | Acesso a todos os modelos | [openrouter.ai](https://openrouter.ai) |
| **Moonshot** | Modelos Kimi | [platform.moonshot.cn](https://platform.moonshot.cn) |
| **Qwen** | Tongyi Qianwen | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) |
| **NVIDIA** | Modelos NVIDIA AI | [build.nvidia.com](https://build.nvidia.com) |
| **Mistral** | Modelos Mistral | [console.mistral.ai](https://console.mistral.ai) |
| **Avian** | Modelos Avian | [avian.io](https://avian.io) |
| **LongCat** | Modelos LongCat | [longcat.chat](https://longcat.chat/platform) |
| **ModelScope** | Modelos ModelScope | [modelscope.cn](https://modelscope.cn) |
| **Novita** | Modelos Novita | [novita.ai](https://novita.ai) |
| **Vivgrid** | Modelos hospedados na Vivgrid | [vivgrid.com](https://vivgrid.com) |
| **ShengSuanYun** | Modelos ShengSuanYun | [router.shengsuanyun.com](https://router.shengsuanyun.com) |
| **Xiaomi MiMo** | Modelos MiMo | [platform.xiaomimimo.com](https://platform.xiaomimimo.com) |
| **Ollama** | Servidor de modelos local | Local (sem chave) |
| **LM Studio** | Servidor de modelos local (compatível com OpenAI) | Local (sem chave por padrão) |
| **vLLM** | Servidor de modelos local (compatível com OpenAI) | Local |
| **LiteLLM** | Proxy LiteLLM | Proxy local |
| **Cerebras** | Inferência rápida | [cerebras.ai](https://cerebras.ai) |
| **VolcEngine** | Modelos Doubao | [console.volcengine.com](https://console.volcengine.com) |
| **Azure OpenAI** | Modelos OpenAI hospedados na Azure | Azure Portal |
| **AWS Bedrock** | Modelos hospedados no Bedrock | AWS Console |
| **Antigravity** | Google Cloud Code Assist | Apenas OAuth |
| **Minimax** | Modelos MiniMax | [platform.minimaxi.com](https://platform.minimaxi.com) |
| **GitHub Copilot** | Modelos via bridge do Copilot | — |
| **Claude CLI / Codex CLI** | Bridges para CLIs locais de modelos | Autenticação local da CLI |

## Configuração rápida

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

Veja [Configuração de modelos](../configuration/model-list.md) para detalhes completos.

## Exemplo Z.AI Coding Plan

Z.AI e Zhipu AI são duas marcas do mesmo provedor. Para o Z.AI Coding Plan, use o prefixo de modelo `openai` com o api base do Z.AI:

```json
{
  "model_name": "glm-4.7",
  "model": "openai/glm-4.7",
  "api_keys": ["your-z.ai-key"],
  "api_base": "https://api.z.ai/api/coding/paas/v4"
}
```

Se o endpoint padrão da Zhipu retornar 429 (saldo insuficiente), o endpoint do Z.AI Coding Plan pode ter saldo disponível, já que eles usam cobrança separada.

## Transcrição de voz

Você pode configurar um modelo dedicado para transcrição de áudio com `voice.model_name`. Isso permite reaproveitar provedores multimodais existentes que aceitam entrada de áudio, em vez de depender apenas do Groq Whisper.

Se `voice.model_name` não estiver configurado, o PicoClaw cai automaticamente para a transcrição da Groq quando há uma chave de API da Groq disponível.

```json
{
  "voice": {
    "model_name": "voice-gemini",
    "echo_transcription": false
  }
}
```

## Cascata de failover de modelos

O PicoClaw suporta failover automático quando você configura um modelo principal junto com modelos de fallback. O runtime tenta o próximo candidato em caso de falhas reaproveitáveis, como HTTP 429, erros de cota/limitação de taxa e timeouts. Também aplica rastreamento de cooldown por candidato para evitar repetir imediatamente um destino que acabou de falhar.

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

Se você usar failover por chave para o mesmo modelo (várias chaves em `api_keys`), o PicoClaw também consegue passar por candidatos adicionais lastreados por chave antes de partir para os backups entre modelos.

## Provedores especiais

- **[Antigravity](./antigravity.md)** — Google Cloud Code Assist, usa OAuth em vez de chaves de API
- **Groq** — também oferece transcrição de voz gratuita (Whisper) para mensagens de voz no Telegram

---
id: groq-api
title: Groq API
---
# Groq API Configuration Guide

## Overview

Groq is an AI inference platform focused on **ultra-low latency and lightning-fast inference**. Powered by its proprietary Tensor architecture, it delivers exceptional speed in code generation and chat interaction. Supports popular open models like Llama and Mixtral, available via pay-as-you-go.

Official Docs: https://console.groq.com/docs/quickstart

---

## Get API Key

### Step 1: Access Platform

Go to [GroqCloud](https://console.groq.com/home)

register and log in.

### Step 2: Create API Key

1. Go to the API Keys page
2. Click **Create API Key**
3. Copy and save your API Key

> ⚠️ **Note**: API Key is shown only once — save it immediately and keep it secure.。

---

![image-20260410163359795](/img/providers/groq1.png)

## Configure PicoClaw

### Pay-as-you-go (Groq only supports pay-as-you-go)

#### Supported Models

|          Model          |                  Description                  |
| :---------------------: | :-------------------------------------------: |
| llama-3.3-70b-versatile | Recommended, balanced performance, ultra-fast |
|    llama-3.3-8b-chat    |     Lightweight, low-cost, fast response     |
|  mixtral-8x7b-instruct  | Mixture-of-experts, strong long-text handling |
|      gemma-2-9b-it      |         Google lightweight chat model         |

#### Method 1: Web UI (Recommended)

Open PicoClaw WebUI → go to **Models** → click **Add Model** in the top-right corner.

![image-20260410163514016](/img/providers/groq2.png)

|      Field      |                         Fill Content                         |
| :--------------: | :----------------------------------------------------------: |
|   Model Alias   |                  Custom name, e.g.,`groq`                  |
| Model Identifier | `groq/llama-3.3-70b-versatile` (or other supported models) |
|     API Key     |                      Your Groq API Key                      |
|   API Base URL   |              `https://api.groq.com/openai/v1`              |

#### Method 2: Edit Config Files

`config.json`：

```
{
  "version": 2,
  "model_list": [
    {
      "model_name": "llama-3.3-70b",
      "model": "groq/llama-3.3-70b-versatile",
      "api_base": "https://api.groq.com/openai/v1"
    },
  ],
  "agents": {
    "defaults": {
      "model_name": "llama-3.3-70b"
    }
  }
}
```

`~/.picoclaw/.security.yml`：

```
model_list:
  llama-3.3-70b:0:
    api_keys:
      - "your-groq-api-key"
```

---

## Notes

- Groq has **no subscription plans** — only pay-as-you-go, with real-time token-based billing.
- Fixed default endpoint: `https://api.groq.com/openai/v1` (cannot be omitted).
- For production, store API Key in `.security.yml` — avoid plaintext in `config.json`.
- Inference is extremely fast; monitor usage to prevent unexpected overconsumption.

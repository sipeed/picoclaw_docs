---
id: openrouter-api
title: OpenRouter API
---

# OpenRouter API Configuration Guide

## Overview

**OpenRouter API** is a unified interface platform that aggregates multiple LLM services, supporting access to models from OpenAI, Anthropic, Google, Meta, and more.

With OpenRouter, you can:

- Use a unified API to call models from different providers
- Auto-route to optimal models or lowest-cost nodes
- Avoid rate limiting issues from single platforms
- Switch models flexibly without changing code

Popular available models:

| Model | Provider | Features | Use Cases |
|-------|----------|----------|-----------|
| openai/gpt-4o-mini | OpenAI | Fast, low cost | Daily conversations |
| openai/gpt-4o | OpenAI | High quality | Multimodal tasks |
| anthropic/claude-3-haiku | Anthropic | Fast | Light tasks |
| anthropic/claude-3-opus | Anthropic | High reasoning | Complex analysis |
| google/gemini-pro | Google | Strong multimodal | General tasks |

---

## Getting API Key

### Step 1: Visit OpenRouter

Go to [OpenRouter](https://openrouter.ai/)

### Step 2: Sign In

Supports GitHub / Google login.

### Step 3: Create API Key

1. Navigate to **Dashboard → Keys**
2. Click **Create Key**
3. **Copy and save** your API Key

> ⚠️ **Note**: Keep your API Key secure and avoid exposing it.

![OpenRouter API Key](/img/providers/openrouterapi.png)

![OpenRouter API Key](/img/providers/openrouterapi1.png)

---

## Configuring PicoClaw

### Option 1: Using WebUI (Recommended)

PicoClaw provides a WebUI interface where you can easily configure models without manually editing configuration files.

Edit preset settings, or click the **"Add Model"** button in the top right corner:

![Add Model](/img/providers/webuimodel.png)

| Field | Value |
|-------|-------|
| Model Alias | Custom name, e.g., `gpt-4o-mini` |
| Model Identifier | `openai/gpt-4o-mini` (or other supported models) |
| API Key | OpenRouter API Key |
| API Base URL | `https://openrouter.ai/api/v1` |

### Option 2: Edit Configuration File

Add in `config.json`:

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-mini",
      "model": "openai/gpt-4o-mini",
      "base_url": "https://openrouter.ai/api/v1",
      "auth_method": "api_key",
      "api_key": "YOUR_OPENROUTER_API_KEY",
      "headers": {
        "HTTP-Referer": "http://localhost",
        "X-Title": "PicoClaw"
      }
    },
    {
      "model_name": "claude-3-haiku",
      "model": "anthropic/claude-3-haiku",
      "base_url": "https://openrouter.ai/api/v1",
      "auth_method": "api_key",
      "api_key": "YOUR_OPENROUTER_API_KEY"
    }
  ],
  "agents": {
    "defaults": {
      "model": "gpt-4o-mini"
    }
  }
}
```

---

## Limits & Quotas

### Billing

OpenRouter uses a **pay-as-you-go** model, charging based on the actual model used and token consumption.

### Rate Limits

- Different models have different rate limits
- Free models may have stricter limits
- Paid users enjoy higher rate quotas

---

## Common Issues

### Model Unavailable

**Cause**: Model discontinued or insufficient account balance

**Solutions**:
- Check if the model is still available
- Top up account balance

### Response Timeout

**Cause**: Slow model response or network issues

**Solutions**:
- Try using a faster model
- Check network connection

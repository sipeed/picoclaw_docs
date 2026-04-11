---
id: deepseek-api
title: DeepSeek API
---

# DeepSeek Configuration Guide

## Overview

**DeepSeek** is a benchmark in China's large model field.

The DeepSeek-V3 series has attracted widespread attention globally with highly competitive inference performance and extremely low API prices, becoming one of the most cost-effective models preferred by developers.

Its OpenAI-compatible interface makes integration almost zero-threshold and is one of the most commonly used domestic providers for PicoClaw users.

![DeepSeek Overview](/img/providers/deepseek-overview.png)

Official Documentation: https://api-docs.deepseek.com/zh-cn/api/deepseek-api/

***Note**: DeepSeek currently only supports pay-as-you-go, no subscription plans*

*deepseek-chat currently corresponds to DeepSeek-V3.2*

## Getting API Key

### Step 1: Visit Platform

Go to [DeepSeek Open Platform](https://platform.deepseek.com/), register and log in.

### Step 2: Create API Key

1. Enter Console → **API Keys** page
2. Click "Create API Key"
3. Copy and save securely

   *⚠️ **Note**: API Key is shown only once, save it immediately.*

## Configuring PicoClaw

### Option 1: Using WebUI (Recommended)

Open PicoClaw WebUI, go to the **Models** page in the left navigation, click "Add Model" in the top right corner:

![Add Model](/img/providers/webuimodel.png)

| Field | Value |
|-------|-------|
| Model Alias | Custom name, e.g., deepseek |
| Model Identifier | deepseek/deepseek-chat |
| API Key | Your DeepSeek API Key |
| API Base URL | Leave empty (automatically uses default endpoint) |

Click "Add Model" to save. To set as default model, enable the "Set as Default Model" switch at the bottom.

### Option 2: Edit Configuration File

Add to model_list in config.json (without keys):

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "deepseek",
      "model": "deepseek/deepseek-chat"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "deepseek"
    }
  }
}
```

Store keys in ~/.picoclaw/.security.yml:

```yaml
model_list:
  deepseek:0:
    api_keys:
      - "sk-your-deepseek-key"
```

deepseek protocol prefix has built-in default endpoint https://api.deepseek.com/v1, no need to fill api_base

## Notes

- DeepSeek currently only supports pay-as-you-go, no subscription plans
- deepseek-chat currently corresponds to DeepSeek-V3.2
- For production, store API Key in .security.yml, avoid plaintext in config.json
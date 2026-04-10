---
id: Anthropic-api
title: Claude(Anthropic) API
---

# Claude (Anthropic) API Configuration Guide

## Overview

**Claude (Anthropic)** offers both **subscription plans** and **pay-as-you-go** options, both using OpenAI-compatible interfaces. They share the same endpoint, differing only in API Key and billing method.

Official Docs: https://docs.anthropic.com/en/api/getting-started>

***
## Subscription Plan (Recommended)

Claude subscription plans are designed for developers, providing high-frequency usage within fixed quotas. Ideal for daily coding, long context, and code understanding tasks.

![image-20260409215655752](/img/providers/Claude(Anthropic)1.png)
## Get API Key

1. Go to the Anthropic Console
2. Register, log in, and activate a subscription plan (Pro / Max 5× / Max 20×)
3. Go to API Keys in the console to get your **subscription-exclusive API Key**

![image-20260409215733096](/img/providers/Claude(Anthropic)2.png)

### Plan Usage (Coding Scenario Reference)
|  Plan   | Monthly Price |                    Use Case                     |
| :-----: | :-----------: | :---------------------------------------------: |
|   Pro   |  $20 / month  | Light personal dev, short sessions, small repos |
| Max 5×  | $100 / month  | Daily high-frequency, multi-file repo analysis  |
| Max 20× | $200 / month  |  Heavy multi-repo parallel, long-term main use  |
### Supported Models
|           Model            |                         Description                          |
| :------------------------: | :----------------------------------------------------------: |
|     claude-sonnet-4-6      | Recommended, balanced performance & cost, excellent long context |
|      claude-opus-4-6       |    High-end model, complex reasoning, ultra-long context     |
|      claude-haiku-4-6      |             Lightweight, fast response, low cost             |
| claude-3-5-sonnet-20241022 |          Classic stable version, wide compatibility          |
> For daily coding, prioritize **claude-sonnet-4-6**. Switch to Opus only for complex tasks to avoid fast quota consumption.
## Configure PicoClaw

### Web UI Configuration

Open PicoClaw WebUI → go to **Models** in the left sidebar → click **Add Model** in the top-right corner.

![image-20260409221239555](/img/providers/Claude(Anthropic)3.png)
|      Field       |                       Fill Content                        |
| :--------------: | :-------------------------------------------------------: |
|   Model Alias    |              Custom name, e.g., `anthropic`               |
| Model Identifier | `anthropic/claude-sonnet-4-6` (or other supported models) |
|     API Key      |         Anthropic subscription-exclusive API Key          |
|   API Base URL   |              `https://api.anthropic.com/v1`               |
### Edit Config Files
config.json 
```
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_base": "https://api.anthropic.com/v1"
    },
```
***
`~/.picoclaw/.security.yml`：

```YAML
model_list:
  claude-sonnet-4.6:0:
    api_keys:
      - "your-volcengine-api-key"
```
## Notes

- Subscription and pay-as-you-go **share the same endpoint**: `https://api.anthropic.com/v1`, but **API Keys are not interchangeable** — get from the corresponding page.
- Pay-as-you-go deducts balance in real time by tokens; subscriptions are recommended for heavy use.
- Claude Opus series consumes more quota/cost — avoid long-term use unless necessary.
- Subscription quota and API quota are **separate** and cannot be shared.


---
id: anthropic-api
title: Claude(Anthropic) API
---

# Claude (Anthropic) API Configuration Guide

## Overview

**Claude (Anthropic)** uses a **pay-as-you-go** pricing model. Access is provided through an official Anthropic API key, and charges are based on actual token usage.

> ⚠️ **Important notes**
>
> - Claude **subscription plans** (Pro / Max / Team / Enterprise) and the **API** are **completely separate** products. Subscriptions work only on claude.ai web, desktop, and mobile apps. They **do not include API access** and cannot be used in developer tools like PicoClaw.
> - The native Anthropic API uses the `/v1/messages` format, **not** the OpenAI-compatible `/v1/chat/completions` format. Using OpenAI compatibility mode disables key features such as Prompt Caching, Extended Thinking, and PDF processing.
> - Using an OAuth token from a subscription account to call Claude in third-party tools **violates Anthropic's Terms of Service**. Anthropic officially blocked this path in April 2026, so do not attempt it.

Official docs: https://docs.anthropic.com/en/api/getting-started



![image-20260409215655752](/img/providers/Claude(Anthropic)1.png)

## Get API Key

1. Visit the [Anthropic Console](https://console.anthropic.com/), sign up, and log in.
2. Open the **API Keys** page in the left navigation and click **Create Key** to generate an API key.
3. On the **Billing** page, add a payment method and top up your balance. API usage is deducted from that balance based on actual token consumption.

![image-20260409215733096](/img/providers/Claude(Anthropic)2.png)

### Pricing

Anthropic API billing is usage-based. There is no monthly fee, and you are charged only for the tokens you consume. Reference rates below may change over time:

|       Model       | Input (per million tokens) | Output (per million tokens) |
| :---------------: | :------------------------: | :-------------------------: |
| claude-sonnet-4.6 |             $3             |             $15             |
|  claude-opus-4.7  |            $15             |             $75             |
| claude-haiku-4.5  |            $0.8            |             $4              |

Latest pricing always follows Anthropic's official pricing page.

### Supported Models

|           Model            |                         Description                          |
| :------------------------: | :----------------------------------------------------------: |
|     claude-sonnet-4.6      | Recommended; balanced performance and cost, excellent long context |
|      claude-opus-4.7       |      High-end model for complex reasoning and large context      |
|      claude-haiku-4.5      |             Lightweight, fast response, lower cost             |
| claude-3-5-sonnet-20241022 |          Classic stable version with broad compatibility          |
> For daily coding, prefer **claude-sonnet-4.6** and switch to Opus only for more complex tasks.
## Configure PicoClaw

### Web UI Configuration

Open PicoClaw WebUI, go to **Models** in the left sidebar, and click **Add Model** in the top-right corner.

![image-20260409221239555](/img/providers/Claude(Anthropic)3.png)
|    Field     |                     Value to enter                     |
| :----------: | :----------------------------------------------------: |
| Model Alias  |              Custom name, for example `anthropic`              |
|   Model ID   | anthropic/claude-sonnet-4.6 (or another supported model) |
|   API Key    |         API key generated in Anthropic Console         |
| API Base URL |              https://api.anthropic.com/v1              |
### Edit Config Files

`config.json`:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_base": "https://api.anthropic.com/v1"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "claude-sonnet-4.6"
    }
  }
}
```

`~/.picoclaw/.security.yml`:

```yaml
model_list:
  claude-sonnet-4.6:0:
    api_keys:
      - "your-anthropic-api-key"
```
## Notes

- Pay-as-you-go costs scale directly with usage. For frequent or long-context tasks, set usage alerts on the Console billing page.
- Claude Opus is significantly more expensive than Sonnet, so avoid long-running Opus usage unless needed.
- Subscription plans and API balances are separate and non-transferable. Balance added in Console is for API calls only and is unrelated to claude.ai subscriptions.


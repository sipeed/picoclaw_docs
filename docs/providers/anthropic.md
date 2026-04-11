---
id: Anthropic-api
title: Claude(Anthropic) API
---

# Claude (Anthropic) API Configuration Guide

## Overview

**Claude (Anthropic)** offers a **Pay‑as‑you‑go** pricing model. Access is via official Anthropic API Key, with charges based on actual Token consumption.

> ⚠️ **Important Notes**
>
> 
>
> - Claude **subscription plans** (Pro / Max / Team / Enterprise) and the **API** are **completely separate** products. Subscriptions work only on the claude.ai web, desktop, and mobile apps; they **do NOT include API access** and cannot be used in dev tools like PicoClaw.
> - The native Anthropic API uses the `/v1/messages` interface format, **not** the OpenAI‑compatible interface (`/v1/chat/completions`). Using OpenAI compatibility mode disables core features such as Prompt Caching, Extended Thinking, and PDF processing.
> - Using a subscription account’s OAuth Token to call Claude in third‑party tools **violates Anthropic ToS**; this method was officially blocked in April 2026 — do not attempt.

Official docs: https://docs.anthropic.com/en/api/getting-started



![image-20260409215655752](/img/providers/Claude(Anthropic)1.png)

## Get API Key

1. Visit the Anthropic Console [Anthropic Console](https://console.anthropic.com/), register and log in
* Go to the API Keys page in the left navigation, click "Create Key" to generate an API Key
* On the Billing page, add a payment method and top up, API calls will be deducted from the balance based on actual token usage

![image-20260409215733096](/img/providers/Claude(Anthropic)2.png)

### Plan Usage

Pay‑as‑you‑go, charged by actual input/output Tokens consumed. No monthly fee; no charge when idle. Reference rates (prices subject to official changes):

|       Model       | Input (per million Tokens) | Output (per million Tokens) |
| :---------------: | :------------------------: | :-------------------------: |
| claude-sonnet-4.6 |             $3             |             $15             |
|  claude-opus-4.6  |            $15             |             $75             |
| claude-haiku-4.6  |            $0.8            |             $4              |
Latest prices follow Anthropic’s official pricing page.

### Supported Models

|           Model            |                         Description                          |
| :------------------------: | :----------------------------------------------------------: |
|     claude-sonnet-4.6      | Recommended; balanced performance and cost, excellent long context |
|      claude-opus-4.6       |    High‑end model, complex reasoning, ultra‑long context     |
|      claude-haiku-4.6      |             Lightweight, fast response, low cost             |
| claude-3-5-sonnet-20241022 |          Classic stable version, wide compatibility          |
> For daily coding, prefer **claude-sonnet-4.6**; switch to Opus only for complex tasks to avoid excessive usage.
## Configure PicoClaw

### Web UI Configuration

Open PicoClaw WebUI, go to the **Models** page in the left sidebar, and click **Add Model** in the top right corner.

![image-20260409221239555](/img/providers/Claude(Anthropic)3.png)
|    Field     |                     Value to enter                     |
| :----------: | :----------------------------------------------------: |
| Model Alias  |              Custom name, e.g. anthropic               |
|   Model ID   | anthropic/claude-sonnet-4.6 (or other supported model) |
|   API Key    |         API Key generated in Anthropic Console         |
| API Base URL |              https://api.anthropic.com/v1              |
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
      - "your-anthropic-api-key"
```
## Notes

- Pay‑as‑you‑go: costs scale with usage. Frequent or long‑context tasks can increase costs quickly — set usage alerts on the Console Billing page.
- The Claude Opus series is significantly more expensive than Sonnet; avoid prolonged use unless necessary.
- Subscription plans and API balances are separate and non‑transferable: balance added to the Console is for API calls only and unrelated to claude.ai subscriptions.


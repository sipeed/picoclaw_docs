---
id: minimax-api
title: MiniMax API
---

# MiniMax Configuration Guide

## Overview

**MiniMax** is a leading multimodal large model company in China. The MiniMax-M2 series excels in long-context understanding, multimodal processing, and reasoning capabilities.

MiniMax's Token Plan provides high-frequency request quotas through subscriptions, and the speed edition plans provide sufficient throughput guarantees for high-concurrency scenarios, making it an excellent choice for developers pursuing stability and speed.

![MiniMax Overview](/img/providers/minimax-overview.png)

Official Documentation: https://platform.minimaxi.com/docs/token-plan/intro

## Getting API Key

MiniMax offers **Token Plan subscription packages** and **pay-as-you-go**, both using the same endpoint but different API Keys. Please obtain from the corresponding page.

### Token Plan Exclusive Key

1. Visit [MiniMax Open Platform](https://platform.minimaxi.com/), register and log in
2. Go to [Subscription Page](https://platform.minimaxi.com/subscribe/token-plan) to subscribe to a plan
3. Get exclusive API Key on the plan management page

### Pay-as-you-go Key

1. Visit [MiniMax Open Platform](https://platform.minimaxi.com/), register and log in
2. Create API Key on the console API Keys page

   *⚠️ **Note**: API Key is shown only once, save it immediately.*

### Token Plan Usage (M2.7 requests only)

| Plan | Requests per 5 hours |
|------|----------------------|
| Starter | 600 calls |
| Plus | 1,500 calls |
| Max | 4,500 calls |
| Plus-Speed | 1,500 calls (M2.7-highspeed) |
| Max-Speed | 4,500 calls (M2.7-highspeed) |
| Ultra-Speed | 30,000 calls (M2.7-highspeed) |

Speed edition plans can use MiniMax-M2.7-highspeed model, faster speed.

## Configuring PicoClaw

### Option 1: Using WebUI (Recommended)

Open PicoClaw WebUI, go to the **Models** page in the left navigation, click "Add Model" in the top right corner:

![Add Model](/img/providers/webuimodel.png)

| Field | Value |
|-------|-------|
| Model Alias | Custom name, e.g., minimax |
| Model Identifier | minimax/MiniMax-M2.7 (use minimax/MiniMax-M2.7-highspeed for speed edition) |
| API Key | Your MiniMax API Key |
| API Base URL | Leave empty (automatically uses default endpoint) |

### Option 2: Edit Configuration File

config.json:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "minimax",
      "model": "minimax/MiniMax-M2.7"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "minimax"
    }
  }
}
```

*For speed edition, change model to minimax/MiniMax-M2.7-highspeed*

~/.picoclaw/.security.yml:

```yaml
model_list:
  minimax:0:
    api_keys:
      - "your-minimax-api-key"
```

minimax protocol prefix has built-in default endpoint https://api.minimaxi.com/v1, no need to fill api_base

## Notes

- Token Plan and pay-as-you-go use the same endpoint, but API Keys are different, please obtain from corresponding page
- Speed edition model MiniMax-M2.7-highspeed is only available when subscribed to speed edition plans
- For production, store API Key in .security.yml, avoid plaintext in config.json
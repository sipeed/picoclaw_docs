---
id: NVIDIA-api
title: Nim(NVIDIA) API
---

# NVIDIA NIM API Configuration Guide

## Overview

**NVIDIA NIM (NVIDIA Inference Microservice)** is NVIDIA’s GPU‑accelerated inference microservice. It provides industry-standard OpenAI-compatible APIs, supporting mainstream models from multiple providers with fast, stable inference. Free quotas are available for individual developers, making it great for coding, long context, and multi-model switching.

Official Site: https://build.nvidia.com/

Official API Docs: https://docs.nvidia.com/nim/

---

## Get API Key

### Step 1: Access Platform

Go to[Try NVIDIA NIM APIs](https://build.nvidia.com/)

(NVIDIA Build platform), register and log in.

### Step 2: Create API Key

1. Click your profile in the top-right → select **API Keys** (direct link: https://build.nvidia.com/settings/api-keys)
2. Click **Generate API Key**, name it, set expiration
3. Copy and save your API Key (starts with `nvapi-`)

> ⚠️ **Note**: API Key is displayed only once — save immediately and do not share.

---

![image-20260410164719609](/img/providers/nim1.png)

## Configure PicoClaw

### Pay-as-you-go (NVIDIA NIM only supports free quota + pay-as-you-go)

#### Supported Models

|               Model               |               Description                |
| :-------------------------------: | :--------------------------------------: |
|       moonshotai/kimi-k2.5        |   Recommended, excellent long context    |
|          zhipuai/GLM-4.7          | Balanced value, great for Chinese coding |
|      minimaxai/minimax-m2.5       |    Balanced chat & code capabilities     |
|   meta/llama-3.3-70b-versatile    |       High-performance open model        |
| nvidia/nemotron-3-super-120b-a12b |        NVIDIA flagship MoE model         |
|       google/gemma-4-31b-it       |         Google latest chat model         |

#### Method 1: Web UI (Recommended)

Open PicoClaw WebUI → go to **Models** → click **Add Model** in the top-right corner.

![image-20260410164756785](/img/providers/nim2.png)

|      Field       |                       Fill Content                        |
| :--------------: | :-------------------------------------------------------: |
|   Model Alias    |              Custom name, e.g., `nvidia-nim`              |
| Model Identifier | `nvidia/moonshotai/kimi-k2.5` (or other supported models) |
|     API Key      |                  Your NVIDIA NIM API Key                  |
|   API Base URL   |           `https://integrate.api.nvidia.com/v1`           |

#### Method 2: Edit Config Files

```
{
  "version": 2,
  "model_list": [
    {
      "model_name": "nemotron-4-340b",
      "model": "nvidia/nemotron-3-super-120b-a12b"
      "api_base": "https://integrate.api.nvidia.com/v1"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "nemotron-4-340b"
    }
  }
}
```

`~/.picoclaw/.security.yml`：

```
model_list:
  nemotron-4-340b:0:
    api_keys:
      - "nvapi-your-nvidia-api-key"
```

---

## Notes

- NVIDIA NIM has **no subscription plans** — only free quota + pay-as-you-go (token-based real-time billing).
- Fixed API endpoint: `https://integrate.api.nvidia.com/v1` (do not omit or misconfigure).
- API Key starts with `nvapi-` — must be generated on the official API Keys page.
- For production, store API Key in `.security.yml` — avoid plaintext in `config.json`.
- Free quota is limited; monitor remaining calls for frequent use.

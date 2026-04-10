---
id: nim (NVIDIA)-api
title: Nim (NVIDIA) API
---

# NVIDIA NIM 配置指南

## 概述

**NVIDIA NIM（NVIDIA Inference Microservice）**是英伟达推出的**GPU 加速推理微服务**，提供行业标准 OpenAI 兼容接口，支持多厂商主流模型一键调用，推理速度快、稳定性强，个人开发者可免费获取额度使用，是编程、长文本、多模型切换场景的优选方案。

官方文档：https://build.nvidia.com/

官方 API 文档：https://docs.nvidia.com/nim/

------

## 获取 API Key

### 第一步：访问平台

前往 [Try NVIDIA NIM APIs](https://build.nvidia.com/)NVIDIA Build 平台

注册并登录账号。

### 第二步：创建 API Key

1. 点击右上角头像 → 选择 **API Keys**（直达：https://build.nvidia.com/settings/api-keys）
2. 点击 **Generate API Key**，填写名称，选择有效期
3. 生成后复制保存 API Key（以 `nvapi-` 开头）

> ⚠️ **注意**：API Key 仅显示一次，请立即保存，切勿泄露。

------

![image-20260410164719609](./OpenAI/image-20260410164719609.png)

## 配置 PicoClaw

### 按量付费（NVIDIA NIM 仅支持按量 / 免费额度）

#### 支持的模型

|               模型                |           说明           |
| :-------------------------------: | :----------------------: |
|       moonshotai/kimi-k2.5        |    推荐，长上下文优秀    |
|          zhipuai/GLM-4.7          | 均衡性价比，中文编程友好 |
|      minimaxai/minimax-m2.5       |    对话与代码能力均衡    |
|   meta/llama-3.3-70b-versatile    |      开源强性能模型      |
| nvidia/nemotron-3-super-120b-a12b | 英伟达自研旗舰 MoE 模型  |
|       google/gemma-4-31b-it       |   Google 最新对话模型    |

#### 方式一：使用 WebUI（推荐）

打开 PicoClaw WebUI，进入左侧导航 **模型** 页面，点击右上角「添加模型」：

![image-20260410164756785](./OpenAI/image-20260410164756785.png)

|     字段     |                   填写内容                    |
| :----------: | :-------------------------------------------: |
|   模型别名   |          自定义名称，如 `nvidia-nim`          |
|  模型标识符  | nvidia/moonshotai/kimi-k2.5（或其他支持模型） |
|   API Key    |            你的 NVIDIA NIM API Key            |
| API Base URL |      https://integrate.api.nvidia.com/v1      |

#### 方式二：编辑配置文件

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

------

## 注意事项

- NVIDIA NIM **无订阅套餐**，仅支持免费额度 + 按量付费，按 Token 实时结算。
- 固定 API 端点：`https://integrate.api.nvidia.com/v1`，不可省略或填错。
- API Key 以 `nvapi-` 开头，务必在官方 API Keys 页面生成。
- 生产环境请将 API Key 存放在 `.security.yml`，避免明文写入 `config.json`。
- 免费额度有限，高频使用建议关注账户剩余调用次数。


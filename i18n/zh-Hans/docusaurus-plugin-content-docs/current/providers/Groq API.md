# Groq 配置指南

## 概述

Groq 是主打**超低延迟、极速推理**的 AI 推理平台，依托自研 Tensor 架构，在代码生成、对话交互等场景下响应速度极快，适合需要高频、快速调用的开发场景，支持 Llama、Mixtral 等主流开源模型，提供按量付费使用方式。

官方文档：https://console.groq.com/docs/quickstart

------

## 获取 API Key

### 第一步：访问平台

前往 [GroqCloud](https://console.groq.com/home)

注册并登录。

### 第二步：创建 API Key

1. 进入 API Keys 管理页面
2. 点击「Create API Key」创建密钥
3. 复制并保存 API Key

> ⚠️ **注意**：API Key 仅显示一次，请立即保存，避免泄露。

------

![image-20260410163359795](./grop/image-20260410163359795.png)

## 配置 PicoClaw

### 按量付费（Groq 仅支持按量付费）

#### 支持的模型

、

|          模型           |             说明             |
| :---------------------: | :--------------------------: |
| llama-3.3-70b-versatile | 推荐，综合性能均衡，速度极快 |
|    llama-3.3-8b-chat    |   轻量模型，低成本快速响应   |
|  mixtral-8x7b-instruct  |  多专家模型，长文本处理优秀  |
|      gemma-2-9b-it      |     Google 轻量对话模型      |

#### 方式一：使用 WebUI（推荐）

打开 PicoClaw WebUI，进入左侧导航 **模型** 页面，点击右上角「添加模型」：

![image-20260410163514016](./grop/image-20260410163514016.png)

|     字段     |                     填写内容                     |
| :----------: | :----------------------------------------------: |
|   模型别名   |              自定义名称，如 `groq`               |
|  模型标识符  | `groq/llama-3.3-70b-versatile`（或其他支持模型） |
|   API Key    |                你的 Groq API Key                 |
| API Base URL |         `https://api.groq.com/openai/v1`         |

#### 方式二：编辑配置文件

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

------

## 注意事项

- Groq **无订阅套餐**，仅支持按量付费，按 Token 实时扣除账户余额。
- 默认端点固定为 `https://api.groq.com/openai/v1`，不可省略。
- 生产环境请将 API Key 存放在 `.security.yml`，避免明文写入 `config.json`。
- 模型调用速度极快，注意控制调用频率，避免意外超额消耗。

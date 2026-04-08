---
id: zhipu-api
title: 智谱 GLM
---

# 智谱 GLM 配置指南

## 概述

**智谱 AI** 是国内大模型领域的重要力量，依托清华大学的深厚学术背景，GLM 系列模型在中文理解、代码生成和复杂推理上持续突破

GLM-4.7 以均衡的性能和极高的性价比成为日常编程任务的可靠选择，而 GLM-5 系列则在复杂任务上对标国际顶级模型

智谱 Coding Plan 为开发者提供了稳定的订阅制配额，是国内 AI 编程生态的重要组成部分

![智谱 Coding Plan](/img/providers/zhipu-coding-plan.png)

官方文档：https://docs.bigmodel.cn/cn/coding-plan/tool/openclaw

## 获取 API Key

### 第一步：访问平台

前往 [智谱 AI 开放平台](https://open.bigmodel.cn/)，注册并登录

### 第二步：创建 API Key

1. 开通 Coding Plan 套餐（或按量付费）
2. 在控制台 API Key 管理页面创建并复制 API Key

   *⚠️ **注意**：API Key 仅显示一次，请立即保存*

## 配置 PicoClaw

### Coding Plan（推荐）

### 支持的模型

| 模型 | 说明 |
|------|------|
| GLM-4.7 | 推荐，适合大多数任务，套餐用量最经济 |
| GLM-5.1 | 高阶模型，对标 Claude Opus。高峰期 3 倍、非高峰期 2 倍额度消耗 |
| GLM-5 | 高阶模型，消耗系数同 GLM-5.1 |
| GLM-5-Turbo | 高阶模型，消耗系数同 GLM-5.1 |
| GLM-4.6 | 更多选择 |
| GLM-4.5 | 更多选择 |
| GLM-4.5-Air | 更多选择 |
| GLM-4.5V | 更多选择 |
| GLM-4.6V | 更多选择 |

*建议优先使用 GLM-4.7，仅在处理特别复杂的任务时切换至 GLM-5.1，以避免套餐额度消耗过快*

*请勿选择 Flash、FlashX 等模型，否则会扣除账户余额*

### 方式一：使用 WebUI（推荐）

打开 PicoClaw WebUI，进入左侧导航 **模型** 页面，点击右上角「添加模型」：

![添加模型](/img/providers/webuimodel.png)

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 glm |
| 模型标识符 | zhipu/GLM-4.7（或其他支持的模型） |
| API Key | 你的智谱 API Key |
| API Base URL | https://open.bigmodel.cn/api/coding/paas/v4 |

### 方式二：编辑配置文件

config.json：

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "glm",
      "model": "zhipu/GLM-4.7",
      "api_base": "https://open.bigmodel.cn/api/coding/paas/v4"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "glm"
    }
  }
}
```

~/.picoclaw/.security.yml：

```yaml
model_list:
  glm:0:
    api_keys:
      - "your-zhipu-api-key"
```

### 按量付费

### 方式一：使用 WebUI

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 glm |
| 模型标识符 | zhipu/GLM-4.7 |
| API Key | 你的智谱 API Key |
| API Base URL | 留空（自动使用默认端点） |

### 方式二：编辑配置文件

config.json：

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "glm",
      "model": "zhipu/GLM-4.7"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "glm"
    }
  }
}
```

~/.picoclaw/.security.yml：

```yaml
model_list:
  glm:0:
    api_keys:
      - "your-zhipu-api-key"
```

zhipu 协议前缀已内置默认端点 https://open.bigmodel.cn/api/paas/v4，无需填写 api_base

## 注意事项

- Coding Plan 端点为 https://open.bigmodel.cn/api/coding/paas/v4，按量付费端点为 https://open.bigmodel.cn/api/paas/v4，两者不同，请勿填错
- 按量付费会直接扣除账户余额，建议优先使用 Coding Plan
- GLM-5.1、GLM-5、GLM-5-Turbo 消耗额度较快，日常任务推荐使用 GLM-4.7
- 生产环境请将 API Key 存放在 .security.yml，避免明文写入 config.json
---
id: volcengine-api
title: 火山引擎（豆包）
---

# 火山引擎（豆包）配置指南

## 概述

**火山引擎**是字节跳动旗下的云服务平台，豆包大模型系列凭借字节在推荐系统和大规模工程上的深厚积累，在响应速度和并发稳定性上表现出色

火山引擎方舟平台的 Coding Plan 聚合了豆包、MiniMax、Kimi、GLM、DeepSeek 等多家顶级模型，以统一接口和订阅制价格为开发者提供极大便利，是目前国内模型聚合套餐中覆盖面最广的选择之一

![火山引擎方舟平台](/img/providers/volcengine-ark.png)

官方文档：https://www.volcengine.com/docs/82379/1928262?lang=zh

## 获取 API Key

### 第一步：访问平台

前往 [火山引擎方舟控制台](https://console.volcengine.com/ark)，注册并登录。

### 第二步：开通套餐并获取 Key

1. 开通 Coding Plan 套餐（或按量付费）
2. 在控制台 API Key 管理页面创建并复制 API Key

## 配置 PicoClaw

### Coding Plan（推荐）

### 套餐用量

| 套餐 | 每 5 小时 | 每周 | 每订阅月 |
|------|-----------|------|----------|
| Lite | ~1,200 次 | ~9,000 次 | ~18,000 次 |
| Pro | ~6,000 次 | ~45,000 次 | ~90,000 次 |

### 支持的模型

| 模型 | 说明 |
|------|------|
| Doubao-Seed-2.0-pro | 豆包旗舰 |
| Doubao-Seed-2.0-lite | 豆包轻量 |
| Doubao-Seed-2.0-Code | 豆包代码专项 |
| Doubao-Seed-Code | 豆包代码 |
| MiniMax-M2.5 | MiniMax |
| Kimi-K2.5 | Kimi |
| GLM-4.7 | 智谱 GLM |
| DeepSeek-V3.2 | DeepSeek |
| ark-code-latest | 自动选择最优模型 |

*使用 ark-code-latest 时，可在火山引擎管理页面切换目标模型或开启 Auto 模式由系统自动选择，切换后 3-5 分钟生效*

### 方式一：使用 WebUI（推荐）

打开 PicoClaw WebUI，进入左侧导航 **模型** 页面，点击右上角「添加模型」：

![添加模型](/img/providers/webuimodel.png)

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 volcengine |
| 模型标识符 | volcengine/Doubao-Seed-2.0-pro（或其他支持的模型） |
| API Key | 火山引擎 API Key |
| API Base URL | https://ark.cn-beijing.volces.com/api/coding/v3 |

### 方式二：编辑配置文件

config.json：

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "volcengine",
      "model": "volcengine/Doubao-Seed-2.0-pro",
      "api_base": "https://ark.cn-beijing.volces.com/api/coding/v3"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "volcengine"
    }
  }
}
```

*如果使用 ark-code-latest 自动路由，将 model 改为 volcengine/ark-code-latest*

~/.picoclaw/.security.yml：

```yaml
model_list:
  volcengine:0:
    api_keys:
      - "your-volcengine-api-key"
```

### 按量付费

### 方式一：使用 WebUI

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 volcengine |
| 模型标识符 | volcengine/Doubao-Seed-2.0-pro（或其他模型） |
| API Key | 火山引擎 API Key |
| API Base URL | 留空（自动使用默认端点） |

### 方式二：编辑配置文件

config.json：

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "volcengine",
      "model": "volcengine/Doubao-Seed-2.0-pro"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "volcengine"
    }
  }
}
```

~/.picoclaw/.security.yml：

```yaml
model_list:
  volcengine:0:
    api_keys:
      - "your-volcengine-api-key"
```

volcengine 协议前缀已内置默认端点 https://ark.cn-beijing.volces.com/api/v3，无需填写 api_base

## 注意事项

- Coding Plan 端点为 https://ark.cn-beijing.volces.com/api/coding/v3，按量付费端点为 https://ark.cn-beijing.volces.com/api/v3，两者不同，请勿填错
- 按量付费会直接扣除账户余额，建议优先使用 Coding Plan
- 生产环境请将 API Key 存放在 .security.yml，避免明文写入 config.json
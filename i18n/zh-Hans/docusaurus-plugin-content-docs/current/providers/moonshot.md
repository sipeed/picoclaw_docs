---
id: moonshot-api
title: Kimi
---

# Kimi 配置指南

## 概述

**Kimi**（月之暗面）是国内最受关注的大模型创业公司之一，以超长上下文处理能力起家，Kimi-K2 系列在代码生成和复杂推理上实现了显著突破，跻身国内顶级模型行列

Kimi 开放平台提供标准的 OpenAI 兼容接口，接入简单，是希望体验国内顶尖推理能力的开发者的优质选择

![Kimi 概述](/img/providers/kimi-overview.png)

官方文档：https://platform.kimi.com/docs/api/chat

***注意**：Kimi Code 会员明确限制仅可在 Claude Code 和 Roo Code 中使用*

*在 PicoClaw 中使用会员 API Key 存在账号封禁风险*

*本文仅介绍 platform.kimi.com 按量付费 API*

## 获取 API Key

### 第一步：访问平台

前往 [Kimi 开放平台](https://platform.kimi.com/)，注册并登录

### 第二步：创建 API Key

1. 进入控制台 → **API Keys** 页面
2. 创建 API Key，复制并妥善保存

   *⚠️ **注意**：API Key 仅显示一次，请立即保存*

### 模型与价格

| 模型 | 输入（缓存命中） | 输入（未命中） | 输出 | 上下文长度 |
|------|------------------|----------------|------|------------|
| kimi-k2.5 | ¥0.70/M tokens | ¥4.00/M tokens | ¥21.00/M tokens | 262,144 tokens |

## 配置 PicoClaw

### 方式一：使用 WebUI（推荐）

打开 PicoClaw WebUI，进入左侧导航 **模型** 页面，点击右上角「添加模型」：

![添加模型](/img/providers/webuimodel.png)

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 kimi |
| 模型标识符 | moonshot/kimi-k2.5 |
| API Key | 你的 Kimi API Key |
| API Base URL | 留空（自动使用默认端点） |

### 方式二：编辑配置文件

config.json：

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "kimi",
      "model": "moonshot/kimi-k2.5"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "kimi"
    }
  }
}
```

~/.picoclaw/.security.yml：

```yaml
model_list:
  kimi:0:
    api_keys:
      - "your-kimi-api-key"
```

moonshot 协议前缀已内置默认端点 https://api.moonshot.cn/v1，无需填写 api_base

## 注意事项

- 请勿使用 Kimi Code 会员 API Key，仅使用 platform.kimi.com 按量付费 API Key
- 生产环境请将 API Key 存放在 .security.yml，避免明文写入 config.json
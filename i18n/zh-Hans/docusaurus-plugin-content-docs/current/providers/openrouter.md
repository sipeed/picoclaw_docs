---
id: openrouter-api
title: OpenRouter API
---

# OpenRouter API 配置指南

## 概述

**OpenRouter API** 是一个聚合多家大模型服务的统一接口平台，支持访问 OpenAI、Anthropic、Google、Meta 等多个厂商的模型。

通过 OpenRouter，你可以：

- 使用统一 API 调用不同厂商模型
- 自动路由到最优模型或最低成本节点
- 避免单一平台限流问题
- 灵活切换模型，无需更改代码

## 支持的模型

| 模型 | 提供商 | 特点 | 适用场景 |
|------|--------|------|----------|
| openai/gpt-4o-mini | OpenAI | 快速、低成本 | 日常对话 |
| openai/gpt-4o | OpenAI | 高质量 | 多模态任务 |
| anthropic/claude-3-haiku | Anthropic | 速度快 | 轻量任务 |
| anthropic/claude-3-opus | Anthropic | 高推理能力 | 复杂分析 |
| google/gemini-pro | Google | 强多模态 | 综合任务 |

## 获取 API Key

### 步骤 1：访问 OpenRouter

前往 [OpenRouter](https://openrouter.ai/)

### 步骤 2：登录账号

支持使用 GitHub / Google 登录。

### 步骤 3：创建 API Key

1. 进入 **Dashboard → Keys**
2. 点击 **Create Key**
3. **复制并保存** 生成的 API Key

> ⚠️ **注意**：请妥善保存 API Key，避免泄露。

![OpenRouter API Key](/img/providers/openrouterapi.png)

![OpenRouter API Key](/img/providers/openrouterapi1.png)

## 配置 PicoClaw

### 方式一：使用 WebUI（推荐）

PicoClaw 提供了 WebUI 界面，您可以在 WebUI 中轻松配置模型，无需手动编辑配置文件。

编辑预设设置，或在右上角点击 **"添加模型"** 按钮进行配置：

![添加模型](/img/providers/webuimodel.png)

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 `gpt-4o-mini` |
| 模型标识符 | `openrouter/openai/gpt-4o-mini`（或其他支持的模型） |
| API Key | OpenRouter API Key |
| API Base URL | 留空即可（默认：`https://openrouter.ai/api/v1`） |

### 方式二：编辑配置文件

在 `config.json` 中添加：

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-mini",
      "model": "openrouter/openai/gpt-4o-mini",
      "custom_headers": {
        "HTTP-Referer": "http://localhost",
        "X-Title": "PicoClaw"
      }
    },
    {
      "model_name": "claude-3-haiku",
      "model": "openrouter/anthropic/claude-3-haiku"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt-4o-mini"
    }
  }
}
```

在 `~/.picoclaw/.security.yml` 中存放 API Key：

```yaml
model_list:
  gpt-4o-mini:
    api_keys:
      - "YOUR_OPENROUTER_API_KEY"
  claude-3-haiku:
    api_keys:
      - "YOUR_OPENROUTER_API_KEY"
```

生产环境建议将真实密钥放在 `~/.picoclaw/.security.yml`，`config.json` 主要用于维护模型结构。

## 注意事项

### 计费方式

OpenRouter 采用 **按使用量计费** 模式，根据实际使用的模型和 Token 数量收费。

### 速率限制

- 不同模型有不同的速率限制
- 免费模型可能有更严格的限制
- 付费用户享有更高的速率配额

### 常见问题

#### 模型不可用

**原因**：模型已下架或账户余额不足

**解决**：
- 检查模型是否仍然可用
- 充值账户余额

#### 响应超时

**原因**：模型响应较慢或网络问题

**解决**：
- 尝试使用更快的模型
- 检查网络连接

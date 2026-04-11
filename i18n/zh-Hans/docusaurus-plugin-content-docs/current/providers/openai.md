---
id: openai-api
title: OpenAI API
---

# OpenAI API 配置指南

## 概述

**OpenAI API** 是由 OpenAI 提供的通用 AI 接口，支持文本生成、对话、代码生成等多种能力。它提供了高度统一的接口规范，被广泛支持。

OpenAI 提供多个模型系列，适用于不同性能与成本场景：

## 支持的模型

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| gpt-4o-mini | 速度快、成本低 | 高并发、日常对话 |
| gpt-4o | 高质量多模态 | 复杂任务、图像理解 |
| gpt-4.1 | 更强推理与代码能力 | 代码生成、逻辑推理 |

## 获取 API Key

### 步骤 1：访问 OpenAI 平台

前往 [OpenAI Platform](https://platform.openai.com/) 并登录你的账号。

### 步骤 2：生成 API Key

1. 进入 **Dashboard → API Keys**
2. 点击 **"Create new secret key"**
3. **复制并保存** 生成的 API Key

> ⚠️ **注意**：API Key 仅显示一次，请妥善保管，不要泄露给他人。

![API Keys 页面](/img/providers/openaiapi.png)

![创建新的 API Key](/img/providers/openaiapi1.png)

## 配置 PicoClaw

### 方式一：使用 WebUI（推荐）

PicoClaw 提供了 WebUI 界面，您可以在 WebUI 中轻松配置模型，无需手动编辑配置文件。

编辑预设设置，或在右上角点击 **"添加模型"** 按钮进行配置：

![添加模型](/img/providers/webuimodel.png)

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 `gpt-4o` |
| 模型标识符 | `openai/gpt-4o-mini`（或其他支持的模型） |
| API Key | OpenAI API Key（`sk-xxxxx`） |
| API Base URL | 留空（默认使用 `https://api.openai.com/v1`） |

### 方式二：编辑配置文件

在 `config.json` 中添加 OpenAI 模型（schema v2 将模型结构与凭证分离）：

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-mini",
      "model": "openai/gpt-4o-mini"
    },
    {
      "model_name": "gpt-4o",
      "model": "openai/gpt-4o"
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
      - "YOUR_OPENAI_API_KEY_HERE"
  gpt-4o:
    api_keys:
      - "YOUR_OPENAI_API_KEY_HERE"
```

生产环境建议将真实密钥放在 `~/.picoclaw/.security.yml`，`config.json` 主要用于维护模型结构。

## 注意事项

### 计费方式

OpenAI 采用 **按 Token 使用量计费（Pay-as-you-go）** 模式，根据实际使用的 Token 数量收费。

### 速率限制

不同账户等级和模型有不同的速率限制：

- **RPM**（Requests Per Minute）：每分钟请求数
- **TPM**（Tokens Per Minute）：每分钟 Token 数

超过限制时会返回 `429 Too Many Requests` 错误。

---

## 常见问题

### max_tokens 报错

```
Invalid max_tokens value
```

**原因**：超过模型限制

**解决**：降低 `max_tokens` 参数值（如 1024 或 2048）

### 429 限流错误

**解决方案**：

- 降低请求频率
- 升级 OpenAI 账户等级
- 在 PicoClaw 中启用请求限流

### 无法连接 API

**检查项**：

- `base_url` 是否正确（默认：`https://api.openai.com/v1`）
- 是否需要代理（中国大陆用户）
- DNS 解析是否正常
- 网络连通性
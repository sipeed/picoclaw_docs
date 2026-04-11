---
id: gemini-api
title: Gemini API (Google AI Studio)
---

# Gemini API 配置指南

## 概述

**Gemini API** 是由 Google 推出的 AI 接口，通过 **Google AI Studio** 提供。相比 Google Cloud 的 Vertex AI，AI Studio 提供了更简单的 **API Key** 认证方式，非常适合快速开发和个人集成。

Gemini 提供多个模型系列，适用于不同性能与成本场景：

## 支持的模型

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| gemini-2.0-flash | 速度快、成本低 | 高并发、日常对话 |
| gemini-1.5-pro | 高质量多模态 | 复杂任务、长文本理解 |
| gemini-1.5-flash | 平衡性能与成本 | 通用场景 |

## 获取 API Key

### 步骤 1：访问 Google AI Studio

前往 [Google AI Studio](https://aistudio.google.com/) 并使用你的 Google 账号登录。

### 步骤 2：生成 API Key

1. 在左侧导航栏点击 **"Get API key"**
2. 点击 **"Create API key in new project"**（或选择现有 Google Cloud 项目）
3. **复制并保存** 生成的 API Key

> ⚠️ **注意**：API Key 请妥善保管，不要泄露在公开代码库中。

![Gemini API Key](/img/providers/geminiapi.png)

![Gemini API Key](/img/providers/geminiapi1.png)

## 配置 PicoClaw

### 方式一：使用 WebUI（推荐）

PicoClaw 提供了 WebUI 界面，您可以在 WebUI 中轻松配置模型，无需手动编辑配置文件。

编辑预设设置，或在右上角点击 **"添加模型"** 按钮进行配置：

![添加模型](/img/providers/webuimodel.png)

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 `gemini-flash` |
| 模型标识符 | `gemini/gemini-2.0-flash`（或其他支持的模型） |
| API Key | Google AI Studio API Key |
| API Base URL | 留空（使用默认地址） |

### 方式二：编辑配置文件

在 `config.json` 中添加 Gemini 模型（schema v2 将模型结构与凭证分离）：

```json
{
  "model_list": [
    {
      "model_name": "gemini-flash",
      "model": "gemini/gemini-2.0-flash"
    },
    {
      "model_name": "gemini-pro",
      "model": "gemini/gemini-1.5-pro"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gemini-flash"
    }
  }
}
```

在 `~/.picoclaw/.security.yml` 中存放 API Key：

```yaml
model_list:
  gemini-flash:
    api_keys:
      - "YOUR_GEMINI_API_KEY_HERE"
  gemini-pro:
    api_keys:
      - "YOUR_GEMINI_API_KEY_HERE"
```

生产环境建议将真实密钥放在 `~/.picoclaw/.security.yml`，`config.json` 主要用于维护模型结构。

## 注意事项

### 免费层级

Google AI Studio 为开发者提供免费层级：

- **免费额度**：每日有免费请求配额
- **速率限制**：免费层级有每分钟请求数（RPM）限制
- **数据隐私**：免费层级下，Google 可能会使用输入/输出数据改进模型

### 付费层级

如需更高配额或企业级隐私保护，可升级至付费层级或使用 Google Cloud Vertex AI。

### 常见问题

#### API Key 无效

**原因**：API Key 过期或被撤销

**解决**：前往 Google AI Studio 重新生成 API Key

#### 请求超时

**原因**：网络问题或请求过于频繁

**解决**：
- 检查网络连接
- 降低请求频率
- 使用代理（如需要）

#### 模型不可用

**原因**：部分模型在特定地区不可用

**解决**：
- 检查模型是否在您的地区支持
- 尝试使用其他 Gemini 模型

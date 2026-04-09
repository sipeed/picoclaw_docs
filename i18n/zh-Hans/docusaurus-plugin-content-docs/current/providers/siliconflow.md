---
id: siliconflow-api
title: SiliconFlow API
---

# SiliconFlow API 配置指南

## 概述

**SiliconFlow（硅基流动）** 是一个提供高性价比大模型推理服务的平台，支持多种开源与商业模型（如 DeepSeek、Qwen、LLaMA 等）。

## 支持的模型

| 模型 | 提供方 | 特点 | 适用场景 |
|------|--------|------|----------|
| deepseek-chat | DeepSeek | 综合能力强 | 日常对话 |
| deepseek-coder | DeepSeek | 代码能力强 | 编程任务 |
| qwen2-7b-instruct | 阿里 | 中文优化 | 中文场景 |
| llama3-70b-instruct | Meta | 开源大模型 | 通用任务 |

## 获取 API Key

### 步骤 1：访问平台

前往 [SiliconFlow 云平台](https://cloud.siliconflow.cn/)

### 步骤 2：登录账号

支持手机号或其他方式注册登录。

### 步骤 3：创建 API Key

1. 进入 **控制台 → API Key 管理**
2. 点击 **创建 API Key**
3. **复制并保存** Key

> ⚠️ **注意**：API Key 仅显示一次，请妥善保存。

## 配置 PicoClaw

### 方式一：使用 WebUI（推荐）

PicoClaw 提供了 WebUI 界面，您可以在 WebUI 中轻松配置模型，无需手动编辑配置文件。

编辑预设设置，或在右上角点击 **"添加模型"** 按钮进行配置：

![添加模型](/img/providers/webuimodel.png)

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 `deepseek-chat` |
| 模型标识符 | `openai/deepseek-ai/DeepSeek-V3`（或其他 SiliconFlow 模型 ID） |
| API Key | SiliconFlow API Key |
| API Base URL | `https://api.siliconflow.cn/v1` |

### 方式二：编辑配置文件

在 `config.json` 中添加：

```json
{
  "model_list": [
    {
      "model_name": "deepseek-chat",
      "model": "openai/deepseek-ai/DeepSeek-V3",
      "api_base": "https://api.siliconflow.cn/v1"
    },
    {
      "model_name": "deepseek-coder",
      "model": "openai/deepseek-ai/DeepSeek-Coder-V2-Instruct",
      "api_base": "https://api.siliconflow.cn/v1"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "deepseek-chat"
    }
  }
}
```

在 `~/.picoclaw/.security.yml` 中存放 API Key：

```yaml
model_list:
  deepseek-chat:
    api_keys:
      - "YOUR_SILICONFLOW_API_KEY"
  deepseek-coder:
    api_keys:
      - "YOUR_SILICONFLOW_API_KEY"
```

生产环境建议将真实密钥放在 `~/.picoclaw/.security.yml`，`config.json` 主要用于维护模型结构。

## 注意事项

### 计费方式

SiliconFlow 采用 **按使用量计费** 模式，根据实际使用的模型和 Token 数量收费。

### 速率限制

- 不同模型有不同的速率限制
- 新用户可能有免费额度
- 充值后可享受更高的速率配额

### 常见问题

#### 余额不足

**原因**：账户余额耗尽

**解决**：前往控制台充值

#### 模型不可用

**原因**：模型名称填写错误，或该模型已下线

**解决**：
- 检查模型名称是否正确
- 在 SiliconFlow 文档中确认当前可用模型列表


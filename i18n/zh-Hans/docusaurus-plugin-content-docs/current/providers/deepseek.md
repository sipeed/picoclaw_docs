---
id: deepseek-api
title: DeepSeek
---

# DeepSeek 配置指南

## 概述

**DeepSeek** 是国内大模型领域的标杆级存在

DeepSeek-V3 系列以极具竞争力的推理性能和极低的 API 价格，在全球范围内引发广泛关注，成为开发者首选的高性价比模型之一

其 OpenAI 兼容接口让接入几乎零门槛，是 PicoClaw 用户最常用的国内 provider 之一

![DeepSeek 概述](/img/providers/deepseek-overview.png)

官方文档：https://api-docs.deepseek.com/zh-cn/api/deepseek-api/

***注意**：DeepSeek 目前仅支持按量付费，无订阅套餐*

*deepseek-chat 当前对应 DeepSeek-V3.2*

## 获取 API Key

### 第一步：访问平台

前往 [DeepSeek 开放平台](https://platform.deepseek.com/)，注册并登录

### 第二步：创建 API Key

1. 进入控制台 → **API Keys** 页面
2. 点击「创建 API Key」
3. 复制并妥善保存

   *⚠️ **注意**：API Key 仅显示一次，请立即保存*

## 配置 PicoClaw

### 方式一：使用 WebUI（推荐）

打开 PicoClaw WebUI，进入左侧导航 **模型** 页面，点击右上角「添加模型」：

![添加模型](/img/providers/webuimodel.png)

| 字段 | 填写内容 |
|------|----------|
| 模型别名 | 自定义名称，如 deepseek |
| 模型标识符 | deepseek/deepseek-chat |
| API Key | 你的 DeepSeek API Key |
| API Base URL | 留空（自动使用默认端点） |

点击「添加模型」保存，如需设为默认模型，开启底部「设为默认模型」开关

### 方式二：编辑配置文件

在 config.json 的 model_list 中添加（不含密钥）：

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "deepseek",
      "model": "deepseek/deepseek-chat"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "deepseek"
    }
  }
}
```

在 ~/.picoclaw/.security.yml 中存放密钥：

```yaml
model_list:
  deepseek:0:
    api_keys:
      - "sk-your-deepseek-key"
```

deepseek 协议前缀已内置默认端点 https://api.deepseek.com/v1，无需填写 api_base

## 注意事项

- DeepSeek 目前仅支持按量付费，无订阅套餐
- deepseek-chat 当前对应 DeepSeek-V3.2
- 生产环境请将 API Key 存放在 .security.yml，避免明文写入 config.json
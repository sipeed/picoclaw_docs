---
id: antigravity
title: Antigravity（Google Cloud Code Assist）
---

# Antigravity 认证与集成指南

## 概述

**Antigravity**（Google Cloud Code Assist）是 Google 支持的 AI 模型提供商，通过 Google Cloud 基础设施提供对 Claude Opus 4.6、Gemini 等模型的访问。本文档介绍认证流程、如何获取模型列表以及如何在 PicoClaw 中实现新提供商。

---

## 认证流程

### OAuth 2.0 + PKCE

Antigravity 使用 **OAuth 2.0 with PKCE（Proof Key for Code Exchange）** 进行安全认证：

```
┌─────────────┐                                    ┌─────────────────┐
│   客户端    │ ───(1) 生成 PKCE 参数─────────────> │                 │
│             │ ───(2) 打开授权 URL───────────────> │  Google OAuth   │
│             │                                    │    服务器       │
│             │ <──(3) 重定向（含 Code）──────────── │                 │
│             │                                    └─────────────────┘
│             │ ───(4) 用 Code 换取 Token──────────> │   Token URL    │
│             │                                    │                 │
│             │ <──(5) Access Token + Refresh Token│                 │
└─────────────┘                                    └─────────────────┘
```

### 两种 OAuth 模式

**自动模式**（本地开发，有浏览器）：
- 在本地 51121 端口启动 HTTP 服务
- 等待 Google 重定向回来
- 自动从查询参数中提取授权码

**手动模式**（远程/无头环境）：
- 将授权 URL 展示给用户
- 用户在浏览器中完成认证
- 用户将完整的重定向 URL 粘贴回终端
- 从粘贴的 URL 中解析授权码

## Token 管理

认证成功后，Token 存储在 `~/.picoclaw/auth.json`：

- **Access Token**：有效期约 1 小时，自动刷新
- **Refresh Token**：长期有效，用于获取新的 Access Token
- **自动刷新**：PicoClaw 在 Token 过期前自动刷新，无需手动干预

## 配置

为了提供更流畅和直观的配置体验，我们推荐优先通过 Web UI 配置模型。

![Web UI 模型配置](/img/providers/webuimodel.png)

在 `config.json` 中添加 Antigravity 模型：

```json
{
  "model_list": [
    {
      "model_name": "gemini",
      "model": "antigravity/gemini-2.0-flash",
      "auth_method": "oauth"
    },
    {
      "model_name": "claude-thinking",
      "model": "antigravity/claude-opus-4-6-thinking",
      "auth_method": "oauth"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gemini"
    }
  }
}
```

## 快速开始

```bash
# 1. 登录
picoclaw auth login --provider antigravity

# 2. 查看可用模型
picoclaw auth models

# 3. 测试
picoclaw agent -m "你好！"
```

详细使用说明请参考 [Antigravity 使用指南](./antigravity-usage.md)。

## API 端点参考

| 端点 | 用途 |
| --- | --- |
| `https://accounts.google.com/o/oauth2/v2/auth` | OAuth 授权 |
| `https://oauth2.googleapis.com/token` | Token 交换/刷新 |
| `https://cloudcode-pa.googleapis.com/v1internal/models` | 获取模型列表 |

## 所需 OAuth 权限范围

- `https://www.googleapis.com/auth/cloud-platform`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/cclog`
- `https://www.googleapis.com/auth/experimentsandconfigs`

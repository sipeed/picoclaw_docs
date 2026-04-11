---
id: index
title: 聊天通道
sidebar_label: 概览
---

# 聊天通道

通过 **网关模式** 将 PicoClaw 连接到各种即时通讯平台。

```bash
picoclaw gateway
```

## 支持的通道

| 通道 | 难度 | 说明 |
| --- | --- | --- |
| **Telegram** | 简单 | 推荐。支持 Groq 语音转文字。 |
| **Discord** | 简单 | 机器人 token + 意图配置。支持群聊触发。 |
| **Slack** | 简单 | Socket 模式，无需公网 IP。 |
| **QQ** | 简单 | 官方 QQ 机器人 API（AppID + AppSecret）。 |
| **钉钉** | 中等 | Stream 模式，无需公网 IP。 |
| **企业微信** | 简单 | 统一 WebSocket 企业微信集成，基于 AI Bot API。支持扫码登录。 |
| **飞书** | 困难 | 企业协作平台。 |
| **LINE** | 困难 | 通过共享网关端口接收 Webhook。 |
| **OneBot** | 中等 | 兼容 NapCat/Go-CQHTTP。 |
| **Matrix** | 简单 | 开放的去中心化协议。支持输入状态、占位消息、媒体。 |
| **WhatsApp** | 中等 | Bridge 模式或原生协议（whatsmeow）。 |
| **MaixCam** | 简单 | 硬件集成 AI 摄像头。 |
| **VK** | 简单 | 通过 Long Poll API 连接 VKontakte 社区机器人。 |
| **Pico** | 简单 | 原生 WebSocket 通道，适用于自定义客户端。 |

## 工作原理

1. 在 `~/.picoclaw/config.json` 的 `channels` 字段中配置一个或多个通道
2. 为要启用的每个通道设置 `"enabled": true`
3. 运行 `picoclaw gateway` 开始监听
4. 网关同时处理所有通道

## 访问控制

所有通道都支持 `allow_from` 字段，用于限制特定用户的访问：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_TOKEN",
      "allow_from": ["123456789"]
    }
  }
}
```

将 `allow_from` 设置为空数组 `[]` 可允许所有用户访问。也可以设置 `allow_from: ["*"]` 来显式允许所有用户（启动时会打印警告日志）。

## 通用通道字段

所有通道均支持以下可选字段：

| 字段 | 说明 |
| --- | --- |
| `reasoning_channel_id` | 将推理/思考过程输出到单独的频道 |
| `group_trigger` | 控制机器人在群聊中的触发行为（仅@、关键词前缀） |

## 共享网关

所有基于 Webhook 的通道（LINE、钉钉等）共享同一个网关 HTTP 服务器，端口为 `18790`。不再需要每个通道单独配置 `webhook_host`/`webhook_port`——只需配置 `webhook_path` 即可区分各端点。企业微信现在使用出站 WebSocket 连接，不再需要公网 Webhook。

日志级别通过 `gateway.log_level` 控制（默认：`warn`）。支持的值：`debug`、`info`、`warn`、`error`、`fatal`。

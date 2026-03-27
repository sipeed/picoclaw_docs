---
id: wecom-bot
title: WeCom Bot (企业微信机器人)
---

# 企业微信机器人

企业微信机器人是较简单的企业微信接入方式，支持通过 Webhook 在群聊中使用。

如需完整功能的企业微信自建应用（私聊、主动推送），请参见 [企业微信自建应用](./wecom-app.md)。如需官方智能机器人，请参见 [企业微信智能机器人](./wecom-aibot.md)。

## 设置流程

### 1. 创建机器人

- 前往企业微信管理后台 → 群聊 → 添加群聊机器人
- 复制 Webhook URL（格式：`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx`）

### 2. 配置消息接收（可选）

如需接收用户消息：
- 设置 Webhook 回调端点
- 配置 Token 和 EncodingAESKey

### 3. 配置

```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "token": "YOUR_TOKEN",
      "encoding_aes_key": "YOUR_43_CHAR_ENCODING_AES_KEY",
      "webhook_url": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY",
      "webhook_path": "/webhook/wecom",
      "allow_from": [],
      "reply_timeout": 5
    }
  }
}
```

企业微信机器人使用共享网关 HTTP 服务器（默认端口 `18790`）。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `token` | string | 签名验证令牌 |
| `encoding_aes_key` | string | 用于消息加密的 43 字符 AES 密钥 |
| `webhook_url` | string | 企业微信机器人 Webhook URL，用于发送消息 |
| `webhook_path` | string | Webhook 接收路径（默认：`/webhook/wecom`） |
| `allow_from` | array | 允许的用户 ID 列表 |
| `reply_timeout` | int | 回复超时时间（秒） |

### 4. 运行

```bash
picoclaw gateway
```

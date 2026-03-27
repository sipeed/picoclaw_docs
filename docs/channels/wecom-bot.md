---
id: wecom-bot
title: WeCom Bot (企业微信机器人)
---

# WeCom Bot

WeCom Bot (智能机器人) is the easier WeCom integration. It supports group chats via webhook.

For the full-featured WeCom App integration (private chat, proactive messaging), see [WeCom App](./wecom-app.md). For the official AI Bot integration, see [WeCom AI Bot](./wecom-aibot.md).

## Setup

### 1. Create a Bot

- Go to WeCom Admin Console → Group Chat → Add Group Bot
- Copy the webhook URL (format: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx`)

### 2. Configure Receive Messages (Optional)

To receive messages from users:
- Set up a webhook endpoint
- Configure Token and EncodingAESKey

### 3. Configure

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

WeCom Bot uses the shared gateway HTTP server (default port `18790`).

| Field | Type | Description |
| --- | --- | --- |
| `token` | string | Verification token |
| `encoding_aes_key` | string | 43-character AES key for message encryption |
| `webhook_url` | string | WeCom bot webhook URL for sending messages |
| `webhook_path` | string | Webhook receive path (default: `/webhook/wecom`) |
| `allow_from` | array | List of allowed user IDs |
| `reply_timeout` | int | Reply timeout in seconds |

### 4. Run

```bash
picoclaw gateway
```

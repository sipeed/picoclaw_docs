---
id: wecom-aibot
title: WeCom AI Bot (企业微信智能机器人)
---

# WeCom AI Bot

WeCom AI Bot (智能机器人) is the official WeCom AI Bot integration using the streaming pull protocol. It supports proactive messaging and private chats.

For the simpler group chat bot, see [WeCom Bot](./wecom-bot). For the self-built app integration, see [WeCom App](./wecom-app).

## Setup

### 1. Create an AI Bot

- Log in to the [WeCom Admin Console](https://work.weixin.qq.com/wework_admin)
- Go to AI Bot settings
- Note down **Token** and **EncodingAESKey**

### 2. Configure PicoClaw

```json
{
  "channels": {
    "wecom_aibot": {
      "enabled": true,
      "token": "YOUR_TOKEN",
      "encoding_aes_key": "YOUR_43_CHAR_ENCODING_AES_KEY",
      "webhook_path": "/webhook/wecom-aibot",
      "max_steps": 10,
      "welcome_message": "Hello! I'm your AI assistant. How can I help you today?"
    }
  }
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `token` | string | — | Verification token |
| `encoding_aes_key` | string | — | 43-character AES key |
| `webhook_path` | string | `/webhook/wecom-aibot` | Webhook receive path |
| `max_steps` | int | 10 | Maximum streaming steps |
| `welcome_message` | string | — | Message sent on `enter_chat` event |
| `reasoning_channel_id` | string | — | Route reasoning output to a separate chat |

### 3. Run

```bash
picoclaw gateway
```

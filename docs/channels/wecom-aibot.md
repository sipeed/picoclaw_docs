---
id: wecom-aibot
title: WeCom AI Bot (企业微信智能机器人)
---

# WeCom AI Bot

WeCom AI Bot (智能机器人) is the official WeCom AI Bot integration using the streaming pull protocol. It supports both private and group chats with streaming responses.

For the simpler group chat bot, see [WeCom Bot](./wecom-bot). For the self-built app integration, see [WeCom App](./wecom-app).

## Comparison with Other WeCom Channels

| Feature | WeCom Bot | WeCom App | **WeCom AI Bot** |
| --- | --- | --- | --- |
| Private chat | ✅ | ✅ | ✅ |
| Group chat | ✅ | ❌ | ✅ |
| Streaming output | ❌ | ❌ | ✅ |
| Proactive push after timeout | ❌ | ✅ | ✅ |
| Configuration complexity | Low | High | Medium |

## Setup

### 1. Create an AI Bot

1. Log in to the [WeCom Admin Console](https://work.weixin.qq.com/wework_admin)
2. Go to **App Management** → **AI Bot** (智能机器人), create or select an AI Bot
3. In the AI Bot configuration page, fill in the "Message Receive" settings:
   - **URL**: `http://<your-server-ip>:18790/webhook/wecom-aibot`
   - **Token**: Generate randomly or set a custom value
   - **EncodingAESKey**: Click "Random Generate" to get a 43-character key
4. Copy the **Token** and **EncodingAESKey** values

:::tip
Your server must be accessible from WeCom servers. For local development, use [ngrok](https://ngrok.com) or frp for tunneling.
:::

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
      "welcome_message": "Hello! I'm your AI assistant. How can I help you today?",
      "reasoning_channel_id": ""
    }
  }
}
```

### 3. Save and Verify

1. Start PicoClaw first
2. Go back to the WeCom Admin Console and click **Save**
3. WeCom will send a verification request to your server — PicoClaw must be running to respond

### 4. Run

```bash
picoclaw gateway
```

## Field Reference

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `token` | string | — | Verification token from the AI Bot configuration page |
| `encoding_aes_key` | string | — | 43-character AES key from the AI Bot configuration page |
| `webhook_path` | string | `/webhook/wecom-aibot` | Webhook receive path |
| `allow_from` | array | [] | User ID whitelist (empty = allow all) |
| `reply_timeout` | int | 5 | Reply timeout in seconds |
| `max_steps` | int | 10 | Maximum agent execution steps |
| `welcome_message` | string | — | Message sent when a user opens the chat (`enter_chat` event) |
| `reasoning_channel_id` | string | — | Route reasoning output to a separate chat |

## Streaming Response Protocol

WeCom AI Bot uses a "streaming pull" protocol, different from the one-shot reply of regular webhooks:

```
User sends message
  │
  ▼
PicoClaw immediately returns {finish: false} (agent starts processing)
  │
  ▼
WeCom polls approximately every 1 second: {msgtype: "stream", stream: {id: "..."}}
  │
  ├─ Agent not done → return {finish: false} (keep waiting)
  │
  └─ Agent done → return {finish: true, content: "response content"}
```

### Timeout Handling

If the agent takes longer than ~30 seconds (WeCom's maximum polling window is ~6 minutes):

1. PicoClaw closes the stream and shows the user: "⏳ Processing, please wait. The result will be sent shortly."
2. The agent continues running in the background
3. When the agent finishes, PicoClaw sends the final reply via the `response_url` provided in the original message

:::note
`response_url` is issued by WeCom, valid for 1 hour, and can only be used once. PicoClaw POSTs a markdown message body directly — no encryption needed.
:::

## Welcome Message

When `welcome_message` is configured, PicoClaw automatically sends this message when a user opens the AI Bot chat window (`enter_chat` event). Leave empty to disable.

```json
"welcome_message": "Hello! I'm your PicoClaw AI assistant. How can I help you?"
```

## Troubleshooting

### Callback URL Verification Failed

- Ensure your server firewall allows the gateway port (default 18790)
- Verify that `token` and `encoding_aes_key` are correct
- Check PicoClaw logs for incoming GET requests from WeCom

### No Reply to Messages

- Check if `allow_from` accidentally restricts the sender
- Look for `context canceled` or agent errors in logs
- Verify agent configuration (`model_name`, etc.) is correct

### Long-running Tasks Not Receiving Final Push

- Confirm the message callback includes a `response_url` (only supported by newer WeCom AI Bot versions)
- Ensure the server can access the internet (needs to POST to `response_url`)
- Check logs for `response_url mode` and `Sending reply via response_url`

## Reference

- [WeCom AI Bot Documentation](https://developer.work.weixin.qq.com/document/path/100719)
- [Streaming Response Protocol](https://developer.work.weixin.qq.com/document/path/100719)
- [response_url Proactive Reply](https://developer.work.weixin.qq.com/document/path/101138)

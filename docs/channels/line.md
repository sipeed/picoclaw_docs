---
id: line
title: LINE
---

# LINE

LINE requires HTTPS for webhooks (use a reverse proxy or tunnel like ngrok).

## Setup

### 1. Create a LINE Official Account

- Go to [LINE Developers Console](https://developers.line.biz/)
- Create a provider → Create a Messaging API channel
- Copy **Channel Secret** and **Channel Access Token**

### 2. Configure PicoClaw

```json
{
  "channels": {
    "line": {
      "enabled": true,
      "channel_secret": "YOUR_CHANNEL_SECRET",
      "channel_access_token": "YOUR_CHANNEL_ACCESS_TOKEN",
      "webhook_path": "/webhook/line",
      "allow_from": []
    }
  }
}
```

LINE uses the shared gateway HTTP server (default port `18790`). No separate `webhook_host`/`webhook_port` configuration is needed.

### 3. Set Up HTTPS Webhook

LINE requires HTTPS. Use a reverse proxy or tunnel:

```bash
# Example with ngrok
ngrok http 18790
```

Set the Webhook URL in LINE Developers Console to `https://your-domain/webhook/line` and enable **Use webhook**.

### 4. Run

```bash
picoclaw gateway
```

## Notes

- In group chats, the bot responds only when @mentioned (default `group_trigger.mention_only: true`)
- Replies quote the original message

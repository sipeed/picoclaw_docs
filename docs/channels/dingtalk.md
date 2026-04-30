---
id: dingtalk
title: DingTalk (钉钉)
---

# DingTalk

DingTalk is Alibaba's enterprise communication platform, widely used in Chinese workplaces. PicoClaw uses DingTalk's **Stream Mode** SDK, which maintains a persistent WebSocket connection — no public IP or webhook configuration needed.

## Setup

### 1. Create an Internal App

1. Go to [DingTalk Open Platform](https://open.dingtalk.com/)
2. Click **Application Development** → **Enterprise Internal Development** → **Create Application**
3. Fill in the app name and description

### 2. Get Credentials

1. Go to **Credentials & Basic Info** in your app settings
2. Copy the **Client ID** (AppKey) and **Client Secret** (AppSecret)

### 3. Enable Robot Capability

1. Go to **App Features** → **Robot**
2. Enable the robot capability
3. The robot can work in both **group chats** and **private chats**

### 4. Configure Permissions

In **Permissions & Scopes**, ensure the following permissions are granted:

- Receive messages (for receiving user messages)
- Send messages (for sending bot replies)

### 5. Configure PicoClaw

#### 1. WebUI Configuration

We recommend using the WebUI first because it is faster and more convenient.

![WebUI DingTalk Connection Interface](/img/channels/webui_dingtalk.png)

Fill in the Client ID (`YOUR_CLIENT_ID`) and Client Secret (`YOUR_CLIENT_SECRET`) in order, then click **Save**.

#### 2. Configuration Files

Edit `~/.picoclaw/.security.yml`:

```yaml
dingtalk:
  settings:
    client_secret: YOUR_CLIENT_SECRET
```

Edit `~/.picoclaw/config.json`:

```json
{
  "channels": {
      "enabled": true,
      "type": "dingtalk",
      "reasoning_channel_id": "",
      "group_trigger": {},
      "typing": {},
      "placeholder": {
        "enabled": false
      },
      "settings": {
        "client_id": "YOUR_CLIENT_ID"
      }
  }
}
```

### 6. Run

```bash
picoclaw gateway
```

## Field Reference

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `client_id` | string | Yes | DingTalk app Client ID (AppKey) |
| `client_secret` | string | Yes | DingTalk app Client Secret (AppSecret) |
| `allow_from` | array | No | DingTalk user ID whitelist (empty = allow all) |
| `group_trigger` | object | No | Group chat trigger settings (see [Common Channel Fields](../#common-channel-fields)) |
| `reasoning_channel_id` | string | No | Route reasoning output to a separate chat |

## How It Works

### Stream Mode

DingTalk Stream Mode uses a persistent WebSocket connection maintained by the SDK:

- **No public IP needed** — the SDK connects outbound to DingTalk servers
- **Automatic reconnection** — the SDK handles disconnections and reconnects automatically
- **Real-time delivery** — messages are pushed instantly via the WebSocket channel

### Message Handling

- **Private chats**: Messages are received directly
- **Group chats**: The bot responds when @-mentioned (configurable via `group_trigger`)
- **Session Webhook**: Each incoming message carries a `sessionWebhook` URL for direct replies
- **Max message length**: 20,000 characters per message (longer responses are automatically truncated)

### Mention Handling in Groups

When the bot is @-mentioned in a group chat, PicoClaw automatically strips leading `@mention` tags from the message before passing it to the agent. This ensures the agent receives clean input text without the `@BotName` prefix. The bot uses DingTalk's `IsInAtList` field to reliably detect whether it was mentioned, rather than parsing the text manually.

### Group vs Private Chat

| Feature | Private Chat | Group Chat |
| --- | --- | --- |
| Trigger | Any message | @mention by default |
| Reply | Direct response | Reply via session webhook |
| Context | Per-user session | Per-group session |

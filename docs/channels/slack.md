---
id: slack
title: Slack
---

# Slack

Slack integration uses **Socket Mode**, so no public IP is needed. PicoClaw maintains a real-time bidirectional WebSocket connection to Slack.

## Setup

### 1. Create a Slack App

- Go to [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch**
- Choose your workspace

### 2. Enable Socket Mode

- Go to **Settings** → **Socket Mode** → Enable Socket Mode
- Create an **App-Level Token** with `connections:write` scope
- Copy the app token (starts with `xapp-`)

### 3. Add Bot Token Scopes

Go to **OAuth & Permissions** → **Bot Token Scopes** and add:

| Scope | Description |
| --- | --- |
| `chat:write` | Send messages as the bot |
| `im:history` | View DM message history |
| `im:read` | View DM metadata |
| `reactions:write` | Add emoji reactions |
| `files:write` | Upload files |
| `channels:history` | View public channel message history |
| `app_mentions:read` | Read @mentions of the bot |

### 4. Install to Workspace

- **OAuth & Permissions** → **Install to Workspace**
- Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### 5. Enable Event Subscriptions

Go to **Event Subscriptions** → **Enable Events** → **Subscribe to bot events**:

| Event | Description |
| --- | --- |
| `message.im` | Direct messages to the bot |
| `message.channels` | Messages in public channels the bot is in |
| `app_mention` | When the bot is @mentioned |

### 6. Configure PicoClaw

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "bot_token": "xoxb-YOUR-BOT-TOKEN",
      "app_token": "xapp-YOUR-APP-TOKEN",
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "typing": {
        "enabled": true
      },
      "placeholder": {
        "enabled": true,
        "text": "Thinking..."
      },
      "reasoning_channel_id": ""
    }
  }
}
```

### 7. Run

```bash
picoclaw gateway
```

## Field Reference

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `bot_token` | string | Yes | Bot User OAuth Token (starts with `xoxb-`) |
| `app_token` | string | Yes | App-Level Token for Socket Mode (starts with `xapp-`) |
| `allow_from` | array | No | Slack user ID whitelist (empty = allow all) |
| `group_trigger` | object | No | Group chat trigger settings (see [Common Channel Fields](../#common-channel-fields)) |
| `typing` | object | No | Typing indicator config (`enabled`) |
| `placeholder` | object | No | Placeholder message config (`enabled`, `text`) |
| `reasoning_channel_id` | string | No | Route reasoning output to a separate channel |

## How It Works

### Socket Mode

Socket Mode establishes a WebSocket connection from PicoClaw to Slack servers:

- **No public URL needed** — the connection is outbound from your server
- **Real-time delivery** — events are pushed instantly via WebSocket
- **Automatic reconnection** — handled by the Slack SDK

### Thread Support

- When a user sends a DM, the bot responds directly
- In channels, the bot replies in a **thread** to keep conversations organized
- Thread context is maintained for multi-turn conversations

### Typing Indicator

When `typing.enabled` is `true`, the bot shows a typing indicator while processing the response.

### Reaction Acknowledgment

The bot reacts with a ✅ emoji to acknowledge receipt of a message.

### Message Limits

- Maximum message length: 40,000 characters
- Longer responses are automatically split across multiple messages

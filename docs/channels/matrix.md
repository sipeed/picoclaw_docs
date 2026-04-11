---
id: matrix
title: Matrix
---

# Matrix

[Matrix](https://matrix.org/) is an open, decentralized communication protocol. PicoClaw integrates with Matrix homeservers, supporting text, media messages, group chats, typing indicators, and auto-joining invited rooms.

## Setup

### 1. Create a Matrix Account for the Bot

Create a dedicated Matrix account for your bot on your preferred homeserver (e.g., matrix.org, or a self-hosted server).

### 2. Get an Access Token

You can obtain an access token by logging in via the Matrix client API:

```bash
curl -X POST "https://matrix.org/_matrix/client/v3/login" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "m.login.password",
    "identifier": {"type": "m.id.user", "user": "your-bot-username"},
    "password": "your-bot-password"
  }'
```

Copy the `access_token` from the response.

### 3. Configure PicoClaw

```json
{
  "channels": {
    "matrix": {
      "enabled": true,
      "homeserver": "https://matrix.org",
      "user_id": "@your-bot:matrix.org",
      "access_token": "YOUR_MATRIX_ACCESS_TOKEN",
      "device_id": "",
      "join_on_invite": true,
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
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

### 4. Run

```bash
picoclaw gateway
```

The bot will connect to the homeserver and start listening for messages. If `join_on_invite` is enabled, it will automatically join any room it is invited to.

## Field Reference

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `homeserver` | string | Yes | Matrix homeserver URL (e.g., `https://matrix.org`) |
| `user_id` | string | Yes | Bot's Matrix user ID (e.g., `@bot:matrix.org`) |
| `access_token` | string | Yes | Bot access token |
| `device_id` | string | No | Optional Matrix device ID |
| `join_on_invite` | bool | No | Auto-join rooms when invited (default: false) |
| `allow_from` | array | No | Whitelist of Matrix user IDs (empty = allow all) |
| `group_trigger` | object | No | Group trigger settings (see [Common Channel Fields](../#common-channel-fields)) |
| `placeholder` | object | No | Placeholder message config (`enabled`, `text`) |
| `reasoning_channel_id` | string | No | Route reasoning output to a separate room |

## Supported Features

- **Text messages** — Send and receive text messages with Markdown support
- **Improved HTML formatting** — Markdown responses are converted to HTML using a CommonMark-compliant parser with XHTML output, ensuring reliable rendering of lists, code blocks, and other formatting without requiring blank lines before block elements
- **Media messages** — Incoming image/audio/video/file download and outgoing upload
- **Audio transcription** — Incoming audio is normalized into the existing transcription flow (`[audio: ...]`)
- **Group trigger rules** — Supports mention-only mode and keyword prefixes
- **Typing indicator** — Shows `m.typing` state while processing
- **Placeholder messages** — Sends a temporary message (e.g., "Thinking...") then replaces it with the actual response
- **Auto-join** — Automatically joins rooms when invited (can be disabled)

---
id: vk
title: VK (VKontakte)
---

# VK (VKontakte)

Connect PicoClaw to [VK](https://vk.com) using the Bots Long Poll API. Supports text messages, media attachments, voice transcription, and group chats.

## Setup

### 1. Create a VK Community

- Go to [VK](https://vk.com) and log in
- Create a new community or use an existing one
- Note your Community ID (found in the community URL, e.g., `public123456789`)

### 2. Enable Messages

- Go to your community page
- Click **Manage** → **Messages** → **Community Messages**
- Enable community messages

### 3. Create Access Token

- Go to **Manage** → **API usage** → **Access tokens**
- Click **Create token**
- Select permissions:
  - `messages` — required for sending and receiving messages
  - `photos` — optional, for photo attachments
  - `docs` — optional, for document attachments
- Copy the generated access token

### 4. Configure

```json
{
  "channels": {
    "vk": {
      "enabled": true,
      "token": "NOT_HERE",
      "group_id": 123456789,
      "allow_from": ["123456789"]
    }
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | bool | Enable/disable the channel |
| `token` | string | Set to `NOT_HERE` — stored securely (see below) |
| `group_id` | int | VK Community ID (numeric) |
| `allow_from` | array | Allowed user IDs (empty = allow all) |
| `reasoning_channel_id` | string | Route reasoning output to a separate chat |
| `group_trigger` | object | Group chat trigger settings (`mention_only`, `prefixes`) |

### Token Storage

The VK token should not be stored directly in the config file. Use one of these methods:

- **Environment variable**: `PICOCLAW_CHANNELS_VK_TOKEN`
- **Secure storage**: PicoClaw's built-in credential encryption (see [Credential Encryption](/docs/credential-encryption))

```bash
export PICOCLAW_CHANNELS_VK_TOKEN="vk1.a.abc123..."
```

### 5. Run

```bash
picoclaw gateway
```

## Features

### Supported Attachments

| Type | Display |
| --- | --- |
| Photo | `[photo]` |
| Video | `[video]` |
| Audio | `[audio]` |
| Voice message | `[voice]` (supports transcription) |
| Document | `[document: filename]` |
| Sticker | `[sticker]` |

### Voice Support

The VK channel supports both ASR (speech-to-text) and TTS (text-to-speech). To enable voice transcription, configure a voice model in your providers setup.

### Group Chat

Control bot behavior in group chats with `group_trigger`:

```json
{
  "channels": {
    "vk": {
      "enabled": true,
      "token": "NOT_HERE",
      "group_id": 123456789,
      "group_trigger": {
        "mention_only": false,
        "prefixes": ["/bot", "!bot"]
      }
    }
  }
}
```

- **Mention-only**: Bot only responds when mentioned
- **Prefix mode**: Bot responds to messages starting with specified prefixes
- **Default**: Bot responds to all messages

### Message Length

VK limits messages to 4000 characters. PicoClaw automatically splits longer responses.

## Troubleshooting

- **Bot not responding**: Check that the token is valid, `group_id` is correct, and user ID is in `allow_from` (if configured)
- **Permission errors**: Ensure the token has `messages` permission
- **Group chat issues**: Verify `group_trigger` configuration and bot permissions in the group

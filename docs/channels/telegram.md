---
id: telegram
title: Telegram
---

# Telegram

Telegram is the **recommended** channel. It's easy to set up and supports voice transcription.

## Setup

### 1. Create a Bot

- Open Telegram and search for `@BotFather`
- Send `/newbot`, follow the prompts
- Copy the bot token

### 2. Get Your User ID

- Message `@userinfobot` on Telegram
- Copy your User ID

### 3. Configure

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_BOT_TOKEN",
      "allow_from": ["YOUR_USER_ID"]
    }
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | bool | Enable/disable the channel |
| `token` | string | Bot token from @BotFather |
| `base_url` | string | Custom Telegram Bot API server URL (optional) |
| `proxy` | string | HTTP/SOCKS proxy URL (optional, also reads `HTTP_PROXY` env) |
| `allow_from` | array | List of allowed user IDs (empty = allow all) |
| `reasoning_channel_id` | string | Route reasoning output to a separate chat |
| `group_trigger` | object | Group chat trigger settings (`mention_only`, `prefixes`) |

### 4. Run

```bash
picoclaw gateway
```

## Voice Transcription

Telegram voice messages can be automatically transcribed using Groq's Whisper:

```json
{
  "model_list": [
    {
      "model_name": "whisper",
      "model": "groq/whisper-large-v3",
      "api_key": "gsk_..."
    }
  ]
}
```

Get a free Groq API key at [console.groq.com](https://console.groq.com).

## Troubleshooting

**"Conflict: terminated by other getUpdates"**: Only one `picoclaw gateway` can run at a time. Stop any other instances.

**Proxy**: If Telegram is blocked in your region, use the `proxy` field:

```json
{
  "channels": {
    "telegram": {
      "proxy": "socks5://127.0.0.1:1080"
    }
  }
}
```

## Bot Commands

The Telegram channel registers these built-in bot commands:

| Command | Description |
| --- | --- |
| `/start` | Greeting message |
| `/help` | Show help text |
| `/show [model\|channel]` | Show current configuration |
| `/list [models\|channels]` | List available options |

## Media Support

The bot handles photos, audio files, documents, and voice messages. Voice messages are transcribed if a Whisper model is configured (see [Voice Transcription](#voice-transcription)).

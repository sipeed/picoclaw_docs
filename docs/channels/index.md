---
id: index
title: Chat Channels
sidebar_label: Overview
---

# Chat Channels

Connect PicoClaw to messaging platforms through its **gateway** mode.

```bash
picoclaw gateway
```

## Supported Channels

| Channel | Difficulty | Notes |
| --- | --- | --- |
| **Telegram** | Easy | Recommended. Supports voice transcription with Groq. |
| **Discord** | Easy | Bot token + intents. Supports group trigger. |
| **Slack** | Easy | Socket mode, no public IP needed. |
| **QQ** | Easy | Official QQ bot API (AppID + AppSecret). |
| **DingTalk** | Medium | Stream mode, no public IP needed. |
| **WeCom Bot** | Medium | Group chat via webhook. |
| **WeCom App** | Hard | Private chat, proactive messaging. |
| **WeCom AI Bot** | Medium | Official AI Bot with streaming pull protocol. |
| **Feishu** | Hard | Enterprise collaboration platform. |
| **LINE** | Hard | Webhook via shared gateway port. |
| **OneBot** | Medium | Compatible with NapCat/Go-CQHTTP. |
| **Matrix** | Easy | Open, decentralized protocol. Supports typing, placeholder, media. |
| **WhatsApp** | Medium | Bridge mode or native (whatsmeow). |
| **MaixCam** | Easy | Hardware-integrated AI camera. |
| **Pico** | Easy | Native WebSocket channel for custom clients. |

## How It Works

1. Configure one or more channels in `~/.picoclaw/config.json` under the `channels` key
2. Set `"enabled": true` for each channel you want to use
3. Run `picoclaw gateway` to start listening
4. The gateway handles all channels concurrently

## Access Control

All channels support the `allow_from` field to restrict access to specific users:

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_TOKEN",
      "allow_from": ["123456789"]
    }
  }
}
```

Set `allow_from` to an empty array `[]` to allow all users.

## Common Channel Fields

All channels support these optional fields:

| Field | Description |
| --- | --- |
| `reasoning_channel_id` | Route reasoning/thinking output to a separate channel |
| `group_trigger` | Control bot behavior in group chats (mention-only, prefixes) |

## Shared Gateway

All webhook-based channels (LINE, WeCom, WeCom App, WeCom AI Bot) share the single gateway HTTP server on port `18790`. Per-channel `webhook_host`/`webhook_port` fields are no longer needed — just configure `webhook_path` to differentiate endpoints.

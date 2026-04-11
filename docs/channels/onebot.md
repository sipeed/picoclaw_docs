---
id: onebot
title: OneBot
---

# OneBot

OneBot is a protocol compatible with various QQ bots (NapCat, Go-CQHTTP, etc.).

## Setup

### 1. Start a OneBot-Compatible Client

Examples:
- [NapCat](https://napcat.napneko.icu/) — modern QQ protocol implementation
- [Go-CQHTTP](https://github.com/Mrs4s/go-cqhttp) — classic implementation

Configure it to expose a WebSocket reverse server.

### 2. Configure PicoClaw

```json
{
  "channels": {
    "onebot": {
      "enabled": true,
      "ws_url": "ws://127.0.0.1:3001",
      "access_token": "",
      "reconnect_interval": 5,
      "group_trigger_prefix": [],
      "allow_from": []
    }
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `ws_url` | string | WebSocket URL of the OneBot client |
| `access_token` | string | Access token (if configured) |
| `reconnect_interval` | int | Reconnect interval in seconds |
| `group_trigger_prefix` | array | Prefixes that trigger bot response in groups (legacy, migrated to `group_trigger.prefixes`) |
| `group_trigger` | object | Group chat trigger settings (`mention_only`, `prefixes`) |
| `allow_from` | array | Allowed QQ user IDs |
| `reasoning_channel_id` | string | Route reasoning output to a separate channel |

### 3. Run

```bash
picoclaw gateway
```

:::note
Full OneBot documentation is available in Chinese in the repository at `docs/channels/onebot/README.zh.md`.
:::

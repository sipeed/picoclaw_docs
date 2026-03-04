---
id: discord
title: Discord
---

# Discord

## Setup

### 1. Create a Bot

- Go to [discord.com/developers/applications](https://discord.com/developers/applications)
- Create an application → Bot → Add Bot
- Copy the bot token

### 2. Enable Intents

- In Bot settings, enable **MESSAGE CONTENT INTENT**

### 3. Get Your User ID

- Discord Settings → Advanced → enable **Developer Mode**
- Right-click your avatar → **Copy User ID**

### 4. Configure

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "token": "YOUR_BOT_TOKEN",
      "allow_from": ["YOUR_USER_ID"],
      "group_trigger": {
        "mention_only": false
      }
    }
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | bool | Enable/disable the channel |
| `token` | string | Bot token from Discord Developer Portal |
| `proxy` | string | HTTP/SOCKS proxy URL (optional) |
| `allow_from` | array | List of allowed user IDs (empty = allow all) |
| `group_trigger` | object | Group chat trigger settings (see below) |
| `reasoning_channel_id` | string | Route reasoning output to a separate channel |

### 5. Invite the Bot

- OAuth2 → URL Generator
- Scopes: `bot`
- Bot Permissions: `Send Messages`, `Read Message History`
- Open the generated invite URL and add the bot to your server

### 6. Run

```bash
picoclaw gateway
```

## Group Trigger

Control how the bot responds in server channels (does not affect DMs — the bot always responds in DMs):

```json
{
  "group_trigger": {
    "mention_only": true,
    "prefixes": ["/ask", "!bot"]
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `mention_only` | bool | Only respond when @-mentioned in groups |
| `prefixes` | array | Keyword prefixes that trigger the bot in groups |

:::note Migration
The old top-level `"mention_only": true` field is automatically migrated to `"group_trigger": {"mention_only": true}`.
:::

## Media Support

Discord audio attachments are automatically transcribed if a Whisper model is configured. Other attachments (images, files) are downloaded and included as context.

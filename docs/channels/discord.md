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

#### 1. WebUI Configuration

We recommend using the WebUI first because it is faster and more convenient.

![WebUI Discord Connection Interface](/img/channels/webui_discord.png)

Fill in the Bot Token (`YOUR_BOT_TOKEN`) and Allowed Sources (`YOUR_USER_ID`) in order, then click **Save**.

#### 2. Configuration Files

Edit `~/.picoclaw/.security.yml`:

```yaml
discord:
  settings:
    token: YOUR_BOT_TOKEN
```

Edit `~/.picoclaw/config.json`:

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "type": "discord",
      "allow_from": [
        "YOUR_USER_ID"
      ],
      "reasoning_channel_id": "",
      "group_trigger": {},
      "typing": {},
      "placeholder": {
        "enabled": false
      },
      "settings": {
        "proxy": "",
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

## Voice Channel

PicoClaw can join Discord voice channels and participate in voice conversations:

- Join a voice channel yourself, then type `!vc join` in a text channel to make the bot join
- Leave the voice channel with `!vc leave`
- Voice input is transcribed using the configured ASR model and sent to the agent
- The agent's response is converted to audio via TTS and played back in the voice channel

Voice requires `voice.tts_model_name` to be configured in `config.json`. See [Model Configuration](../configuration/model-list.md) for details.

## Media Support

Discord audio attachments are automatically transcribed if an ASR model is configured. Other attachments (images, files) are downloaded and included as context.

---
id: feishu
title: Feishu / Lark (飞书)
---

# Feishu / Lark

Feishu (international version: Lark) is ByteDance's enterprise collaboration platform. PicoClaw integrates with it through event-driven WebSocket, supporting both Chinese and global markets.

## Setup

### 1. Create a Feishu App

1. Go to [Feishu Open Platform](https://open.feishu.cn/) (or [Lark Developer](https://open.larksuite.com/) for international)
2. Click **Create Custom App** → choose **Enterprise Self-built Application**
3. Fill in the app name and description
4. Note down your **App ID** (starts with `cli_`) and **App Secret** from the **Credentials & Basic Info** page

### 2. Configure Permissions

In **Permissions & Scopes**, add the following bot permissions:

| Permission | Description |
| --- | --- |
| `im:message` | Access messages |
| `im:message:send_v2` | Send messages as the bot |
| `im:resource` | Access message resources (images, files) |
| `im:chat` | Access chat info |
| `im:message.reactions:write` | Write message reactions |

### 3. Configure Event Subscriptions

Go to **Event Subscriptions** settings:

1. **Choose connection mode**: Select **WebSocket Mode** (recommended — no public IP needed)
   - Alternative: HTTP callback mode (requires a public-facing URL)
2. Subscribe to the following event:
   - `im.message.receive_v1` — Receive messages

### 4. Set Up Encryption (Recommended for Production)

In the **Event Subscriptions** page:

1. Click **Encrypt Key** → Generate or set a custom key
2. Click **Verification Token** → Generate or set a custom token
3. Copy both values to your PicoClaw config

:::tip
For development/testing, you can leave `encrypt_key` and `verification_token` empty. For production, enabling encryption is strongly recommended.
:::

### 5. Configure PicoClaw

#### 1. WebUI Configuration

We recommend using the WebUI first because it is faster and more convenient.

![WebUI Feishu Connection Interface](/img/channels/webui_feishu.png)

Fill in the App ID (`YOUR_APP_ID`), App Secret (`YOUR_APP_SECRET`), Encrypt Key (`YOUR_ENCRYPT_KEY`), and Verification Token (`YOUR_VERIFICATION_TOKEN`) in order, then click **Save**.

#### 2. Configuration Files

Edit `~/.picoclaw/config.json`:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "type": "feishu",
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
        "app_id": "YOUR_APP_ID",
        "random_reaction_emoji": null,
        "is_lark": false
      }
    }
  }
}
```

Edit `~/.picoclaw/.security.yml`:

```yaml
feishu:
  settings:
    app_secret: "YOUR_APP_SECRET"
    encrypt_key: "YOUR_ENCRYPT_KEY"
    verification_token: "YOUR_VERIFICATION_TOKEN"
```

### 6. Publish the App

1. Go to **Version Management & Release**
2. Create a new version and submit for review
3. Set **Availability** to define which users/departments can use the bot
4. After approval, the bot will be available in Feishu chats

### 7. Run

```bash
picoclaw gateway
```

## Field Reference

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `app_id` | string | Yes | Feishu App ID (starts with `cli_`) |
| `app_secret` | string | Yes | Feishu App Secret |
| `encrypt_key` | string | No | Event callback encryption key |
| `verification_token` | string | No | Event verification token |
| `allow_from` | array | No | User open ID whitelist (empty = allow all) |
| `group_trigger` | object | No | Group chat trigger settings (see [Common Channel Fields](../#common-channel-fields)) |
| `placeholder` | object | No | Placeholder message config (`enabled`, `text`) |
| `random_reaction_emoji` | array | No | Custom emoji list for message reactions (empty = default "Pin") |
| `reasoning_channel_id` | string | No | Route reasoning output to a separate chat |

### Placeholder

When enabled, PicoClaw sends a placeholder message (e.g., "Thinking...") immediately when a user message is received, then replaces it with the actual response once the agent finishes processing.

```json
"placeholder": {
  "enabled": true,
  "text": "Thinking..."
}
```

### Custom Reaction Emoji

PicoClaw reacts to user messages with an emoji to acknowledge receipt. You can customize the emoji list:

```json
"random_reaction_emoji": ["THUMBSUP", "HEART", "SMILE"]
```

Leave empty to use the default "Pin" emoji. See the [Feishu Emoji List](https://open.larkoffice.com/document/server-docs/im-v1/message-reaction/emojis-introduce) for available emojis.

:::note
Empty or whitespace-only entries in the `random_reaction_emoji` list are automatically filtered out. For example, `["", "Pin"]` is treated the same as `["Pin"]`. If the list contains no valid entries after filtering, the default "Pin" emoji is used.
:::

## How It Works

- PicoClaw uses the Lark SDK with **WebSocket mode** for event handling
- Messages are received via the `im.message.receive_v1` event subscription
- Responses are sent as **Interactive Card JSON 2.0** format with Markdown support
- In group chats, the bot detects @mentions via the bot's `open_id`

### Reply context enrichment

When a user **replies** to an earlier message (including bot messages, cards, and file/image messages), PicoClaw automatically fetches the original message and prepends a short context block before the user's text. This gives the agent the conversational thread it needs to make sense of short replies like "yes do it" or "send that to bob".

- The original message is looked up via the Feishu API and cached for 30 seconds (`messageCacheTTL`)
- The injected context is capped at **600 characters** (`maxReplyContextLen`)
- Card and file replies are also enriched, not just plain text
- The lookup is bounded by a 5-second timeout — if it fails, the message is processed without enrichment

This is automatic and has no configuration knobs.

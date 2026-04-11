---
id: teams-webhook
title: Microsoft Teams (Webhook)
---

# Microsoft Teams (Webhook)

The Teams Webhook channel is **output-only**. It posts agent responses to Microsoft Teams via [Power Automate workflow webhooks](https://learn.microsoft.com/en-us/power-automate/), formatted as Adaptive Cards.

Use this channel when you want to push notifications, summaries, or alerts from PicoClaw into Teams without giving the agent inbound access to Teams messages.

:::note Output-only
Teams Webhook cannot receive messages or trigger conversations. Pair it with another channel (Telegram, Slack, etc.) if you need a full chat loop.
:::

## Setup

### 1. Create a Power Automate Workflow

1. Open [Power Automate](https://make.powerautomate.com/) and create a new flow
2. Use the **"Post to a channel when a webhook request is received"** template (or any HTTP-trigger flow that posts an Adaptive Card to a Teams channel)
3. After saving, copy the generated webhook URL — it will look like `https://prod-xx.westus.logic.azure.com/workflows/...`

:::tip Why Power Automate?
Microsoft retired the legacy Office 365 connector incoming webhooks. Power Automate workflows are the supported replacement and the only path that PicoClaw's underlying library uses.
:::

### 2. Configure PicoClaw

Add to `~/.picoclaw/config.json`:

```json
{
  "channels": {
    "teams_webhook": {
      "enabled": true,
      "webhooks": {
        "default": {
          "webhook_url": "https://prod-xx.westus.logic.azure.com/workflows/...",
          "title": "PicoClaw Notification"
        }
      }
    }
  }
}
```

A `default` target is **required**. PicoClaw falls back to it whenever a message arrives without a matching `ChatID`.

### 3. Multiple Targets

You can register multiple webhook destinations and select between them by setting `ChatID` on the outgoing message:

```json
{
  "channels": {
    "teams_webhook": {
      "enabled": true,
      "webhooks": {
        "default": {
          "webhook_url": "https://.../default-channel",
          "title": "PicoClaw"
        },
        "alerts": {
          "webhook_url": "https://.../alerts-channel",
          "title": "PicoClaw Alerts"
        },
        "reports": {
          "webhook_url": "https://.../reports-channel",
          "title": "Daily Reports"
        }
      }
    }
  }
}
```

When the agent sends a message with `ChatID = "alerts"`, it goes to the alerts webhook. Unknown `ChatID` values fall back to `default` with a warning.

### 4. Store Secrets in `.security.yml`

Webhook URLs contain authentication tokens. Keep them out of `config.json`:

`~/.picoclaw/.security.yml`:

```yaml
channels:
  teams_webhook:
    webhooks:
      default:
        webhook_url: "https://prod-xx.westus.logic.azure.com/workflows/..."
      alerts:
        webhook_url: "https://prod-xx.westus.logic.azure.com/workflows/..."
```

### 5. Run

```bash
picoclaw gateway
```

## Field Reference

### `teams_webhook`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | bool | Yes | Enable the channel |
| `webhooks` | map | Yes | Map of named webhook targets. Must contain a `default` key. |

### `webhooks.<name>`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `webhook_url` | string | Yes | Power Automate workflow URL. Must be HTTPS. |
| `title` | string | No | Title shown at the top of every Adaptive Card sent through this target. Defaults to `"PicoClaw Notification"`. |

## Message Formatting

Outbound messages are converted to Adaptive Cards with:

- **Title** — taken from the target's `title` field
- **Body** — message content as text blocks (supports bold, italic, lists, links)
- **Tables** — Markdown tables (`| col | col |\n| --- | --- |\n| ... |`) are detected and rendered as native Adaptive Card Tables, since Teams TextBlocks do not support markdown tables
- **Full-width** — cards render at the full width of the Teams channel

The maximum payload length is **24,000 characters**, leaving headroom under the 28KB Power Automate webhook limit. Longer messages are truncated.

## Error Handling

PicoClaw classifies HTTP errors returned by the webhook:

- **4xx (e.g., 401 Unauthorized, 404 Not Found)** — treated as **permanent**, not retried
- **5xx and network errors** — treated as **temporary**, retried with backoff

Error logs deliberately omit the raw error payload to avoid leaking the webhook URL into log files.

## Limitations

- **Output only**: cannot read messages from Teams
- **No threading**: each message is a standalone card
- **No file uploads**: only text + tables in the Adaptive Card body
- **Adaptive Card subset**: TextBlocks render bold, italic, bullet/numbered lists, and links — but not headers, images, or arbitrary HTML
- `expose_paths` and other Teams-specific routing must be set up inside the Power Automate flow

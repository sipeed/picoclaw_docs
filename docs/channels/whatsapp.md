---
id: whatsapp
title: WhatsApp
---

# WhatsApp

PicoClaw can connect to WhatsApp in two ways: a generic **WebSocket bridge** (`pkg/channels/whatsapp`) for situations where another process speaks the WhatsApp protocol, or a **native** client (`pkg/channels/whatsapp_native`) that talks the WhatsApp Web protocol directly via [whatsmeow](https://github.com/tulir/whatsmeow). The mode is selected by the `use_native` flag.

## Native Mode (whatsmeow)

Native mode connects directly to WhatsApp servers — no external bridge process required. Recommended for most users.

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "use_native": true,
      "session_store_path": "~/.picoclaw/workspace/whatsapp",
      "allow_from": []
    }
  }
}
```

On first run a QR code is printed to the terminal. Scan it with your phone (WhatsApp → Settings → Linked Devices) to pair. The session is persisted under `session_store_path` so subsequent runs reuse the pairing without rescanning.

:::tip Re-pairing
If pairing gets stuck or you want to start over, delete the session store and restart:
```bash
rm -rf ~/.picoclaw/workspace/whatsapp
```
:::

## Bridge Mode

Bridge mode points PicoClaw at an external WebSocket endpoint that already speaks WhatsApp on its behalf. Use this if you have an existing bridge process you want to integrate with.

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "use_native": false,
      "bridge_url": "ws://localhost:3001"
    }
  }
}
```

PicoClaw will dial `bridge_url` over plain WebSocket and exchange messages with the bridge. The bridge is responsible for actually talking to WhatsApp — PicoClaw treats it as an opaque transport.

## Configuration Reference

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Enable the WhatsApp channel |
| `use_native` | bool | `false` | If `true`, use native whatsmeow mode; if `false`, use bridge mode |
| `bridge_url` | string | `""` | WebSocket URL for bridge mode (ignored when `use_native` is `true`) |
| `session_store_path` | string | `""` | Directory for storing the whatsmeow session (native mode only) |
| `allow_from` | array | `[]` | Phone numbers allowed to interact with the bot. Empty array allows all contacts. |
| `reasoning_channel_id` | string | `""` | Route reasoning output to a separate chat |

Each field can also be set through the matching environment variable, prefixed with `PICOCLAW_CHANNELS_WHATSAPP_` (e.g. `PICOCLAW_CHANNELS_WHATSAPP_USE_NATIVE=true`).

## Access Control

Use `allow_from` with phone numbers in international format (no `+` prefix):

```json
{
  "allow_from": ["5511999998888", "5521888887777"]
}
```

Set to `[]` to allow any contact who messages the bot.

## Media Support

Incoming media (images, audio, documents) is downloaded and included as conversation context. If a Whisper-compatible voice transcription model is configured under `voice.model_name`, audio messages are automatically transcribed before being passed to the agent.

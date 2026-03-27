---
id: wecom-app
title: WeCom App (企业微信自建应用)
---

# WeCom App

WeCom App (自建应用) offers more features than WeCom Bot: private chat, proactive messaging, and more.

For the simpler group chat bot, see [WeCom Bot](./wecom-bot.md). For the official AI Bot integration, see [WeCom AI Bot](./wecom-aibot.md).

## Features

| Feature | Supported |
| --- | --- |
| Receive messages | ✅ |
| Send proactive messages | ✅ |
| Private chat | ✅ |
| Group chat | ❌ |

## Setup

### 1. WeCom Admin Console

1. Log in to the [WeCom Admin Console](https://work.weixin.qq.com/wework_admin)
2. Go to App Management → select your self-built app
3. Note down:
   - **AgentId** — shown on the app details page
   - **Secret** — click "View" to get it
4. Go to "My Company" → copy the **CorpID**

### 2. Configure Message Receiving

1. In the app details page, click "Receive Message" → "Set API"
2. Fill in:
   - **URL**: `http://your-server:18790/webhook/wecom-app`
   - **Token**: Generate or set a custom value
   - **EncodingAESKey**: Click "Random Generate" to get a 43-character key
3. Click "Save" — WeCom will send a verification request to your server

### 3. Configure PicoClaw

```json
{
  "channels": {
    "wecom_app": {
      "enabled": true,
      "corp_id": "wwxxxxxxxxxxxxxxxx",
      "corp_secret": "YOUR_CORP_SECRET",
      "agent_id": 1000002,
      "token": "YOUR_TOKEN",
      "encoding_aes_key": "YOUR_43_CHAR_ENCODING_AES_KEY",
      "webhook_path": "/webhook/wecom-app",
      "allow_from": [],
      "reply_timeout": 5
    }
  }
}
```

### 4. Run

```bash
picoclaw gateway
```

:::warning Port Requirement
WeCom App uses the shared gateway port (default `18790`). This port must be accessible from the internet. Use a reverse proxy for HTTPS if required.
:::

## Troubleshooting

### Callback URL Verification Failed

- Confirm the gateway port (default 18790) is open in your firewall
- Verify `corp_id`, `token`, and `encoding_aes_key` are correct
- Check PicoClaw logs to confirm requests are reaching the server

### Chinese Message Decryption Error (`invalid padding size`)

WeCom uses non-standard PKCS7 padding (32-byte block size instead of 16-byte). This is fixed in the latest version of PicoClaw.

### Port Conflict

Change the gateway port in the `gateway` config section if needed.

## Technical Details

- **Encryption**: AES-256-CBC
- **Key**: 32 bytes decoded from EncodingAESKey (Base64)
- **IV**: First 16 bytes of AES key
- **Padding**: PKCS7 (non-standard 32-byte block size)
- **Message format**: XML

Message structure after decryption:
```
random(16B) + msg_len(4B) + msg + receiveid
```

## References

- [WeCom Official Docs — Receive Messages](https://developer.work.weixin.qq.com/document/path/96211)

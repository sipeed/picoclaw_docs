---
id: qq
title: QQ
---

# QQ

PicoClaw supports QQ through the official [QQ Open Platform](https://q.qq.com/) bot API, using WebSocket mode for real-time communication.

## Setup

### 1. Create a Bot Application

1. Go to [QQ Open Platform](https://q.qq.com/#) and register/log in
2. Click **Create Application** → select **Bot**
3. Fill in the application info and submit for review

### 2. Get Credentials

1. After the application is approved, go to the application dashboard
2. Copy the **AppID** and **AppSecret** from the credentials page

### 3. Configure Sandbox Mode

:::info
Newly created bots default to **sandbox mode**. You must add test users and groups to the sandbox before they can interact with the bot.
:::

1. In the application dashboard, go to **Sandbox Configuration**
2. Add your test QQ users to the sandbox
3. Add test groups to the sandbox
4. The bot will only respond to users and groups in the sandbox until it passes review

### 4. Configure PicoClaw

```json
{
  "channels": {
    "qq": {
      "enabled": true,
      "app_id": "YOUR_APP_ID",
      "app_secret": "YOUR_APP_SECRET",
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "reasoning_channel_id": ""
    }
  }
}
```

### 5. Run

```bash
picoclaw gateway
```

## Field Reference

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `app_id` | string | Yes | QQ bot AppID |
| `app_secret` | string | Yes | QQ bot AppSecret |
| `allow_from` | array | No | QQ user ID whitelist (empty = allow all) |
| `group_trigger` | object | No | Group chat trigger settings (see [Common Channel Fields](../#common-channel-fields)) |
| `reasoning_channel_id` | string | No | Route reasoning output to a separate chat |

## How It Works

### Message Types

PicoClaw handles two types of QQ bot messages:

| Type | Scenario | Trigger |
| --- | --- | --- |
| **C2C** | Private chat (1:1 DM) | Any message from the user |
| **GroupAT** | Group chat | User must @mention the bot |

### Key Behaviors

- **Group chats require @mention**: In group chats, the bot only responds when @mentioned (GroupAT intent). This is enforced by the QQ platform.
- **Message deduplication**: PicoClaw tracks processed message IDs to prevent duplicate processing
- **Token auto-refresh**: The bot SDK automatically manages access token renewal
- **WebSocket mode**: Uses the QQ Bot SDK's WebSocket connection for real-time message delivery

### Sandbox vs Production

| | Sandbox | Production |
| --- | --- | --- |
| Access | Only sandbox-registered users/groups | All users |
| Activation | Default for new bots | After review approval |
| Purpose | Development and testing | Live deployment |

---
id: line
title: LINE
---

# LINE

LINE 的 Webhook 要求使用 HTTPS（需要反向代理或 ngrok 等隧道工具）。

## 设置流程

### 1. 创建 LINE Official Account

- 前往 [LINE Developers Console](https://developers.line.biz/)
- 创建 Provider → 创建 Messaging API Channel
- 复制 **Channel Secret** 和 **Channel Access Token**

### 2. 配置 PicoClaw

```json
{
  "channels": {
    "line": {
      "enabled": true,
      "channel_secret": "YOUR_CHANNEL_SECRET",
      "channel_access_token": "YOUR_CHANNEL_ACCESS_TOKEN",
      "webhook_path": "/webhook/line",
      "allow_from": []
    }
  }
}
```

LINE 使用共享网关 HTTP 服务器（默认端口 `18790`），无需单独配置 `webhook_host`/`webhook_port`。

### 3. 设置 HTTPS Webhook

LINE 要求使用 HTTPS。可使用反向代理或隧道：

```bash
# 使用 ngrok 示例
ngrok http 18790
```

在 LINE Developers Console 中将 Webhook URL 设置为 `https://your-domain/webhook/line`，并启用 **Use webhook**。

### 4. 运行

```bash
picoclaw gateway
```

## 注意事项

- 在群聊中，机器人默认仅在被 @ 时响应（默认 `group_trigger.mention_only: true`）
- 回复会引用原始消息

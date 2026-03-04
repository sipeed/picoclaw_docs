---
id: discord
title: Discord
---

# Discord

## 设置流程

### 1. 创建机器人

- 前往 [discord.com/developers/applications](https://discord.com/developers/applications)
- 创建应用 → Bot → 添加机器人
- 复制机器人 token

### 2. 启用 Intents

- 在 Bot 设置中，启用 **MESSAGE CONTENT INTENT**

### 3. 获取你的用户 ID

- Discord 设置 → 高级 → 启用**开发者模式**
- 右键点击你的头像 → **复制用户 ID**

### 4. 配置

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

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | bool | 启用/禁用该通道 |
| `token` | string | Discord 开发者门户获取的机器人 token |
| `proxy` | string | HTTP/SOCKS 代理地址（可选） |
| `allow_from` | array | 允许的用户 ID 列表（空数组 = 允许所有人） |
| `group_trigger` | object | 群聊触发设置（见下方） |
| `reasoning_channel_id` | string | 将推理过程输出到单独的频道 |

### 5. 邀请机器人

- OAuth2 → URL Generator
- Scopes: `bot`
- Bot Permissions: `Send Messages`、`Read Message History`
- 打开生成的邀请链接，将机器人添加到你的服务器

### 6. 运行

```bash
picoclaw gateway
```

## 群聊触发

控制机器人在服务器频道中的响应方式（不影响私聊——机器人在私聊中始终响应）：

```json
{
  "group_trigger": {
    "mention_only": true,
    "prefixes": ["/ask", "!bot"]
  }
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mention_only` | bool | 仅在群聊中被 @ 时响应 |
| `prefixes` | array | 群聊中触发机器人的关键词前缀 |

:::note 迁移说明
旧的顶层 `"mention_only": true` 字段会自动迁移为 `"group_trigger": {"mention_only": true}`。
:::

## 媒体支持

如果配置了 Whisper 模型，Discord 的音频附件会自动转写。其他附件（图片、文件）会被下载并作为上下文。

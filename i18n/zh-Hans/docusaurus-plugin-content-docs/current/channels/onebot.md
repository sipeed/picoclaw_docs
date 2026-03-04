---
id: onebot
title: OneBot
---

# OneBot

OneBot 是兼容多种 QQ 机器人（NapCat、Go-CQHTTP 等）的协议。

## 设置流程

### 1. 启动 OneBot 兼容客户端

示例：
- [NapCat](https://napcat.napneko.icu/) — 现代 QQ 协议实现
- [Go-CQHTTP](https://github.com/Mrs4s/go-cqhttp) — 经典实现

将其配置为提供 WebSocket 反向服务器。

### 2. 配置 PicoClaw

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

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ws_url` | string | OneBot 客户端的 WebSocket URL |
| `access_token` | string | 访问令牌（如已配置） |
| `reconnect_interval` | int | 重连间隔（秒） |
| `group_trigger_prefix` | array | 群聊中触发机器人的前缀（旧字段，已迁移至 `group_trigger.prefixes`） |
| `group_trigger` | object | 群聊触发设置（`mention_only`、`prefixes`） |
| `allow_from` | array | 允许的 QQ 用户 ID |
| `reasoning_channel_id` | string | 将推理过程输出到单独的通道 |

### 3. 运行

```bash
picoclaw gateway
```

:::note
完整的 OneBot 文档（中文）在仓库中的 `docs/channels/onebot/README.zh.md`。
:::

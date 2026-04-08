---
id: slack
title: Slack
---

# Slack

Slack 集成使用 **Socket Mode**，无需公网 IP。PicoClaw 与 Slack 服务器之间保持实时双向 WebSocket 连接。

## 设置流程

### 1. 创建 Slack 应用

- 前往 [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch**
- 选择你的工作区

### 2. 启用 Socket Mode

- 进入 **Settings** → **Socket Mode** → 启用 Socket Mode
- 创建一个 **App-Level Token**，赋予 `connections:write` 权限
- 复制 App Token（以 `xapp-` 开头）

### 3. 添加 Bot Token Scopes

进入 **OAuth & Permissions** → **Bot Token Scopes**，添加：

| Scope | 描述 |
| --- | --- |
| `chat:write` | 以机器人身份发送消息 |
| `im:history` | 查看私信历史 |
| `im:read` | 查看私信元数据 |
| `reactions:write` | 添加表情回复 |
| `files:write` | 上传文件 |
| `channels:history` | 查看公共频道消息历史 |
| `app_mentions:read` | 读取机器人的 @提及 |

### 4. 安装到工作区

- **OAuth & Permissions** → **Install to Workspace**
- 复制 **Bot User OAuth Token**（以 `xoxb-` 开头）

### 5. 启用事件订阅

进入 **Event Subscriptions** → **Enable Events** → **Subscribe to bot events**：

| 事件 | 描述 |
| --- | --- |
| `message.im` | 发送给机器人的私信 |
| `message.channels` | 机器人所在公共频道的消息 |
| `app_mention` | 机器人被 @提及 |

### 6. 配置 PicoClaw

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "bot_token": "xoxb-YOUR-BOT-TOKEN",
      "app_token": "xapp-YOUR-APP-TOKEN",
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "typing": {
        "enabled": true
      },
      "placeholder": {
        "enabled": true,
        "text": "正在思考..."
      },
      "reasoning_channel_id": ""
    }
  }
}
```

### 7. 运行

```bash
picoclaw gateway
```

## 字段参考

| 字段 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `bot_token` | string | 是 | Bot User OAuth Token（以 `xoxb-` 开头） |
| `app_token` | string | 是 | Socket Mode App-Level Token（以 `xapp-` 开头） |
| `allow_from` | array | 否 | 用户 ID 白名单（空数组 = 允许所有用户） |
| `group_trigger` | object | 否 | 群聊触发设置（见[通用通道字段](../#通用通道字段)） |
| `typing` | object | 否 | 输入状态指示器配置（`enabled`） |
| `placeholder` | object | 否 | 占位消息配置（`enabled`、`text`） |
| `reasoning_channel_id` | string | 否 | 将推理过程输出到单独的频道 |

## 工作原理

### Socket Mode

Socket Mode 从 PicoClaw 向 Slack 服务器建立 WebSocket 连接：

- **无需公网 URL** — 连接从服务器主动发起
- **实时推送** — 事件通过 WebSocket 即时送达
- **自动重连** — 由 Slack SDK 自动处理

### 线程支持

- 用户发送私信时，机器人直接回复
- 在频道中，机器人在 **线程（Thread）** 中回复，保持对话组织有序
- 线程上下文支持多轮对话

### 输入状态指示器

当 `typing.enabled` 为 `true` 时，机器人在处理回复期间会显示"正在输入"状态。

### 确认回复

机器人会对消息添加 ✅ 表情，表示已收到并开始处理。

### 消息长度限制

- 最大消息长度：40,000 字符
- 超长回复会自动分割为多条消息

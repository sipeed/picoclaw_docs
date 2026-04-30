---
id: telegram
title: Telegram
---

# Telegram

Telegram 是**推荐**的通道。设置简单，支持语音转写。

## 设置流程

### 1. 创建机器人

- 在 Telegram 中搜索 `@BotFather`
- 发送 `/newbot`，按照提示操作
- 复制机器人 token

### 2. 获取你的用户 ID

- 在 Telegram 中发消息给 `@userinfobot`
- 复制你的 User ID

### 3. 配置

#### 1. WebUI 配置

优先推荐 WebUI 配置，方便快捷。

![WebUI Telegram Connection Interface](/img/channels/webui_telegram.png)

依次填入 Bot Token（`YOUR_BOT_TOKEN`）和允许来源（`YOUR_USER_ID`），然后点击 **保存** 即可。

#### 2. 配置文件

修改 `~/.picoclaw/.security.yml`

```yaml
telegram:
  settings:
    token: YOUR_BOT_TOKEN
```

修改 `~/.picoclaw/config.json`

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "allow_from": [
        "YOUR_USER_ID"
      ],
      "reasoning_channel_id": "",
      "group_trigger": {}
    }
  }
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | bool | 启用/禁用该通道 |
| `token` | string | 从 @BotFather 获取的机器人 token |
| `base_url` | string | 自定义 Telegram Bot API 服务器地址（可选） |
| `proxy` | string | HTTP/SOCKS 代理地址（可选，也会读取 `HTTP_PROXY` 环境变量） |
| `allow_from` | array | 允许的用户 ID 列表（空数组 = 允许所有人） |
| `reasoning_channel_id` | string | 将推理过程输出到单独的聊天 |
| `group_trigger` | object | 群聊触发设置（`mention_only`、`prefixes`） |

### 4. 运行

```bash
picoclaw gateway
```

## 语音转写

Telegram 语音消息可通过 Groq 的 Whisper 自动转写：

```json
{
  "model_list": [
    {
      "model_name": "whisper",
      "model": "groq/whisper-large-v3",
      "api_key": "gsk_..."
    }
  ]
}
```

在 [console.groq.com](https://console.groq.com) 免费获取 Groq API Key。

## 故障排查

**"Conflict: terminated by other getUpdates"**：同一时间只能运行一个 `picoclaw gateway`，请停止其他实例。

**代理**：如果你所在地区无法直接访问 Telegram，可使用 `proxy` 字段：

```json
{
  "channels": {
    "telegram": {
      "proxy": "socks5://127.0.0.1:1080"
    }
  }
}
```

## 内置机器人命令

Telegram 通道注册了以下内置命令：

| 命令 | 说明 |
| --- | --- |
| `/start` | 欢迎消息 |
| `/help` | 显示帮助 |
| `/show [model\|channel]` | 显示当前配置 |
| `/list [models\|channels]` | 列出可用选项 |

## 引用回复支持

当用户在 Telegram 中使用内置的"回复"功能回复某条消息时，PicoClaw 会自动将被引用的消息作为上下文传递给 Agent：

- **文本**：被引用的消息内容会以 `[quoted user/assistant message from 作者]: ...` 的格式添加在用户新消息前面
- **媒体**：如果被引用的消息包含语音或音频，这些文件也会被下载并传递给 Agent
- **角色识别**：机器人能区分被引用的消息来自普通用户、机器人自身（assistant）还是其他机器人

这使得 Agent 能够理解对话上下文，即使消息并非连续发送。

## 媒体支持

机器人支持照片、音频文件、文档和语音消息。如果配置了 Whisper 模型，语音消息会自动转写（见[语音转写](#语音转写)）。

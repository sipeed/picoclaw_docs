---
id: matrix
title: Matrix
---

# Matrix

[Matrix](https://matrix.org/) 是一个开放的去中心化通信协议。PicoClaw 支持与 Matrix 服务器集成，支持文本、媒体消息、群聊、输入状态指示器和自动加入邀请房间。

## 设置流程

### 1. 为机器人创建 Matrix 账号

在你选择的 Matrix 服务器（如 matrix.org 或自建服务器）上为机器人创建一个专用账号。

### 2. 获取 Access Token

通过 Matrix 客户端 API 登录获取 access token：

```bash
curl -X POST "https://matrix.org/_matrix/client/v3/login" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "m.login.password",
    "identifier": {"type": "m.id.user", "user": "your-bot-username"},
    "password": "your-bot-password"
  }'
```

从响应中复制 `access_token`。

### 3. 配置 PicoClaw

```json
{
  "channels": {
    "matrix": {
      "enabled": true,
      "homeserver": "https://matrix.org",
      "user_id": "@your-bot:matrix.org",
      "access_token": "YOUR_MATRIX_ACCESS_TOKEN",
      "device_id": "",
      "join_on_invite": true,
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
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

### 4. 运行

```bash
picoclaw gateway
```

机器人将连接到 Matrix 服务器并开始监听消息。如果启用了 `join_on_invite`，它会自动加入被邀请的房间。

## 字段参考

| 字段 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `homeserver` | string | 是 | Matrix 服务器地址（如 `https://matrix.org`） |
| `user_id` | string | 是 | 机器人的 Matrix 用户 ID（如 `@bot:matrix.org`） |
| `access_token` | string | 是 | 机器人 access token |
| `device_id` | string | 否 | 可选的 Matrix 设备 ID |
| `join_on_invite` | bool | 否 | 被邀请时自动加入房间（默认：false） |
| `allow_from` | array | 否 | Matrix 用户 ID 白名单（空数组 = 允许所有用户） |
| `group_trigger` | object | 否 | 群聊触发设置（见[通用通道字段](../#通用通道字段)） |
| `placeholder` | object | 否 | 占位消息配置（`enabled`、`text`） |
| `reasoning_channel_id` | string | 否 | 将推理过程输出到单独的房间 |

## 支持的功能

- **文本消息** — 收发文本消息，支持 Markdown
- **改进的 HTML 格式化** — Markdown 响应通过符合 CommonMark 规范的解析器转换为 XHTML 输出，确保列表、代码块等格式在不需要块元素前空行的情况下也能可靠渲染
- **媒体消息** — 入站图片/音频/视频/文件下载和出站上传
- **音频转写** — 入站音频消息会标准化进入现有的转写流程（`[audio: ...]`）
- **群聊触发规则** — 支持仅 @提及模式和关键词前缀
- **输入状态指示器** — 处理期间显示 `m.typing` 状态
- **占位消息** — 发送临时消息（如"正在思考..."），然后用实际回复替换
- **自动加入** — 被邀请时自动加入房间（可禁用）

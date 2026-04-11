---
id: vk
title: VK (VKontakte)
---

# VK (VKontakte)

通过 Bots Long Poll API 将 PicoClaw 连接到 [VK](https://vk.com)。支持文本消息、媒体附件、语音转写和群聊。

## 设置

### 1. 创建 VK 社区

- 前往 [VK](https://vk.com) 并登录
- 创建新社区或使用现有社区
- 记下社区 ID（在社区 URL 中可以找到，例如 `public123456789`）

### 2. 启用消息功能

- 进入社区页面
- 点击 **管理** → **消息** → **社区消息**
- 启用社区消息

### 3. 创建访问令牌

- 进入 **管理** → **API 使用** → **访问令牌**
- 点击 **创建令牌**
- 选择权限：
  - `messages` — 收发消息（必需）
  - `photos` — 图片附件（可选）
  - `docs` — 文档附件（可选）
- 复制生成的访问令牌

### 4. 配置

```json
{
  "channels": {
    "vk": {
      "enabled": true,
      "token": "NOT_HERE",
      "group_id": 123456789,
      "allow_from": ["123456789"]
    }
  }
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | bool | 启用/禁用此通道 |
| `token` | string | 设置为 `NOT_HERE` — 安全存储（见下文） |
| `group_id` | int | VK 社区 ID（数字） |
| `allow_from` | array | 允许的用户 ID 列表（空 = 允许所有） |
| `reasoning_channel_id` | string | 将推理输出路由到单独的聊天 |
| `group_trigger` | object | 群聊触发设置（`mention_only`、`prefixes`） |

### 令牌存储

VK 令牌不应直接存储在配置文件中，请使用以下方式之一：

- **环境变量**：`PICOCLAW_CHANNELS_VK_TOKEN`
- **安全存储**：PicoClaw 内置的凭据加密（参见[凭据加密](/docs/credential-encryption)）

```bash
export PICOCLAW_CHANNELS_VK_TOKEN="vk1.a.abc123..."
```

### 5. 运行

```bash
picoclaw gateway
```

## 功能

### 支持的附件类型

| 类型 | 显示 |
| --- | --- |
| 图片 | `[photo]` |
| 视频 | `[video]` |
| 音频 | `[audio]` |
| 语音消息 | `[voice]`（支持转写） |
| 文档 | `[document: 文件名]` |
| 表情贴纸 | `[sticker]` |

### 语音支持

VK 通道支持 ASR（语音转文字）和 TTS（文字转语音）。要启用语音转写，请在 providers 中配置语音模型。

### 群聊

通过 `group_trigger` 控制机器人在群聊中的行为：

```json
{
  "channels": {
    "vk": {
      "enabled": true,
      "token": "NOT_HERE",
      "group_id": 123456789,
      "group_trigger": {
        "mention_only": false,
        "prefixes": ["/bot", "!bot"]
      }
    }
  }
}
```

- **仅@模式**：仅在被提及时回复
- **前缀模式**：回复以指定前缀开头的消息
- **默认**：回复所有消息

### 消息长度

VK 限制消息为 4000 字符。PicoClaw 会自动拆分较长的回复。

## 故障排查

- **机器人不回复**：检查令牌是否有效、`group_id` 是否正确、用户 ID 是否在 `allow_from` 中（如已配置）
- **权限错误**：确保令牌有 `messages` 权限
- **群聊问题**：验证 `group_trigger` 配置和机器人在群组中的权限

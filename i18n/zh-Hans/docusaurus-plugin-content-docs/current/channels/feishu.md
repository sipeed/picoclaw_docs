---
id: feishu
title: 飞书
---

# 飞书

飞书（国际版名称：Lark）是字节跳动旗下的企业协作平台。PicoClaw 通过事件驱动的 WebSocket 与飞书集成，同时支持中国和全球市场。

## 设置流程

### 1. 创建飞书应用

1. 前往[飞书开放平台](https://open.feishu.cn/)
2. 点击 **创建自建应用** → 选择 **企业自建应用**
3. 填写应用名称和描述
4. 在 **凭证与基础信息** 页面记下 **App ID**（以 `cli_` 开头）和 **App Secret**

### 2. 配置权限

在 **权限管理** 中，添加以下机器人权限：

| 权限 | 描述 |
| --- | --- |
| `im:message` | 获取消息 |
| `im:message:send_v2` | 以机器人身份发送消息 |
| `im:resource` | 获取消息资源（图片、文件） |
| `im:chat` | 获取群组信息 |
| `im:message.reactions:write` | 添加消息表情回复 |

### 3. 配置事件订阅

进入 **事件与回调** 设置：

1. **选择连接方式**：选择 **WebSocket 模式**（推荐 — 无需公网 IP）
   - 备选：HTTP 回调模式（需要公网可访问的 URL）
2. 订阅以下事件：
   - `im.message.receive_v1` — 接收消息

### 4. 设置加密（生产环境建议启用）

在 **事件与回调** 页面：

1. 点击 **Encrypt Key** → 生成或自定义密钥
2. 点击 **Verification Token** → 生成或自定义令牌
3. 将这两个值复制到 PicoClaw 配置文件中

:::tip
开发/测试时可以将 `encrypt_key` 和 `verification_token` 留空。生产环境强烈建议启用加密。
:::

### 5. 配置 PicoClaw

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "app_id": "cli_xxx",
      "app_secret": "YOUR_APP_SECRET",
      "encrypt_key": "YOUR_ENCRYPT_KEY",
      "verification_token": "YOUR_VERIFICATION_TOKEN",
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "placeholder": {
        "enabled": true,
        "text": "正在思考..."
      },
      "random_reaction_emoji": [],
      "reasoning_channel_id": ""
    }
  }
}
```

### 6. 发布应用

1. 进入 **版本管理与发布**
2. 创建新版本并提交审核
3. 设置 **可用范围**，定义哪些用户/部门可以使用该机器人
4. 审核通过后，机器人即可在飞书聊天中使用

### 7. 运行

```bash
picoclaw gateway
```

## 字段参考

| 字段 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `app_id` | string | 是 | 飞书应用 App ID（以 `cli_` 开头） |
| `app_secret` | string | 是 | 飞书应用 App Secret |
| `encrypt_key` | string | 否 | 事件回调加密密钥 |
| `verification_token` | string | 否 | 事件验证令牌 |
| `allow_from` | array | 否 | 用户 open ID 白名单（空数组 = 允许所有用户） |
| `group_trigger` | object | 否 | 群聊触发设置（见[通用通道字段](../#通用通道字段)） |
| `placeholder` | object | 否 | 占位消息配置（`enabled`、`text`） |
| `random_reaction_emoji` | array | 否 | 自定义消息表情列表（空 = 默认使用 "Pin"） |
| `reasoning_channel_id` | string | 否 | 将推理过程输出到单独的聊天 |

### 占位消息

启用后，PicoClaw 在收到用户消息时立即发送一条占位消息（如"正在思考..."），待 Agent 处理完成后用实际回复替换。

```json
"placeholder": {
  "enabled": true,
  "text": "正在思考..."
}
```

### 自定义表情

PicoClaw 会对用户消息添加表情回复以确认已收到。你可以自定义表情列表：

```json
"random_reaction_emoji": ["THUMBSUP", "HEART", "SMILE"]
```

留空则使用默认的 "Pin" 表情。可用表情列表参见[飞书 Emoji 列表](https://open.larkoffice.com/document/server-docs/im-v1/message-reaction/emojis-introduce)。

:::note
`random_reaction_emoji` 列表中的空字符串或纯空白字符串会被自动过滤。例如 `["", "Pin"]` 等同于 `["Pin"]`。如果过滤后没有有效条目，则使用默认的 "Pin" 表情。
:::

## 工作原理

- PicoClaw 使用 Lark SDK 的 **WebSocket 模式** 处理事件
- 消息通过 `im.message.receive_v1` 事件订阅接收
- 响应以 **Interactive Card JSON 2.0** 格式发送，支持 Markdown
- 群聊中，机器人通过 `open_id` 检测 @提及

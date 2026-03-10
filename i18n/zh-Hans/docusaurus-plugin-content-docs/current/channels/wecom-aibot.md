---
id: wecom-aibot
title: 企业微信智能机器人
---

# 企业微信智能机器人

企业微信智能机器人（AI Bot）是企业微信官方提供的 AI 对话接入方式，使用流式拉取协议。支持私聊与群聊，内置流式响应协议，并支持超时后通过 `response_url` 主动推送最终回复。

如需较简单的群聊机器人，请参见 [企业微信机器人](./wecom-bot)。如需自建应用，请参见 [企业微信自建应用](./wecom-app)。

## 与其他 WeCom 通道的对比

| 特性 | 企业微信机器人 | 企业微信自建应用 | **企业微信智能机器人** |
| --- | --- | --- | --- |
| 私聊 | ✅ | ✅ | ✅ |
| 群聊 | ✅ | ❌ | ✅ |
| 流式输出 | ❌ | ❌ | ✅ |
| 超时主动推送 | ❌ | ✅ | ✅ |
| 配置复杂度 | 低 | 高 | 中 |

## 设置流程

### 1. 创建智能机器人

1. 登录[企业微信管理后台](https://work.weixin.qq.com/wework_admin)
2. 进入 **应用管理** → **智能机器人**，创建或选择一个 AI Bot
3. 在 AI Bot 配置页面，填写"消息接收"信息：
   - **URL**：`http://<your-server-ip>:18790/webhook/wecom-aibot`
   - **Token**：随机生成或自定义
   - **EncodingAESKey**：点击"随机生成"，得到 43 字符密钥
4. 复制 **Token** 和 **EncodingAESKey**

:::tip
服务器需要能被企业微信服务器访问。如在内网/本地开发，可使用 [ngrok](https://ngrok.com) 或 frp 做内网穿透。
:::

### 2. 配置 PicoClaw

```json
{
  "channels": {
    "wecom_aibot": {
      "enabled": true,
      "token": "YOUR_TOKEN",
      "encoding_aes_key": "YOUR_43_CHAR_ENCODING_AES_KEY",
      "webhook_path": "/webhook/wecom-aibot",
      "max_steps": 10,
      "welcome_message": "你好！我是你的 AI 助手，有什么可以帮你的吗？",
      "reasoning_channel_id": ""
    }
  }
}
```

### 3. 保存并验证

1. 先启动 PicoClaw
2. 回到企业微信管理后台点击 **保存**
3. 企业微信会向你的服务器发送验证请求 — PicoClaw 必须处于运行状态才能响应

### 4. 运行

```bash
picoclaw gateway
```

## 字段参考

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `token` | string | — | AI Bot 配置页面的验证令牌 |
| `encoding_aes_key` | string | — | AI Bot 配置页面的 43 字符 AES 密钥 |
| `webhook_path` | string | `/webhook/wecom-aibot` | Webhook 接收路径 |
| `allow_from` | array | [] | 用户 ID 白名单（空数组 = 允许所有用户） |
| `reply_timeout` | int | 5 | 回复超时时间（秒） |
| `max_steps` | int | 10 | Agent 最大执行步骤数 |
| `welcome_message` | string | — | 用户进入聊天时发送的欢迎消息（`enter_chat` 事件） |
| `reasoning_channel_id` | string | — | 将推理过程输出到单独的聊天 |

## 流式响应协议

企业微信智能机器人使用"流式拉取"协议，区别于普通 Webhook 的一次性回复：

```
用户发消息
  │
  ▼
PicoClaw 立即返回 {finish: false}（Agent 开始处理）
  │
  ▼
企业微信每隔约 1 秒拉取一次 {msgtype: "stream", stream: {id: "..."}}
  │
  ├─ Agent 未完成 → 返回 {finish: false}（继续等待）
  │
  └─ Agent 完成 → 返回 {finish: true, content: "回答内容"}
```

### 超时处理

若 Agent 处理时间超过约 30 秒（企业微信最大轮询窗口为约 6 分钟）：

1. PicoClaw 关闭流，向用户显示："⏳ 正在处理中，请稍候，结果将稍后发送。"
2. Agent 继续在后台运行
3. Agent 完成后，通过消息中携带的 `response_url` 将最终回复主动推送给用户

:::note
`response_url` 由企业微信颁发，有效期 1 小时，只可使用一次。PicoClaw 直接 POST markdown 消息体，无需加密。
:::

## 欢迎语

配置 `welcome_message` 后，当用户打开与 AI Bot 的聊天窗口时（`enter_chat` 事件），PicoClaw 会自动回复该欢迎语。留空则不发送。

```json
"welcome_message": "你好！我是 PicoClaw AI 助手，有什么可以帮你？"
```

## 常见问题

### 回调 URL 验证失败

- 确认服务器防火墙已开放网关端口（默认 18790）
- 确认 `token` 与 `encoding_aes_key` 填写正确
- 检查 PicoClaw 日志是否收到了来自企业微信的 GET 请求

### 消息没有回复

- 检查 `allow_from` 是否意外限制了发送者
- 查看日志中是否出现 `context canceled` 或 Agent 错误
- 确认 Agent 配置（`model_name` 等）正确

### 超长任务没有收到最终推送

- 确认消息回调中携带了 `response_url`（仅企业微信新版 AI Bot 支持）
- 确认服务器能主动访问外网（需向 `response_url` POST 请求）
- 查看日志关键词 `response_url mode` 和 `Sending reply via response_url`

## 参考文档

- [企业微信 AI Bot 接入文档](https://developer.work.weixin.qq.com/document/path/100719)
- [流式响应协议说明](https://developer.work.weixin.qq.com/document/path/100719)
- [response_url 主动回复](https://developer.work.weixin.qq.com/document/path/101138)

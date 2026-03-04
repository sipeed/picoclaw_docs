---
id: wecom-aibot
title: WeCom AI Bot (企业微信智能机器人)
---

# 企业微信智能机器人

企业微信智能机器人是官方 AI Bot 接入方式，使用流式拉取协议。支持主动推送消息和私聊。

如需较简单的群聊机器人，请参见 [企业微信机器人](./wecom-bot)。如需自建应用，请参见 [企业微信自建应用](./wecom-app)。

## 设置流程

### 1. 创建智能机器人

- 登录 [企业微信管理后台](https://work.weixin.qq.com/wework_admin)
- 进入智能机器人设置
- 记下 **Token** 和 **EncodingAESKey**

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
      "welcome_message": "你好！我是你的 AI 助手，有什么可以帮你的吗？"
    }
  }
}
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `token` | string | — | 签名验证令牌 |
| `encoding_aes_key` | string | — | 43 字符 AES 密钥 |
| `webhook_path` | string | `/webhook/wecom-aibot` | Webhook 接收路径 |
| `max_steps` | int | 10 | 最大流式步数 |
| `welcome_message` | string | — | `enter_chat` 事件触发时发送的欢迎消息 |
| `reasoning_channel_id` | string | — | 将推理过程输出到单独的聊天 |

### 3. 运行

```bash
picoclaw gateway
```

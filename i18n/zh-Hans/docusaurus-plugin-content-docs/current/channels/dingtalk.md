---
id: dingtalk
title: 钉钉
---

# 钉钉

钉钉是阿里巴巴旗下的企业通讯平台，在中国职场中广受欢迎。PicoClaw 使用钉钉的 **Stream 模式** SDK，通过持久化 WebSocket 连接通信 — 无需公网 IP，无需配置 Webhook。

## 设置流程

### 1. 创建企业内部应用

1. 前往[钉钉开放平台](https://open.dingtalk.com/)
2. 点击 **应用开发** → **企业内部开发** → **创建应用**
3. 填写应用名称和描述

### 2. 获取凭据

1. 进入应用设置的 **凭证与基础信息** 页面
2. 复制 **Client ID**（AppKey）和 **Client Secret**（AppSecret）

### 3. 开启机器人能力

1. 进入 **应用功能** → **机器人**
2. 开启机器人功能
3. 机器人支持 **群聊** 和 **单聊** 两种模式

### 4. 配置权限

在 **权限管理** 中，确保以下权限已授予：

- 接收消息（用于接收用户消息）
- 发送消息（用于发送机器人回复）

### 5. 配置 PicoClaw

#### 1. WebUI 配置

优先推荐使用 WebUI 配置，方便快捷。

![WebUI DingTalk Connection Interface](/img/channels/webui_dingtalk.png)

依次填入 Client ID（`YOUR_CLIENT_ID`）和 Client Secret（`YOUR_CLIENT_SECRET`），然后点击 **保存** 即可。

#### 2. 配置文件

修改 `~/.picoclaw/.security.yml`：

```yaml
dingtalk:
  settings:
    client_secret: YOUR_CLIENT_SECRET
```

修改 `~/.picoclaw/config.json`：

```json
{
  "channels": {
      "enabled": true,
      "type": "dingtalk",
      "reasoning_channel_id": "",
      "group_trigger": {},
      "typing": {},
      "placeholder": {
        "enabled": false
      },
      "settings": {
        "client_id": "YOUR_CLIENT_ID"
      }
  }
}
```

### 6. 运行

```bash
picoclaw gateway
```

## 字段参考

| 字段 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `client_id` | string | 是 | 钉钉应用 Client ID（AppKey） |
| `client_secret` | string | 是 | 钉钉应用 Client Secret（AppSecret） |
| `allow_from` | array | 否 | 用户 ID 白名单（空数组 = 允许所有用户） |
| `group_trigger` | object | 否 | 群聊触发设置（见[通用通道字段](../#通用通道字段)） |
| `reasoning_channel_id` | string | 否 | 将推理过程输出到单独的聊天 |

## 工作原理

### Stream 模式

钉钉 Stream 模式使用 SDK 维持持久化 WebSocket 连接：

- **无需公网 IP** — SDK 主动向钉钉服务器发起出站连接
- **自动重连** — SDK 自动处理断连和重新连接
- **实时推送** — 消息通过 WebSocket 通道即时送达

### 消息处理

- **单聊**：消息直接接收
- **群聊**：默认需要 @机器人 才会触发（可通过 `group_trigger` 配置）
- **Session Webhook**：每条消息都携带 `sessionWebhook` URL 用于直接回复
- **最大消息长度**：单条消息上限 20,000 字符（超长回复会自动截断）

### 群聊中的 @提及处理

当机器人在群聊中被 @提及时，PicoClaw 会自动去除消息开头的 `@提及` 标签，确保 Agent 收到的是干净的文本内容，而不包含 `@机器人名称` 前缀。机器人通过钉钉的 `IsInAtList` 字段可靠地判断是否被提及，而非手动解析文本。

### 群聊 vs 单聊

| 特性 | 单聊 | 群聊 |
| --- | --- | --- |
| 触发方式 | 任意消息 | 默认需 @提及 |
| 回复方式 | 直接回复 | 通过 session webhook 回复 |
| 上下文 | 按用户维护会话 | 按群组维护会话 |

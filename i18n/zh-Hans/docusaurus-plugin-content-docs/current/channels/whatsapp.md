---
id: whatsapp
title: WhatsApp
---

# WhatsApp

PicoClaw 支持两种方式连接 WhatsApp：通用 **WebSocket bridge**（`pkg/channels/whatsapp`），适用于已有进程在代为处理 WhatsApp 协议的场景；以及 **native 原生模式**（`pkg/channels/whatsapp_native`），通过 [whatsmeow](https://github.com/tulir/whatsmeow) 直接讲 WhatsApp Web 协议。两者通过 `use_native` 字段切换。

## Native 模式（whatsmeow）

Native 模式直接连接 WhatsApp 服务器，**无需任何外部 bridge 进程**。推荐大多数用户使用。

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "use_native": true,
      "session_store_path": "~/.picoclaw/workspace/whatsapp",
      "allow_from": []
    }
  }
}
```

首次启动时终端会打印一个二维码。使用手机扫码（WhatsApp → 设置 → 已链接设备）即可完成配对。配对信息会持久化存储在 `session_store_path` 目录下，后续启动无需重新扫码。

:::tip 重新配对
如果配对卡住或你想重新开始，删除 session 存储目录后重启即可：
```bash
rm -rf ~/.picoclaw/workspace/whatsapp
```
:::

## Bridge 模式

Bridge 模式让 PicoClaw 通过一个外部的 WebSocket 端点间接收发 WhatsApp 消息。如果你已经有现成的 bridge 进程，希望将其与 PicoClaw 集成，可使用该模式。

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "use_native": false,
      "bridge_url": "ws://localhost:3001"
    }
  }
}
```

PicoClaw 通过普通 WebSocket 连接 `bridge_url` 并与 bridge 交换消息。具体的 WhatsApp 协议处理由 bridge 负责，PicoClaw 仅将 bridge 视为透明传输层。

## 配置字段参考

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | 是否启用 WhatsApp 通道 |
| `use_native` | bool | `false` | `true` 使用 native whatsmeow 模式；`false` 使用 bridge 模式 |
| `bridge_url` | string | `""` | bridge 模式下的 WebSocket 地址（`use_native: true` 时忽略） |
| `session_store_path` | string | `""` | whatsmeow 会话数据目录（仅 native 模式） |
| `allow_from` | array | `[]` | 允许与 bot 交互的手机号白名单。空数组表示允许所有联系人 |
| `reasoning_channel_id` | string | `""` | 将推理过程输出到单独的会话 |

每个字段也可以通过对应的环境变量配置，前缀为 `PICOCLAW_CHANNELS_WHATSAPP_`（例如 `PICOCLAW_CHANNELS_WHATSAPP_USE_NATIVE=true`）。

## 访问控制

`allow_from` 接受国际格式的手机号（**不带** `+` 前缀）：

```json
{
  "allow_from": ["8613800138000", "5511999998888"]
}
```

设为 `[]` 则允许所有给 bot 发消息的联系人。

## 媒体支持

入站媒体（图片、音频、文档）会被下载并作为对话上下文提供。如果在 `voice.model_name` 中配置了 Whisper 兼容的语音转写模型，音频消息会自动转写后再交给 Agent 处理。

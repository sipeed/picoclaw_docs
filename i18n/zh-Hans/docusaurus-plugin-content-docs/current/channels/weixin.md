---
id: weixin
title: 微信个人号渠道
---


# 💬 微信个人号渠道 (Weixin)

PicoClaw 支持使用腾讯官方 iLink API 连接您的个人微信账号。

## 🚀 快速激活

最简单的方法是使用交互式 onboarding 命令进行一键激活：

```bash
picoclaw auth weixin
```



该命令将：
1. 从 iLink API 获取二维码并在终端中打印。
2. 等待您使用手机微信 App 扫码。
3. 扫码确认后，自动将生成的 Access Token 保存至您的 `~/.picoclaw/config.json` 中。

配置完成后，即可启动网关：

```bash
picoclaw gateway
```
## 🖥️ Web 管理界面(WebUI)
PicoClaw 提供了现代化的Web管理界面，可以一键获取二维码。

![WebUI 微信连接界面](/img/channels/webui_weixin.png)



---

## ⚙️ 配置说明

您也可以在 `config.json` 的 `channels.weixin` 段目下进行手动维护。

```json
{
  "channels": {
    "weixin": {
      "enabled": true,
      "token": "YOUR_WEIXIN_TOKEN",
      "allow_from": [
        "user_id_1",
        "user_id_2"
      ],
      "proxy": ""
    }
  }
}
```

### 字段解析

| 字段 | 说明 |
|---|---|
| `enabled` | 设置为 `true` 以在启动时激活该频道。 |
| `token` | 通过扫码获取的认证令牌。 |
| `allow_from` | (可选) 允许与机器人交互的微信 User ID 列表。如果为空，任何能给此微信号发消息的人都可以触发机器人。 |
| `proxy` | (可选) HTTP 代理地址（例如 `http://localhost:7890`），适合网络访问受限环境。 |

## 会话持久化

PicoClaw 会自动将微信的 context token 持久化到磁盘，使对话会话在重启后得以恢复。每条收到的消息都携带一个 `context_token`，用于将回复关联到正确的对话；这些 token 保存在 `~/.picoclaw/channels/weixin/context-tokens/` 目录下，并在网关启动时自动恢复。这意味着你可以重启 PicoClaw 而不会丢失回复进行中对话的能力。

## ⚠️ 注意事项

- **单端绑定**: iLink 令牌通常与单个会话绑定。在其他地方重新扫码激活可能会导致旧令牌失效。
- **频率控制**: 为避免触发微信的风控反垃圾机制，请避免设置死循环触发、高频广播等恶意行为。

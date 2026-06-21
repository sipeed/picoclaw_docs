---
id: irc
title: IRC
---

# IRC

IRC 通道通过普通 IRC 客户端连接把 PicoClaw 接入 IRC 网络。它支持 TLS、密码/SASL 认证、加入频道、群聊触发规则，以及服务器支持 `message-tags` 时的 IRCv3 输入状态标签。

## 配置

```json
{
  "channels": {
    "irc": {
      "enabled": true,
      "server": "irc.libera.chat:6697",
      "tls": true,
      "nick": "picoclaw-bot",
      "channels": ["#mychannel"],
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "typing": {
        "enabled": false
      }
    }
  }
}
```

保存配置后启动网关：

```bash
picoclaw gateway
```

## 配置参考

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | 启用 IRC 通道 |
| `server` | string | `irc.libera.chat:6697` | IRC 服务器和端口 |
| `tls` | bool | `true` | 使用 TLS 连接 |
| `nick` | string | `mybot` | 机器人昵称，必填 |
| `user` | string | `nick` | IRC 用户名，留空时使用 `nick` |
| `real_name` | string | `nick` | IRC real name，留空时使用 `nick` |
| `password` | string | `""` | 服务器密码 |
| `nickserv_password` | string | `""` | 存入安全配置的 NickServ 密码字段 |
| `sasl_user` | string | `""` | SASL 用户名。配置后优先使用 SASL。 |
| `sasl_password` | string | `""` | SASL 密码，建议放入安全配置 |
| `channels` | string[] | `["#mychannel"]` | 连接后加入的频道 |
| `request_caps` | string[] | `["server-time", "message-tags"]` | 请求的 IRCv3 capability |
| `allow_from` | array | `[]` | 允许访问的 IRC 昵称或用户 ID。空数组表示允许所有用户。 |
| `group_trigger` | object | `{ "mention_only": true }` | 频道消息中是否要求 @ 或前缀触发 |
| `typing.enabled` | bool | `false` | 服务器支持时发送 IRCv3 `+typing` 标签 |
| `reasoning_channel_id` | string | `""` | 将推理输出路由到单独目标 |

## 认证

支持 SASL 的网络推荐使用 `sasl_user` 和 `sasl_password`。未配置 SASL 时，可以使用 `password` 进行服务器认证。`nickserv_password` 会作为安全通道配置保存，但当前 IRC 连接器不会自动发送 NickServ 命令。

敏感值可以放在 `.security.yml`，避免写入 `config.json`。

## 行为说明

IRC 是按行发送的协议，因此 PicoClaw 会把多行回复拆成多条 IRC 消息发送。通道使用较保守的消息长度限制，以适配常见 IRC 服务器限制。

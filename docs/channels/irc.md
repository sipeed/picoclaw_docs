---
id: irc
title: IRC
---

# IRC

The IRC channel connects PicoClaw to IRC networks through a normal IRC client connection. It supports TLS, password/SASL authentication, channel joins, group triggers, and optional IRCv3 typing tags when the server advertises `message-tags`.

## Configuration

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

Run the gateway after saving the config:

```bash
picoclaw gateway
```

## Configuration Reference

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Enable the IRC channel |
| `server` | string | `irc.libera.chat:6697` | IRC server and port |
| `tls` | bool | `true` | Connect with TLS |
| `nick` | string | `mybot` | Bot nickname. Required. |
| `user` | string | `nick` | IRC username. Falls back to `nick` when empty. |
| `real_name` | string | `nick` | IRC real name. Falls back to `nick` when empty. |
| `password` | string | `""` | Server password, if required |
| `nickserv_password` | string | `""` | NickServ password field stored in secure config |
| `sasl_user` | string | `""` | SASL username. SASL takes priority over NickServ when configured. |
| `sasl_password` | string | `""` | SASL password kept in secure config |
| `channels` | string[] | `["#mychannel"]` | Channels to join after connecting |
| `request_caps` | string[] | `["server-time", "message-tags"]` | IRCv3 capabilities to request |
| `allow_from` | array | `[]` | Allowed IRC nicks or user IDs. Empty array allows all users. |
| `group_trigger` | object | `{ "mention_only": true }` | Require mentions or prefixes in channel messages |
| `typing.enabled` | bool | `false` | Send IRCv3 `+typing` tags when supported by the server |
| `reasoning_channel_id` | string | `""` | Route reasoning output to a separate target |

## Authentication

Use `sasl_user` and `sasl_password` for networks that support SASL. If SASL is not configured, you can provide `password` for server authentication. `nickserv_password` is stored as secure channel configuration, but the current IRC connector does not send NickServ commands automatically.

Sensitive values can be stored in `.security.yml` instead of `config.json`.

## Behavior Notes

IRC is line-oriented, so PicoClaw sends multi-line responses as separate IRC messages. The channel uses a conservative message length limit to fit common IRC server limits.

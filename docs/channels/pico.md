---
id: pico
title: Pico Protocol
---

# Pico Protocol

The Pico channel is PicoClaw's native WebSocket protocol for custom clients and the web UI. It supports live messages, message edits/deletes, typing indicators, placeholders, media delivery, and tool feedback updates.

PicoClaw can run either as the WebSocket server (`pico`) or as a client that connects to a remote Pico server (`pico_client`).

## Server Mode

Enable `pico` when this gateway should accept WebSocket clients.

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "YOUR_PICO_TOKEN",
      "allow_token_query": false,
      "allow_origins": ["https://docs.picoclaw.io"],
      "ping_interval": 30,
      "read_timeout": 60,
      "max_connections": 100,
      "allow_from": []
    }
  },
  "gateway": {
    "host": "localhost",
    "port": 18790
  }
}
```

Clients connect to the shared gateway at `/pico/ws`. Authentication uses the configured token. Query-string token authentication is disabled unless `allow_token_query` is set to `true`.

## Client Mode

Enable `pico_client` when this PicoClaw instance should connect outward to another Pico server.

```json
{
  "channels": {
    "pico_client": {
      "enabled": true,
      "url": "wss://remote-pico-server/pico/ws",
      "token": "YOUR_PICO_TOKEN",
      "session_id": "",
      "ping_interval": 30,
      "read_timeout": 60,
      "allow_from": []
    }
  }
}
```

## Server Configuration Reference

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Enable Pico server mode |
| `token` | string | required | Shared token for client authentication |
| `allow_token_query` | bool | `false` | Allow token authentication through a query parameter |
| `allow_origins` | string[] | `[]` | Allowed browser origins. Empty array allows all origins. |
| `ping_interval` | int | `30` | WebSocket ping interval in seconds |
| `read_timeout` | int | `60` | WebSocket read timeout in seconds |
| `write_timeout` | int | `0` | Optional WebSocket write timeout in seconds |
| `max_connections` | int | `100` | Maximum active WebSocket connections |
| `allow_from` | array | `[]` | Allowed Pico session senders. Empty array allows all users. |

## Client Configuration Reference

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Enable Pico client mode |
| `url` | string | required | Remote Pico WebSocket URL |
| `token` | string | required | Shared token for remote server authentication |
| `session_id` | string | `""` | Optional fixed session ID |
| `ping_interval` | int | `30` | WebSocket ping interval in seconds |
| `read_timeout` | int | `60` | WebSocket read timeout in seconds |
| `allow_from` | array | `[]` | Allowed inbound session senders |

## Security Notes

Keep `token` in `.security.yml` for production deployments. If browser clients are used, configure `allow_origins` to the exact trusted origins instead of leaving it open.

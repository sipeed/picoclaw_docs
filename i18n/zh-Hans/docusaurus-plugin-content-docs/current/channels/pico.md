---
id: pico
title: Pico 协议
---

# Pico 协议

Pico 通道是 PicoClaw 为自定义客户端和 Web UI 提供的原生 WebSocket 协议。它支持实时消息、消息编辑/删除、输入状态、占位消息、媒体传输和工具反馈更新。

PicoClaw 既可以作为 WebSocket 服务端（`pico`），也可以作为客户端连接到远程 Pico 服务端（`pico_client`）。

## 服务端模式

当当前网关需要接收 WebSocket 客户端连接时，启用 `pico`。

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

客户端通过共享网关的 `/pico/ws` 路径连接。认证使用配置中的 token。除非设置 `allow_token_query: true`，否则不会允许通过查询参数传递 token。

## 客户端模式

当这个 PicoClaw 实例需要主动连接到另一个 Pico 服务端时，启用 `pico_client`。

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

## 服务端配置参考

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | 启用 Pico 服务端模式 |
| `token` | string | 必填 | 客户端认证共享 token |
| `allow_token_query` | bool | `false` | 允许通过查询参数进行 token 认证 |
| `allow_origins` | string[] | `[]` | 允许的浏览器 Origin。空数组表示允许所有 Origin。 |
| `ping_interval` | int | `30` | WebSocket ping 间隔，单位秒 |
| `read_timeout` | int | `60` | WebSocket 读取超时，单位秒 |
| `write_timeout` | int | `0` | 可选的 WebSocket 写入超时，单位秒 |
| `max_connections` | int | `100` | 最大活跃 WebSocket 连接数 |
| `allow_from` | array | `[]` | 允许的 Pico 会话发送方。空数组表示允许所有用户。 |

## 客户端配置参考

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | 启用 Pico 客户端模式 |
| `url` | string | 必填 | 远程 Pico WebSocket URL |
| `token` | string | 必填 | 远程服务端认证共享 token |
| `session_id` | string | `""` | 可选的固定会话 ID |
| `ping_interval` | int | `30` | WebSocket ping 间隔，单位秒 |
| `read_timeout` | int | `60` | WebSocket 读取超时，单位秒 |
| `allow_from` | array | `[]` | 允许的入站会话发送方 |

## 安全说明

生产部署中建议把 `token` 放入 `.security.yml`。如果使用浏览器客户端，请把 `allow_origins` 配置为可信 Origin，不要保持开放。

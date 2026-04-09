---
id: token_authentication
title: Token 认证登录
---

# Token 认证登录

## 概述

PicoClaw 支持多种 Token 认证方式，用于保护 Gateway API 访问和 Web 控制台登录。本文档介绍如何配置和使用 Token 认证功能。

---

## Pico Channel Token 认证

Pico Channel 是 PicoClaw 的原生 WebSocket 协议通道，支持通过 Token 进行身份验证。

### 配置方式

#### 方式一：配置文件

在 `~/.picoclaw/config.json` 中配置：

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "your-secure-token-here"
    }
  }
}
```

#### 方式二：环境变量

```bash
export PICOCLAW_CHANNELS_PICO_TOKEN="your-secure-token-here"
```

#### 方式三：安全配置文件（推荐）

在 `~/.picoclaw/.security.yml` 中配置敏感信息：

```yaml
channels:
  pico:
    token: "your-secure-token-here"
```

> **安全提示**：推荐使用 `.security.yml` 存储敏感 Token，该文件应添加到 `.gitignore` 中。

### 认证方式

Pico Channel 支持三种 Token 认证方式：

| 认证方式 | 说明 | 适用场景 |
|---------|------|---------|
| **Authorization Header** | `Authorization: Bearer <token>` | 服务端调用、API 客户端 |
| **WebSocket Subprotocol** | `Sec-WebSocket-Protocol: token.<value>` | 浏览器 WebSocket 连接 |
| **URL Query 参数** | `?token=<token>` | 简单场景（需显式启用） |

#### 1. Authorization Header

在 HTTP 请求头中携带 Token：

```bash
curl -H "Authorization: Bearer your-secure-token-here" \
  http://localhost:18790/api/endpoint
```

#### 2. WebSocket Subprotocol

建立 WebSocket 连接时指定子协议：

```javascript
const ws = new WebSocket('ws://localhost:18790/pico', ['token.your-secure-token-here']);
```

#### 3. URL Query 参数

> **注意**：此方式默认禁用，需显式启用。

启用 URL Query Token：

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "your-secure-token-here",
      "allow_token_query": true
    }
  }
}
```

使用方式：

```javascript
const ws = new WebSocket('ws://localhost:18790/pico?token=your-secure-token-here');
```

> **安全警告**：URL Query 参数方式可能导致 Token 在日志、浏览器历史记录中泄露，请谨慎使用。

### 完整配置选项

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "your-secure-token-here",
      "allow_token_query": false,
      "allow_origins": ["https://your-app.com"],
      "ping_interval": 30,
      "read_timeout": 60,
      "write_timeout": 60,
      "max_connections": 100
    }
  }
}
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | `false` | 是否启用 Pico Channel |
| `token` | string | - | 认证 Token（必填） |
| `allow_token_query` | bool | `false` | 是否允许 URL Query 方式传递 Token |
| `allow_origins` | []string | `[]` | 允许的 Origin 列表，空则允许所有 |
| `ping_interval` | int | `30` | WebSocket Ping 间隔（秒） |
| `read_timeout` | int | `60` | 读取超时时间（秒） |
| `write_timeout` | int | `60` | 写入超时时间（秒） |
| `max_connections` | int | - | 最大连接数 |

---

## Web 启动器控制台 Token

Web 启动器控制台（Launcher Dashboard）使用 Token 进行登录认证。

![set token](/img/configuration/login.png)

### 默认行为

默认情况下，启动器 Token 在**每次启动时随机生成**，重启后会变化。

查看 Token 的方式：

- **控制台模式**（`-console`）：查看启动时的终端输出
- **托盘/GUI 模式**：使用托盘菜单中的「复制控制台口令」
- **日志文件**：`$PICOCLAW_HOME/logs/launcher.log`

### 设置固定 Token

通过环境变量设置固定 Token：

```bash
export PICOCLAW_LAUNCHER_TOKEN="your-fixed-launcher-token"
```

设置后，Token 将固定不变，启动日志中不会显示具体 Token 值。

### 登录方式

1. **手动输入**：在登录页面输入 Token
2. **URL 参数**：访问 `http://localhost:18791?token=your-token` 自动登录

> **安全说明**：
> - 登录后的会话 Cookie 默认约 7 天有效
> - 登录接口有暴力尝试限制（每分钟尝试次数上限）
> - 全站响应携带 `Referrer-Policy: no-referrer`，减轻 Token 经 Referer 头泄露的风险

---

## 通过webUI自定义令牌

![set token](/img/configuration/settoken.png)

## Token 存储建议

| 存储方式 | 安全性 | 适用场景 |
|---------|--------|---------|
| `.security.yml` | ⭐⭐⭐ 高 | 生产环境（推荐） |
| 环境变量 | ⭐⭐ 中 | 容器化部署、CI/CD |
| `config.json` | ⭐ 低 | 仅开发测试 |

### 安全配置示例

**`.security.yml`**：

```yaml
channels:
  pico:
    token: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  telegram:
    token: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
  discord:
    token: "your-discord-bot-token"
```

**`.gitignore`**：

```gitignore
.picoclaw/.security.yml
```

---

## 常见问题

### Q: Token 认证失败怎么办？

1. 检查 Token 是否正确配置
2. 确认请求头格式正确：`Authorization: Bearer <token>`（注意 Bearer 后有空格）
3. 如果使用 URL Query 方式，确认 `allow_token_query` 已启用

### Q: 如何轮换 Token？

1. 更新 `.security.yml` 或环境变量中的 Token
2. 重启 PicoClaw Gateway
3. 更新客户端配置使用新 Token

### Q: 多个客户端如何使用不同 Token？

当前版本 Pico Channel 仅支持单一 Token。如需多用户场景，建议：
- 使用其他支持多用户的 Channel（如 Telegram、Discord）
- 通过反向代理实现多 Token 验证

---

## 相关文档

- [配置指南](./index.md)
- [安全配置](./security-reference.md)
- [聊天应用配置](../channels/index.md)

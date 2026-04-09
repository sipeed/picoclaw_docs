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

Web 启动器控制台（Launcher Dashboard）通过一套标准 HTTP 登录 / 初始化 / 退出流程进行身份认证，整个流程由一个 token 守护，同一个 token 也用于签名控制台的会话 Cookie。

![set token](/img/configuration/login.png)

### Token 解析顺序

启动时，启动器按以下优先级解析控制台 token：

1. **`PICOCLAW_LAUNCHER_TOKEN` 环境变量** —— 最高优先级。设置后会被使用，并且**不会**回显到日志。
2. **`launcher-config.json` 中的 `launcher_token` 字段** —— 跨重启持久化。一旦你通过控制台或手工编辑该文件设置了自定义 token，默认就走这一项。
3. **随机 token（兜底）** —— 仅在前两者都没有时才会触发。PicoClaw 会生成一个 256-bit 随机 token，**写回 `launcher-config.json`**，并在下次启动时复用同一个值。

启动器日志在启动时会标明当前 token 的来源（`env` / `config` / `random`），所以**除非你显式轮换，否则 token 会跨重启保持不变**。

### 查看 Token

- **控制台模式**（`-console`）：启动时打印 token 或它的来源
- **托盘 / GUI 模式**：使用托盘菜单的「复制控制台口令」
- **日志文件**：`$PICOCLAW_HOME/logs/launcher.log`
- **launcher-config.json**：直接读 `launcher_token` 字段

### 设置固定 Token

两种方式：

**环境变量**（覆盖其他来源，不会持久化）：

```bash
export PICOCLAW_LAUNCHER_TOKEN="your-fixed-launcher-token"
```

**`launcher-config.json`**（持久化）：

```json
{
  "port": 18800,
  "launcher_token": "your-fixed-launcher-token"
}
```

### 登录流程

控制台暴露三个 HTTP 接口：

| 接口 | 方法 | 用途 |
| --- | --- | --- |
| `/login` | POST | 用 launcher token 登录，换取会话 Cookie |
| `/setup` | POST | 首次运行流程：在控制台可用之前注册一个自定义 token |
| `/logout` | POST | 注销当前会话 |

登录方式：

1. **手动输入**：在登录页面输入 token
2. **URL 参数**：访问 `http://localhost:18800?token=your-token` 自动登录

> **安全说明**：
> - 会话 Cookie 由**每次进程启动时新生成的 256-bit 密钥** HMAC 签名，所以每次启动器重启，所有已有会话都会失效
> - 会话 Cookie 默认约 7 天有效
> - 登录接口有暴力尝试限制（每分钟尝试次数上限）
> - 所有响应都带 `Referrer-Policy: no-referrer`，减轻 token 经 Referer 头泄露的风险

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

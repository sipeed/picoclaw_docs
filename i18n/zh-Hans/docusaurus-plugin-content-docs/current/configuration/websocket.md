---
id: websocket
title: 连接 WebSocket
---
## PicoClaw WebSocket 外部客户端连接指南

从 v0.2.5 开始，PicoClaw WebSocket 连接需要**双重认证**。直接连接 Gateway 端口（18790）或仅提供 pico token 将无法成功认证。

---

### 认证架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Launcher (18800)                         │
├─────────────────────────────────────────────────────────────────┤
│  第一层认证：Dashboard 认证                                       │
│  - Session Cookie (picoclaw_launcher_auth)                      │
│  - 或 Authorization: Bearer <dashboard_token>                   │
├─────────────────────────────────────────────────────────────────┤
│  第二层认证：Pico WebSocket 认证                                  │
│  - Sec-WebSocket-Protocol: token.<picoToken>                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Gateway (18790)                            │
│  内部使用组合 token: pico-{pidToken}{picoToken}                  │
│  (由 Launcher 自动转换，客户端无需关心)                            │
└─────────────────────────────────────────────────────────────────┘
```

---

### 浏览器插件/前端连接方式

#### 步骤 1：用户登录 Dashboard

用户需要先在浏览器中访问 PicoClaw Dashboard 并登录：

```
http://your-host:18800?token=<dashboard_token>
```

登录成功后，浏览器会获得 session cookie (`picoclaw_launcher_auth`)。

> **Dashboard Token 获取方式**：
> - 查看 Launcher 启动时的控制台输出
> - 或设置环境变量 `PICOCLAW_LAUNCHER_TOKEN`
> - 或在 `~/.picoclaw/launcher.json` 中配置

#### 步骤 2：获取 Pico Token

```javascript
const response = await fetch('/api/pico/token');
const { token, ws_url, enabled } = await response.json();

console.log('Pico Token:', token);
console.log('WebSocket URL:', ws_url);
```

#### 步骤 3：连接 WebSocket

```javascript
const ws = new WebSocket(ws_url, [`token.${token}`]);

ws.onopen = () => {
    console.log('WebSocket 连接成功');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('收到消息:', message);
};

ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
};

ws.onclose = () => {
    console.log('WebSocket 连接关闭');
};
```

#### 完整示例

```javascript
class PicoClawClient {
    constructor() {
        this.ws = null;
        this.picoToken = null;
        this.wsUrl = null;
    }

    async connect() {
        // 获取 pico token
        const response = await fetch('/api/pico/token');
        if (!response.ok) {
            throw new Error('获取 token 失败，请先登录 Dashboard');
        }
        
        const data = await response.json();
        this.picoToken = data.token;
        this.wsUrl = data.ws_url;

        // 连接 WebSocket
        // session cookie 会自动携带，无需手动设置
        this.ws = new WebSocket(this.wsUrl, [`token.${this.picoToken}`]);

        return new Promise((resolve, reject) => {
            this.ws.onopen = () => resolve();
            this.ws.onerror = (e) => reject(new Error('连接失败'));
        });
    }

    send(content) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket 未连接');
        }
        
        this.ws.send(JSON.stringify({
            type: 'message.send',
            session_id: this.sessionId,
            timestamp: Date.now(),
            payload: { content }
        }));
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// 使用示例
const client = new PicoClawClient();
await client.connect();
client.send('Hello PicoClaw!');
```

---

### 非浏览器客户端连接方式

对于无法使用 cookie 的客户端（如 Node.js、Python、Postman），需要：

#### 方式 A：使用 Authorization Header

```javascript
// Node.js 示例 (需要支持 WebSocket 的库)
const WebSocket = require('ws');

const dashboardToken = 'your-dashboard-token';
const picoToken = 'your-pico-token';

const ws = new WebSocket('ws://your-host:18800/pico/ws', [`token.${picoToken}`], {
    headers: {
        'Authorization': `Bearer ${dashboardToken}`
    }
});
```

#### 方式 B：使用 Query Token

```
ws://your-host:18800/pico/ws?token=<dashboard_token>
```

同时提供 `Sec-WebSocket-Protocol: token.<picoToken>`。

---

### 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| **302 重定向到 /launcher-login** | 未通过 Dashboard 认证 | 先登录 Dashboard 获取 session cookie |
| **403 Forbidden "Invalid Pico token"** | pico token 不正确或未提供 | 调用 `/api/pico/token` 获取正确的 token |
| **401 Unauthorized** | 直接连 Gateway 端口 | 改连 Launcher 端口 (18800) |
| **503 Service Unavailable** | Gateway 未运行 | 启动 Gateway 服务 |

---

### 端口说明

| 端口 | 用途 | 外部客户端是否可直连 |
|------|------|---------------------|
| **18800** | Launcher (Web UI + 代理) | ✅ 推荐使用 |
| **18790** | Gateway (内部服务) | ❌ 不支持直连 |

---

### Token 类型说明

| Token 类型 | 用途 | 获取方式 |
|-----------|------|----------|
| **Dashboard Token** | 访问 Web UI 和 API | 启动时生成或配置 `PICOCLAW_LAUNCHER_TOKEN` |
| **Pico Token** | WebSocket 连接认证 | 调用 `GET /api/pico/token` |
| **PID Token** | Gateway 内部使用 | 自动生成，客户端无需关心 |

---

### 安全建议

1. **不要暴露 Gateway 端口**：仅暴露 Launcher 端口 (18800)
2. **使用 HTTPS**：在生产环境中配置反向代理（如 Nginx）启用 HTTPS
3. **定期更换 Token**：通过 `POST /api/pico/token` 重新生成 pico token
4. **限制访问 IP**：在 `launcher.json` 中配置 `allowed_cidrs`

---

如有其他问题，请在 GitHub Issues 中反馈。
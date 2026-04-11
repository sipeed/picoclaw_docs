---
id: websocket
title: Connecting WebSocket
---
## PicoClaw WebSocket External Client Connection Guide

Starting from v0.2.5, PicoClaw WebSocket connections require **dual authentication**. Directly connecting to the Gateway port (18790) or providing only the pico token will not authenticate successfully.

---

### Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Launcher (18800)                         │
├─────────────────────────────────────────────────────────────────┤
│  First Layer Authentication: Dashboard Authentication            │
│  - Session Cookie (picoclaw_launcher_auth)                      │
│  - Or Authorization: Bearer <dashboard_token>                   │
├─────────────────────────────────────────────────────────────────┤
│  Second Layer Authentication: Pico WebSocket Authentication      │
│  - Sec-WebSocket-Protocol: token.<picoToken>                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Gateway (18790)                            │
│  Internal use combined token: pico-{pidToken}{picoToken}         │
│  (Automatically converted by Launcher, clients don't need to care) │
└─────────────────────────────────────────────────────────────────┘
```

---

### Browser Plugin/Frontend Connection Method

#### Step 1: User Logs into Dashboard

Users need to access the PicoClaw Dashboard in the browser and log in first:

```
http://your-host:18800?token=<dashboard_token>
```

After successful login, the browser will obtain a session cookie (`picoclaw_launcher_auth`).

> **Dashboard Token Acquisition Methods**:
> - Check the console output when Launcher starts
> - Or set environment variable `PICOCLAW_LAUNCHER_TOKEN`
> - Or configure in `~/.picoclaw/launcher.json`

#### Step 2: Obtain Pico Token

```javascript
const response = await fetch('/api/pico/token');
const { token, ws_url, enabled } = await response.json();

console.log('Pico Token:', token);
console.log('WebSocket URL:', ws_url);
```

#### Step 3: Connect WebSocket

```javascript
const ws = new WebSocket(ws_url, [`token.${token}`]);

ws.onopen = () => {
    console.log('WebSocket connection successful');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('WebSocket connection closed');
};
```

#### Complete Example

```javascript
class PicoClawClient {
    constructor() {
        this.ws = null;
        this.picoToken = null;
        this.wsUrl = null;
    }

    async connect() {
        // Obtain pico token
        const response = await fetch('/api/pico/token');
        if (!response.ok) {
            throw new Error('Failed to obtain token, please log into Dashboard first');
        }
        
        const data = await response.json();
        this.picoToken = data.token;
        this.wsUrl = data.ws_url;

        // Connect WebSocket
        // Session cookie is automatically carried, no need to set manually
        this.ws = new WebSocket(this.wsUrl, [`token.${this.picoToken}`]);

        return new Promise((resolve, reject) => {
            this.ws.onopen = () => resolve();
            this.ws.onerror = (e) => reject(new Error('Connection failed'));
        });
    }

    send(content) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket not connected');
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

// Usage Example
const client = new PicoClawClient();
await client.connect();
client.send('Hello PicoClaw!');
```

---

### Non-Browser Client Connection Method

For clients that cannot use cookies (such as Node.js, Python, Postman), you need:

#### Method A: Use Authorization Header

```javascript
// Node.js example (requires WebSocket library)
const WebSocket = require('ws');

const dashboardToken = 'your-dashboard-token';
const picoToken = 'your-pico-token';

const ws = new WebSocket('ws://your-host:18800/pico/ws', [`token.${picoToken}`], {
    headers: {
        'Authorization': `Bearer ${dashboardToken}`
    }
});
```

#### Method B: Use Query Token

```
ws://your-host:18800/pico/ws?token=<dashboard_token>
```

Provide `Sec-WebSocket-Protocol: token.<picoToken>` at the same time.

---

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **302 Redirect to /launcher-login** | Dashboard authentication not passed | Log into Dashboard first to obtain session cookie |
| **403 Forbidden "Invalid Pico token"** | Pico token incorrect or not provided | Call `/api/pico/token` to obtain correct token |
| **401 Unauthorized** | Directly connected to Gateway port | Change to connect to Launcher port (18800) |
| **503 Service Unavailable** | Gateway not running | Start Gateway service |

---

### Port Description

| Port | Purpose | Can external clients connect directly |
|------|---------|--------------------------------------|
| **18800** | Launcher (Web UI + Proxy) | ✅ Recommended |
| **18790** | Gateway (Internal Service) | ❌ Direct connection not supported |

---

### Token Type Description

| Token Type | Purpose | Acquisition Method |
|------------|---------|-------------------|
| **Dashboard Token** | Access Web UI and API | Generated at startup or configure `PICOCLAW_LAUNCHER_TOKEN` |
| **Pico Token** | WebSocket connection authentication | Call `GET /api/pico/token` |
| **PID Token** | Gateway internal use | Auto-generated, clients don't need to care |

---

### Security Recommendations

1. **Do not expose Gateway port**: Only expose Launcher port (18800)
2. **Use HTTPS**: Configure reverse proxy (like Nginx) to enable HTTPS in production
3. **Change tokens regularly**: Regenerate pico token via `POST /api/pico/token`
4. **Restrict access IPs**: Configure `allowed_cidrs` in `launcher.json`

---

For other issues, please provide feedback in GitHub Issues.
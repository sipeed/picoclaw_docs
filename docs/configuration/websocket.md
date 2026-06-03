---
id: websocket
title: Connect WebSocket
---
## PicoClaw WebSocket Integration Guide

> Scope: current repository behavior as of 2026-04-13.
> This document is for third-party developers integrating with PicoClaw WebSocket through Launcher, including browser extensions, frontend pages running on the Launcher origin, desktop clients, and server-side clients.

Since v0.2.5, PicoClaw WebSocket connections require two layers of validation. External clients should connect to Launcher on port `18800`, not directly to Gateway on port `18790`.

## Three Things To Remember First

1. The public entry point is `ws(s)://<launcher-host>/pico/ws`.
2. The handshake must pass Launcher auth and also provide a Pico token.
3. Browsers are the easiest way to test because they automatically send the logged-in session cookie.

## Version Strategy

- Build and test third-party integrations against release tags.
- Do not build production integrations against `main`; it changes frequently and compatibility is not guaranteed.
- When upgrading PicoClaw, pin both the PicoClaw version and the version of the documentation you rely on.

We recommend recording these explicitly in your own project:

1. The PicoClaw tag or release version
2. The version of this integration document
3. The minimum and maximum PicoClaw versions you support

## Architecture And Auth Model

In Launcher mode, the connection path is:

- Client -> `ws(s)://<launcher-host>/pico/ws`
- Launcher -> reverse proxy to the Gateway Pico channel

There are currently two auth layers:

1. Launcher auth layer
   Uses a logged-in session or `Authorization: Bearer <dashboard_token>` on server-side requests.
2. Pico WebSocket auth layer
   Uses `Sec-WebSocket-Protocol: token.<pico_token>`.

Key points:

- `/pico/ws` is not an anonymous WebSocket endpoint; it is protected by Launcher.
- After a successful Launcher login, Launcher writes the `picoclaw_launcher_auth` cookie.
- `picoclaw_launcher_auth` proves that this browser has already logged in to Launcher, which satisfies the first auth layer.
- This cookie is a session credential. You do not manually inject it into browser code; the browser sends it automatically on same-origin requests.
- Launcher converts `token.<raw_pico_token>` into the internal format before forwarding to Gateway, so clients do not need to care about PID token composition.

### Auth Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Launcher (18800)                         │
├─────────────────────────────────────────────────────────────────┤
│  First auth layer: Launcher login state                         │
│  - Browser session cookie: picoclaw_launcher_auth              │
│  - Or Authorization: Bearer <dashboard_token>                  │
├─────────────────────────────────────────────────────────────────┤
│  Second auth layer: Pico WebSocket auth                        │
│  - Sec-WebSocket-Protocol: token.<pico_token>                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Gateway (18790)                            │
│  Launcher handles internal token conversion and forwarding      │
└─────────────────────────────────────────────────────────────────┘
```

## Standard Integration Flow

### Step 1: Log In To Launcher First

For browser users, the simplest way is to open:

```text
http://your-host:18800?token=<dashboard_token>
```

You can also call the login endpoint explicitly:

```http
POST /api/auth/login
Content-Type: application/json

{
  "token": "<dashboard_token>"
}
```

After login succeeds, Launcher sets the session cookie `picoclaw_launcher_auth`. After that, this browser will automatically send the login state when accessing `/api/pico/token` and `/pico/ws`.

> You can obtain `dashboard_token` in these ways:
> - Check Launcher startup logs
> - Set `PICOCLAW_LAUNCHER_TOKEN`
> - Configure it in `~/.picoclaw/launcher.json`

### Step 2: Get The Pico Token And `ws_url`

This is the part that tends to confuse non-developers. What you actually do is: log in to Launcher in the browser first, then run a small `fetch` snippet in that same browser context to get `token` and `ws_url`.

Important: the browser examples below assume your code is running on the Launcher origin, for example directly on the Launcher page. If your frontend is hosted on a different origin, the relative path `/api/pico/token` will target your own site, not Launcher.

#### Method A: Verify In The Browser Address Bar

Open this in the browser:

```text
http://127.0.0.1:18800/api/pico/token
```

You may see one of these results:

- A JSON response directly, which means you are already logged in and can continue.
- A redirect to the login page, which means Launcher is not logged in yet or the login session has expired.
- A `401`, which means the current login state is invalid.

Expected response:

```json
{
  "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "ws_url": "ws://127.0.0.1:18800/pico/ws",
  "enabled": true
}
```

#### Method B: Run It In Browser DevTools Console

If you are following the code samples, they are usually meant to be run in the browser console, not in your system terminal.

Also note that browser `fetch()` usually follows redirects automatically. So if the login state is invalid, you may not see a raw `302` in JavaScript. Instead, the request may end up on the login page and then fail when you try to parse HTML as JSON.

Steps:

1. Open the Launcher page, for example `http://127.0.0.1:18800/`.
2. Press `F12` to open DevTools.
3. Switch to the `Console` tab.
4. If Chrome blocks the first paste, type `allow pasting` manually and press Enter.
5. Then paste and run the following code.

```javascript
const response = await fetch('/api/pico/token');

if (response.redirected) {
  throw new Error(`Request was redirected to ${response.url}. Log in to Launcher / Dashboard first.`);
}

if (response.status === 401) {
  throw new Error('You need to log in to Launcher / Dashboard first');
}

if (!response.ok) {
  throw new Error(`Failed to get Pico token: ${response.status}`);
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`Expected JSON from /api/pico/token, got ${contentType || 'unknown content type'}`);
}

const data = await response.json();
console.log(data);
```

If the console prints something like this, the step succeeded:

```json
{
  "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "ws_url": "ws://127.0.0.1:18800/pico/ws",
  "enabled": true
}
```

If `enabled` is `false`, the Pico WebSocket channel has not been enabled yet.

### Step 3: Open The WebSocket Connection

Connection URL:

```text
<ws_url>?session_id=<your_session_id>
```

Subprotocol:

```text
token.<pico_token>
```

We recommend generating your own stable and traceable `session_id`, such as `browser-demo` or `node-test-001`.

## Browser Integration Examples

Native browser `WebSocket` usually cannot customize the `Authorization` header, so browser clients should log in to Launcher first and then rely on the same-origin cookie during the handshake.

That same-origin requirement matters. The browser examples in this section are valid when your code runs on the Launcher page origin. They are not drop-in examples for a third-party web app hosted on another origin.

### Chrome Extensions Need Extra Care

If you are developing a Chrome extension, distinguish between these two execution contexts:

- A script injected into the Launcher page
- The extension's own `popup`, `side panel`, or `service worker`

The first case behaves much more like a normal page script and is the easiest way to reuse the Launcher page login state.

The second case comes from `chrome-extension://...`, which is not the same origin as Launcher. That means even if you already logged in to Launcher in the browser, you should not assume that `fetch('/api/pico/token')` inside the extension popup will work the same way as in a normal page.

If your goal is protocol debugging or quick testing, prefer one of these approaches:

1. Open DevTools directly on the Launcher page and run the sample code there.
2. Let the extension inject a test script into the Launcher page instead of trying to connect directly from the extension popup.

### Minimal Connect Example

```javascript
const response = await fetch('/api/pico/token');

if (response.redirected) {
  throw new Error(`Request was redirected to ${response.url}. Log in to Launcher first.`);
}

if (response.status === 401) {
  throw new Error('Launcher login state is invalid');
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`Expected JSON from /api/pico/token, got ${contentType || 'unknown content type'}`);
}

const { token, ws_url, enabled } = await response.json();

if (!enabled) {
  throw new Error('Pico WebSocket channel is not enabled');
}

const sessionId = 'browser-demo';
const ws = new WebSocket(
  `${ws_url}?session_id=${encodeURIComponent(sessionId)}`,
  [`token.${token}`],
);

ws.onopen = () => {
  console.log('WebSocket connected');
};

ws.onmessage = (event) => {
  console.log('Received message:', JSON.parse(event.data));
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket closed');
};
```

### What To Do After Connecting

Explaining only how to connect is not enough. After the handshake succeeds, you should at least know how to send one message and where to look for the response.

This is a minimal interactive flow:

```javascript
const response = await fetch('/api/pico/token');

if (response.redirected) {
  throw new Error(`Request was redirected to ${response.url}. Log in to Launcher first.`);
}

if (response.status === 401) {
  throw new Error('Launcher login state is invalid');
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`Expected JSON from /api/pico/token, got ${contentType || 'unknown content type'}`);
}

const { token, ws_url, enabled } = await response.json();

if (!enabled) {
  throw new Error('Pico WebSocket channel is not enabled');
}

const sessionId = 'browser-demo';
const ws = new WebSocket(
  `${ws_url}?session_id=${encodeURIComponent(sessionId)}`,
  [`token.${token}`],
);

ws.onopen = () => {
  console.log('connected');

  ws.send(JSON.stringify({
    type: 'message.send',
    id: `req-${Date.now()}`,
    session_id: sessionId,
    timestamp: Date.now(),
    payload: {
      content: 'Hello PicoClaw!',
    },
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('server -> client', message);
};
```

Watch for two things:

1. Whether `connected` appears in the Console first.
2. Whether the server sends back messages such as `typing.start`, `message.create`, `message.update`, `error`, or `pong`.

To test heartbeat, you can also send:

```javascript
ws.send(JSON.stringify({
  type: 'ping',
  id: `ping-${Date.now()}`,
  timestamp: Date.now(),
  payload: {},
}));
```

Normally you should receive `pong`.

### A More Complete Browser Example

```javascript
class PicoClawClient {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.ws = null;
  }

  async connect() {
    const response = await fetch('/api/pico/token');

    if (response.redirected) {
      throw new Error(`Request was redirected to ${response.url}. Log in to Launcher / Dashboard first.`);
    }

    if (response.status === 401) {
      throw new Error('You need to log in to Launcher / Dashboard first');
    }

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Expected JSON from /api/pico/token, got ${contentType || 'unknown content type'}`);
    }

    const { token, ws_url, enabled } = await response.json();

    if (!enabled) {
      throw new Error('Pico WebSocket channel is not enabled');
    }

    this.ws = new WebSocket(
      `${ws_url}?session_id=${encodeURIComponent(this.sessionId)}`,
      [`token.${token}`],
    );

    this.ws.onmessage = (event) => {
      console.log('Received message:', JSON.parse(event.data));
    };

    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error('WebSocket connection failed'));
    });
  }

  sendText(content) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.send(JSON.stringify({
      type: 'message.send',
      id: `req-${Date.now()}`,
      session_id: this.sessionId,
      timestamp: Date.now(),
      payload: { content },
    }));
  }

  ping() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.send(JSON.stringify({
      type: 'ping',
      id: `ping-${Date.now()}`,
      timestamp: Date.now(),
      payload: {},
    }));
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

const client = new PicoClawClient('browser-demo');
await client.connect();
client.sendText('Hello PicoClaw!');
client.ping();
```

## Non-Browser Client Notes

For Node.js, Python, desktop apps, or tools like Postman that do not automatically carry browser cookies, the current integration experience is much rougher and needs an explicit note.

### Current Observed Behavior

- If you request `/api/pico/token` without a valid Launcher login state, you will usually get a `302` redirect to the login page.
- In the "password-based startup login" case, the older documentation path that used `dashboardToken` directly is not a good general solution.
- In current testing, the handshake flow uses `session_id`; it is not a simple "get dashboardToken and connect blindly" model.
- In other words, non-browser clients are not yet a smooth standalone integration path in the current version. This still needs more design and cleanup.

### What To Do If You Get 302

`302` usually means Launcher thinks you are not logged in, or this client does not actually have a usable login session.

Do not just retry WebSocket immediately. Check these three things first:

1. You are using `18800`, not `18790`.
2. You have already logged in to Launcher in the browser.
3. Your non-browser client is actually sending the login state.

With the current implementation, the easiest thing to miss is the session cookie. The browser may already have `picoclaw_launcher_auth`, but your Node.js process does not inherit that cookie automatically.

### A Node.js Example That Better Matches Current Reality

This example demonstrates the "reuse the browser session cookie" idea instead of pretending `dashboardToken` alone covers all cases.

This is intentionally not presented as a supported end-to-end workflow, because the current docs do not define a clean, official way to export and reuse the browser session in a separate Node.js process. Treat the snippet below as a debugging sketch that explains why the request still gets `302`, not as a polished integration recipe.

```javascript
const fetch = require('node-fetch');
const WebSocket = require('ws');

async function connectPico() {
  const launcherBaseUrl = 'http://127.0.0.1:18800';
  const sessionId = 'node-demo';

  // Replace this with a valid Launcher session cookie only if you already have one
  // through your own debugging setup.
  // The current docs do not define an official cookie export workflow.
  const launcherCookie = 'picoclaw_launcher_auth=replace-with-real-cookie';

  const tokenResponse = await fetch(`${launcherBaseUrl}/api/pico/token`, {
    headers: {
      Cookie: launcherCookie,
    },
    redirect: 'manual',
  });

  if (tokenResponse.status === 302 || tokenResponse.status === 401) {
    throw new Error('Launcher auth failed: this client does not have a valid login session');
  }

  if (!tokenResponse.ok) {
    throw new Error(`Failed to get Pico token: ${tokenResponse.status}`);
  }

  const { token, ws_url, enabled } = await tokenResponse.json();

  if (!enabled) {
    throw new Error('Pico WebSocket channel is not enabled');
  }

  const ws = new WebSocket(
    `${ws_url}?session_id=${encodeURIComponent(sessionId)}`,
    [`token.${token}`],
    {
      headers: {
        Cookie: launcherCookie,
      },
    },
  );

  ws.on('open', () => {
    console.log('connected');
    ws.send(JSON.stringify({
      type: 'message.send',
      id: `req-${Date.now()}`,
      session_id: sessionId,
      timestamp: Date.now(),
      payload: {
        content: 'Hello from Node.js',
      },
    }));
  });

  ws.on('message', (data) => {
    console.log('server -> client', JSON.parse(data.toString()));
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}

connectPico().catch(console.error);
```

### Why This Section Is Intentionally Conservative

Because in the current version, the non-browser client path still has several real problems:

- Login state is much more natural inside the browser than outside it.
- The relationship between `session_id` and Launcher login state is not exposed clearly enough.
- When users hit `302`, they may understand they need to log in to Dashboard, but without a follow-up explanation of how to carry that login state into Node.js, they still get stuck.

So this document intentionally describes the current limitation and the failure mode, while also making it clear that the non-browser flow still needs follow-up design work.

## Development And Debugging Advice

If you are building an integration, do not start directly with Node.js or a desktop app. Debug in this order instead:

1. Log in to Launcher in the browser.
2. Confirm `GET /api/pico/token` returns JSON in the browser.
3. Complete one WebSocket connection in the browser DevTools `Console`.
4. Send one `message.send` and confirm you receive a response.
5. Only after the browser path works should you move on to non-browser session reuse.

The reason is simple: the browser already carries `picoclaw_launcher_auth`, which makes it much easier to separate auth issues from message protocol issues.

## Message Protocol

Common inbound message types (client -> server):

- `message.send`
- `media.send`
- `ping`

Common outbound message types (server -> client):

- `message.create`
- `message.update`
- `typing.start`
- `typing.stop`
- `error`
- `pong`

General message structure:

```json
{
  "type": "message.send",
  "id": "optional-id",
  "session_id": "optional-session-id",
  "timestamp": 0,
  "payload": {}
}
```

Minimal send example:

```json
{
  "type": "message.send",
  "id": "req-1",
  "payload": {
    "content": "hello"
  }
}
```

## Common Errors And Troubleshooting

| Problem | Common Cause | What To Do |
|------|----------|----------|
| `302` redirect to the login page or `/launcher-login` | Launcher auth failed; not logged in or login state was not carried over | First confirm the browser is logged in, then confirm the current client really sends the login state |
| `401 Unauthorized` | Wrong port, or current auth method is not accepted | Use `18800`, do not connect directly to `18790` |
| `403 Invalid Pico token` | `token.<...>` in `Sec-WebSocket-Protocol` is wrong | Call `GET /api/pico/token` again and use the latest token |
| `503 Gateway not available` | Gateway is not running or Launcher did not attach successfully | Check Gateway state and retry |
| Connection succeeds but nothing happens | Only the handshake completed; no `message.send` or `ping` was sent | Follow the interaction examples and send a message explicitly |
| Origin validation failed | `channels.pico.allow_origins` does not match the request origin | Configure allowed origins explicitly and avoid `*` |

## Ports And Tokens

### Ports

| Port | Purpose | Allow External Direct Access |
|------|------|------------------|
| `18800` | Launcher (Web UI + API + WebSocket proxy) | Yes, recommended |
| `18790` | Gateway (internal service) | No, not supported |

### Tokens / Session

| Name | Purpose | Notes |
|------|------|------|
| Dashboard Token | Log in to Launcher and access protected APIs | Useful as a Launcher login entry point, but should no longer be treated as the single credential for all client scenarios |
| `picoclaw_launcher_auth` | Launcher session cookie in the browser | Set by Launcher after login; browsers send it automatically on same-origin requests |
| Pico Token | WebSocket subprotocol authentication | Obtained from `GET /api/pico/token` |
| `session_id` | Session identifier for the current connection | Passed in the URL query, for example `?session_id=browser-demo` |

## Security Recommendations

1. Use HTTPS/WSS in production.
2. Do not expose Gateway port `18790`.
3. Do not enable `allow_token_query` by default.
4. Keep `allow_origins` as narrow as possible; do not use `*`.
5. Rotate Pico tokens regularly; you can regenerate them through `POST /api/pico/token`.
6. Keep Launcher bound locally whenever possible. If you need LAN or public exposure, pair it with `allowed_cidrs`.
7. Do not write tokens or session cookies into frontend persistence, browser logs, or plaintext server logs.

## Configuration Example

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "replace-with-strong-random-token",
      "allow_token_query": false,
      "allow_origins": ["https://your-app.example.com"],
      "max_connections": 100
    }
  }
}
```

## Recommendations For Third-Party Developers

At a minimum, cover this flow in automated tests:

1. Log in to Launcher
2. Get a Pico token
3. Open a WebSocket connection using `token.<token>`
4. Send `message.send`
5. Verify that you receive either a response or an error message

Once that flow is stable, move on to UI, session management, reconnection, and recovery strategies.

## Documentation Maintenance Advice

- Keep this WebSocket integration guidance as one primary document so that the general integration flow and the developer-focused caveats do not drift apart.
- If there are future changes around auth design discussion, Node.js-specific examples, or tutorial improvements, split them into separate PRs instead of mixing them together.

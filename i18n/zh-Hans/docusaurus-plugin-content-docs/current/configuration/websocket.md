---
id: websocket
title: 连接 WebSocket
---
## PicoClaw WebSocket 接入指南

> 适用范围：当前仓库实现（截至 2026-04-13）。
> 本文面向通过 Launcher 接入 PicoClaw WebSocket 的第三方开发者，包括浏览器插件、运行在 Launcher 同源下的前端页面、桌面客户端和服务端客户端。

从 v0.2.5 开始，PicoClaw WebSocket 连接需要双层校验。外部客户端应连接 Launcher 端口 `18800`，不要直接连 Gateway 端口 `18790`。

## 先记住三件事

1. 对外入口是 `ws(s)://<launcher-host>/pico/ws`。
2. 握手时既要通过 Launcher 登录态校验，也要提供 Pico token。
3. 浏览器最容易跑通，因为浏览器会自动带上登录后的会话 cookie。

## 版本策略

- 第三方集成请基于 release/tag 开发和测试。
- 不要基于 `main` 做生产集成，主线改动频繁，不保证兼容。
- 升级 PicoClaw 时，请同时固定 PicoClaw 版本和你依赖的文档版本。

建议在自己的项目中明确记录：

1. PicoClaw 的 tag 或发布版本
2. 当前接入文档对应的版本
3. 你支持的最小和最大 PicoClaw 版本区间

## 架构与鉴权模型

Launcher 模式下，连接路径为：

- 客户端 -> `ws(s)://<launcher-host>/pico/ws`
- Launcher -> 反向代理到 Gateway 的 Pico channel

当前是两层鉴权：

1. Launcher 鉴权层
   使用已登录会话，或服务端请求头中的 `Authorization: Bearer <dashboard_token>`。
2. Pico WebSocket 鉴权层
   使用 `Sec-WebSocket-Protocol: token.<pico_token>`。

关键点：

- `/pico/ws` 不是匿名 WebSocket，而是 Launcher 保护下的接口。
- Launcher 登录成功后会写入 `picoclaw_launcher_auth` cookie。
- `picoclaw_launcher_auth` 的作用是证明“这个浏览器已经登录过 Launcher”，从而通过第一层鉴权。
- 这个 cookie 是会话凭证，不需要你手动拼到浏览器代码里；浏览器会在同源请求时自动携带。
- Launcher 会把 `token.<raw_pico_token>` 转换成内部格式再转发到 Gateway，客户端无需关心 PID token 的拼装细节。

### 认证架构

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Launcher (18800)                         │
├─────────────────────────────────────────────────────────────────┤
│  第一层认证：Launcher 登录态                                     │
│  - 浏览器会话 cookie: picoclaw_launcher_auth                    │
│  - 或 Authorization: Bearer <dashboard_token>                   │
├─────────────────────────────────────────────────────────────────┤
│  第二层认证：Pico WebSocket 认证                                 │
│  - Sec-WebSocket-Protocol: token.<pico_token>                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Gateway (18790)                            │
│  Launcher 负责内部 token 转换与转发                              │
└─────────────────────────────────────────────────────────────────┘
```

## 标准接入流程

### 步骤 1：先登录 Launcher

浏览器用户最简单的方式是直接访问：

```text
http://your-host:18800?token=<dashboard_token>
```

也可以显式调用登录接口：

```http
POST /api/auth/login
Content-Type: application/json

{
  "token": "<dashboard_token>"
}
```

登录成功后，Launcher 会设置会话 cookie `picoclaw_launcher_auth`。之后这个浏览器访问 `/api/pico/token` 和 `/pico/ws` 时，就会自动带上登录态。

> `dashboard_token` 可通过以下方式获得：
> - 查看 Launcher 启动时的控制台输出
> - 设置环境变量 `PICOCLAW_LAUNCHER_TOKEN`
> - 在 `~/.picoclaw/launcher.json` 中配置

### 步骤 2：获取 Pico token 与 `ws_url`

这一步对普通用户最容易迷糊。实际要做的是：先在浏览器里登录 Launcher，然后在同一个浏览器页面里执行一段 `fetch` 代码，拿到 `token` 和 `ws_url`。

这里有个前提：下面这些浏览器示例默认你的代码运行在 Launcher 同源下，比如直接运行在 Launcher 页面里。如果你的前端页面部署在别的域名上，`/api/pico/token` 这个相对路径请求到的会是你自己的站点，而不是 Launcher。

#### 做法 A：直接在浏览器地址栏验证自己是否已登录

在浏览器打开：

```text
http://127.0.0.1:18800/api/pico/token
```

可能出现三种情况：

- 直接看到一段 JSON，说明你已经登录，继续下一步。
- 被重定向到登录页，说明还没有登录 Launcher，或者当前登录态已经失效。
- 返回 `401`，说明当前登录态无效或已经过期。

正常返回示例：

```json
{
  "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "ws_url": "ws://127.0.0.1:18800/pico/ws",
  "enabled": true
}
```

#### 做法 B：在浏览器开发者工具的 Console 里执行

如果你是按示例代码操作，通常是在浏览器控制台执行，而不是在系统终端执行。

还要注意一点：浏览器里的 `fetch()` 默认通常会自动跟随重定向。所以如果当前登录态无效，你在 JavaScript 里不一定能直接看到原始 `302`，更常见的是请求已经跳到了登录页，随后在 `response.json()` 这里因为拿到的是 HTML 而失败。

操作顺序：

1. 打开 Launcher 页面，例如 `http://127.0.0.1:18800/`。
2. 按 `F12` 打开开发者工具。
3. 切到 `Console` 标签。
4. 第一次粘贴代码时，如果浏览器阻止粘贴，先手动输入 `allow pasting` 并回车。
5. 再粘贴下面这段代码并执行。

```javascript
const response = await fetch('/api/pico/token');

if (response.redirected) {
  throw new Error(`请求被重定向到了 ${response.url}，需要先登录 Launcher / Dashboard`);
}

if (response.status === 401) {
  throw new Error('需要先登录 Launcher / Dashboard');
}

if (!response.ok) {
  throw new Error(`获取 Pico token 失败: ${response.status}`);
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`/api/pico/token 预期返回 JSON，实际是 ${contentType || '未知内容类型'}`);
}

const data = await response.json();
console.log(data);
```

控制台看到类似下面的输出，就说明这一步成功了：

```json
{
  "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "ws_url": "ws://127.0.0.1:18800/pico/ws",
  "enabled": true
}
```

如果 `enabled` 是 `false`，说明 Pico WebSocket 通道还没有启用。

### 步骤 3：建立 WebSocket 连接

连接地址：

```text
<ws_url>?session_id=<your_session_id>
```

子协议：

```text
token.<pico_token>
```

这里的 `session_id` 建议由你的客户端自己生成一个稳定、可追踪的值，例如 `browser-demo`、`node-test-001`。

## 浏览器接入示例

浏览器原生 `WebSocket` 通常不能自定义 `Authorization` 头，所以浏览器场景应先登录 Launcher，再依赖同源 cookie 完成握手。

这个“同源”前提很重要。本节里的浏览器示例适用于代码运行在 Launcher 页面同源下的情况，不是给任意第三方站点直接复制粘贴就能工作的通用跨域示例。

### Chrome 扩展要额外注意

如果你开发的是 Chrome 扩展，需要区分两类运行环境：

- 扩展注入到 Launcher 页面里的脚本
- 扩展自己的 `popup`、`side panel`、`service worker`

前者更接近普通网页脚本，最容易直接复用 Launcher 页面的登录态。

后者的来源是 `chrome-extension://...`，不等同于 Launcher 同源页面。也就是说，即使你已经在浏览器里登录了 Launcher，也不能想当然地认为扩展 `popup` 里的 `fetch('/api/pico/token')` 会像普通网页一样自然工作。

如果你的目标只是做联调或抓协议，推荐优先使用两种方式：

1. 直接在 Launcher 页面里打开开发者工具执行示例代码。
2. 让扩展把测试脚本注入到 Launcher 页面里运行，而不是直接在扩展 `popup` 中建连。


### 最小连接示例

```javascript
const response = await fetch('/api/pico/token');

if (response.redirected) {
  throw new Error(`请求被重定向到了 ${response.url}，需要先登录 Launcher`);
}

if (response.status === 401) {
  throw new Error('Launcher 登录态无效');
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`/api/pico/token 预期返回 JSON，实际是 ${contentType || '未知内容类型'}`);
}

const { token, ws_url, enabled } = await response.json();

if (!enabled) {
  throw new Error('Pico WebSocket 通道未启用');
}

const sessionId = 'browser-demo';
const ws = new WebSocket(
  `${ws_url}?session_id=${encodeURIComponent(sessionId)}`,
  [`token.${token}`],
);

ws.onopen = () => {
  console.log('WebSocket 已连接');
};

ws.onmessage = (event) => {
  console.log('收到消息:', JSON.parse(event.data));
};

ws.onerror = (error) => {
  console.error('WebSocket 错误:', error);
};

ws.onclose = () => {
  console.log('WebSocket 已关闭');
};
```

### 建连后怎么交互

前面只讲“怎么连上”是不够的。连上后，你至少还需要会发送一条消息，并知道去哪里看返回内容。

下面这段代码包含了一个最小可交互流程：

```javascript
const response = await fetch('/api/pico/token');

if (response.redirected) {
  throw new Error(`请求被重定向到了 ${response.url}，需要先登录 Launcher`);
}

if (response.status === 401) {
  throw new Error('Launcher 登录态无效');
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`/api/pico/token 预期返回 JSON，实际是 ${contentType || '未知内容类型'}`);
}

const { token, ws_url, enabled } = await response.json();

if (!enabled) {
  throw new Error('Pico WebSocket 通道未启用');
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

你需要观察两个地方：

1. Console 中是否先出现 `connected`。
2. 发送后是否收到服务端返回的消息，例如`typing.start`、`message.create`、`message.update`、`error` 或 `pong`。

如果要测试心跳，也可以发送：

```javascript
ws.send(JSON.stringify({
  type: 'ping',
  id: `ping-${Date.now()}`,
  timestamp: Date.now(),
  payload: {},
}));
```

正常情况下你会收到 `pong`。

### 一个更完整的浏览器示例

```javascript
class PicoClawClient {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.ws = null;
  }

  async connect() {
    const response = await fetch('/api/pico/token');

    if (response.redirected) {
      throw new Error(`请求被重定向到了 ${response.url}，需要先登录 Launcher / Dashboard`);
    }

    if (response.status === 401) {
      throw new Error('需要先登录 Launcher / Dashboard');
    }

    if (!response.ok) {
      throw new Error(`获取 token 失败: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`/api/pico/token 预期返回 JSON，实际是 ${contentType || '未知内容类型'}`);
    }

    const { token, ws_url, enabled } = await response.json();

    if (!enabled) {
      throw new Error('Pico WebSocket 通道未启用');
    }

    this.ws = new WebSocket(
      `${ws_url}?session_id=${encodeURIComponent(this.sessionId)}`,
      [`token.${token}`],
    );

    this.ws.onmessage = (event) => {
      console.log('收到消息:', JSON.parse(event.data));
    };

    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error('WebSocket 连接失败'));
    });
  }

  sendText(content) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未连接');
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
      throw new Error('WebSocket 未连接');
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

## 非浏览器客户端说明

对于 Node.js、Python、桌面端或 Postman 这类不能自动携带浏览器 cookie 的客户端，当前接入体验明显更差，这里需要特别说明。

### 当前实测现状

- 直接请求 `/api/pico/token` 时，如果没有 Launcher 登录态，通常会收到 `302` 并跳转到登录页。
- 在“启动时使用密码登录”的场景下，旧文档中直接使用 `dashboardToken` 的方式并不适合作为通用方案。
- 当前实测流程里，握手参数使用的是 `session_id`，不是“拿到 dashboardToken 就能无脑建连”的模型。
- 也就是说，非浏览器客户端在当前版本下并不是一个足够顺手的独立接入路径，这部分后续还需要继续梳理和改进。

### 如果你拿到了 302，下一步该做什么

`302` 的含义通常是：Launcher 认为你还没有登录，或者你当前这个客户端没有可用的登录会话。

这时不要直接继续重试 WebSocket。应先确认下面三件事：

1. 你访问的是 `18800`，不是 `18790`。
2. 你已经在浏览器里成功登录 Launcher。
3. 你这个非浏览器客户端是否真的把登录态带上了。

当前实现下，如果你是在浏览器里登录成功，再去做 Node.js 调试，最容易遗漏的就是会话 cookie。浏览器里已经有 `picoclaw_launcher_auth`，但你的 Node.js 进程默认并不会自动继承这个 cookie。

### 当前更接近真实情况的 Node.js 示例

下面的示例演示的是“复用浏览器里已有的会话 cookie”这一思路，而不是继续假设只靠 `dashboardToken` 就能覆盖所有情况。

这里要说清楚：下面这段并不是一个官方支持、可直接照抄落地的完整流程。当前文档并没有定义“如何把浏览器登录态规范地导出并复用到另一个 Node.js 进程”这件事，所以这段代码更适合作为解释当前失败模式的调试草图，而不是成熟的接入方案。

```javascript
const fetch = require('node-fetch');
const WebSocket = require('ws');

async function connectPico() {
  const launcherBaseUrl = 'http://127.0.0.1:18800';
  const sessionId = 'node-demo';

  // 这里只能在你已经通过自己的调试手段拿到有效 Launcher 会话 cookie 时替换。
  // 当前文档并没有定义官方的 cookie 导出工作流。
  const launcherCookie = 'picoclaw_launcher_auth=replace-with-real-cookie';

  const tokenResponse = await fetch(`${launcherBaseUrl}/api/pico/token`, {
    headers: {
      Cookie: launcherCookie,
    },
    redirect: 'manual',
  });

  if (tokenResponse.status === 302 || tokenResponse.status === 401) {
    throw new Error('Launcher 鉴权失败：当前客户端没有有效登录会话');
  }

  if (!tokenResponse.ok) {
    throw new Error(`获取 Pico token 失败: ${tokenResponse.status}`);
  }

  const { token, ws_url, enabled } = await tokenResponse.json();

  if (!enabled) {
    throw new Error('Pico WebSocket 通道未启用');
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
    console.error('WebSocket 错误:', err);
  });
}

connectPico().catch(console.error);
```

### 这部分文档为什么写得这么保守

因为当前版本下，非浏览器客户端这一段仍然存在几个现实问题：

- 登录态建立在浏览器里更自然，脱离浏览器后复用会话不够直观。
- `session_id` 和 Launcher 登录态的关系对外暴露得不够清晰。
- 用户遇到 `302` 后，虽然知道要去登录 Dashboard，但文档若不继续说明“如何把登录态带到 Node.js 里”，就会卡住。

因此这里先把当前限制和实际失败方式讲清楚，同时明确这块仍需后续讨论和改进。

## 开发与调试建议

如果你正在做接入开发，建议先按下面顺序调试，而不是一上来就直接写 Node.js 或桌面端代码：

1. 先用浏览器登录 Launcher。
2. 在浏览器里确认 `GET /api/pico/token` 能返回 JSON。
3. 在浏览器开发者工具的 `Console` 中完成一次 WebSocket 建连。
4. 主动发送一条 `message.send`，确认能收到回包。
5. 浏览器链路跑通后，再去处理非浏览器客户端如何复用登录态。

这样做的原因很直接：浏览器会自动携带 `picoclaw_launcher_auth`，最容易把“是鉴权问题，还是消息协议问题”分开排查。

## 消息协议

常见入站消息类型（客户端 -> 服务端）：

- `message.send`
- `media.send`
- `ping`

常见出站消息类型（服务端 -> 客户端）：

- `message.create`
- `message.update`
- `typing.start`
- `typing.stop`
- `error`
- `pong`

通用消息结构：

```json
{
  "type": "message.send",
  "id": "optional-id",
  "session_id": "optional-session-id",
  "timestamp": 0,
  "payload": {}
}
```

最小发送示例：

```json
{
  "type": "message.send",
  "id": "req-1",
  "payload": {
    "content": "hello"
  }
}
```

## 常见错误与排查

| 问题 | 常见原因 | 处理方式 |
|------|----------|----------|
| `302` 跳转到登录页或 `/launcher-login` | Launcher 鉴权失败，未登录或会话未带上 | 先确认浏览器已登录，再确认当前客户端确实带上了登录态 |
| `401 Unauthorized` | 连错端口，或当前鉴权方式不被接受 | 改连 `18800`，不要直连 `18790` |
| `403 Invalid Pico token` | `Sec-WebSocket-Protocol` 中的 `token.<...>` 不正确 | 重新调用 `GET /api/pico/token` 获取最新 token |
| `503 Gateway not available` | Gateway 未运行或 Launcher 未成功附着 | 检查 Gateway 状态后再重试 |
| 建连成功但不会交互 | 只完成握手，没有发送 `message.send` 或 `ping` | 按本文交互示例主动发送消息，观察回包 |
| Origin 校验失败 | `channels.pico.allow_origins` 与请求来源不匹配 | 显式配置允许的 origin，避免使用 `*` |

## 端口与 Token 说明

### 端口

| 端口 | 用途 | 是否允许外部直连 |
|------|------|------------------|
| `18800` | Launcher（Web UI + API + WebSocket 代理） | 是，推荐 |
| `18790` | Gateway（内部服务） | 否，不支持 |

### Token / 会话

| 名称 | 用途 | 说明 |
|------|------|------|
| Dashboard Token | 登录 Launcher、访问受保护 API | 适合做 Launcher 登录入口，但不应再被理解成“覆盖所有客户端场景的唯一凭证” |
| `picoclaw_launcher_auth` | 浏览器中的 Launcher 会话 cookie | 登录成功后由 Launcher 设置，浏览器同源请求会自动带上 |
| Pico Token | WebSocket 子协议认证 | 通过 `GET /api/pico/token` 获取 |
| `session_id` | 当前连接的会话标识 | 建连时放在 URL 查询参数中，例如 `?session_id=browser-demo` |

## 安全建议

1. 生产环境使用 HTTPS/WSS。
2. 不要暴露 Gateway 端口 `18790`。
3. 不要默认开启 `allow_token_query`。
4. `allow_origins` 应使用最小允许集合，不要直接使用 `*`。
5. 定期轮换 Pico token，可通过 `POST /api/pico/token` 重新生成。
6. Launcher 尽量保持本地监听；如需公网或局域网暴露，请配合 `allowed_cidrs`。
7. 不要把 token 或会话 cookie 写入前端持久化存储、浏览器日志或服务端明文日志。

## 配置示例

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

## 对第三方开发者的建议

在自动化测试中，至少覆盖以下流程：

1. 登录 Launcher
2. 获取 Pico token
3. 使用 `token.<token>` 建立 WebSocket 连接
4. 主动发送 `message.send`
5. 验证收到回包或错误消息

当以上流程稳定后，再继续实现 UI、会话管理、重连和错误恢复策略。

## 文档维护建议

- 这一类 websocket 接入说明，最好继续维持为一篇主文档，避免“普通接入流程”和“开发者补充说明”分散后互相漂移。
- 如果后续还有鉴权设计讨论、Node.js 专项示例修正、接入教程补充，建议分别拆成不同 PR，不要混在同一个 PR 里。

---
id: heartbeat
title: Heartbeat (Periodic Tasks)
---

# Heartbeat

PicoClaw can perform periodic tasks automatically. Create a `HEARTBEAT.md` file in your workspace:

```markdown
# Periodic Tasks

- Check my email for important messages
- Review my calendar for upcoming events
- Check the weather forecast
```

The agent reads this file every 30 minutes (configurable) and executes any tasks using available tools.

## Configuration

```json
{
  "heartbeat": {
    "enabled": true,
    "interval": 30
  }
}
```

| Option | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | Enable/disable heartbeat |
| `interval` | `30` | Check interval in minutes (min: 5) |

**Environment variables:**
- `PICOCLAW_HEARTBEAT_ENABLED=false` — disable heartbeat
- `PICOCLAW_HEARTBEAT_INTERVAL=60` — change interval

## Async Tasks with Spawn

For long-running tasks (web search, API calls), use the `spawn` tool to create a **subagent**:

```markdown
# Periodic Tasks

## Quick Tasks (respond directly)

- Report current time

## Long Tasks (use spawn for async)

- Search the web for AI news and summarize
- Check email and report important messages
```

**Key behaviors:**

| Feature | Description |
| --- | --- |
| **spawn** | Creates async subagent, doesn't block heartbeat |
| **Independent context** | Subagent has its own context, no session history |
| **message tool** | Subagent communicates with user directly |
| **Non-blocking** | After spawning, heartbeat continues to next task |

## How Subagent Communication Works

```
Heartbeat triggers
    ↓
Agent reads HEARTBEAT.md
    ↓
For long task: spawn subagent
    ↓                           ↓
Continue to next task      Subagent works independently
    ↓                           ↓
All tasks done            Subagent uses "message" tool
    ↓                           ↓
Respond HEARTBEAT_OK      User receives result directly
```

The subagent has access to tools (message, web_search, etc.) and communicates with the user independently without going through the main agent.

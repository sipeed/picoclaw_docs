---
id: spawn-tasks
title: Spawn & Async Tasks
---

# Spawn & Async Tasks

PicoClaw supports asynchronous task execution via the **spawn** tool. This lets the main agent delegate long-running work to independent subagents while continuing to process other tasks.

## How It Works

The **heartbeat** system periodically checks `workspace/HEARTBEAT.md` for scheduled tasks.

- **Quick tasks** are handled inline by the main agent.
- **Long tasks** are delegated to a subagent via `spawn`.
- The **subagent** has its own independent context and communicates results back using the `message` tool.

### Flow Diagram

```
Heartbeat triggers
      │
      ▼
Agent reads HEARTBEAT.md
      │
      ├── Quick task ──► Handle inline ──► Continue to next task
      │
      └── Long task  ──► spawn subagent ──► Continue to next task
                              │
                              ▼
                     Subagent works independently
                              │
                              ▼
                     Subagent uses message tool
                              │
                              ▼
                     User receives result
```

## Configuration

Add the `heartbeat` section to your `~/.picoclaw/config.json`:

```json
{
  "heartbeat": {
    "enabled": true,
    "interval": 30
  }
}
```

| Option     | Type    | Default | Description                                      |
|------------|---------|---------|--------------------------------------------------|
| `enabled`  | boolean | `true`  | Enable or disable the heartbeat system.          |
| `interval` | integer | `30`    | Check interval in minutes. Minimum value is `5`. |

## Environment Variables

| Variable                       | Description                          |
|--------------------------------|--------------------------------------|
| `PICOCLAW_HEARTBEAT_ENABLED`   | Override `heartbeat.enabled` config. |
| `PICOCLAW_HEARTBEAT_INTERVAL`  | Override `heartbeat.interval` config.|

:::tip
Set the interval to a lower value (e.g. `5`) during development to iterate faster on scheduled tasks.
:::

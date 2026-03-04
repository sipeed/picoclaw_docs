---
id: index
title: Configuration Overview
sidebar_label: Overview
---

# Configuration

Config file: `~/.picoclaw/config.json`

## Sections

| Section | Purpose |
| --- | --- |
| `agents.defaults` | Default agent settings (model, workspace, limits) |
| `model_list` | LLM provider definitions |
| `channels` | Chat app integrations |
| `tools` | Web search, exec, cron, skills, MCP |
| `heartbeat` | Periodic task settings |
| `gateway` | HTTP gateway host/port |
| `devices` | USB device monitoring |

## Workspace Layout

PicoClaw stores data in your configured workspace (default: `~/.picoclaw/workspace`):

```
~/.picoclaw/workspace/
├── sessions/          # Conversation sessions and history
├── memory/            # Long-term memory (MEMORY.md)
├── state/             # Persistent state (last channel, etc.)
├── cron/              # Scheduled jobs database
├── skills/            # Custom skills
├── AGENTS.md          # Agent behavior guide
├── HEARTBEAT.md       # Periodic task prompts (checked every 30 min)
├── IDENTITY.md        # Agent identity
├── SOUL.md            # Agent soul
├── TOOLS.md           # Tool descriptions
└── USER.md            # User preferences
```

## Environment Variables

Most config values can be set via environment variables using the pattern `PICOCLAW_<SECTION>_<KEY>` in UPPER_SNAKE_CASE:

```bash
export PICOCLAW_AGENTS_DEFAULTS_MODEL_NAME=my-model
export PICOCLAW_HEARTBEAT_ENABLED=false
export PICOCLAW_HEARTBEAT_INTERVAL=60
export PICOCLAW_AGENTS_DEFAULTS_RESTRICT_TO_WORKSPACE=false
```

### Special Environment Variables

| Variable | Description |
| --- | --- |
| `PICOCLAW_HOME` | Override PicoClaw home directory (default: `~/.picoclaw`) |
| `PICOCLAW_CONFIG` | Override config file path |

## Quick Links

- [Model Configuration (model_list)](./model-list.md) — add LLM providers
- [Security Sandbox](./security-sandbox.md) — workspace restrictions
- [Heartbeat](./heartbeat.md) — periodic tasks
- [Tools Configuration](./tools.md) — web search, exec, cron
- [Full Config Reference](./config-reference.md) — complete annotated example

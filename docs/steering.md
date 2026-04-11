---
id: steering
title: Steering
---

# Steering

Steering allows you to inject messages into a running agent loop between tool calls. This is useful when you need to redirect the agent, provide new context, or cancel an in-progress plan — without waiting for the current turn to finish.

## How It Works

After each tool completes, PicoClaw checks a per-session steering queue. If one or more messages are found:

1. **Remaining queued tools are skipped** — their results are replaced with a placeholder.
2. **Steering messages are injected** into the conversation as user messages.
3. **The model is called again** with the updated context.

### Flow Diagram

```
Agent loop running
      │
      ▼
Tool N completes
      │
      ▼
Check steering queue ──── empty ──► continue to Tool N+1
      │
      │ (messages found)
      ▼
Skip remaining tools
      │
      ▼
Inject steering messages into conversation
      │
      ▼
Call LLM with updated context
      │
      ▼
Agent loop continues with new direction
```

## Scoped Queues

Steering queues are **isolated per resolved session scope** — they are not global. Each active session maintains its own queue, so steering messages sent to one session will never leak into another.

## Configuration

Steering mode is configured under `agents.defaults.steering_mode`:

| Value | Behavior |
|-------|----------|
| `"one-at-a-time"` (default) | Dequeues one message per poll cycle. |
| `"all"` | Drains the entire queue at once. |

You can also set this via environment variable:

```bash
export PICOCLAW_AGENTS_DEFAULTS_STEERING_MODE=all
```

## Polling Points

PicoClaw checks the steering queue at four points during the agent loop:

1. **At loop start** — before any tool is executed.
2. **After every tool** — the primary interception point.
3. **After a direct LLM response** — when the model responds without tool calls.
4. **Before turn finalized** — last chance before the turn result is returned.

## Why Remaining Tools Are Skipped

When a steering message arrives mid-turn, all tools that have not yet started are skipped. This is intentional for three reasons:

| Reason | Example |
|--------|---------|
| **Preventing unwanted side effects** | The user says "stop, don't delete that" — but a `file_delete` tool is still queued. Skipping prevents irreversible damage. |
| **Avoiding wasted time** | The agent planned 5 API calls, but the user's steering message makes them irrelevant. Skipping saves latency and cost. |
| **LLM gets full context** | The model sees the steering message alongside prior results and can make a better-informed decision about what to do next. |

### Skipped Tool Result Format

Tools that are skipped due to steering have their result set to:

```
Skipped due to queued user message.
```

This appears in the conversation history so the LLM understands that those tools were not executed.

## Full Flow Example

```
Agent receives: "Search for config files and then delete any temp files."
      │
      ▼
Tool 1: search_files("*.conf")  ──► completes, returns results
      │
      ▼
Check steering queue ──► user sent: "Actually, don't delete anything."
      │
      ▼
Tool 2: delete_files("*.tmp")   ──► SKIPPED ("Skipped due to queued user message.")
Tool 3: delete_files("*.bak")   ──► SKIPPED ("Skipped due to queued user message.")
      │
      ▼
Inject steering message: "Actually, don't delete anything."
      │
      ▼
LLM sees: search results + skipped tools + user correction
      │
      ▼
LLM responds: "Understood, I found 3 config files but won't delete anything."
```

## Automatic Bus Drain

When the agent is busy processing a turn, a background goroutine automatically consumes inbound messages from the bus and places them into the steering queue. This ensures that messages sent while the agent is working are not lost.

Key details:

- **Audio is transcribed first** — voice messages are converted to text before being queued.
- **Scope-aware** — messages are routed to the correct session's steering queue based on their scope.

## Steering with Media

Steering messages may contain `media://` references. These are preserved in the queue and resolved through the normal media pipeline when the message is injected into the conversation.

## Notes

- **Maximum queue size is 10.** Messages beyond this limit are dropped with a warning log.
- **Steering does not interrupt a currently executing tool.** The tool must complete (or time out) before the steering queue is checked.

---
id: cron
title: Scheduled Tasks & Cron Jobs
---

# Scheduled Tasks & Cron Jobs

PicoClaw stores scheduled jobs in the current workspace and can run them either as agent turns, direct deliveries, or shell commands.

## Schedule Types

The cron tool supports three schedule forms:

| Type | Description | One-time? |
|------|-------------|-----------|
| `at_seconds` | Fires once, relative to now. The job is deleted after it runs. | Yes |
| `every_seconds` | Recurring interval, in seconds. | No |
| `cron_expr` | Standard cron expression (e.g. `0 9 * * *`). | No |

### Priority

When multiple schedule fields are provided, the tool uses this priority order: `at_seconds` > `every_seconds` > `cron_expr`.

### CLI Usage

The CLI command `picoclaw cron add` supports recurring jobs only:

- `--every <seconds>` -- recurring interval
- `--cron '<expr>'` -- cron expression

There is no CLI flag for a one-time `at` job today. One-time jobs can only be created through the agent tool.

**Examples:**

```bash
picoclaw cron add --name "Daily summary" --message "Summarize today's logs" --cron "0 18 * * *"
picoclaw cron add --name "Ping" --message "heartbeat" --every 300 --deliver
```

## Execution Modes

Jobs are stored with a message payload and can execute in three modes:

### Agent Turn (`deliver: false`)

This is the **default** mode for the cron tool.

When the job fires, PicoClaw sends the saved message back through the agent loop as a new agent turn. Use this for scheduled work that may need reasoning, tools, or a generated reply.

### Direct Delivery (`deliver: true`)

When the job fires, PicoClaw publishes the saved message directly to the target channel and recipient without agent processing.

The CLI `picoclaw cron add --deliver` flag uses this mode.

### Command Execution

When a cron job includes a `command` field, PicoClaw runs that shell command through the `exec` tool and publishes the command output back to the channel.

For command jobs:
- `deliver` is forced to `false` when the job is created
- The saved `message` becomes descriptive text only; the scheduled action is the shell command
- Command jobs require an internal channel
- The current CLI `picoclaw cron add` command does not expose a `command` flag

## Tool Actions

The agent-facing cron tool supports these actions:

| Action | Description | Required Parameters |
|--------|-------------|---------------------|
| `add` | Create a new scheduled job | `message`, plus one of `at_seconds` / `every_seconds` / `cron_expr` |
| `list` | List all enabled scheduled jobs | -- |
| `remove` | Remove a job by ID | `job_id` |
| `enable` | Enable a disabled job | `job_id` |
| `disable` | Disable a job (keeps it in the store) | `job_id` |

### Tool Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | `add`, `list`, `remove`, `enable`, or `disable` |
| `message` | string | For `add` | The reminder/task message to display when triggered |
| `command` | string | No | Shell command to execute directly |
| `command_confirm` | boolean | No | Explicit confirmation flag for scheduling a shell command |
| `at_seconds` | integer | No | One-time: seconds from now (e.g. `600` for 10 minutes) |
| `every_seconds` | integer | No | Recurring interval in seconds (e.g. `3600` for every hour) |
| `cron_expr` | string | No | Cron expression (e.g. `0 9 * * *`) |
| `job_id` | string | For `remove`/`enable`/`disable` | Target job ID |

## Configuration & Security

### `tools.cron`

| Config | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | bool | `true` | Register the agent-facing cron tool |
| `allow_command` | bool | `true` | Allow command jobs without extra confirmation |
| `exec_timeout_minutes` | int | `5` | Timeout for scheduled command execution (0 = no limit) |

If you disable `tools.cron.enabled`, users can no longer create or manage jobs through the agent tool. The gateway still starts the CronService, but it does not install the job execution callback. As a result, due jobs do not actually run; one-time jobs may be deleted and recurring jobs may be rescheduled without executing their payload.

### `tools.exec` dependency

Scheduled command jobs depend on `tools.exec.enabled` (default: `true`).

If `tools.exec.enabled` is `false`:
- New command jobs are rejected by the cron tool
- Existing command jobs publish a "command execution is disabled" error when they fire

### `allow_command` behavior

`tools.cron.allow_command` defaults to `true`. This is not a hard disable switch. If you set `allow_command` to `false`, PicoClaw still allows a command job when the caller explicitly passes `command_confirm: true`.

Command jobs also require an internal channel. Non-command reminders do not have that restriction.

**Example configuration:**

```json
{
  "tools": {
    "cron": {
      "enabled": true,
      "exec_timeout_minutes": 5,
      "allow_command": true
    },
    "exec": {
      "enabled": true
    }
  }
}
```

## Persistence & Storage

Cron jobs are stored in:

```
<workspace>/cron/jobs.json
```

By default, the workspace is:

```
~/.picoclaw/workspace
```

If `PICOCLAW_HOME` is set, the default workspace becomes:

```
$PICOCLAW_HOME/workspace
```

Both the gateway and `picoclaw cron` CLI subcommands use the same `cron/jobs.json` file.

### Storage behavior

- One-time `at_seconds` jobs are deleted after they run
- Recurring jobs stay in the store until explicitly removed
- Disabled jobs stay in the store and still appear in `picoclaw cron list`

## Job Lifecycle

```
Job created (enabled=true)
      |
      v
CronService computes nextRunAtMS
      |
      v
Timer fires when nextRunAtMS is reached
      |
      +-- at (one-time) ------> Execute -> Delete job
      |
      +-- every / cron -------> Execute -> Recompute nextRunAtMS
```

Each job tracks execution state:

| Field | Description |
|-------|-------------|
| `nextRunAtMs` | Next scheduled execution time |
| `lastRunAtMs` | Last execution start time |
| `lastStatus` | `ok` or `error` |
| `lastError` | Error message from last failed execution |

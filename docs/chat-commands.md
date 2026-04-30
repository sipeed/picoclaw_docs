---
id: chat-commands
title: Chat Command Reference
sidebar_label: Chat Command Reference
---

PicoClaw supports interacting with the Agent through chat commands.
> PicoClaw chat commands are defined centrally under `pkg/commands` and are handled by the Agent when a message starts with a command prefix.

Supported prefixes:

- `/` e.g. `/help`
- `!` e.g. `!help`

Telegram-style `/command@botname` is also normalized to the command name.

## Command List

### `/start`

Starts or greets the bot. It replies with "Hello! I am PicoClaw 🦞".

Usage: `/start`

### `/help`

Shows all available commands with short descriptions.

Usage: `/help`

### `/show [model|channel|agents|mcp <server>]`

Shows current configuration or runtime information.

**Subcommands:**

| Subcommand | Description |
|---|---|
| `/show model` | Shows the current model and provider. |
| `/show channel` | Shows the current channel. |
| `/show agents` | Shows registered agents. |
| `/show mcp <server>` | Shows active tools for a specified MCP server. |

### `/list [models|channels|agents|skills|mcp]`

Lists available options or configured resources.

**Subcommands:**

| Subcommand | Description |
|---|---|
| `/list models` | Shows the configured model and provider information. |
| `/list channels` | Lists enabled channels. |
| `/list agents` | Lists registered agents. |
| `/list skills` | Lists installed skills and hints how to use `/use`. |
| `/list mcp` | Lists configured MCP servers, enabled/deferred/connected status, and active tool count. |

### `/use <skill> [message]`

Forces use of a specific installed skill.

**Usage patterns:**

| Pattern | Behavior |
|---|---|
| `/use <skill> <message>` | Uses the specified skill for this message. |
| `/use <skill>` | Arms the skill for the next normal message. |
| `/use clear` or `/use off` | Clears the pending skill override. |

### `/btw <question>`

Asks a side question without changing the current session history. Useful for temporary or interrupting questions.

Usage: `/btw <question>`

Example: `/btw what is 2+2?`

### `/switch model to <name>`

Switches the model used by the current Agent.

Usage: `/switch model to <name>`

:::note
`/switch channel` has been migrated to `/check channel`.
:::

### `/check channel <name>`

Checks whether a channel is available and enabled.

Usage: `/check channel <name>`

### `/clear`

Clears the chat history for the current session.

Usage: `/clear`

Reply: `Chat history cleared!`

### `/context`

Shows current session context and token usage, including message count, used tokens, total context window, compression threshold, compression progress, and remaining tokens.

Usage: `/context`

### `/subagents`

Shows running subagents or the active task tree in the current session. If none are running, it reports that no active tasks exist.

Usage: `/subagents`

### `/reload`

Reloads the configuration file.

Usage: `/reload`

Reply: `Config reload triggered!` or an error message.

## Implementation Locations

| Area | Path |
|---|---|
| Command definitions | `pkg/commands/builtin.go` and `pkg/commands/cmd_*.go` |
| Command parsing | `pkg/commands/request.go` |
| Command execution | `pkg/commands/executor.go` |
| Agent integration | `pkg/agent/agent_command.go` |
| Top-level CLI subcommands | `cmd/picoclaw/main.go` |

## Additional: Top-level CLI Subcommands

Besides chat slash commands, the `picoclaw` binary also provides Cobra CLI subcommands, including:

`picoclaw onboard` · `picoclaw agent` · `picoclaw auth` · `picoclaw gateway` · `picoclaw status` · `picoclaw cron` · `picoclaw mcp` · `picoclaw migrate` · `picoclaw skills` · `picoclaw model` · `picoclaw update` · `picoclaw version`

These CLI commands and chat commands are separate entry points: CLI commands run in the terminal, while chat commands are triggered through channel messages such as Telegram, Feishu, WeChat, etc.

---
id: exec
title: Command Execution Settings
---

# Command Execution Settings Guide

PicoClaw provides two key settings to control command execution permissions, helping you balance functionality and security.

## Overview

| Setting | Config Path | Default | Description |
|--------|------------|--------|-------------|
| Enable Command Execution | `tools.exec.enabled` | `true` | Globally controls whether command execution is allowed |
| Allow Remote Command Execution | `tools.exec.allow_remote` | `true` | Controls whether remote sessions can execute commands |
| Dangerous Pattern Blocking | `tools.exec.enable_deny_patterns` | `true` | Enables the built-in safety guard that blocks dangerous shell patterns |
| Custom Deny Patterns | `tools.exec.custom_deny_patterns` | `[]` | Additional regex patterns to block |
| Custom Allow Patterns | `tools.exec.custom_allow_patterns` | `[]` | Regex patterns that exempt commands from deny checks |
| Execution Timeout | `tools.exec.timeout_seconds` | `60` | Per-command timeout in seconds (0 = use default 60 s) |

## Enable Command Execution

### Description

Controls whether the application is allowed to execute commands. When disabled, all command requests will be rejected.

### Configuration

**Via configuration file:**

```json
{
  "tools": {
    "exec": {
      "enabled": false
    }
  }
}
```

**Via environment variable:**

```bash
export PICOCLAW_TOOLS_EXEC_ENABLED=false
```


### Use Cases
| Scenario                                                         | Recommended Setting                 |
| ---------------------------------------------------------------- | ----------------------------------- |
| Production / read-only mode                                      | `enabled: false`                    |
| Development with automation                                      | `enabled: true`                     |
| High-security environments                                       | `enabled: false`                    |

### Impact

When this setting is disabled:

- Agents cannot run shell commands through the `exec` tool
- Shell commands in cron tasks cannot run
- All command requests are rejected immediately

## Allow Remote Command Execution

### Description

When enabled, command execution is allowed for remote sessions and non-local contexts. When disabled, only trusted local contexts can execute commands.

### Configuration

**Via configuration file:**

```json
{
  "tools": {
    "exec": {
      "allow_remote": false
    }
  }
}
```

**Via environment variable:**

```bash
export PICOCLAW_TOOLS_EXEC_ALLOW_REMOTE=false
```

### Use Cases

| Scenario                                                         | Recommended Setting                 |
| ---------------------------------------------------------------- | ----------------------------------- |
| Local-only usage                                                 | `allow_remote: false`               |
| Remote channels (Telegram, Discord, etc.) need command execution | `allow_remote: true`                |
| Multi-user remote access                                         | `allow_remote: false` (more secure) |

### Security Context
| Context Type          | Description                                           |
| --------------------- | ----------------------------------------------------- |
| Local trusted context | Commands executed directly in a local terminal or CLI |
| Remote session        | Requests from Telegram, Discord, WeChat, etc.         |
| Non-local context     | HTTP API calls, Webhook triggers, etc.                |

## Dangerous Pattern Blocking (`enable_deny_patterns`)

When `enable_deny_patterns: true` (the default), PicoClaw applies a set of built-in regex rules to every command before execution. **This check runs independently of the `enabled` and `allow_remote` switches** — turning those on does not disable pattern blocking.

The full list of blocked patterns includes:

| Category | Examples |
|----------|----------|
| Bulk deletion | `rm -rf`, `del /f/q`, `rmdir /s` |
| Disk operations | `format`, `mkfs`, `diskpart`, `dd if=`, writes to block devices (`/dev/sd*`, `/dev/hd*`, `/dev/vd*`, `/dev/xvd*`, `/dev/nvme*`, `/dev/mmcblk*`, `/dev/loop*`, `/dev/dm-*`, `/dev/md*`, `/dev/sr*`, `/dev/nbd*`) |
| System control | `shutdown`, `reboot`, `poweroff` |
| Fork bomb | `:(){ :\|:& };:` |
| **Shell substitution** | **`$(...)`, `${...}`, backticks**, `$(cat ...)`, `$(curl ...)`, `$(wget ...)`, `$(which ...)` |
| Chained deletion | `; rm -rf`, `&& rm -rf`, `\|\| rm -rf` |
| Pipe to shell | `\| sh`, `\| bash` |
| Heredoc | `<< EOF` |
| Privilege escalation | `sudo`, `chmod NNN` (numeric mode), `chown` |
| Process control | `pkill`, `killall`, `kill` |
| Remote code execution | `curl \| sh`, `wget \| sh`, `ssh user@host` |
| Package managers | `apt install/remove/purge`, `yum install/remove`, `dnf install/remove`, `npm install -g`, `pip install --user` |
| Containers | `docker run`, `docker exec` |
| Git mutations | `git push`, `git force` |
| Other | `eval`, `source *.sh` |

:::caution Common False Positive: Shell Variable Syntax
The rule `\$\{[^\}]+\}` blocks **any** command containing `${...}`, including legitimate bash default-value syntax like `${VAR:-default}`. This is a known trade-off — the pattern was added to prevent variable injection attacks.

Error message you will see:
```
Command blocked by safety guard (dangerous pattern detected)
```

Example command that triggers it:
```bash
echo "HOST=${AIEXCEL_API_HOST:-未设置}"
```

See [Allowing Specific Patterns](#allowing-specific-patterns) below for solutions.
:::

### Disabling Pattern Blocking Entirely

:::warning
Disabling `enable_deny_patterns` removes **all** 41 built-in safety rules, including `rm -rf` and `sudo`. Only do this in fully controlled, trusted environments.
:::

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": false
    }
  }
}
```

Environment variable:
```bash
export PICOCLAW_TOOLS_EXEC_ENABLE_DENY_PATTERNS=false
```

## Allowing Specific Patterns

Use `custom_allow_patterns` to exempt specific commands from deny checks **without disabling the entire safety guard**. A command matching any allow pattern bypasses all deny pattern checks.

> **WebUI**: In the "Command Allowlist" text box, enter one regex per line using single backslashes (no double-escaping needed as in JSON).

### Example 1: Allow bash default-value variable syntax

This is the fix for `${VAR:-default}` being blocked:

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": [
        "\\$\\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\\}"
      ]
    }
  }
}
```

WebUI allowlist field:
```
\$\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\}
```

This pattern only allows `${VAR:-fallback}` syntax. Commands that use `${}` for actual command injection (e.g., `${evil_cmd}`) are still blocked because they do not match the `:-` form.

### Example 2: Allow `git push` to a specific remote

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": [
        "\\bgit\\s+push\\s+origin\\b"
      ]
    }
  }
}
```

`git push origin main` is allowed; `git push upstream main` is still blocked.

### Example 3: Allow running Python scripts

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": [
        "^python3?\\s+[^\\s|;&`]+\\.py\\b"
      ]
    }
  }
}
```

:::note
Allow patterns are matched against the **lowercased** command string. The check runs before all deny patterns — if a command matches any allow pattern, deny patterns are skipped entirely for that command.
:::

## Combined Usage Examples

### Scenario 1: Fully Disable Command Execution

Suitable for high-security, read-only environments:
```json
{
  "tools": {
    "exec": {
      "enabled": false
    }
  }
}
```
**Effect:** All command requests are rejected, both local and remote.

### Scenario 2: Allow Local Execution Only

Suitable when local automation is needed but remote command execution is not allowed:
```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "allow_remote": false
    }
  }
}
```
**Effect:**

- Local terminal commands can execute
- Remote channel requests (Telegram, Discord, etc.) are rejected

### Scenario 3: Fully Open (Default)

Suitable for development environments or trusted networks:
```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "allow_remote": true
    }
  }
}
```
**Effect:** Both local and remote command execution are allowed.

## Working with Other Security Settings

| Setting                    | Config Path                             | Description                       |
| -------------------------- | --------------------------------------- | --------------------------------- |
| Workspace Restriction      | `agents.defaults.restrict_to_workspace` | Limits command execution paths    |
| Dangerous Command Blocking | `tools.exec.enable_deny_patterns`       | Blocks dangerous command patterns |
| Custom Deny Patterns       | `tools.exec.custom_deny_patterns`       | Adds custom blocking rules        |
| Custom Allow Patterns      | `tools.exec.custom_allow_patterns`      | Exempts specific commands from deny checks |

### Complete Security Configuration Example

```json
{
  "agents": {
    "defaults": {
      "restrict_to_workspace": true
    }
  },
  "tools": {
    "exec": {
      "enabled": true,
      "allow_remote": false,
      "enable_deny_patterns": true,
      "custom_deny_patterns": [
        "\\brm\\s+-rf\\b",
        "\\bsudo\\b"
      ],
      "custom_allow_patterns": [
        "\\$\\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\\}"
      ]
    }
  }
}
```
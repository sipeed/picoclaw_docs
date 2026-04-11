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
      ]
    }
  }
}
```
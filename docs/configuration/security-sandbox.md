---
id: security-sandbox
title: Security Sandbox
---

# Security Sandbox

PicoClaw runs in a sandboxed environment by default. The agent can only access files and execute commands within the configured workspace.

## Default Configuration

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.picoclaw/workspace",
      "restrict_to_workspace": true
    }
  }
}
```

| Option | Default | Description |
| --- | --- | --- |
| `workspace` | `~/.picoclaw/workspace` | Working directory for the agent |
| `restrict_to_workspace` | `true` | Restrict file/command access to workspace |
| `allow_read_outside_workspace` | `false` | Allow file reads outside workspace even when restricted |

## Protected Tools

When `restrict_to_workspace: true`, the following tools are sandboxed:

| Tool | Function | Restriction |
| --- | --- | --- |
| `read_file` | Read files | Only files within workspace |
| `write_file` | Write files | Only files within workspace |
| `list_dir` | List directories | Only directories within workspace |
| `edit_file` | Edit files | Only files within workspace |
| `append_file` | Append to files | Only files within workspace |
| `exec` | Execute commands | Command paths must be within workspace |

## Additional Exec Protection

Even with `restrict_to_workspace: false`, the `exec` tool blocks these dangerous commands:

- `rm -rf`, `del /f`, `rmdir /s` — Bulk deletion
- `format`, `mkfs`, `diskpart` — Disk formatting
- `dd if=` — Disk imaging
- Writing to block devices (`/dev/sd*`, `/dev/hd*`, `/dev/nvme*`, `/dev/mmcblk*`, `/dev/loop*`, etc.) — Direct disk writes
- `shutdown`, `reboot`, `poweroff` — System shutdown
- Fork bomb `:(){ :|:& };:`

### Error Examples

```
[ERROR] tool: Tool execution failed
{tool=exec, error=Command blocked by safety guard (path outside working dir)}
```

```
[ERROR] tool: Tool execution failed
{tool=exec, error=Command blocked by safety guard (dangerous pattern detected)}
```

## Disabling Restrictions

:::warning Security Risk
Disabling this restriction allows the agent to access any path on your system. Use with caution in controlled environments only.
:::

**Method 1: Config file**

```json
{
  "agents": {
    "defaults": {
      "restrict_to_workspace": false
    }
  }
}
```

**Method 2: Environment variable**

```bash
export PICOCLAW_AGENTS_DEFAULTS_RESTRICT_TO_WORKSPACE=false
```

## Security Boundary Consistency

The `restrict_to_workspace` setting applies consistently across all execution paths:

| Execution Path | Security Boundary |
| --- | --- |
| Main Agent | `restrict_to_workspace` ✅ |
| Subagent / Spawn | Inherits same restriction ✅ |
| Heartbeat tasks | Inherits same restriction ✅ |

All paths share the same workspace restriction — there's no way to bypass the security boundary through subagents or scheduled tasks.

## Channel Access Control (`allow_from`)

Each channel supports an `allow_from` array that restricts which users can interact with the bot:

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "allow_from": ["123456789"]
    }
  }
}
```

| Value | Behavior |
| --- | --- |
| `[]` (empty) | Allow everyone (a security warning is logged at startup) |
| `["user1", "user2"]` | Allow only the listed user IDs |
| `["*"]` | Allow everyone (explicit wildcard, acknowledges open access) |

:::warning Open Access
Using `"*"` or an empty `allow_from` array means **anyone** can interact with your bot. Use this only when you intentionally want public access. PicoClaw logs a security warning at startup if `allow_from` is empty.
:::

## .security.yml

Config schema `2` supports a `.security.yml` file for storing sensitive credentials (API keys, tokens, secrets) separately from `config.json`. This file should be placed in the same directory as `config.json` (typically `~/.picoclaw/.security.yml`) and added to `.gitignore`.

Values from `.security.yml` are automatically mapped to the corresponding fields at load time. If a field exists in both files, `.security.yml` takes precedence.

For `model_list` in schema `2`, `config.json` `api_key` is ignored. Use `.security.yml` with `api_keys` for model credentials.

```bash
chmod 600 ~/.picoclaw/.security.yml
```

See [`.security.yml` Reference](./security-reference.md) for field-by-field mapping and merge rules, and [Credential Encryption](../credential-encryption.md) for details on encrypted value formats.

## Safe Paths

The following paths are always accessible regardless of workspace restriction:

- `/dev/null`, `/dev/zero`, `/dev/random`, `/dev/urandom`
- `/dev/stdin`, `/dev/stdout`, `/dev/stderr`

---
id: isolation
title: Subprocess Isolation
---

# Subprocess Isolation

PicoClaw can run the child processes it spawns inside a per-instance isolated environment. This applies to:

- the `exec` tool
- CLI-based providers (`claude-cli`, `codex-cli`, etc.)
- process-based hooks
- MCP `stdio` servers

The PicoClaw main process itself **is not** sandboxed — only the children it launches are.

Isolation is **off by default** so existing installations keep their current behavior. Enable it explicitly when you want a stronger boundary between the agent's tool calls and the host filesystem.

:::caution Linux requires bubblewrap
The Linux backend depends on `bwrap` (the `bubblewrap` package). There is no automatic fallback if `bwrap` is missing — startup will fail. Install it with your package manager:

- Debian/Ubuntu: `apt install bubblewrap`
- Fedora/RHEL: `dnf install bubblewrap`
- Arch: `pacman -S bubblewrap`
- Alpine: `apk add bubblewrap`
:::

## Configuration

Add an `isolation` block to `~/.picoclaw/config.json`:

```json
{
  "isolation": {
    "enabled": false,
    "expose_paths": []
  }
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Enable subprocess isolation |
| `expose_paths` | array | `[]` | Host paths to expose into the isolated environment (Linux only) |

### `expose_paths` entries

```json
{
  "source": "/opt/toolchains/go",
  "target": "/opt/toolchains/go",
  "mode": "ro"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `source` | string | Yes | Host path to make visible inside the isolated environment |
| `target` | string | No | Path inside the isolated environment. Defaults to `source` when omitted. |
| `mode` | string | Yes | `ro` (read-only) or `rw` (read-write) |

Rules:

- Only one final rule may exist for the same `target` — later config overrides earlier rules
- `expose_paths` is **Linux only**; Windows configuration with `expose_paths` will fail to start

### Example

```json
{
  "isolation": {
    "enabled": true,
    "expose_paths": [
      {
        "source": "/opt/toolchains/go",
        "target": "/opt/toolchains/go",
        "mode": "ro"
      },
      {
        "source": "/data/shared-assets",
        "target": "/opt/picoclaw-instance-a/workspace/assets",
        "mode": "rw"
      }
    ]
  }
}
```

## How It Works

The implementation has four layers:

1. **Configuration layer** — reads `isolation` from your config and registers it at runtime
2. **Instance layout layer** — resolves `PICOCLAW_HOME` (or `~/.picoclaw`), prepares instance directories, builds a per-instance user environment
3. **Platform backend** — Linux uses `bwrap`; Windows uses a restricted token, low integrity, and a Job Object; macOS and other platforms are not implemented
4. **Unified startup** — every code path that spawns a child process goes through `PrepareCommand` / `Start` / `Run` instead of calling `cmd.Start` directly

When isolation is enabled, child processes get a redirected per-instance user environment:

- **Linux**: `HOME`, `TMPDIR`, `XDG_CONFIG_HOME`, `XDG_CACHE_HOME`, `XDG_STATE_HOME`
- **Windows**: `USERPROFILE`, `HOME`, `TEMP`, `TMP`, `APPDATA`, `LOCALAPPDATA`

These all point inside the `runtime-user-env/` directory under the PicoClaw instance root. The agent's tools and CLI providers will see this environment instead of your normal user environment.

## Platform Behavior

### Linux (bubblewrap)

- Minimal filesystem view via `bwrap`
- IPC namespace isolation
- Read-only or read-write `source -> target` bind mounts
- Default mounts include the instance root plus `/usr`, `/bin`, `/lib`, `/lib64`, and `/etc/resolv.conf`
- PicoClaw also auto-mounts the executable path, its directory, the working directory, and absolute path arguments where needed

The Linux backend does **not** currently enable a dedicated PID namespace by default.

### Windows

- Restricted primary token
- Low integrity level
- Process inside a Job Object
- Redirected per-instance user environment

Windows isolation does **not** implement true `source -> target` filesystem remapping. Setting `expose_paths` on Windows will fail at startup.

### macOS and Other Platforms

Not implemented yet. If you set `enabled: true` on an unsupported platform, the runtime should surface this as an unsupported configuration rather than silently pretending isolation succeeded.

## Logging and Debugging

When isolation is enabled, PicoClaw logs the generated isolation plan at startup:

- **Linux**: log entry named `linux isolation mount plan`
- **Windows**: log entry named `windows isolation access rules`

If you suspect isolation is leaking, check whether unexpected host paths show up in those logs.

## Relationship to `restrict_to_workspace`

`restrict_to_workspace` and `isolation` solve different problems and complement each other:

| | `restrict_to_workspace` | `isolation` |
| --- | --- | --- |
| **Layer** | Tool-call validation | OS-level subprocess sandbox |
| **What it blocks** | File paths the agent is *allowed to ask for* | What a child process can *actually see* |
| **Enforcement** | Inside the picoclaw process | bwrap / Job Object |
| **Bypass risk** | A buggy tool may forget to validate | Enforced by the kernel |

Use both for defense in depth.

## Current Limits

- Linux backend uses `bwrap`, not a custom in-process sandbox
- Linux does not enable a dedicated PID namespace by default
- Windows does not yet implement full host ACL enforcement for every allowed/denied path
- macOS is not implemented
- Only child processes are isolated; the PicoClaw main process is not

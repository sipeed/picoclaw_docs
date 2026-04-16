---
id: cli-parameters
title: CLI Commands and Parameters
---

# CLI Commands and Parameters

## Core CLI Commands

| Command | Description |
| --- | --- |
| `picoclaw onboard` | Initialize config and workspace |
| `picoclaw agent -m "hello"` | One-shot chat |
| `picoclaw agent` | Interactive chat mode |
| `picoclaw gateway` | Start the gateway (for chat apps) |
| `picoclaw status` | Show status |
| `picoclaw cron list` | List all scheduled jobs |
| `picoclaw cron add ...` | Add a scheduled job |

## `picoclaw-launcher` Parameters

| Parameter | Description | Example |
| --- | --- | --- |
| `-console` | Run in terminal mode (no tray GUI), prints login hint/token source in console startup output | `picoclaw-launcher -console` |
| `-public` | Listen on `0.0.0.0`, allow LAN devices to access WebUI | `picoclaw-launcher -public` |
| `-no-browser` | Do not auto-open browser on startup | `picoclaw-launcher -no-browser` |
| `-port &lt;port&gt;` | Specify launcher port (default `18800`) | `picoclaw-launcher -port 19999` |
| `-lang &lt;en|zh&gt;` | Set launcher UI language | `picoclaw-launcher -lang zh` |
| `[config.json]` | Optional positional config path | `picoclaw-launcher ./config.json` |

Common combinations:

```bash
# Headless/SSH server: run in console mode and expose to LAN
picoclaw-launcher -console -no-browser -public

# Custom port with explicit config file
picoclaw-launcher -port 19999 ./config.json
```

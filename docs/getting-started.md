---
id: getting-started
title: Getting Started
---

# Getting Started

Get PicoClaw running in 2 minutes.

## Default Setup Path (Recommended): WebUI

For most users, the default setup path is **WebUI via Launcher** (not manual JSON editing).

1. Run initialization once:

```bash
picoclaw onboard
```

2. Start the WebUI launcher:

```bash
picoclaw-launcher
```

3. Open `http://localhost:18800` and complete setup in the UI:
- Add at least one LLM model and set it as default
- Configure web search (recommended before first real chat; see next section)
- Start Gateway from the launcher dashboard

![WebUI](/img/picoclaw-launcher.png)

## Web Search Setup

Without web search, many real tasks (latest news, links, fact checking) are hard to use.
Configure one search engine during initial setup.

### Option A: WebUI configuration (recommended)

In Launcher WebUI, open tool settings and enable web search provider(s):
- [`Brave Search`](https://brave.com/search/api) (best default; free tier available)
- [`DuckDuckGo`](https://duckduckgo.com/) fallback (no key required)
- [`Baidu Search`](https://www.baidu.com/) (1000 free queries/day; better for Mainland China content)

### Option B: `config.json` + `.security.yml` (schema v2 default)

In schema v2, keep structure in `config.json` and store real keys in `.security.yml`.

Edit `~/.picoclaw/config.json`:

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": true,
        "max_results": 5
      }
    }
  }
}
```

Then put secrets in `~/.picoclaw/.security.yml`:

```yaml
web:
  brave:
    api_keys:
      - "YOUR_BRAVE_API_KEY"
```

Get keys:
- [Brave Search API](https://brave.com/search/api) (2000 free queries/month)
- [Tavily API](https://tavily.com) (1000 free queries/month)
- [Baidu Search](https://www.baidu.com/) (1000 free queries/day; better for Mainland China content)

## Model Setup (If You Prefer JSON)

If you prefer manual config, use `config.json` + `.security.yml`:

```json
{
  "version": 2,
  "agents": {
    "defaults": {
      "workspace": "~/.picoclaw/workspace",
      "model_name": "gpt-5.4",
      "max_tokens": 32768,
      "max_tool_iterations": 50
    }
  },
  "model_list": [
    {
      "model_name": "ark-code-latest",
      "model": "volcengine/ark-code-latest"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6"
    }
  ]
}
```

`~/.picoclaw/.security.yml`:

```yaml
model_list:
  ark-code-latest:0:
    api_keys:
      - "sk-your-volcengine-key"
  gpt-5.4:0:
    api_keys:
      - "sk-your-openai-key"
  claude-sonnet-4.6:0:
    api_keys:
      - "sk-your-anthropic-key"
```

See [Model Configuration](./configuration/model-list.md) for all supported providers.
See [`.security.yml Reference`](./configuration/security-reference.md) for secret mapping rules.

## CLI Reference

| Command | Description |
| --- | --- |
| `picoclaw onboard` | Initialize config and workspace |
| `picoclaw agent -m "hello"` | One-shot chat |
| `picoclaw agent` | Interactive chat mode |
| `picoclaw gateway` | Start the gateway (for chat apps) |
| `picoclaw status` | Show status |
| `picoclaw cron list` | List all scheduled jobs |
| `picoclaw cron add ...` | Add a scheduled job |

## Web UI (`picoclaw-launcher`)

Double-click `picoclaw-launcher` (or `picoclaw-launcher.exe` on Windows) to open WebUI at `http://localhost:18800`.

`picoclaw-launcher-tui` is no longer maintained and is being phased out. Prefer `picoclaw-launcher`.

### Web UI `picoclaw-launcher` parameters

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

## Scheduled Tasks

PicoClaw supports reminders and recurring tasks via the `cron` tool:

- **One-time**: "Remind me in 10 minutes"
- **Recurring**: "Remind me every 2 hours"
- **Cron expressions**: "Remind me at 9am daily"

Jobs are stored in `~/.picoclaw/workspace/cron/` and processed automatically.

## Run on Android (Termux)

Give your old phone a second life as an AI assistant:

```bash
wget https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz
tar xzf picoclaw_Linux_arm64.tar.gz
pkg install proot
termux-chroot ./picoclaw onboard
```

![PicoClaw running in Termux](https://github.com/sipeed/picoclaw/raw/main/assets/termux.jpg)

## Troubleshooting

### Web search says "API key configuration issue"

This is normal if you have not configured a search API key yet.

To enable web search:

1. **Option 1 (Recommended)**: Get a free API key at [https://brave.com/search/api](https://brave.com/search/api) (2000 free queries/month).
2. **Option 2 (No Credit Card)**: Use [**DuckDuckGo**](https://duckduckgo.com/) fallback (no key required).
3. **Option 3 (For Mainland China content)**: Use [**Baidu Search**](https://www.baidu.com/) (1000 free queries/day).

### Content filtering errors

Some providers (like Zhipu) have content filtering. Try rephrasing your query or use a different model.

### Telegram bot "Conflict: terminated by other getUpdates"

Only one `picoclaw gateway` instance should run at a time. Stop any other instances.

## API Key Comparison

| Service | Free Tier | Use Case |
| --- | --- | --- |
| **OpenRouter** | 200K tokens/month | Multiple models (Claude, GPT-4, etc.) |
| **Volcengine CodingPlan** | ¥9.9/first month | Best for Chinese users, multiple SOTA models (Doubao, DeepSeek, etc.) |
| **Zhipu** | 200K tokens/month | For Chinese users |
| [**Brave Search**](https://brave.com/search/api) | 2000 queries/month | Web search functionality |
| [**Tavily**](https://tavily.com) | 1000 queries/month | AI Agent optimized search |
| [**Baidu Search**](https://www.baidu.com/) | 1000 queries/day | Better coverage for Mainland China content |
| **Groq** | Free tier | Fast inference (Llama, Mixtral) |
| **Cerebras** | Free tier | Fast inference (Llama, Qwen) |

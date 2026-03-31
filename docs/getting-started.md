---
id: getting-started
title: Getting Started
---

# Getting Started

Get PicoClaw running in 2 minutes.

:::tip API Keys
Set your API Key in `~/.picoclaw/config.json`. Get API Keys: [Volcengine (CodingPlan)](https://console.volcengine.com) (LLM) · [OpenRouter](https://openrouter.ai/keys) (LLM) · [Zhipu](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys) (LLM). Web search is **optional** — get a free [Tavily API](https://tavily.com) (1000 free queries/month) or [Brave Search API](https://brave.com/search/api) (2000 free queries/month).
:::

## Step 1: Initialize

```bash
picoclaw onboard
```

This creates your workspace at `~/.picoclaw/` and generates a default config file.

## Step 2: Configure

Edit `~/.picoclaw/config.json`:

```json
{
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
      "model": "volcengine/ark-code-latest",
      "api_key": "sk-your-api-key"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "your-api-key"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6",
      "api_key": "your-anthropic-key"
    }
  ]
}
```

See [Model Configuration](./configuration/model-list.md) for all supported providers.

## Step 3: Chat

```bash
# One-shot chat
picoclaw agent -m "What is 2+2?"

# Interactive mode
picoclaw agent
```

That's it! You have a working AI assistant.

## CLI Reference

| Command | Description |
| --- | --- |
| `picoclaw onboard` | Initialize config and workspace |
| `picoclaw agent -m "..."` | One-shot chat |
| `picoclaw agent` | Interactive chat mode |
| `picoclaw gateway` | Start the gateway (for chat apps) |
| `picoclaw status` | Show status |
| `picoclaw cron list` | List all scheduled jobs |
| `picoclaw cron add ...` | Add a scheduled job |

## Launcher (Visual Setup)

Don't want to edit JSON by hand? The release package includes two launchers — just double-click to run:

### Web Launcher (`picoclaw-launcher`)

Double-click `picoclaw-launcher` (or `picoclaw-launcher.exe` on Windows), it opens a browser-based setup UI at `http://localhost:18800`.

From the UI you can:
- **Add models** — card-style model management, set primary model, no API key = grayed out
- **Configure channels** — form-based setup for Telegram, Discord, Slack, WeCom, etc.
- **OAuth login** — one-click login for OpenAI, Anthropic, Google Antigravity
- **Start/stop gateway** — manage the `picoclaw gateway` process directly

To allow access from other devices on the LAN (e.g., configure from your phone):

```bash
./picoclaw-launcher -public
```

### TUI Launcher (`picoclaw-launcher-tui`)

For headless environments (SSH, embedded devices), run `picoclaw-launcher-tui` in your terminal. It provides a menu-driven interface for model selection, channel setup, starting agent/gateway, and viewing logs.

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

This is normal if you haven't configured a search API key yet. PicoClaw will provide helpful links for manual searching.

To enable web search:

1. **Option 1 (Recommended)**: Get a free API key at [https://brave.com/search/api](https://brave.com/search/api) (2000 free queries/month) for the best results.
2. **Option 2 (No Credit Card)**: If you don't have a key, we automatically fall back to **DuckDuckGo** (no key required).

Add the key to `~/.picoclaw/config.json` if using Brave:

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": false,
        "api_key": "YOUR_BRAVE_API_KEY",
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
| **Brave Search** | 2000 queries/month | Web search functionality |
| **Tavily** | 1000 queries/month | AI Agent optimized search |
| **Groq** | Free tier | Fast inference (Llama, Mixtral) |
| **Cerebras** | Free tier | Fast inference (Llama, Qwen) |

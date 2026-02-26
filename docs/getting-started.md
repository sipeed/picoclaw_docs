---
id: getting-started
title: Getting Started
---

# Getting Started

Get PicoClaw running in 2 minutes.

:::tip API Keys
Get free API keys: [OpenRouter](https://openrouter.ai/keys) (200K tokens/month) · [Zhipu](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys) (200K tokens/month)
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
      "model": "gpt4",
      "max_tokens": 8192,
      "temperature": 0.7,
      "max_tool_iterations": 20
    }
  },
  "model_list": [
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.2",
      "api_key": "your-api-key"
    },
    {
      "model_name": "claude",
      "model": "anthropic/claude-sonnet-4-6",
      "api_key": "your-anthropic-key"
    }
  ]
}
```

See [Model Configuration](./configuration/model-list) for all supported providers.

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

## Scheduled Tasks

PicoClaw supports reminders and recurring tasks via the `cron` tool:

- **One-time**: "Remind me in 10 minutes"
- **Recurring**: "Remind me every 2 hours"
- **Cron expressions**: "Remind me at 9am daily"

Jobs are stored in `~/.picoclaw/workspace/cron/` and processed automatically.

## Run on Android (Termux)

Give your old phone a second life as an AI assistant:

```bash
# Note: Replace v0.1.1 with the latest version from the Releases page
wget https://github.com/sipeed/picoclaw/releases/download/v0.1.1/picoclaw-linux-arm64
chmod +x picoclaw-linux-arm64
pkg install proot
termux-chroot ./picoclaw-linux-arm64 onboard
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
| **Zhipu** | 200K tokens/month | Best for Chinese users |
| **Brave Search** | 2000 queries/month | Web search functionality |
| **Groq** | Free tier | Fast inference (Llama, Mixtral) |
| **Cerebras** | Free tier | Fast inference (Llama, Qwen) |

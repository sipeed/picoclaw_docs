---
id: docker
title: Docker Deployment
---

# Docker Deployment

Run PicoClaw with Docker Compose without installing anything locally.

## Docker Compose Setup

```bash
# 1. Clone the repo
git clone https://github.com/sipeed/picoclaw.git
cd picoclaw

# 2. First run — auto-generates docker/data/config.json then exits
docker compose -f docker/docker-compose.yml --profile gateway up
# The container prints "First-run setup complete." and stops.

# 3. Set your API keys
vim docker/data/config.json   # Set provider API keys, bot tokens, etc.

# 4. Start
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

:::tip Docker Network
By default, the Gateway listens on `127.0.0.1`. Set `PICOCLAW_GATEWAY_HOST=0.0.0.0` in your environment or config.json to expose it to the Docker host network.
:::

:::note Gateway Profile
The `gateway` profile only serves the webhook handlers (including Pico when enabled) and health endpoints on the gateway port. It does not expose generic REST chat endpoints. The Launcher mode adds the browser UI on port 18800.
:::

:::info Restart Policy
The gateway and launcher services use `restart: unless-stopped` so they automatically restart after crashes or system reboots, unless explicitly stopped.
:::

## Launcher Mode (Web Console)

The Launcher provides a browser-based setup UI on port **18800**:

```bash
docker compose -f docker/docker-compose.yml --profile launcher up -d
```

Open `http://localhost:18800` to manage models, channels, and the gateway process.

:::warning Dashboard Token
The web console uses a dashboard token (generated in-memory per run unless `PICOCLAW_LAUNCHER_TOKEN` is set). Do not expose the launcher to untrusted networks or the public internet without adding your own auth layer (reverse proxy, VPN, etc.).
:::

## Agent Mode

```bash
# One-shot question
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent -m "What is 2+2?"

# Interactive mode
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent
```

## Update

```bash
docker compose -f docker/docker-compose.yml pull
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

## Quick Start

### 1. Initialize

```bash
picoclaw onboard
```

### 2. Configure `~/.picoclaw/config.json`

#### Model List

Add one or more model providers:

```json
{
  "model_list": [
    {
      "model_name": "ark-code-latest",
      "model": "volcengine/ark-code-latest",
      "api_key": "sk-your-volcengine-key"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "your-openai-key"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6",
      "api_key": "your-anthropic-key"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt-5.4"
    }
  }
}
```

#### Web Tools (Optional)

Configure a web search provider for the agent's search tool:

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "api_key": "YOUR_BRAVE_API_KEY",
        "max_results": 5
      },
      "tavily": {
        "enabled": false,
        "api_key": "YOUR_TAVILY_API_KEY",
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": false,
        "max_results": 5
      },
      "perplexity": {
        "enabled": false,
        "api_key": "YOUR_PERPLEXITY_API_KEY"
      },
      "searxng": {
        "enabled": false,
        "base_url": "http://localhost:8080"
      }
    }
  }
}
```

**Get API Keys:**

| Service | Link |
| --- | --- |
| Brave Search | [brave.com/search/api](https://brave.com/search/api) (2000 free queries/month) |
| Tavily | [tavily.com](https://tavily.com) (1000 free queries/month) |
| DuckDuckGo | No key required |
| Perplexity | [perplexity.ai](https://docs.perplexity.ai) |
| SearXNG | Self-hosted, see [docs.searxng.org](https://docs.searxng.org) |

### 3. Start Chatting

```bash
picoclaw agent -m "Summarize the latest Rust release notes"
```

---
id: config-reference
title: Full Configuration Reference
---

# Full Configuration Reference

Complete annotated `config.json` example. Copy from `config/config.example.json` in the repository.

`"version": 2` here means **config schema version 2**, not a product release version.

For day-to-day model management, Web UI is recommended. Use manual JSON editing for automation templates and advanced deployment workflows.

![Web UI Model Setup](/img/providers/webuimodel.png)

```json
{
  "version": 2,

  "agents": {
    "defaults": {
      "workspace": "~/.picoclaw/workspace",
      "restrict_to_workspace": true,
      "model_name": "gpt-5.4",
      "max_tokens": 32768,
      "max_tool_iterations": 50
    }
  },

  "model_list": [
    {
      "model_name": "ark-code-latest",
      "model": "volcengine/ark-code-latest",
      "api_keys": ["sk-your-volcengine-key"]
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-your-openai-key"],
      "api_base": "https://api.openai.com/v1"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_keys": ["sk-ant-your-key"],
      "api_base": "https://api.anthropic.com/v1"
    },
    {
      "model_name": "gemini",
      "model": "antigravity/gemini-2.0-flash",
      "auth_method": "oauth"
    },
    {
      "model_name": "deepseek",
      "model": "deepseek/deepseek-chat",
      "api_keys": ["sk-your-deepseek-key"]
    },
    {
      "model_name": "loadbalanced-gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key1"],
      "api_base": "https://api1.example.com/v1"
    },
    {
      "model_name": "loadbalanced-gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key2"],
      "api_base": "https://api2.example.com/v1"
    }
  ],

  "channels": {
    "telegram": {
      "enabled": false,
      "token": "YOUR_TELEGRAM_BOT_TOKEN",
      "base_url": "",
      "proxy": "",
      "allow_from": ["YOUR_USER_ID"],
      "reasoning_channel_id": ""
    },
    "discord": {
      "enabled": false,
      "token": "YOUR_DISCORD_BOT_TOKEN",
      "proxy": "",
      "allow_from": [],
      "group_trigger": {
        "mention_only": false
      },
      "reasoning_channel_id": ""
    },
    "qq": {
      "enabled": false,
      "app_id": "YOUR_QQ_APP_ID",
      "app_secret": "YOUR_QQ_APP_SECRET",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "maixcam": {
      "enabled": false,
      "host": "0.0.0.0",
      "port": 18790,
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "whatsapp": {
      "enabled": false,
      "bridge_url": "ws://localhost:3001",
      "use_native": false,
      "session_store_path": "",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "feishu": {
      "enabled": false,
      "app_id": "",
      "app_secret": "",
      "encrypt_key": "",
      "verification_token": "",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "dingtalk": {
      "enabled": false,
      "client_id": "YOUR_CLIENT_ID",
      "client_secret": "YOUR_CLIENT_SECRET",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "slack": {
      "enabled": false,
      "bot_token": "xoxb-YOUR-BOT-TOKEN",
      "app_token": "xapp-YOUR-APP-TOKEN",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "line": {
      "enabled": false,
      "channel_secret": "YOUR_LINE_CHANNEL_SECRET",
      "channel_access_token": "YOUR_LINE_CHANNEL_ACCESS_TOKEN",
      "webhook_path": "/webhook/line",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "onebot": {
      "enabled": false,
      "ws_url": "ws://127.0.0.1:3001",
      "access_token": "",
      "reconnect_interval": 5,
      "group_trigger_prefix": [],
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "wecom": {
      "enabled": false,
      "bot_id": "YOUR_BOT_ID",
      "secret": "YOUR_SECRET",
      "websocket_url": "wss://openws.work.weixin.qq.com",
      "send_thinking_message": true,
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "matrix": {
      "enabled": false,
      "homeserver": "https://matrix.org",
      "user_id": "@your-bot:matrix.org",
      "access_token": "YOUR_MATRIX_ACCESS_TOKEN",
      "device_id": "",
      "join_on_invite": true,
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "placeholder": {
        "enabled": true,
        "text": "Thinking..."
      },
      "reasoning_channel_id": ""
    }
  },

  "tools": {
    "web": {
      "brave": {
        "enabled": false,
        "api_keys": ["YOUR_BRAVE_API_KEY"],
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": true,
        "max_results": 5
      },
      "perplexity": {
        "enabled": false,
        "api_keys": ["pplx-xxx"],
        "max_results": 5
      },
      "proxy": ""
    },
    "mcp": {
      "enabled": false,
      "servers": {
        "context7": {
          "enabled": false,
          "type": "http",
          "url": "https://mcp.context7.com/mcp"
        },
        "filesystem": {
          "enabled": false,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
        },
        "github": {
          "enabled": false,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-github"],
          "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN" }
        }
      }
    },
    "cron": {
      "exec_timeout_minutes": 5
    },
    "exec": {
      "enable_deny_patterns": true,
      "custom_deny_patterns": [],
      "custom_allow_patterns": []
    },
    "skills": {
      "registries": {
        "clawhub": {
          "enabled": true,
          "base_url": "https://clawhub.ai",
          "search_path": "/api/v1/search",
          "skills_path": "/api/v1/skills",
          "download_path": "/api/v1/download"
        }
      }
    }
  },

  "heartbeat": {
    "enabled": true,
    "interval": 30
  },

  "devices": {
    "enabled": false,
    "monitor_usb": true
  },

  "gateway": {
    "host": "127.0.0.1",
    "port": 18790,
    "log_level": "warn"
  }
}
```

## Field Reference

### `version`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `version` | int | `0` | Config schema version. Current version is `2`. New configs should set this to `2`. |

### `agents.defaults`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `workspace` | string | `~/.picoclaw/workspace` | Working directory for the agent (respects `PICOCLAW_HOME`) |
| `restrict_to_workspace` | bool | `true` | Restrict file/command access to workspace |
| `allow_read_outside_workspace` | bool | `false` | Allow file reads outside workspace (when `restrict_to_workspace` is true) |
| `model_name` | string | — | Default model name (must match a `model_list` entry) |
| `model` | string | — | **Deprecated**: use `model_name` instead |
| `model_fallbacks` | array | [] | Fallback model names tried in order if primary fails |
| `max_tokens` | int | 32768 | Maximum tokens per response |
| `temperature` | float | — | LLM temperature (omit to use provider default) |
| `max_tool_iterations` | int | 50 | Maximum tool call iterations per request |
| `max_media_size` | int | 20971520 | Maximum media file size in bytes (default 20MB) |
| `image_model` | string | — | Model name for image generation |
| `image_model_fallbacks` | array | [] | Fallback image models |
| `routing` | object | — | Intelligent model routing settings (see below) |

#### `routing`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Enable intelligent model routing |
| `light_model` | string | — | Model name (from `model_list`) to use for simple tasks |
| `threshold` | float | — | Complexity score in [0,1]; messages scoring >= threshold use the primary model, below use `light_model` |

When enabled, PicoClaw scores each incoming message against structural features (length, code blocks, tool call history, conversation depth, attachments) and routes simple messages to a lighter/cheaper model.

### `model_list[]`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `model_name` | string | Yes | Alias used in `agents.defaults.model_name` |
| `model` | string | Yes | `vendor/model-id` format. The leading `vendor/` is used only for protocol/API base resolution and is not sent upstream as-is. |
| `api_keys` | array | Depends | API authentication keys (array; supports multiple keys for load balancing). Required for HTTP-based providers unless `api_base` points to a local server. |
| `api_base` | string | No | Override default API base URL |
| `enabled` | bool | No | Whether this model entry is active. Defaults to `true` during migration for models with API keys or named `local-model`. Set to `false` to disable a model without removing its configuration. |
| `auth_method` | string | No | Authentication method (e.g., `oauth`) |
| `proxy` | string | No | HTTP/SOCKS proxy for this model |
| `request_timeout` | int | No | Request timeout in seconds; `<=0` uses default 120s |
| `rpm` | int | No | Rate limit (requests per minute) |
| `max_tokens_field` | string | No | Override the max tokens field name in API requests |
| `connect_mode` | string | No | Connection mode override |
| `workspace` | string | No | Per-model workspace override |
| `thinking_level` | string | No | Extended thinking level: `off`, `low`, `medium`, `high`, `xhigh`, or `adaptive` |
| `fallbacks` | array | No | Fallback model names for failover |
| `extra_body` | object | No | Additional fields to inject into API request body |

:::note API Key Behavior in Schema V2
In config schema V2, `model_list[].api_key` in `config.json` is ignored. Use `api_keys` and prefer storing real credentials in `.security.yml`. During V0/V1 migration, legacy `api_key` and `api_keys` are merged into `api_keys` automatically. API keys can use `SecureString` formats: plaintext, `enc://<base64>`, or `file://<path>`. See [Credential Encryption](../credential-encryption.md).
:::

### `gateway`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `host` | string | `127.0.0.1` | Gateway listen host |
| `port` | int | 18790 | Gateway listen port |
| `log_level` | string | `warn` | Log verbosity: `debug`, `info`, `warn`, `error`, `fatal`. Can also be set via `PICOCLAW_LOG_LEVEL` env var. |
| `hot_reload` | bool | `false` | Enable hot-reload of config changes |

Set `host: "0.0.0.0"` to make the gateway accessible from other devices.

### Common Channel Fields

All channels support these fields:

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | bool | Enable/disable the channel |
| `allow_from` | array | User IDs allowed to use the bot (empty = allow all) |
| `reasoning_channel_id` | string | Dedicated channel/chat ID for routing reasoning output |
| `group_trigger` | object | Group chat trigger settings (see below) |
| `placeholder` | object | Placeholder message settings (see below) |
| `typing` | object | Typing indicator settings (see below) |

#### `group_trigger`

| Field | Type | Description |
| --- | --- | --- |
| `mention_only` | bool | Only respond when @-mentioned in groups |
| `prefixes` | array | Keyword prefixes that trigger the bot in groups |

#### `placeholder`

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | bool | Enable placeholder messages |
| `text` | string | Placeholder text shown while processing (e.g., "Thinking...") |

Supported by: Feishu, Slack, Matrix.

#### `typing`

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | bool | Show typing indicator while processing |

Supported by: Slack, Matrix.

## Security Configuration

### .security.yml File

PicoClaw supports a dedicated `.security.yml` file for sensitive credentials (API keys, tokens, secrets). It is loaded from the same directory as the active `config.json` (including custom paths set by `PICOCLAW_CONFIG`).

### Key Priority Order

When resolving credentials, PicoClaw applies values in this order:

1. **Environment variables**: Highest priority (`env.Parse` runs after file loading)
2. **.security.yml**: Overrides same-path values from `config.json`
3. **config.json**: Base values

For `model_list` in schema V2, `api_key` in `config.json` is ignored; use `.security.yml` + `api_keys`.

For field-by-field `.security.yml` paths, mapping rules, and complete examples, see [`.security.yml Reference`](./security-reference.md).
---
id: security-reference
title: .security.yml Reference
---

# .security.yml Reference

Use `.security.yml` to store sensitive values while keeping structure in `config.json`.

For config schema version `2`, this split is strongly recommended:

- `config.json`: model structure, routing, channel enable flags, behavior settings
- `.security.yml`: API keys, tokens, secrets

## How It Works with config.json

PicoClaw loads configuration in this order:

1. `config.json`
2. `.security.yml` (same directory as active `config.json`)
3. Environment variables

This means effective priority is:

1. Environment variables
2. `.security.yml`
3. `config.json`

`.security.yml` is an overlay, not a standalone config:

- It does not replace `config.json`
- It should only hold sensitive fields
- It relies on existing entries defined in `config.json` (especially `model_list`)

## File Location

- Default config path: `~/.picoclaw/config.json`
- Default security path: `~/.picoclaw/.security.yml`

If `PICOCLAW_CONFIG` points to a custom config path, `.security.yml` is also loaded from that config file's directory.

Example:

- `PICOCLAW_CONFIG=/etc/picoclaw/production.json`
- Security file path: `/etc/picoclaw/.security.yml`

## Top-Level Sections in .security.yml

Important: some `.security.yml` sections map to nested paths in `config.json`.

| `.security.yml` section | Maps to `config.json` |
| --- | --- |
| `model_list` | `model_list` |
| `channels` | `channels` |
| `web` | `tools.web` |
| `skills` | `tools.skills` |

## Model Mapping Rules

For schema v2:

- `config.json` `model_list[].api_key` is ignored
- Use `model_list.<name>[:index].api_keys` in `.security.yml`

`model_list` keys in `.security.yml` support two forms:

1. Indexed key (exact entry): `<model_name>:<index>`
2. Base key (fallback): `<model_name>`

Resolution behavior:

- PicoClaw first tries `<model_name>:<index>`
- If not found, it falls back to `<model_name>`

Use indexed keys when you have multiple entries with the same `model_name`.

### Example: one key per load-balanced entry

```yaml
model_list:
  loadbalanced-gpt-5.4:0:
    api_keys:
      - "sk-key-1"
  loadbalanced-gpt-5.4:1:
    api_keys:
      - "sk-key-2"
```

### Example: shared keys for same model_name

```yaml
model_list:
  loadbalanced-gpt-5.4:
    api_keys:
      - "sk-shared-1"
      - "sk-shared-2"
```

## Supported Sensitive Paths

Only fields wired with YAML tags are read from `.security.yml`.

### model_list

| Path | Type |
| --- | --- |
| `model_list.<model_name_or_model_name:index>.api_keys` | `string[]` |

### channels

| Path | Type |
| --- | --- |
| `channels.telegram.token` | `string` |
| `channels.feishu.app_secret` | `string` |
| `channels.feishu.encrypt_key` | `string` |
| `channels.feishu.verification_token` | `string` |
| `channels.discord.token` | `string` |
| `channels.qq.app_secret` | `string` |
| `channels.dingtalk.client_secret` | `string` |
| `channels.slack.bot_token` | `string` |
| `channels.slack.app_token` | `string` |
| `channels.matrix.access_token` | `string` |
| `channels.line.channel_secret` | `string` |
| `channels.line.channel_access_token` | `string` |
| `channels.onebot.access_token` | `string` |
| `channels.wecom.secret` | `string` |
| `channels.weixin.token` | `string` |
| `channels.pico.token` | `string` |
| `channels.pico_client.token` | `string` |
| `channels.irc.password` | `string` |
| `channels.irc.nickserv_password` | `string` |
| `channels.irc.sasl_password` | `string` |
| `channels.vk.token` | `string` |
| `channels.teams_webhook.webhooks.<name>.webhook_url` | `string` |

### web (maps to `tools.web`)

| Path | Type |
| --- | --- |
| `web.brave.api_keys` | `string[]` |
| `web.tavily.api_keys` | `string[]` |
| `web.perplexity.api_keys` | `string[]` |
| `web.glm_search.api_key` | `string` |
| `web.baidu_search.api_key` | `string` |

### skills (maps to `tools.skills`)

| Path | Type |
| --- | --- |
| `skills.github.token` | `string` |
| `skills.clawhub.auth_token` | `string` |

## Value Formats

Sensitive values support the same SecureString formats:

- Plaintext: `sk-...`
- Encrypted: `enc://...`
- File reference: `file://filename.key`

`file://` paths are resolved relative to the config directory and cannot escape that directory.

See [Credential Encryption](../credential-encryption.md) for `enc://` setup and key management.

## Recommended Paired Example

### `config.json`

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6"
    }
  ],
  "channels": {
    "telegram": {
      "enabled": true
    },
    "wecom": {
      "enabled": true,
      "bot_id": "YOUR_BOT_ID"
    }
  },
  "tools": {
    "web": {
      "brave": {
        "enabled": true
      }
    },
    "skills": {
      "github": {}
    }
  }
}
```

### `.security.yml`

```yaml
model_list:
  gpt-5.4:0:
    api_keys:
      - "sk-openai-..."
  claude-sonnet-4.6:0:
    api_keys:
      - "sk-ant-..."

channels:
  telegram:
    token: "123456:telegram-token"
  wecom:
    secret: "wecom-secret"

web:
  brave:
    api_keys:
      - "BSA-..."

skills:
  github:
    token: "ghp-..."
```

## Operational Notes

- Add `.security.yml` to `.gitignore`
- Restrict permissions (`chmod 600 ~/.picoclaw/.security.yml`)
- Prefer `.security.yml` for real credentials, keep `config.json` shareable

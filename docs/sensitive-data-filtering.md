---
id: sensitive-data-filtering
title: Sensitive Data Filtering
---

# Sensitive Data Filtering

PicoClaw automatically filters sensitive values — such as API keys, tokens, and secrets — from tool results before sending them to the LLM. This prevents credentials from leaking into model context and being echoed back to users or logged.

## How Values Are Collected

Sensitive values are collected from your `.security.yml` file at startup. Every string value defined in that file is treated as a potential secret.

## Configuration

Filtering is configured under the `tools` section:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `filter_sensitive_data` | bool | `true` | Enable or disable sensitive data filtering. |
| `filter_min_length` | int | `8` | Minimum length of a value to be considered for filtering. Values shorter than this are ignored to avoid false positives. |

You can also toggle filtering via environment variable:

```bash
export PICOCLAW_TOOLS_FILTER_SENSITIVE_DATA=false
```

## How It Works

1. **On startup**, PicoClaw reads `.security.yml` and collects all string values that meet the minimum length requirement.
2. These values are assembled into a `strings.Replacer`.
3. **Per tool result**, the replacer scans the output and replaces any matching value with `[FILTERED]`.

### Example

Given a `.security.yml` containing:

```yaml
openai:
  api_key: "sk-abc123xxxxxxxxxxxxxxxxxx"
database:
  password: "super-secret-db-pass"
```

And a tool that returns:

```
Connected to database with password super-secret-db-pass
API response from sk-abc123xxxxxxxxxxxxxxxxxx: {"status": "ok"}
```

The LLM will see:

```
Connected to database with password [FILTERED]
API response from [FILTERED]: {"status": "ok"}
```

## Performance

- **Fast path for short content** — tool results shorter than the minimum filter length are returned immediately without scanning.
- **O(n+m) replacement** — the underlying `strings.Replacer` uses an efficient Aho-Corasick-like algorithm, where `n` is the length of the content and `m` is the total length of all patterns.
- **Lazy initialization** — the replacer is built once at startup and reused for all subsequent tool calls.

## Security Considerations

- **Filtering is best-effort.** If a secret is not listed in `.security.yml`, it will not be filtered. Always keep your security file up to date.
- **Partial matches are not filtered.** The value must appear exactly as defined. Substrings or encoded variants (e.g., base64) will not be caught.
- **The `filter_min_length` default of 8** is chosen to avoid filtering short, common strings that would cause excessive false positives. Adjust this value based on your security requirements.
- **Tool inputs are not filtered** — only tool results (outputs) are scanned. If sensitive data appears in the arguments sent to a tool, it will not be redacted.
- **Logging and storage** — filtering happens before the result is sent to the LLM, but the raw tool output may still appear in local logs depending on your logging configuration.

---
id: troubleshooting
title: Troubleshooting
---

# Troubleshooting

## "model ... not found in model_list" or OpenRouter errors

**Symptom:** You see an error like:

```
Error creating provider: model "openrouter/free" not found in model_list
```

Or OpenRouter returns a 400 error when making requests.

**Cause:** The `model` field in `model_list` is sent directly to the upstream API. For OpenRouter, you must use the full model ID (e.g., `openrouter/google/gemma-2-9b-it:free`), not a shorthand like `openrouter/free`.

- Wrong: `"model": "openrouter/free"`
- Right: `"model": "openrouter/google/gemma-2-9b-it:free"`

**Fix:**

1. `agents.defaults.model_name` must match a `model_name` entry in `model_list`.
2. That entry's `model` field must be a valid model ID recognized by the provider.

Example of a correct configuration:

```json
{
  "agents": {
    "defaults": {
      "model_name": "openrouter-free"
    }
  },
  "model_list": [
    {
      "model_name": "openrouter-free",
      "model": "openrouter/google/gemma-2-9b-it:free",
      "api_key": "sk-or-v1-your-openrouter-key"
    }
  ]
}
```

## Web search says "API key configuration issue"

This is normal if you haven't configured a search API key yet. PicoClaw will provide helpful links for manual searching.

To enable web search:

1. **Option 1 (Recommended)**: Get a free API key at [https://brave.com/search/api](https://brave.com/search/api) (2000 free queries/month) for the best results.
2. **Option 2 (No Credit Card)**: If you don't have a key, PicoClaw automatically falls back to **DuckDuckGo** (no key required).

Add the key to `~/.picoclaw/config.json`:

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "api_key": "YOUR_BRAVE_API_KEY",
        "max_results": 5
      }
    }
  }
}
```

## Content filtering errors

Some providers (like Zhipu) have content filtering. Try rephrasing your query or use a different model.

## Telegram bot "Conflict: terminated by other getUpdates"

Only one `picoclaw gateway` instance should run at a time. Stop any other instances before starting a new one.

## Gateway not accessible from other devices

By default, the gateway listens on `127.0.0.1` (localhost only). To expose it on the LAN:

- Set `PICOCLAW_GATEWAY_HOST=0.0.0.0` in your environment or config.
- If using the Web Launcher, run `./picoclaw-launcher -public`.

## Agent hangs or times out

- Check your internet connection and API key validity.
- Try a different model provider to rule out upstream outages.
- Increase `max_tokens` or `max_tool_iterations` in `agents.defaults` if the task is complex.

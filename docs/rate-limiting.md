---
id: rate-limiting
title: Rate Limiting
---

# Rate Limiting

PicoClaw prevents 429 errors from LLM provider APIs by enforcing configurable per-model request-rate limits **before** sending each request. Unlike the reactive cooldown/fallback system (which activates *after* a 429 is received), rate limiting is **proactive**: it keeps outbound QPS within the provider's free-tier or plan limits.

## How it works

Each rate-limited model gets a token bucket:

- **Capacity** = `rpm` (burst size equals the per-minute limit)
- **Refill rate** = `rpm / 60` tokens per second
- Tokens are consumed one per LLM call; if the bucket is empty, the call blocks until a token refills or the request context is cancelled

### Call chain integration

The rate limiter runs **after** the cooldown check and **before** the provider call:

```
FallbackChain.Execute()
  ├─ CooldownTracker.IsAvailable()   ← skip if post-429 cooldown active
  ├─ RateLimiterRegistry.Wait()      ← block until token available
  └─ provider.Chat()                 ← actual LLM HTTP call
```

Candidates already in cooldown are skipped entirely. Candidates that are available get throttled to the configured RPM.

## Configuration

Set `rpm` on any model entry in `model_list`:

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-free",
      "model": "openai/gpt-4o",
      "api_keys": ["sk-..."],
      "rpm": 3
    },
    {
      "model_name": "claude-haiku",
      "model": "anthropic/claude-haiku-4-5",
      "api_keys": ["sk-ant-..."],
      "rpm": 60
    },
    {
      "model_name": "local-llm",
      "model": "ollama/llama3"
    }
  ]
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `rpm` | int | `0` | Requests per minute. `0` means no limit. |

## Interaction with fallbacks

When a model has fallbacks configured, each candidate is rate-limited independently. If the current candidate's bucket is empty, PicoClaw skips it and tries the next fallback immediately. Only the last remaining candidate waits for a token to refill.

```json
{
  "model_list": [
    {
      "model_name": "primary",
      "model": "openai/gpt-4o",
      "api_keys": ["sk-..."],
      "rpm": 5
    },
    {
      "model_name": "backup",
      "model": "gemini/gemini-2.5-flash",
      "api_keys": ["your-gemini-key"],
      "rpm": 60
    }
  ],
  "agents": {
    "defaults": {
      "model": {
        "primary": "primary",
        "fallbacks": ["backup"]
      }
    }
  }
}
```

## Burst behavior

The bucket starts **full** with `rpm` tokens. For `rpm: 3`, the first 3 requests fire instantly (one token each); after the bucket empties, one token refills every 20 s (= 60 / rpm), spacing subsequent requests accordingly.

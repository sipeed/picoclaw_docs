---
id: context-compression
title: Context Compression
---

# Context Compression

When a conversation grows past the LLM's context window, PicoClaw automatically compresses older turns into summaries so the agent can keep working without losing important state.

The compactor lives in `pkg/seahorse` and runs as a **two-tier hierarchical summarization** pipeline. Tier 1 runs on every turn; tier 2 runs in the background only when the context is actually under pressure.

## How It Works

### Tier 1 — Leaf compaction (synchronous, every turn)

After every conversation turn the engine looks for the oldest contiguous chunk of messages that sits **outside the protected fresh tail** (the most recent 32 items by default) and meets either:

- at least 8 messages, **or**
- at least 20,000 tokens of message content

If both thresholds are below their minimum, leaf compaction does nothing.

When a chunk qualifies, the engine asks the configured LLM to summarize it down to about 1,200 tokens. The summary is written back into the conversation in place of the original messages, and the source messages stay linked to it so the agent can later "expand" the summary if needed.

### Tier 2 — Condensed compaction (asynchronous, when over threshold)

If the total context tokens exceed **75% of the context window** (`ContextThreshold` in `pkg/seahorse/short_constants.go`), the engine launches a background goroutine that condenses **multiple existing leaf summaries into a single higher-level summary**.

The selector walks summaries by depth, picks the shallowest depth that has at least 4 consecutive summaries, asks the LLM to merge them down to ~2,000 tokens, and replaces them in the context. The loop repeats until one of:

- the context drops back under the threshold, or
- there are no more candidates to condense, or
- a pass produces no progress.

Because Tier 2 is asynchronous, normal turns are never blocked on summarization.

### Aggressive recovery

If a hard budget is set (for example because the next turn alone would exceed the context window), the engine falls back to `CompactUntilUnder`, which interleaves leaf and condensed passes and bypasses the fresh-tail protection until the context fits. It is capped at 20 iterations to prevent infinite loops.

### Three-level escalation per call

Each call to the LLM uses up to three escalation levels:

1. **Normal prompt** — preserves decisions, rationale, file operations, and active tasks.
2. **Aggressive prompt** — keeps only durable facts, TODOs, and current task state.
3. **Deterministic truncation** — pure local fallback, no LLM, used when both prompts fail to shrink the input.

This means compaction always makes progress even if the summarization model is overloaded or returns empty content.

## Configuration

The user-facing knobs live under `agents.defaults`:

| Field | Default | Description |
| --- | --- | --- |
| `context_window` | (model-specific) | Total context window size in tokens. Must be set high enough that the trigger threshold is reachable. |
| `summarize_token_percent` | `75` | Trigger compaction once the running context reaches this percentage of `context_window`. |
| `summarize_message_threshold` | `20` | Minimum number of messages before compaction is allowed to fire on token pressure alone. |

```json
{
  "agents": {
    "defaults": {
      "context_window": 131072,
      "summarize_token_percent": 75,
      "summarize_message_threshold": 20
    }
  }
}
```

The seahorse engine itself also exposes a few internal constants in `pkg/seahorse/short_constants.go` (`FreshTailCount`, `LeafMinFanout`, `LeafChunkTokens`, `CondensedMinFanout`, `LeafTargetTokens`, `CondensedTargetTokens`). They are tuned defaults and not intended to be changed via `config.json`.

## LLM-agnostic design

The compaction engine does not bind to a specific provider. It receives a `complete(ctx, prompt, opts)` callback, which is wired up to whichever model is configured for the agent. Any OpenAI-compatible, Anthropic, Gemini, or local model can be used as the summarizer — typically the same model the agent is already running.

## Expanding a summary

Each summary is linked to the original messages it replaced. PicoClaw's `short_expand` tool lets the agent walk back from a summary to its source range when more detail is needed. This is what makes the compactor lossy-but-recoverable: the conversation is shorter in context, but the full history is still in the store.

---
id: rate-limiting
title: 速率限制
---

# 速率限制

PicoClaw 通过在发送请求**之前**强制执行可配置的每模型请求速率限制，主动防止 LLM 提供商 API 的 429 错误。与被动冷却/故障转移系统（在收到 429 *之后*触发）不同，速率限制是**主动**的：它将出站 QPS 保持在提供商免费套餐或计划限制范围内。

## 工作原理

每个启用速率限制的模型都有一个令牌桶：

- **容量** = `rpm`（突发大小等于每分钟限制）
- **补充速率** = `rpm / 60` 个令牌/秒
- 每次 LLM 调用消耗一个令牌；如果桶为空，调用会阻塞直到令牌补充或请求上下文取消

### 调用链集成

速率限制器在冷却检查**之后**、实际提供商调用**之前**运行：

```
FallbackChain.Execute()
  ├─ CooldownTracker.IsAvailable()   ← 如果在 429 后冷却中则跳过
  ├─ RateLimiterRegistry.Wait()      ← 阻塞直到令牌可用
  └─ provider.Chat()                 ← 实际 LLM HTTP 调用
```

已在冷却中的候选完全被跳过。可用的候选按配置的 RPM 进行限速。

## 配置

在 `model_list` 的任意模型条目上设置 `rpm`：

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

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `rpm` | int | `0` | 每分钟请求数。`0` 表示不限制。 |

## 与故障转移的配合

配置了故障转移的模型，每个候选独立进行速率限制。如果当前候选的桶为空，PicoClaw 会立即跳过并尝试下一个备用。只有最后一个剩余候选才会等待令牌补充。

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

## 突发行为

令牌桶初始处于满载状态，即预存了 `rpm` 个令牌可立即使用。以 `rpm: 3` 为例：前 3 个请求会立即发出（各消耗 1 个令牌）；桶空后每 20 秒（= 60 / 3）补充 1 个令牌，后续请求需依次等待。

---
id: context-compression
title: 上下文压缩
---

# 上下文压缩

当对话长度超过 LLM 的上下文窗口时，PicoClaw 会自动将较早的轮次压缩成摘要，让 Agent 在不丢失关键状态的前提下继续工作。

压缩器位于 `pkg/seahorse`，采用**两层分级摘要**流水线：第一层每轮都跑；第二层仅在上下文确实接近上限时在后台执行。

## 工作机制

### 第一层 — Leaf 压缩（同步，每轮触发）

每轮对话结束后，引擎会查找**位于受保护"新鲜尾部"之外**（默认为最近 32 条）的最早一段连续消息，且需同时满足以下任一条件：

- 至少 8 条消息，**或**
- 至少 20,000 token 的消息内容

两个阈值都未达到时，Leaf 压缩本轮不动作。

满足条件后，引擎调用所配置的 LLM 将这段消息摘要为约 1,200 token，并将摘要写回原位、替换原始消息。源消息仍与摘要保持关联，Agent 后续可按需"展开"摘要查看原文。

### 第二层 — Condensed 压缩（异步，超过阈值时触发）

当上下文 token 总数超过**上下文窗口的 75%**（即 `pkg/seahorse/short_constants.go` 中的 `ContextThreshold`）时，引擎会启动一个后台 goroutine，将**多个已有的 leaf 摘要进一步合并为一个更高层的摘要**。

选择器按 depth 遍历摘要，找出至少包含 4 条连续摘要的最浅 depth，调用 LLM 将它们合并到约 2,000 token，再写回上下文。该循环持续运行，直到出现以下任一情况：

- 上下文回落到阈值以下，或
- 没有可继续合并的候选，或
- 某次迭代未能产生进展。

由于第二层是异步执行的，正常对话轮次**不会被摘要操作阻塞**。

### 强制收紧（Aggressive recovery）

当传入了硬性预算（例如下一轮单独就会撑爆上下文），引擎会切换到 `CompactUntilUnder`：交替执行 leaf 与 condensed 压缩，并跳过新鲜尾部保护，直到上下文降到预算以下。该模式上限为 20 次迭代，避免死循环。

### 单次调用的三级回退

每次调用 LLM 进行摘要时，引擎最多走三级回退：

1. **常规 prompt** — 保留决策、理由、文件操作和当前任务状态。
2. **激进 prompt** — 仅保留长期事实、TODO 和当前任务。
3. **本地确定性截断** — 不调用 LLM，纯本地裁剪，作为最后兜底。

这保证了即便摘要模型超载或返回空内容，压缩过程也始终能够推进。

## 配置项

用户可调的参数位于 `agents.defaults` 下：

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `context_window` | （随模型） | 上下文窗口总 token 数。需配置得足够大，触发阈值才有意义。 |
| `summarize_token_percent` | `75` | 当上下文 token 占 `context_window` 的此百分比时触发压缩。 |
| `summarize_message_threshold` | `20` | 仅按 token 压力触发时所需的最小消息数。 |

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

seahorse 引擎本身在 `pkg/seahorse/short_constants.go` 还暴露了若干内部常量（`FreshTailCount`、`LeafMinFanout`、`LeafChunkTokens`、`CondensedMinFanout`、`LeafTargetTokens`、`CondensedTargetTokens`），这些是经验调优的默认值，**不通过 `config.json` 修改**。

## LLM 无关设计

压缩引擎不绑定任何特定提供商。它接收一个 `complete(ctx, prompt, opts)` 回调，由 Agent 当前所配置的模型提供。任何 OpenAI 兼容、Anthropic、Gemini 或本地模型都可以作为摘要器使用——通常就是 Agent 自己正在用的那个模型。

## 展开摘要

每个摘要都关联了它所替换的原始消息。PicoClaw 的 `short_expand` 工具允许 Agent 从摘要回溯到对应的原始消息范围。这正是该压缩机制"有损但可恢复"的关键：上下文中变短了，但完整历史仍然保留在 store 中。

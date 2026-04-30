---
id: chat-commands
title: 聊天命令参考
sidebar_label: 聊天命令参考
---

PicoClaw 支持通过聊天命令与 Agent 交互。
> PicoClaw 的聊天命令由 `pkg/commands` 统一定义，并由 Agent 在收到以命令前缀开头的消息时处理。

支持的命令前缀:

- `/` 例如 `/help`
- `!` 例如 `!help`

Telegram 风格的 `/command@botname` 也会被解析为对应命令。

## 命令列表

### `/start`

启动/问候命令，返回 "Hello! I am PicoClaw 🦞"。

用法: `/start`

### `/help`

显示所有可用命令及简要说明。

用法: `/help`

### `/show [model|channel|agents|mcp <server>]`

显示当前配置或运行状态。

**子命令:**

| 子命令 | 说明 |
|---|---|
| `/show model` | 显示当前模型与 provider。 |
| `/show channel` | 显示当前消息来源 channel。 |
| `/show agents` | 显示已注册 Agent。 |
| `/show mcp <server>` | 显示指定 MCP server 当前可用工具。 |

### `/list [models|channels|agents|skills|mcp]`

列出可用选项或已配置资源。

**子命令:**

| 子命令 | 说明 |
|---|---|
| `/list models` | 显示当前配置模型与 provider 信息。 |
| `/list channels` | 列出已启用 channel。 |
| `/list agents` | 列出已注册 Agent。 |
| `/list skills` | 列出已安装 skills，并提示可用 `/use` 调用。 |
| `/list mcp` | 列出已配置 MCP servers、启用状态、延迟加载状态、连接状态和 active tools 数量。 |

### `/use <skill> [message]`

强制指定某个已安装 skill。

**用法模式:**

| 模式 | 行为 |
|---|---|
| `/use <skill> <message>` | 对当前这条 message 使用指定 skill。 |
| `/use <skill>` | 将该 skill 预置给下一条普通消息。 |
| `/use clear` 或 `/use off` | 取消下一条消息的 skill override。 |

### `/btw <question>`

提出一个"旁路问题"，不会改变当前会话历史。适合临时查询、插入式问题。

用法: `/btw <question>`

示例: `/btw what is 2+2?`

### `/switch model to <name>`

切换当前 Agent 使用的模型。

用法: `/switch model to <name>`

:::note
`/switch channel` 已迁移到 `/check channel`。
:::

### `/check channel <name>`

检查某个 channel 是否可用且已启用。

用法: `/check channel <name>`

### `/clear`

清空当前 session 的聊天历史。

用法: `/clear`

返回: `Chat history cleared!`

### `/context`

显示当前 session 的上下文和 token 使用情况，包括消息数、已用 token、总窗口、压缩阈值、压缩进度和剩余 token。

用法: `/context`

### `/subagents`

显示当前 session 中正在运行的 subagents / task tree。如果没有活动任务，会提示没有正在运行的任务。

用法: `/subagents`

### `/reload`

重新加载配置文件。

用法: `/reload`

返回: `Config reload triggered!` 或错误信息。

## 实现位置

| 区域 | 路径 |
|---|---|
| 命令定义 | `pkg/commands/builtin.go` 和 `pkg/commands/cmd_*.go` |
| 命令解析 | `pkg/commands/request.go` |
| 命令执行 | `pkg/commands/executor.go` |
| Agent 接入 | `pkg/agent/agent_command.go` |
| 顶层 CLI 子命令 | `cmd/picoclaw/main.go` |

## 补充：CLI 顶层子命令

除了聊天里的 slash 命令，`picoclaw` 二进制还提供 Cobra CLI 子命令，包括：

`picoclaw onboard` · `picoclaw agent` · `picoclaw auth` · `picoclaw gateway` · `picoclaw status` · `picoclaw cron` · `picoclaw mcp` · `picoclaw migrate` · `picoclaw skills` · `picoclaw model` · `picoclaw update` · `picoclaw version`

这些 CLI 命令与聊天命令是两套入口：CLI 通过终端执行，聊天命令通过 Telegram/Feishu/微信等 channel 消息触发。

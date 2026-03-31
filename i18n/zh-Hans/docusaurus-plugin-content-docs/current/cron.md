---
id: cron
title: 定时任务与 Cron 作业
---

# 定时任务与 Cron 作业

PicoClaw 将定时作业存储在当前工作空间中，支持以 Agent 回合、直接投递或 Shell 命令三种方式执行。

## 调度类型

cron 工具支持三种调度形式：

| 类型 | 说明 | 是否一次性？ |
|------|------|-------------|
| `at_seconds` | 从现在起延迟触发一次，执行后自动删除 | 是 |
| `every_seconds` | 按秒级间隔循环执行 | 否 |
| `cron_expr` | 标准 cron 表达式（如 `0 9 * * *`） | 否 |

### 优先级

当同时提供多个调度字段时，工具按以下优先级选择：`at_seconds` > `every_seconds` > `cron_expr`。

### CLI 用法

CLI 命令 `picoclaw cron add` 目前仅支持循环作业：

- `--every <seconds>` -- 循环间隔
- `--cron '<expr>'` -- cron 表达式

目前没有一次性 `at` 作业的 CLI 参数，一次性作业只能通过 Agent 工具创建。

**示例：**

```bash
picoclaw cron add --name "每日总结" --message "总结今天的日志" --cron "0 18 * * *"
picoclaw cron add --name "心跳" --message "heartbeat" --every 300 --deliver
```

## 执行模式

作业存储消息载荷，支持三种执行模式：

### Agent 回合（`deliver: false`）

这是 cron 工具的**默认**模式。

作业触发时，PicoClaw 将保存的消息作为新的 Agent 回合发送回 Agent 循环。适用于需要推理、调用工具或生成回复的定时任务。

### 直接投递（`deliver: true`）

作业触发时，PicoClaw 将保存的消息直接发布到目标频道和接收者，不经过 Agent 处理。

CLI 中使用 `picoclaw cron add --deliver` 标志启用此模式。

### 命令执行

当 cron 作业包含 `command` 字段时，PicoClaw 通过 `exec` 工具执行该 Shell 命令，并将命令输出发布回频道。

对于命令作业：
- 创建时 `deliver` 强制设为 `false`
- 保存的 `message` 仅作为描述文本；实际调度的操作是 Shell 命令
- 命令作业需要内部频道
- 当前 CLI `picoclaw cron add` 命令不支持 `command` 参数

## 工具操作

Agent 端的 cron 工具支持以下操作：

| 操作 | 说明 | 必需参数 |
|------|------|---------|
| `add` | 创建新的定时作业 | `message`，加上 `at_seconds` / `every_seconds` / `cron_expr` 之一 |
| `list` | 列出所有已启用的定时作业 | -- |
| `remove` | 按 ID 删除作业 | `job_id` |
| `enable` | 启用已禁用的作业 | `job_id` |
| `disable` | 禁用作业（保留在存储中） | `job_id` |

### 工具参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `action` | string | 是 | `add`、`list`、`remove`、`enable` 或 `disable` |
| `message` | string | `add` 时必需 | 触发时显示的提醒/任务消息 |
| `command` | string | 否 | 直接执行的 Shell 命令 |
| `command_confirm` | boolean | 否 | 调度 Shell 命令的显式确认标志 |
| `at_seconds` | integer | 否 | 一次性：从现在起延迟的秒数（如 `600` 表示 10 分钟） |
| `every_seconds` | integer | 否 | 循环间隔秒数（如 `3600` 表示每小时） |
| `cron_expr` | string | 否 | cron 表达式（如 `0 9 * * *`） |
| `job_id` | string | `remove`/`enable`/`disable` 时必需 | 目标作业 ID |

## 配置与安全

### `tools.cron`

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | `true` | 注册 Agent 端的 cron 工具 |
| `allow_command` | bool | `true` | 允许命令作业无需额外确认 |
| `exec_timeout_minutes` | int | `5` | 定时命令执行的超时时间（0 = 不限制） |

如果禁用 `tools.cron.enabled`，用户将无法通过 Agent 工具创建或管理作业。网关仍会启动 CronService，但不会安装作业执行回调。因此，到期的作业不会实际执行；一次性作业可能被删除，循环作业可能被重新调度但不执行其载荷。

### `tools.exec` 依赖

定时命令作业依赖 `tools.exec.enabled`（默认：`true`）。

如果 `tools.exec.enabled` 为 `false`：
- 新的命令作业会被 cron 工具拒绝
- 已有的命令作业触发时会发布 "command execution is disabled" 错误

### `allow_command` 行为

`tools.cron.allow_command` 默认为 `true`。这不是硬性禁用开关。如果将 `allow_command` 设为 `false`，当调用方显式传递 `command_confirm: true` 时，PicoClaw 仍会允许创建命令作业。

命令作业还要求内部频道。非命令类提醒没有此限制。

**配置示例：**

```json
{
  "tools": {
    "cron": {
      "enabled": true,
      "exec_timeout_minutes": 5,
      "allow_command": true
    },
    "exec": {
      "enabled": true
    }
  }
}
```

## 持久化与存储

Cron 作业存储在：

```
<workspace>/cron/jobs.json
```

默认工作空间为：

```
~/.picoclaw/workspace
```

如果设置了 `PICOCLAW_HOME`，默认工作空间变为：

```
$PICOCLAW_HOME/workspace
```

网关和 `picoclaw cron` CLI 子命令使用同一个 `cron/jobs.json` 文件。

### 存储行为

- 一次性 `at_seconds` 作业执行后自动删除
- 循环作业保留在存储中，直到显式删除
- 已禁用的作业保留在存储中，仍会出现在 `picoclaw cron list` 中

## 作业生命周期

```
作业创建 (enabled=true)
      |
      v
CronService 计算 nextRunAtMS
      |
      v
计时器在 nextRunAtMS 到达时触发
      |
      +-- at（一次性）------> 执行 -> 删除作业
      |
      +-- every / cron -------> 执行 -> 重新计算 nextRunAtMS
```

每个作业跟踪执行状态：

| 字段 | 说明 |
|------|------|
| `nextRunAtMs` | 下次计划执行时间 |
| `lastRunAtMs` | 上次执行开始时间 |
| `lastStatus` | `ok` 或 `error` |
| `lastError` | 上次失败的错误消息 |

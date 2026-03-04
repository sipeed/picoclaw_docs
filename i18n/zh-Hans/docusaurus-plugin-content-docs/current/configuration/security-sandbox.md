---
id: security-sandbox
title: 安全沙箱
---

# 安全沙箱

PicoClaw 默认在沙箱环境中运行。Agent 只能访问配置好的工作目录内的文件，以及在该目录内执行命令。

## 默认配置

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.picoclaw/workspace",
      "restrict_to_workspace": true
    }
  }
}
```

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `workspace` | `~/.picoclaw/workspace` | Agent 的工作目录 |
| `restrict_to_workspace` | `true` | 将文件/命令访问限制在工作目录内 |
| `allow_read_outside_workspace` | `false` | 即使开启了限制，也允许读取工作目录以外的文件 |

## 受保护的工具

当 `restrict_to_workspace: true` 时，以下工具将受到沙箱限制：

| 工具 | 功能 | 限制 |
| --- | --- | --- |
| `read_file` | 读取文件 | 仅限工作目录内的文件 |
| `write_file` | 写入文件 | 仅限工作目录内的文件 |
| `list_dir` | 列出目录 | 仅限工作目录内的目录 |
| `edit_file` | 编辑文件 | 仅限工作目录内的文件 |
| `append_file` | 追加文件内容 | 仅限工作目录内的文件 |
| `exec` | 执行命令 | 命令路径必须在工作目录内 |

## 额外的 Exec 防护

即使 `restrict_to_workspace: false`，`exec` 工具也会拦截以下危险命令：

- `rm -rf`、`del /f`、`rmdir /s` — 批量删除
- `format`、`mkfs`、`diskpart` — 磁盘格式化
- `dd if=` — 磁盘镜像写入
- 写入块设备（`/dev/sd*`、`/dev/hd*`、`/dev/nvme*`、`/dev/mmcblk*`、`/dev/loop*` 等）— 直接写入磁盘
- `shutdown`、`reboot`、`poweroff` — 系统关机
- Fork 炸弹 `:(){ :|:& };:`

### 错误示例

```
[ERROR] tool: Tool execution failed
{tool=exec, error=Command blocked by safety guard (path outside working dir)}
```

```
[ERROR] tool: Tool execution failed
{tool=exec, error=Command blocked by safety guard (dangerous pattern detected)}
```

## 关闭限制

:::warning 安全风险
关闭此限制后，Agent 将可以访问系统上的任意路径。请仅在受控环境中谨慎使用。
:::

**方式一：配置文件**

```json
{
  "agents": {
    "defaults": {
      "restrict_to_workspace": false
    }
  }
}
```

**方式二：环境变量**

```bash
export PICOCLAW_AGENTS_DEFAULTS_RESTRICT_TO_WORKSPACE=false
```

## 安全边界一致性

`restrict_to_workspace` 设置在所有执行路径上均一致生效：

| 执行路径 | 安全边界 |
| --- | --- |
| 主 Agent | `restrict_to_workspace` ✅ |
| 子 Agent / Spawn | 继承相同限制 ✅ |
| 心跳任务 | 继承相同限制 ✅ |

所有路径共享同一个工作目录限制——无法通过子 Agent 或定时任务绕过安全边界。

## 安全路径

以下路径始终可访问，不受工作目录限制：

- `/dev/null`、`/dev/zero`、`/dev/random`、`/dev/urandom`
- `/dev/stdin`、`/dev/stdout`、`/dev/stderr`

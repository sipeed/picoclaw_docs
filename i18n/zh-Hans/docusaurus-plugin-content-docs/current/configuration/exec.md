---
id: exec
title: 命令执行设置
---
# 命令执行设置指南

PicoClaw 提供了两项关键设置来控制命令执行权限，帮助您在功能性和安全性之间取得平衡。

## 概述

| 设置 | 配置路径 | 默认值 | 作用 |
|------|----------|--------|------|
| 允许命令执行 | `tools.exec.enabled` | `true` | 全局控制是否允许执行命令 |
| 允许远程命令执行 | `tools.exec.allow_remote` | `true` | 控制远程会话是否可以执行命令 |
| 危险命令拦截 | `tools.exec.enable_deny_patterns` | `true` | 启用内置安全守卫，拦截危险 shell 命令模式 |
| 自定义拒绝模式 | `tools.exec.custom_deny_patterns` | `[]` | 额外追加的拦截规则（正则表达式） |
| 自定义放行模式 | `tools.exec.custom_allow_patterns` | `[]` | 命中该规则的命令跳过全部拒绝检查 |
| 执行超时 | `tools.exec.timeout_seconds` | `60` | 单条命令超时秒数（0 表示使用默认值 60 秒）|

## 允许命令执行

### 功能说明

控制应用是否允许执行命令。关闭后，所有命令请求都不会执行。

### 配置方式

**通过配置文件：**

```json
{
  "tools": {
    "exec": {
      "enabled": false
    }
  }
}
```

**通过环境变量：**

```bash
export PICOCLAW_TOOLS_EXEC_ENABLED=false
```

### 使用场景

| 场景 | 建议设置 |
|------|----------|
| 生产环境、只读模式 | `enabled: false` |
| 开发环境、需要自动化 | `enabled: true` |
| 高安全要求场景 | `enabled: false` |

### 影响范围

关闭此设置后：

- Agent 无法通过 `exec` 工具执行任何 shell 命令
- Cron 定时任务中的 shell 命令将无法执行
- 所有命令请求都会被直接拒绝

## 允许远程命令执行

### 功能说明

开启后，来自远程会话或非本地上下文的请求也可以执行命令；关闭后，仅允许本地安全上下文执行命令。

### 配置方式

**通过配置文件：**

```json
{
  "tools": {
    "exec": {
      "allow_remote": false
    }
  }
}
```

**通过环境变量：**

```bash
export PICOCLAW_TOOLS_EXEC_ALLOW_REMOTE=false
```

### 使用场景

| 场景 | 建议设置 |
|------|----------|
| 仅本地使用 | `allow_remote: false` |
| 远程频道（Telegram、Discord 等）需要执行命令 | `allow_remote: true` |
| 多用户远程访问 | `allow_remote: false`（更安全） |

### 安全上下文说明

| 上下文类型 | 描述 |
|------------|------|
| 本地安全上下文 | 直接在本地终端运行的命令、本地 CLI 操作 |
| 远程会话 | 通过 Telegram、Discord、微信等远程频道发起的请求 |
| 非本地上下文 | HTTP API 调用、Webhook 触发等 |

## 危险命令拦截（`enable_deny_patterns`）

`enable_deny_patterns: true`（默认）时，PicoClaw 在每次执行命令前都会进行一组内置正则匹配。**此检查独立于 `enabled` 和 `allow_remote` 开关运行** —— 将这两项打开并不会禁用命令模式拦截。

内置拦截规则完整列表：

| 分类 | 示例 |
|------|------|
| 批量删除 | `rm -rf`、`del /f/q`、`rmdir /s` |
| 磁盘操作 | `format`、`mkfs`、`diskpart`、`dd if=`、写入块设备（`/dev/sd*`、`/dev/hd*`、`/dev/vd*`、`/dev/xvd*`、`/dev/nvme*`、`/dev/mmcblk*`、`/dev/loop*`、`/dev/dm-*`、`/dev/md*`、`/dev/sr*`、`/dev/nbd*`）|
| 系统控制 | `shutdown`、`reboot`、`poweroff` |
| Fork 炸弹 | `:(){ :\|:& };:` |
| **Shell 替换** | **`$(...)`、`${...}`、反引号**、`$(cat ...)`、`$(curl ...)`、`$(wget ...)`、`$(which ...)` |
| 链式删除 | `; rm -rf`、`&& rm -rf`、`\|\| rm -rf` |
| 管道到 Shell | `\| sh`、`\| bash` |
| Heredoc | `<< EOF` |
| 提权操作 | `sudo`、`chmod NNN`（数字权限模式）、`chown` |
| 进程控制 | `pkill`、`killall`、`kill` |
| 远程执行 | `curl \| sh`、`wget \| sh`、`ssh user@host` |
| 包管理器 | `apt install/remove/purge`、`yum install/remove`、`dnf install/remove`、`npm install -g`、`pip install --user` |
| 容器 | `docker run`、`docker exec` |
| Git 变更操作 | `git push`、`git force` |
| 其他 | `eval`、`source *.sh` |

:::caution 常见误拦截：Shell 变量默认值语法
规则 `\$\{[^}]+\}` 会拦截**所有**包含 `${...}` 的命令，包括合法的 bash 默认值语法如 `${VAR:-default}`。这是已知的设计取舍 —— 该规则旨在防止变量注入攻击。

报错信息：
```
Command blocked by safety guard (dangerous pattern detected)
```

触发示例：
```bash
echo "HOST=${AIEXCEL_API_HOST:-未设置}"
```

解决方法见下方[放行特定命令](#放行特定命令)章节。
:::

### 完全关闭命令拦截

:::warning
关闭 `enable_deny_patterns` 会移除**全部** 41 条内置安全规则，包括 `rm -rf` 和 `sudo`。仅在完全受控的可信环境中使用。
:::

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": false
    }
  }
}
```

环境变量：
```bash
export PICOCLAW_TOOLS_EXEC_ENABLE_DENY_PATTERNS=false
```

## 放行特定命令

使用 `custom_allow_patterns` 可以在**不关闭整个安全守卫**的前提下，为特定命令添加豁免规则。命中任意放行规则的命令会跳过所有拒绝检查。

> **WebUI 填写方式**：在「命令白名单」文本框中每行填入一条正则表达式，直接写单反斜杠（无需像 JSON 那样双反斜杠转义）。

### 示例一：放行 bash 变量默认值语法

解决 `${VAR:-default}` 被误拦截的问题：

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": [
        "\\$\\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\\}"
      ]
    }
  }
}
```

WebUI 白名单输入框填入：
```
\$\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\}
```

该规则只放行 `${VAR:-fallback}` 形式。使用 `${}` 进行命令注入（如 `${evil_cmd}`）仍会被拦截，因为它不匹配 `:-` 形式。

### 示例二：放行向特定 remote 的 git push

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": [
        "\\bgit\\s+push\\s+origin\\b"
      ]
    }
  }
}
```

`git push origin main` 放行；`git push upstream main` 仍被拦截。

### 示例三：放行运行 Python 脚本

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": [
        "^python3?\\s+[^\\s|;&`]+\\.py\\b"
      ]
    }
  }
}
```

:::note
放行规则匹配的是**小写化后**的命令字符串。检查在所有拒绝规则之前执行 —— 命中任意放行规则的命令将完全跳过拒绝检查。
:::

## 组合使用示例

### 场景一：完全禁用命令执行

适用于高安全要求的只读环境：

```json
{
  "tools": {
    "exec": {
      "enabled": false
    }
  }
}
```

**效果：** 无论本地还是远程，所有命令请求都被拒绝。

### 场景二：仅允许本地执行

适用于需要本地自动化但禁止远程命令的场景：

```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "allow_remote": false
    }
  }
}
```

**效果：**
- 本地终端命令可以执行
- 远程频道（Telegram、Discord 等）的命令请求被拒绝

### 场景三：完全开放（默认）

适用于开发环境或可信网络：

```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "allow_remote": true
    }
  }
}
```

**效果：** 本地和远程都可以执行命令。

## 与其他安全设置的配合

| 设置 | 配置路径 | 说明 |
|------|----------|------|
| 工作区限制 | `agents.defaults.restrict_to_workspace` | 限制命令执行路径 |
| 危险命令拦截 | `tools.exec.enable_deny_patterns` | 拦截危险命令模式 |
| 自定义拒绝模式 | `tools.exec.custom_deny_patterns` | 添加自定义拦截规则 |
| 自定义放行模式 | `tools.exec.custom_allow_patterns` | 为特定命令添加拒绝检查豁免 |

### 完整安全配置示例

```json
{
  "agents": {
    "defaults": {
      "restrict_to_workspace": true
    }
  },
  "tools": {
    "exec": {
      "enabled": true,
      "allow_remote": false,
      "enable_deny_patterns": true,
      "custom_deny_patterns": [
        "\\brm\\s+-rf\\b",
        "\\bsudo\\b"
      ],
      "custom_allow_patterns": [
        "\\$\\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\\}"
      ]
    }
  }
}
```


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
      ]
    }
  }
}
```


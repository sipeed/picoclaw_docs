---
id: spawn-tasks
title: 异步任务与子Agent
---

# 异步任务与子Agent

PicoClaw 通过 **spawn** 工具支持异步任务执行。主 Agent 可以将长时间运行的任务委派给独立的子 Agent，同时继续处理其他任务。

## 工作原理

**心跳（heartbeat）** 系统会定期检查 `workspace/HEARTBEAT.md` 中的计划任务。

- **短任务** 由主 Agent 内联处理。
- **长任务** 通过 `spawn` 委派给子 Agent。
- **子 Agent** 拥有独立的上下文，通过 `message` 工具将结果返回。

### 流程图

```
心跳触发
  │
  ▼
Agent 读取 HEARTBEAT.md
  │
  ├── 短任务 ──► 内联处理 ──► 继续下一任务
  │
  └── 长任务 ──► spawn 子Agent ──► 继续下一任务
                      │
                      ▼
               子Agent 独立工作
                      │
                      ▼
               子Agent 使用 message 工具
                      │
                      ▼
               用户收到结果
```

## 配置

在 `~/.picoclaw/config.json` 中添加 `heartbeat` 部分：

```json
{
  "heartbeat": {
    "enabled": true,
    "interval": 30
  }
}
```

| 选项       | 类型    | 默认值 | 说明                               |
|------------|---------|--------|------------------------------------|
| `enabled`  | boolean | `true` | 启用或禁用心跳系统。                |
| `interval` | integer | `30`   | 检查间隔（分钟）。最小值为 `5`。     |

## 环境变量

| 变量                           | 说明                             |
|--------------------------------|----------------------------------|
| `PICOCLAW_HEARTBEAT_ENABLED`   | 覆盖 `heartbeat.enabled` 配置。  |
| `PICOCLAW_HEARTBEAT_INTERVAL`  | 覆盖 `heartbeat.interval` 配置。 |

:::tip
在开发阶段可以将间隔设置为较低值（如 `5`），以便更快地迭代计划任务。
:::

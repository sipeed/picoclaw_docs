---
id: heartbeat
title: 心跳任务（周期任务）
---

# 心跳任务

PicoClaw 可以自动执行周期性任务。在工作目录中创建 `HEARTBEAT.md` 文件：

```markdown
# 周期任务

- 检查我的邮件中是否有重要消息
- 查看日历中即将到来的日程
- 查询今天的天气预报
```

Agent 会每隔 30 分钟（可配置）读取该文件，并使用可用工具执行其中的任务。

## 配置

```json
{
  "heartbeat": {
    "enabled": true,
    "interval": 30
  }
}
```

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `enabled` | `true` | 启用/禁用心跳 |
| `interval` | `30` | 检查间隔，单位分钟（最小值：5） |

**环境变量：**
- `PICOCLAW_HEARTBEAT_ENABLED=false` — 禁用心跳
- `PICOCLAW_HEARTBEAT_INTERVAL=60` — 修改间隔

## 使用 Spawn 执行异步任务

对于耗时较长的任务（网络搜索、API 调用），使用 `spawn` 工具创建**子 Agent** 异步处理：

```markdown
# 周期任务

## 快速任务（直接响应）

- 报告当前时间

## 耗时任务（使用 spawn 异步处理）

- 搜索最新的 AI 新闻并汇总
- 检查邮件并报告重要消息
```

**关键行为：**

| 特性 | 说明 |
| --- | --- |
| **spawn** | 创建异步子 Agent，不阻塞心跳主流程 |
| **独立上下文** | 子 Agent 有自己的上下文，不共享会话历史 |
| **message 工具** | 子 Agent 通过 message 工具直接与用户通信 |
| **非阻塞** | spawn 后，心跳继续处理下一个任务 |

## 子 Agent 通信流程

```
心跳触发
    ↓
Agent 读取 HEARTBEAT.md
    ↓
遇到耗时任务：spawn 子 Agent
    ↓                           ↓
继续处理下一个任务         子 Agent 独立工作
    ↓                           ↓
所有任务处理完毕           子 Agent 调用 "message" 工具
    ↓                           ↓
响应 HEARTBEAT_OK          用户直接收到结果
```

子 Agent 拥有完整的工具访问权限（message、web_search 等），可独立与用户沟通，无需经过主 Agent 中转。

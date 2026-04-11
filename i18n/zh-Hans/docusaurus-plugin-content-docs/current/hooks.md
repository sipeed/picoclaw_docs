---
id: hooks
title: Hook 系统
---

# Hook 系统

PicoClaw 提供了一套 Hook 系统，允许你观察事件、拦截 LLM 和工具调用、以及通过审批逻辑来控制工具执行——无需修改核心代码。

## Hook 类型

| 类型 | 接口 | 阶段 | 是否可修改数据 |
|------|------|------|----------------|
| Observer（观察者） | EventObserver | EventBus 广播 | 否 |
| LLM interceptor（LLM 拦截器） | LLMInterceptor | before_llm / after_llm | 是 |
| Tool interceptor（工具拦截器） | ToolInterceptor | before_tool / after_tool | 是 |
| Tool approver（工具审批者） | ToolApprover | approve_tool | 否，返回允许/拒绝 |

## Hook 触发点

- **before_llm** — 在每次 LLM 请求之前触发。拦截器可以改写请求内容。
- **after_llm** — 在 LLM 响应之后触发。拦截器可以改写响应内容。
- **before_tool** — 在工具执行之前触发。拦截器可以改写参数。
- **after_tool** — 在工具执行之后触发。拦截器可以改写结果。
- **approve_tool** — 在工具执行之前（before_tool 之后）触发。审批者返回允许或拒绝。

## Hook 动作

拦截器返回一个 `HookDecision`，其中的 `action` 字段决定后续流程：

| 动作 | 适用阶段 | 效果 |
| --- | --- | --- |
| `continue` | 所有拦截器 | 不修改，直接放行 |
| `modify` | `before_llm`、`after_llm`、`before_tool`、`after_tool` | 修改请求/响应后继续 |
| `respond` | `before_tool` | 直接返回工具结果，**跳过实际的工具执行** |
| `deny_tool` | `before_tool` | 拒绝工具执行，返回错误信息 |
| `abort_turn` | 所有拦截器 | 中止当前轮次 |
| `hard_abort` | 所有拦截器 | 强制停止整个 Agent 循环 |

### `respond` 动作

`respond` 允许 `before_tool` hook 直接提供工具结果，从而**让真正的工具实现根本不会被执行**。典型用途：

1. **插件式工具注入**：通过 hook 实现工具，不需要在工具注册表里登记
2. **结果缓存**：对重复的工具调用直接返回缓存结果
3. **工具 mock**：在测试场景下返回固定结果

当 hook 返回 `respond` + 一份 `HookResult` 时，Agent 主循环会：

1. 跳过真正的工具执行
2. 把 hook 提供的结果当成工具结果使用
3. 用这个结果继续当前轮次

:::caution 安全风险
`respond` 会**绕过 `approve_tool` 检查**。Hook 可以为任何工具（包括 `bash` 这类敏感工具）直接返回结果，而无需经过审批环节。请只把 `respond` 能力授予可信的 hook，对不安全的调用优先用 `deny_tool`。
:::

进程内 Go hook 示例：

```go
func (h *MyHook) BeforeTool(
    ctx context.Context,
    call *agent.ToolCallHookRequest,
) (*agent.ToolCallHookRequest, agent.HookDecision, error) {
    if call.Tool == "my_plugin_tool" {
        next := call.Clone()
        next.HookResult = &tools.ToolResult{
            ForLLM:  "Plugin tool executed successfully",
            Silent:  false,
            IsError: false,
        }
        return next, agent.HookDecision{Action: agent.HookActionRespond}, nil
    }
    return call, agent.HookDecision{Action: agent.HookActionContinue}, nil
}
```

进程型 hook 示例（Python，stdio 上的 JSON-RPC）：

```python
def handle_before_tool(id, params):
    if params.get("name") == "my_plugin_tool":
        _respond(id, {
            "decision": {"action": "respond"},
            "hook_result": {
                "for_llm": "Plugin tool executed successfully",
                "is_error": False,
            },
        })
        return
    _respond(id, {"decision": {"action": "continue"}})
```

完整的 JSON-RPC 字段定义和「插件式工具注入」的最佳实践，参见上游文档 [`docs/hooks/hook-json-protocol.md`](https://github.com/sipeed/picoclaw/blob/main/docs/hooks/hook-json-protocol.md) 和 [`docs/hooks/plugin-tool-injection.md`](https://github.com/sipeed/picoclaw/blob/main/docs/hooks/plugin-tool-injection.md)。

## 执行顺序

1. **进程内 Hook**（in-process）优先执行。
2. **外部进程 Hook**（process hooks）随后执行。
3. 在同一组内，按 **priority**（优先级）排序，数值越小越先执行。
4. 如果两个 Hook 优先级相同，则按**名称**（字典序）排序。

## 超时设置

全局默认值在 `hooks.defaults` 下配置：

| 字段 | 说明 |
|------|------|
| `observer_timeout_ms` | 观察者回调的最大执行时间，超时后将被取消。 |
| `interceptor_timeout_ms` | 拦截器的最大执行时间，超时后将被取消。 |
| `approval_timeout_ms` | 审批者的最大执行时间，超时后工具调用将被默认拒绝。 |

## 快速开始

在 PicoClaw 配置中添加以下内容即可启用一个 Python 外部进程 Hook：

```json
{
  "hooks": {
    "enabled": true,
    "processes": {
      "py_review_gate": {
        "enabled": true,
        "priority": 100,
        "transport": "stdio",
        "command": ["python3", "/tmp/review_gate.py"],
        "observe": ["tool_exec_start", "tool_exec_end", "tool_exec_skipped"],
        "intercept": ["before_tool", "approve_tool"],
        "env": {
          "PICOCLAW_HOOK_LOG_FILE": "/tmp/picoclaw-hook-review-gate.log"
        }
      }
    }
  }
}
```

## Go 进程内示例

直接在 Go 中注册 Hook：

```go
package main

import (
    "context"
    "log"

    "github.com/anthropics/picoclaw/hook"
)

type auditHook struct{}

func (h *auditHook) Name() string { return "audit" }

func (h *auditHook) BeforeTool(ctx context.Context, req *hook.ToolRequest) (*hook.ToolRequest, error) {
    log.Printf("tool=%s args=%v", req.Name, req.Args)
    return req, nil // pass through unmodified
}

func init() {
    hook.Register(&auditHook{})
}
```

## Python 外部进程 Hook 示例

以下 `review_gate.py` 实现了一个外部进程 Hook，用于观察工具事件、参与 before_tool 拦截和 approve_tool 审批。它仅记录日志，不会改写参数或拒绝执行。

```python
#!/usr/bin/env python3
"""review_gate.py – PicoClaw process-hook (JSON-RPC over stdio).

Supports:
  hook.hello      – handshake
  hook.event      – observe events (log only)
  hook.before_tool – intercept before tool execution (pass-through)
  hook.approve_tool – approve tool execution (always allow)
"""

import json
import os
import sys

LOG_FILE = os.environ.get("PICOCLAW_HOOK_LOG_FILE", "/tmp/picoclaw-hook-review-gate.log")


def _log(msg: str) -> None:
    with open(LOG_FILE, "a") as f:
        f.write(msg + "\n")


def _respond(id: int | str | None, result: dict) -> None:
    payload = {"jsonrpc": "2.0", "id": id, "result": result}
    line = json.dumps(payload)
    sys.stdout.write(line + "\n")
    sys.stdout.flush()


def handle_hello(id, params):
    _log(f"hello: protocol_version={params.get('protocol_version')}")
    _respond(id, {"name": "py_review_gate", "protocol_version": 1})


def handle_event(id, params):
    _log(f"event: {params.get('type')} — {json.dumps(params.get('data', {}))}")
    _respond(id, {})


def handle_before_tool(id, params):
    tool = params.get("name", "<unknown>")
    _log(f"before_tool: {tool}")
    # Pass through unmodified
    _respond(id, {"args": params.get("args", {})})


def handle_approve_tool(id, params):
    tool = params.get("name", "<unknown>")
    _log(f"approve_tool: {tool} → allow")
    _respond(id, {"allow": True})


DISPATCH = {
    "hook.hello": handle_hello,
    "hook.event": handle_event,
    "hook.before_tool": handle_before_tool,
    "hook.approve_tool": handle_approve_tool,
}


def main() -> None:
    _log("review_gate started")
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            _log(f"bad json: {line}")
            continue

        method = msg.get("method", "")
        handler = DISPATCH.get(method)
        if handler:
            handler(msg.get("id"), msg.get("params", {}))
        else:
            _log(f"unknown method: {method}")
    _log("review_gate exiting")


if __name__ == "__main__":
    main()
```

## 外部进程 Hook 协议

外部进程 Hook 通过 **stdio** 上的 **JSON-RPC 2.0** 协议与 PicoClaw 通信（每行一个 JSON 对象）。

1. PicoClaw 启动进程后发送 `hook.hello`，参数为 `{"protocol_version": 1}`。
2. 进程必须回复 `{"name": "<hook_name>", "protocol_version": 1}`。
3. 随后 PicoClaw 会根据配置发送 `hook.event`、`hook.before_tool`、`hook.after_tool` 或 `hook.approve_tool` 消息。
4. 进程需要为每个请求回复一个 JSON-RPC 响应。

从 PicoClaw 的角度来看，所有通信都是同步的：它发送请求后等待恰好一个响应（受配置的超时时间限制）。

## 配置参考

### 内置 Hook — `hooks.builtins.<name>`

| 字段 | 类型 | 说明 |
|------|------|------|
| `enabled` | bool | 是否启用此内置 Hook。 |
| `priority` | int | 执行顺序（数值越小越先执行）。 |
| `config` | object | 传递给内置 Hook 的特定配置。 |

### 外部进程 Hook — `hooks.processes.<name>`

| 字段 | 类型 | 说明 |
|------|------|------|
| `enabled` | bool | 是否启用此外部进程 Hook。 |
| `priority` | int | 执行顺序（数值越小越先执行）。 |
| `transport` | string | 传输协议。目前仅支持 `"stdio"`。 |
| `command` | string[] | 启动进程的命令及参数。 |
| `dir` | string | 进程的工作目录。 |
| `env` | object | 传递给进程的额外环境变量。 |
| `observe` | string[] | 此 Hook 要观察的事件类型列表。 |
| `intercept` | string[] | 此 Hook 要拦截的 Hook 触发点列表。 |

## 适用范围与限制

Hook 系统最适合以下场景：

- **LLM 请求改写** — 规范化提示词、注入系统上下文、执行策略。
- **工具参数规范化** — 在执行前清理或转换参数。
- **执行前工具审批** — 使用自定义逻辑控制危险操作。
- **审计** — 记录所有 LLM 和工具活动，用于合规或调试。

尚不支持的功能：

- 无限期暂停执行以等待人工审批（请用 `approval_timeout_ms` 加进程 hook 实现同步审批）。
- 完整的消息级拦截（目前仅支持 LLM 请求/响应和工具调用/结果的拦截）。

## 故障排查

- **Hook 未触发** — 确认 `enabled: true`，并检查事件类型或 Hook 触发点是否已列在 `observe` 或 `intercept` 中。
- **超时错误** — 增大 `hooks.defaults` 中对应的超时值。检查外部进程 Hook 是否在每次响应后刷新了 stdout。
- **进程 Hook 启动时崩溃** — 手动运行该命令，检查是否缺少依赖或存在语法错误。
- **JSON 解析错误** — 确保每行恰好一个 JSON 对象，stdout 上不要有多余输出（调试信息请使用 stderr 或日志文件）。

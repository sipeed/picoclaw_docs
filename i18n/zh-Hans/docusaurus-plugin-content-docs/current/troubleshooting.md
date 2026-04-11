---
id: troubleshooting
title: 故障排查
---

# 故障排查

## "model ... not found in model_list" 或 OpenRouter 错误

**症状：** 出现如下错误：

```
Error creating provider: model "openrouter/free" not found in model_list
```

或者 OpenRouter 返回 400 错误。

**原因：** `model_list` 中的 `model` 字段会直接发送给上游 API。对于 OpenRouter，必须使用完整的模型 ID（如 `openrouter/google/gemma-2-9b-it:free`），而不是简写（如 `openrouter/free`）。

- 错误写法：`"model": "openrouter/free"`
- 正确写法：`"model": "openrouter/google/gemma-2-9b-it:free"`

**修复方法：**

1. `agents.defaults.model_name` 必须匹配 `model_list` 中的某个 `model_name`。
2. 该条目的 `model` 字段必须是提供商认可的有效模型 ID。

正确配置示例：

```json
{
  "agents": {
    "defaults": {
      "model_name": "openrouter-free"
    }
  },
  "model_list": [
    {
      "model_name": "openrouter-free",
      "model": "openrouter/google/gemma-2-9b-it:free",
      "api_key": "sk-or-v1-your-openrouter-key"
    }
  ]
}
```

## 网络搜索显示"API 配置问题"

未配置搜索 API Key 时属于正常情况。PicoClaw 会提供链接供你手动搜索。

启用网络搜索：

1. **方式一（推荐）**：在 [https://brave.com/search/api](https://brave.com/search/api) 免费获取 API Key（每月 2000 次查询），搜索效果最佳。
2. **方式二（无需信用卡）**：如果没有 Key，系统会自动回退到 **DuckDuckGo**（无需 Key）。

将 Key 添加到 `~/.picoclaw/config.json`：

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "api_key": "YOUR_BRAVE_API_KEY",
        "max_results": 5
      }
    }
  }
}
```

## 内容过滤错误

某些提供商（如智谱 AI）有内容过滤，请尝试换一种表达方式或使用其他模型。

## Telegram 机器人提示"Conflict: terminated by other getUpdates"

同一时间只能运行一个 `picoclaw gateway` 实例，请停止其他实例后再启动。

## 网关无法从其他设备访问

默认情况下，网关监听 `127.0.0.1`（仅本机可访问）。如需在局域网中访问：

- 在环境变量或配置中设置 `PICOCLAW_GATEWAY_HOST=0.0.0.0`。
- 如果使用 Web 启动器，运行 `./picoclaw-launcher -public`。

## Agent 挂起或超时

- 检查网络连接和 API Key 是否有效。
- 尝试切换到其他模型提供商，排除上游服务故障。
- 如果任务较复杂，可在 `agents.defaults` 中增大 `max_tokens` 或 `max_tool_iterations`。

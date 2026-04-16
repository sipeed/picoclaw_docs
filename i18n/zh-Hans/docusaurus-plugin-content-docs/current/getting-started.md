---
id: getting-started
title: 快速开始
---

# 快速开始

2 分钟内启动 PicoClaw。

:::tip 提醒
请先获取并确保您的 API Key 可用。支持的模型列表请见 [Model 配置](./configuration/model-list.md)。网络搜索是**可选的**，可获取免费的 [Tavily API](https://tavily.com)（每月 1000 次免费查询）或 [Brave Search API](https://brave.com/search/api)（每月 2000 次免费查询）。
:::

## 使用 WebUI（`picoclaw-launcher`）进行配置

对大多数用户，推荐通过 **Launcher WebUI** 完成配置，而不是先手动改配置文件。

1. 直接启动 WebUI 启动器（无需预初始化），可用命令行：

```bash
picoclaw-launcher
```

或双击 `picoclaw-launcher`（Windows 为 `picoclaw-launcher.exe`）。

<div style={{textAlign: 'center'}}>
  <img src="/img/launcher.png" alt="picoclaw-launcher 图标" width="120" />
</div>

>`picoclaw-launcher-tui` 已停止维护，正在逐步淘汰，建议优先使用 `picoclaw-launcher`。

2. 打开 `http://localhost:18800`，在界面内完成：
- 至少添加一个模型并设为默认模型
- 配置网络搜索（当前需通过配置文件，见 [网络搜索配置](./configuration/web-search-setup.md) ）
- 在 Launcher 中启动 Gateway

![WebUI](/img/picoclaw-launcher.png)

- 更多模型字段与完整配置文件见 [Model 配置](./configuration/model-list.md#配置文件))。

配置完成后就可以使用PicoClaw了。
![WebUI](/img/Hello.png)

## 启用网络搜索
如果不启用网络搜索，很多真实场景（查最新信息、找链接、事实核验）会明显受限。
建议在首次配置时至少启用一个搜索引擎。

当前版本中，网络搜索需通过配置文件（`config.json` + `.security.yml`）配置，WebUI 暂无对应入口。完整说明见 [网络搜索配置](./configuration/web-search-setup.md)。

## CLI 命令参考

CLI 命令与 `picoclaw-launcher` 参数详见 [CLI 命令与参数](./configuration/cli-parameters.md)。

## 定时任务

PicoClaw 通过 `cron` 工具支持提醒和周期性任务：

- **一次性提醒**："10 分钟后提醒我"
- **周期性任务**："每 2 小时提醒我"
- **Cron 表达式**："每天早上 9 点提醒我"

任务存储在 `~/.picoclaw/workspace/cron/` 目录下，自动处理。

## 故障排查

### 网络搜索显示“API 配置问题”

如果还没有配置搜索 API Key，这是正常现象。

启用网络搜索：

1. **方式一（国内内容优先）**：使用 [**Baidu Search**](https://www.baidu.com/)（单日 1000 次免费查询）。
2. **方式二（推荐）**：在 [https://brave.com/search/api](https://brave.com/search/api) 免费获取 API Key（每月 2000 次查询）。
3. **方式三（无需信用卡）**：使用 [**DuckDuckGo**](https://duckduckgo.com/) 回退（无需 Key）。

### 内容过滤错误

某些提供商（如智谱）有内容过滤，请尝试更换表达方式或使用其他模型。

### Telegram 机器人提示 “Conflict: terminated by other getUpdates”

同一时间只能运行一个 `picoclaw gateway` 实例，请停止其他实例。

## API Key 对比

| 服务 | 免费额度 | 用途 |
| --- | --- | --- |
| **OpenRouter** | 每月 20 万 token | 多模型聚合（Claude、GPT-4 等） |
| **火山引擎 CodingPlan** | 9.9 元首月 | 适合国内用户，多种 SOTA 模型（豆包、DeepSeek 等） |
| **智谱 AI** | 每月 20 万 token | 适合国内用户 |
| [**Baidu Search**](https://www.baidu.com/) | 单日 1000 次查询 | 更偏向国内内容 |
| [**Brave Search**](https://brave.com/search/api) | 每月 2000 次查询 | 网络搜索功能 |
| [**Tavily**](https://tavily.com) | 每月 1000 次查询 | AI Agent 优化搜索 |
| **Groq** | 提供免费层级 | 极速推理（Llama、Mixtral） |
| **Cerebras** | 提供免费层级 | 极速推理（Llama、Qwen） |

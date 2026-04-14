---
id: getting-started
title: 快速开始
---

# 快速开始

2 分钟内启动 PicoClaw。

## 默认配置方式（推荐）：使用 WebUI

对大多数用户，默认推荐通过 **Launcher WebUI** 完成配置，而不是先手动改 JSON。

1. 先初始化一次：

```bash
picoclaw onboard
```

2. 启动 WebUI 启动器：

```bash
picoclaw-launcher
```

3. 打开 `http://localhost:18800`，在界面内完成：
- 至少添加一个模型并设置为默认模型
- 配置网络搜索（建议首次使用前就配置，见下一节）
- 在 Launcher 中启动 Gateway

![WebUI](/img/picoclaw-launcher.png)

## 网络搜索配置

如果不配置搜索，很多真实场景（查最新信息、找链接、核验事实）体验会明显受限。
建议在首次配置时就启用至少一个搜索引擎。

### 方式 A：在 WebUI 中配置（推荐）

在 Launcher WebUI 的工具配置中启用 Web Search 提供商：
- [`Baidu Search`](https://www.baidu.com/)（单日 1000 次免费查询，更偏向国内内容）
- [`Brave Search`](https://brave.com/search/api)（推荐主用，免费额度可用）
- [`DuckDuckGo`](https://duckduckgo.com/)（无 Key 回退）

### 方式 B：`config.json` + `.security.yml`（schema v2 默认）

在 schema v2 中，推荐把结构放在 `config.json`，真实密钥放在 `.security.yml`。

编辑 `~/.picoclaw/config.json`：

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": true,
        "max_results": 5
      }
    }
  }
}
```

然后把密钥写入 `~/.picoclaw/.security.yml`：

```yaml
web:
  brave:
    api_keys:
      - "YOUR_BRAVE_API_KEY"
```

申请 Key：
- [Baidu Search](https://www.baidu.com/)（单日 1000 次免费查询，更偏向国内内容）
- [Brave Search API](https://brave.com/search/api)（每月 2000 次免费查询）
- [Tavily API](https://tavily.com)（每月 1000 次免费查询）

## 模型配置（如果你偏好手动 JSON）

如需手动配置，建议使用 `config.json` + `.security.yml`：

```json
{
  "version": 2,
  "agents": {
    "defaults": {
      "workspace": "~/.picoclaw/workspace",
      "model_name": "gpt-5.4",
      "max_tokens": 32768,
      "max_tool_iterations": 50
    }
  },
  "model_list": [
    {
      "model_name": "ark-code-latest",
      "model": "volcengine/ark-code-latest"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6"
    }
  ]
}
```

`~/.picoclaw/.security.yml`：

```yaml
model_list:
  ark-code-latest:0:
    api_keys:
      - "sk-your-volcengine-key"
  gpt-5.4:0:
    api_keys:
      - "sk-your-openai-key"
  claude-sonnet-4.6:0:
    api_keys:
      - "sk-your-anthropic-key"
```

详见 [Model 配置](./configuration/model-list.md)。
密钥字段映射规则见 [`.security.yml 配置参考`](./configuration/security-reference.md)。

## CLI 命令参考

| 命令 | 描述 |
| --- | --- |
| `picoclaw onboard` | 初始化配置和工作目录 |
| `picoclaw agent -m "你好"` | 单次对话 |
| `picoclaw agent` | 交互式对话模式 |
| `picoclaw gateway` | 启动网关（用于聊天应用） |
| `picoclaw status` | 显示状态 |
| `picoclaw cron list` | 列出所有定时任务 |
| `picoclaw cron add ...` | 添加定时任务 |

## Web UI（`picoclaw-launcher`）

双击 `picoclaw-launcher`（Windows 上为 `picoclaw-launcher.exe`）会打开 `http://localhost:18800`。

`picoclaw-launcher-tui`已经停止维护，正在逐步舍弃，建议优先使用 `picoclaw-launcher`。

### Web UI `picoclaw-launcher` 参数说明

| 参数 | 作用 | 示例 |
| --- | --- | --- |
| `-console` | 终端模式运行（不启用托盘 GUI），并在启动输出中打印登录提示/令牌来源 | `picoclaw-launcher -console` |
| `-public` | 监听 `0.0.0.0`，允许局域网设备访问 WebUI | `picoclaw-launcher -public` |
| `-no-browser` | 启动时不自动打开浏览器 | `picoclaw-launcher -no-browser` |
| `-port &lt;port&gt;` | 指定端口（默认 `18800`） | `picoclaw-launcher -port 19999` |
| `-lang &lt;en|zh&gt;` | 指定 UI 语言 | `picoclaw-launcher -lang zh` |
| `[config.json]` | 可选：指定配置文件路径 | `picoclaw-launcher ./config.json` |

常见组合：

```bash
# 无头服务器（SSH）常用：终端模式 + 不自动开浏览器 + 局域网访问
picoclaw-launcher -console -no-browser -public

# 自定义端口 + 指定配置文件
picoclaw-launcher -port 19999 ./config.json
```

## 定时任务

PicoClaw 通过 `cron` 工具支持提醒和周期性任务：

- **一次性提醒**："10 分钟后提醒我"
- **周期性任务**："每 2 小时提醒我"
- **Cron 表达式**："每天早上 9 点提醒我"

任务存储在 `~/.picoclaw/workspace/cron/` 目录下，自动处理。

## 在 Android 上运行（Termux）

让旧手机变身 AI 助手：

```bash
wget https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz
tar xzf picoclaw_Linux_arm64.tar.gz
pkg install proot
termux-chroot ./picoclaw onboard
```

![PicoClaw 在 Termux 中运行](https://github.com/sipeed/picoclaw/raw/main/assets/termux.jpg)

## 故障排查

### 网络搜索显示“API 配置问题”

如果还没配置搜索 API Key，这是正常现象。

启用网络搜索：

1. **方式一（国内内容优先）**：使用 [**Baidu Search**](https://www.baidu.com/)（单日 1000 次免费查询）。
2. **方式二（推荐）**：在 [https://brave.com/search/api](https://brave.com/search/api) 免费获取 API Key（每月 2000 次查询）。
3. **方式三（无需信用卡）**：使用 [**DuckDuckGo**](https://duckduckgo.com/) 回退（无需 Key）。

### 内容过滤错误

某些提供商（如智谱 AI）有内容过滤，请尝试换一种表达方式或使用其他模型。

### Telegram 机器人提示 “Conflict: terminated by other getUpdates”

同一时间只能运行一个 `picoclaw gateway` 实例，请停止其他实例。

## API Key 对比

| 服务 | 免费额度 | 用途 |
| --- | --- | --- |
| **OpenRouter** | 每月 20 万 token | 多模型聚合（Claude、GPT-4 等） |
| **火山引擎 CodingPlan** | 9.9 元/首月 | 适合国内用户，多种 SOTA 模型（豆包、DeepSeek 等） |
| **智谱 AI** | 每月 20 万 token | 适合国内用户 |
| [**Baidu Search**](https://www.baidu.com/) | 单日 1000 次查询 | 更偏向国内内容 |
| [**Brave Search**](https://brave.com/search/api) | 每月 2000 次查询 | 网络搜索功能 |
| [**Tavily**](https://tavily.com) | 每月 1000 次查询 | AI Agent 搜索优化 |
| **Groq** | 提供免费层级 | 极速推理（Llama、Mixtral） |
| **Cerebras** | 提供免费层级 | 极速推理（Llama、Qwen） |

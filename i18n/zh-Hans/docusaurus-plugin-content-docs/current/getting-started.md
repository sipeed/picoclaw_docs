---
id: getting-started
title: 快速开始
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始

2 分钟内启动 PicoClaw。

:::tip 获取 API Key
在 `~/.picoclaw/config.json` 中设置您的 API Key。获取 API Key：[Volcengine（CodingPlan）](https://console.volcengine.com)（LLM）· [OpenRouter](https://openrouter.ai/keys)（LLM）· [智谱 AI](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys)（LLM）。网络搜索是**可选的** — 获取免费的 [Tavily API](https://tavily.com)（每月 1000 次免费查询）或 [Brave Search API](https://brave.com/search/api)（每月 2000 次免费查询）
:::

## 第零步：安装 PicoClaw

<Tabs>
  <TabItem value="pwsh" label="PowerShell（跨平台）" default>

PowerShell 安装脚本支持 Windows 与类 Unix 平台。

- Linux/macOS/FreeBSD/NetBSD 需先安装 PowerShell Core（`pwsh`）。
- 支持用户安装与系统安装两种模式。
- 以下命令必须在 PowerShell 终端执行，不能直接粘贴到 bash/ash/zsh。
- 在轻量 Linux 发行版（例如 OpenWrt）上，**不建议**使用 `user` 模式，可能会遇到 PATH 问题。更推荐使用 root 权限执行 `system` 模式安装。

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/sipeed/picoclaw_docs/main/static/scripts/picoclaw/install-picoclaw.ps1" -OutFile install-picoclaw.ps1

if (Get-Command pwsh -ErrorAction SilentlyContinue) {
  pwsh -ExecutionPolicy Bypass -File ./install-picoclaw.ps1 -InstallMode user -Source cdn
} elseif ($env:OS -eq "Windows_NT" -and (Get-Command powershell.exe -ErrorAction SilentlyContinue)) {
  powershell.exe -ExecutionPolicy Bypass -File .\install-picoclaw.ps1 -InstallMode user -Source cdn
} else {
  throw "未找到 PowerShell 可执行程序，请先安装 PowerShell Core（pwsh）。"
}
```

  </TabItem>
  <TabItem value="bash" label="Bash（类 Unix）">

Bash 安装脚本支持 Linux/macOS/FreeBSD/NetBSD。

- 暂不支持 Windows。
- 需要 GNU Bash 4+。
- 不支持 `ash` / BusyBox 等轻量 shell。
- 在轻量 Linux 发行版（例如 OpenWrt）上，**不建议**使用 `user` 模式，可能会遇到 PATH 问题。更推荐使用 root 权限执行 `system` 模式安装。

```bash
curl -fsSL https://raw.githubusercontent.com/sipeed/picoclaw_docs/main/static/scripts/picoclaw/install-picoclaw.sh -o install-picoclaw.sh
chmod +x ./install-picoclaw.sh
bash ./install-picoclaw.sh --mode user --source cdn
```

  </TabItem>
</Tabs>

完整安装方式请查看 [安装页面](./installation)。

## 第一步：初始化

```bash
picoclaw onboard
```

此命令创建工作目录 `~/.picoclaw/` 并生成默认配置文件。

## 第二步：配置

编辑 `~/.picoclaw/config.json`：

```json
{
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
      "model": "volcengine/ark-code-latest",
      "api_key": "sk-your-api-key"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "your-api-key"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6",
      "api_key": "your-anthropic-key"
    }
  ]
}
```

详见 [Model 配置](./configuration/model-list)，查看所有支持的提供商。

## 第三步：对话

```bash
# 单次对话
picoclaw agent -m "你好，今天天气怎么样？"

# 交互模式
picoclaw agent
```

完成！你的 AI 助手已准备就绪。

## CLI 命令参考

| 命令 | 描述 |
| --- | --- |
| `picoclaw onboard` | 初始化配置和工作目录 |
| `picoclaw agent -m "..."` | 单次对话 |
| `picoclaw agent` | 交互式对话模式 |
| `picoclaw gateway` | 启动网关（用于聊天应用） |
| `picoclaw status` | 显示状态 |
| `picoclaw cron list` | 列出所有定时任务 |
| `picoclaw cron add ...` | 添加定时任务 |

## 可视化启动器（Launcher）

不想手动编辑 JSON？发布包中自带两个启动器，双击即可运行：

### Web 启动器（`picoclaw-launcher`）

双击 `picoclaw-launcher`（Windows 上为 `picoclaw-launcher.exe`），会在浏览器中打开配置界面 `http://localhost:18800`。

在界面中你可以：
- **添加模型** — 卡片式模型管理，设置主力模型，未配置 API Key 则显示为灰色
- **配置渠道** — 表单式配置 Telegram、Discord、Slack、企业微信等
- **OAuth 登录** — 一键登录 OpenAI、Anthropic、Google Antigravity
- **启停网关** — 直接管理 `picoclaw gateway` 进程

如需从局域网中的其他设备访问（例如用手机配置）：

```bash
./picoclaw-launcher -public
```

### TUI 启动器（`picoclaw-launcher-tui`）

适用于无图形界面的环境（SSH、嵌入式设备），在终端中运行 `picoclaw-launcher-tui`，提供菜单式操作界面，支持模型选择、渠道配置、启动 Agent/网关、查看日志等。

## 定时任务

PicoClaw 通过 `cron` 工具支持提醒和周期性任务：

- **一次性提醒**："10 分钟后提醒我"
- **周期性任务**："每 2 小时提醒我"
- **Cron 表达式**："每天早上 9 点提醒我"

任务存储在 `~/.picoclaw/workspace/cron/` 目录下，自动处理。

## 在 Android 上运行（Termux）

让旧手机变身 AI 助手：

```bash
# 注意：请将 v0.1.1 替换为 Releases 页面中的最新版本号
wget https://github.com/sipeed/picoclaw/releases/download/v0.1.1/picoclaw-linux-arm64
chmod +x picoclaw-linux-arm64
pkg install proot
termux-chroot ./picoclaw-linux-arm64 onboard
```

![PicoClaw 在 Termux 中运行](https://github.com/sipeed/picoclaw/raw/main/assets/termux.jpg)

## 故障排查

### 网络搜索显示"API 配置问题"

未配置搜索 API Key 时属于正常情况。PicoClaw 会提供链接供你手动搜索。

启用网络搜索：

1. **方式一（推荐）**：在 [https://brave.com/search/api](https://brave.com/search/api) 免费获取 API Key（每月 2000 次查询），搜索效果最佳。
2. **方式二（无需信用卡）**：如果没有 Key，系统会自动回退到 **DuckDuckGo**（无需 Key）。

使用 Brave 时，将 Key 添加到 `~/.picoclaw/config.json`：

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": false,
        "api_key": "YOUR_BRAVE_API_KEY",
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

### 内容过滤错误

某些提供商（如智谱 AI）有内容过滤，请尝试换一种表达方式或使用其他模型。

### Telegram 机器人提示"Conflict: terminated by other getUpdates"

同一时间只能运行一个 `picoclaw gateway` 实例，请停止其他实例。

## API Key 对比

| 服务 | 免费额度 | 用途 |
| --- | --- | --- |
| **OpenRouter** | 每月 20 万 token | 多模型聚合（Claude、GPT-4 等） |
| **火山引擎 CodingPlan** | 9.9 元/首月 | 最适合国内用户，多种 SOTA 模型（豆包、DeepSeek 等） |
| **智谱 AI** | 每月 20 万 token | 适合国内用户 |
| **Brave Search** | 每月 2000 次查询 | 网络搜索功能 |
| **Tavily** | 每月 1000 次查询 | AI Agent 搜索优化 |
| **Groq** | 提供免费层级 | 极速推理（Llama、Mixtral） |
| **Cerebras** | 提供免费层级 | 极速推理（Llama、Qwen） |

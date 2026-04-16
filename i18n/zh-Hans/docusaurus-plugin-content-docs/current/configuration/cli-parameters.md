---
id: cli-parameters
title: CLI 命令与参数
---

# CLI 命令与参数

## 核心 CLI 命令

| 命令 | 说明 |
| --- | --- |
| `picoclaw onboard` | 初始化配置和工作目录 |
| `picoclaw agent -m "你好"` | 单次对话 |
| `picoclaw agent` | 交互式对话模式 |
| `picoclaw gateway` | 启动网关（用于聊天应用） |
| `picoclaw status` | 显示状态 |
| `picoclaw cron list` | 列出所有定时任务 |
| `picoclaw cron add ...` | 添加定时任务 |

## `picoclaw-launcher` 参数说明

| 参数 | 作用 | 示例 |
| --- | --- | --- |
| `-console` | 终端模式运行（不启用托盘 GUI），并在启动输出中打印登录提示和令牌来源 | `picoclaw-launcher -console` |
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

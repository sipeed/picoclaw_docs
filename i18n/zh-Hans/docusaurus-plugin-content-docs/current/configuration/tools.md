---
id: tools
title: 工具配置
---

# 工具配置

工具配置位于 `config.json` 的 `tools` 字段下。

```json
{
  "tools": {
    "web": { ... },
    "mcp": { ... },
    "exec": { ... },
    "cron": { ... },
    "skills": { ... }
  }
}
```

## 网络搜索工具

网络搜索工具用于网页搜索和抓取。

### Brave Search

| 配置项        | 类型   | 默认值 | 说明                 |
| ------------- | ------ | ------ | -------------------- |
| `enabled`     | bool   | false  | 启用 Brave 搜索      |
| `api_key`     | string | —      | Brave Search API Key |
| `max_results` | int    | 5      | 最大返回结果数       |

在 [brave.com/search/api](https://brave.com/search/api) 免费获取 API Key（每月 2000 次查询）。

### DuckDuckGo

| 配置项        | 类型 | 默认值 | 说明                 |
| ------------- | ---- | ------ | -------------------- |
| `enabled`     | bool | true   | 启用 DuckDuckGo 搜索 |
| `max_results` | int  | 5      | 最大返回结果数       |

DuckDuckGo 默认启用，无需 API Key。

### Perplexity

| 配置项        | 类型   | 默认值 | 说明                 |
| ------------- | ------ | ------ | -------------------- |
| `enabled`     | bool   | false  | 启用 Perplexity 搜索 |
| `api_key`     | string | —      | Perplexity API Key   |
| `max_results` | int    | 5      | 最大返回结果数       |

### Tavily

| 配置项        | 类型   | 默认值 | 说明                   |
| ------------- | ------ | ------ | ---------------------- |
| `enabled`     | bool   | false  | 启用 Tavily 搜索       |
| `api_key`     | string | —      | Tavily API Key         |
| `base_url`    | string | —      | 自定义 Tavily API 地址 |
| `max_results` | int    | 5      | 最大返回结果数         |

### GLM (智谱)

| 配置项          | 类型   | 默认值       | 说明                                                               |
| --------------- | ------ | ------------ | ------------------------------------------------------------------ |
| `enabled`       | bool   | false        | 启用 GLM 搜索                                                      |
| `api_key`       | string | —            | GLM API key                                                        |
| `base_url`      | string | —            | 自定义 GLM API 地址                                                |
| `search_engine` | string | search_std | 搜索后端 (search_pro, search_pro_sogou, or search_pro_quark) |
| `max_results`   | int    | 5            | 最大返回结果数                                                     |

### 网络代理

所有网络工具（搜索和抓取）可共享同一个代理：

| 配置项              | 类型   | 默认值   | 说明                                               |
| ------------------- | ------ | -------- | -------------------------------------------------- |
| `proxy`             | string | —        | 所有网络工具的代理地址（支持 http、https、socks5） |
| `fetch_limit_bytes` | int64  | 10485760 | 每次 URL 抓取的最大字节数（默认 10MB）             |

### 网络搜索配置示例

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "api_key": "YOUR_BRAVE_API_KEY",
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": true,
        "max_results": 5
      },
      "perplexity": {
        "enabled": false,
        "api_key": "pplx-xxx",
        "max_results": 5
      },
      "proxy": "socks5://127.0.0.1:1080"
    }
  }
}
```

## MCP（Model Context Protocol）

PicoClaw 支持 MCP 服务器，通过外部工具扩展 Agent 能力。

| 配置项    | 类型   | 默认值 | 说明                  |
| --------- | ------ | ------ | --------------------- |
| `enabled` | bool   | false  | 启用 MCP 集成         |
| `servers` | object | {}     | 命名的 MCP 服务器配置 |

每个 MCP 服务器支持两种连接模式：

**stdio 模式**（本地进程）：

| 配置项     | 类型   | 说明                     |
| ---------- | ------ | ------------------------ |
| `enabled`  | bool   | 启用此服务器             |
| `command`  | string | 要运行的命令（如 `npx`） |
| `args`     | array  | 命令参数                 |
| `env`      | object | 环境变量                 |
| `env_file` | string | 环境变量文件路径         |

**HTTP/SSE 模式**（远程服务器）：

| 配置项    | 类型   | 说明                  |
| --------- | ------ | --------------------- |
| `enabled` | bool   | 启用此服务器          |
| `type`    | string | `"http"` 或 `"sse"`   |
| `url`     | string | 服务器 URL            |
| `headers` | object | HTTP 头（如 API Key） |

### MCP 配置示例

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "servers": {
        "github": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-github"],
          "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
          }
        },
        "context7": {
          "enabled": true,
          "type": "http",
          "url": "https://mcp.context7.com/mcp",
          "headers": {
            "CONTEXT7_API_KEY": "ctx7sk-xx"
          }
        }
      }
    }
  }
}
```

MCP 工具以 `mcp_<服务器名>_<工具名>` 的命名格式注册，与内置工具并列显示。

## Exec 工具（命令执行）

Exec 工具代替 Agent 在系统上执行 Shell 命令。

| 配置项                  | 类型  | 默认值 | 说明                                      |
| ----------------------- | ----- | ------ | ----------------------------------------- |
| `enable_deny_patterns`  | bool  | true   | 启用默认危险命令拦截                      |
| `custom_deny_patterns`  | array | []     | 自定义拦截正则表达式                      |
| `custom_allow_patterns` | array | []     | 自定义允许规则 — 匹配的命令可绕过拦截检查 |

### 默认拦截的危险命令

PicoClaw 默认拦截以下命令：

- 删除类：`rm -rf`、`del /f/q`、`rmdir /s`
- 磁盘操作：`format`、`mkfs`、`diskpart`、`dd if=`、写入块设备（`/dev/sd*`、`/dev/nvme*`、`/dev/mmcblk*` 等）
- 系统操作：`shutdown`、`reboot`、`poweroff`
- 命令替换：`$()`、`${}`、反引号
- 管道执行：`| sh`、`| bash`
- 权限提升：`sudo`、`chmod`、`chown`
- 进程控制：`pkill`、`killall`、`kill -9`
- 远程执行：`curl | sh`、`wget | sh`、`ssh`
- 包管理：`apt`、`yum`、`dnf`、`npm install -g`、`pip install --user`
- 容器：`docker run`、`docker exec`
- Git：`git push`、`git force`
- 其他：`eval`、`source *.sh`

### 自定义允许规则

使用 `custom_allow_patterns` 可以显式放行被拦截规则阻止的命令：

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": ["^git push origin main$"]
    }
  }
}
```

### Exec 配置示例

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_deny_patterns": ["\\brm\\s+-r\\b", "\\bkillall\\s+python"],
      "custom_allow_patterns": []
    }
  }
}
```

## Cron 工具（定时任务）

| 配置项                 | 类型 | 默认值 | 说明                                   |
| ---------------------- | ---- | ------ | -------------------------------------- |
| `exec_timeout_minutes` | int  | 5      | 任务执行超时时间（分钟），0 表示不限制 |

## Skills 工具（技能商店）

Skills 工具管理通过注册表（如 ClawHub）发现和安装技能。

| 配置项                             | 类型   | 默认值               | 说明                |
| ---------------------------------- | ------ | -------------------- | ------------------- |
| `registries.clawhub.enabled`       | bool   | true                 | 启用 ClawHub 注册表 |
| `registries.clawhub.base_url`      | string | `https://clawhub.ai` | ClawHub 地址        |
| `registries.clawhub.search_path`   | string | `/api/v1/search`     | 搜索 API 路径       |
| `registries.clawhub.skills_path`   | string | `/api/v1/skills`     | 技能 API 路径       |
| `registries.clawhub.download_path` | string | `/api/v1/download`   | 下载 API 路径       |

```json
{
  "tools": {
    "skills": {
      "registries": {
        "clawhub": {
          "enabled": true,
          "base_url": "https://clawhub.ai"
        }
      }
    }
  }
}
```

## 环境变量

所有配置项均可通过环境变量覆盖，格式为 `PICOCLAW_TOOLS_<区域>_<键>`：

- `PICOCLAW_TOOLS_WEB_BRAVE_ENABLED=true`
- `PICOCLAW_TOOLS_EXEC_ENABLE_DENY_PATTERNS=false`
- `PICOCLAW_TOOLS_CRON_EXEC_TIMEOUT_MINUTES=10`

注意：数组类型的配置项暂不支持通过环境变量设置，必须在配置文件中配置。

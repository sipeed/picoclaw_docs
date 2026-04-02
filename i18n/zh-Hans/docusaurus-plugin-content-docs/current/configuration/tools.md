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

## 敏感数据过滤

在工具结果发送到 LLM 之前，PicoClaw 可以过滤输出中的敏感值（API Key、Token、Secret）。这可以防止 LLM 看到自己的凭证。

详见 [敏感数据过滤](/docs/sensitive-data-filtering)。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `filter_sensitive_data` | bool | `true` | 启用/禁用过滤 |
| `filter_min_length` | int | `8` | 触发过滤的最小内容长度 |

## 网络搜索工具

网络搜索工具用于网页搜索和抓取。

### Web Fetcher（网页抓取）

网页内容抓取和处理的通用设置。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | true | 启用网页抓取功能 |
| `fetch_limit_bytes` | int | 10485760 | 抓取网页的最大字节数（默认 10MB） |
| `format` | string | `"plaintext"` | 抓取内容的输出格式。可选：`plaintext` 或 `markdown`（推荐） |

### Brave Search

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | false | 启用 Brave 搜索 |
| `api_key` | string | -- | Brave Search API Key |
| `api_keys` | string[] | -- | 多个 API Key 轮换使用（优先于 `api_key`） |
| `max_results` | int | 5 | 最大返回结果数 |

在 [brave.com/search/api](https://brave.com/search/api) 免费获取 API Key（每月 2000 次查询）。

### DuckDuckGo

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | true | 启用 DuckDuckGo 搜索 |
| `max_results` | int | 5 | 最大返回结果数 |

DuckDuckGo 默认启用，无需 API Key。

### 百度搜索

百度搜索使用[千帆 AI 搜索 API](https://cloud.baidu.com/doc/qianfan-api/s/Wmbq4z7e5)，基于 AI 驱动，针对中文查询优化。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | false | 启用百度搜索 |
| `api_key` | string | -- | 千帆 API Key |
| `base_url` | string | `https://qianfan.baidubce.com/v2/ai_search/web_search` | 百度搜索 API 地址 |
| `max_results` | int | 5 | 最大返回结果数 |

```json
{
  "tools": {
    "web": {
      "baidu_search": {
        "enabled": true,
        "api_key": "YOUR_BAIDU_QIANFAN_API_KEY",
        "max_results": 10
      }
    }
  }
}
```

### Perplexity

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | false | 启用 Perplexity 搜索 |
| `api_key` | string | -- | Perplexity API Key |
| `api_keys` | string[] | -- | 多个 API Key 轮换使用（优先于 `api_key`） |
| `max_results` | int | 5 | 最大返回结果数 |

### Tavily

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | false | 启用 Tavily 搜索 |
| `api_key` | string | -- | Tavily API Key |
| `base_url` | string | -- | 自定义 Tavily API 地址 |
| `max_results` | int | 5 | 最大返回结果数 |

### SearXNG

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | false | 启用 SearXNG 搜索 |
| `base_url` | string | `http://localhost:8888` | SearXNG 实例 URL |
| `max_results` | int | 5 | 最大返回结果数 |

### GLM（智谱）

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | false | 启用 GLM 搜索 |
| `api_key` | string | -- | GLM API Key |
| `base_url` | string | `https://open.bigmodel.cn/api/paas/v4/web_search` | GLM 搜索 API 地址 |
| `search_engine` | string | `search_std` | 搜索引擎类型 |
| `max_results` | int | 5 | 最大返回结果数 |

### 网络代理

所有网络工具（搜索和抓取）可共享同一个代理：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `proxy` | string | -- | 所有网络工具的代理地址（支持 http、https、socks5） |
| `fetch_limit_bytes` | int64 | 10485760 | 每次 URL 抓取的最大字节数（默认 10MB） |

### 其他 Web 设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `prefer_native` | bool | true | 优先使用提供商的原生搜索而非配置的搜索引擎 |
| `private_host_whitelist` | string[] | `[]` | 允许网页抓取的私有/内部主机列表 |

### `web_search` 工具参数

运行时，`web_search` 工具接受以下参数：

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `query` | string | 是 | 搜索查询字符串 |
| `count` | integer | 否 | 返回结果数量。默认：`10`，最大：`10` |
| `range` | string | 否 | 可选时间过滤：`d`（天）、`w`（周）、`m`（月）、`y`（年） |

省略 `range` 时，PicoClaw 执行不限时间的搜索。

**`web_search` 调用示例：**

```json
{
  "query": "ai agent news",
  "count": 10,
  "range": "w"
}
```

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
      "baidu_search": {
        "enabled": false,
        "api_key": "YOUR_BAIDU_QIANFAN_API_KEY"
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

## Exec 工具（命令执行）

Exec 工具代替 Agent 在系统上执行 Shell 命令。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | true | 启用 exec 工具 |
| `enable_deny_patterns` | bool | true | 启用默认危险命令拦截 |
| `custom_deny_patterns` | array | [] | 自定义拦截正则表达式 |
| `custom_allow_patterns` | array | [] | 自定义允许规则 -- 匹配的命令可绕过拦截检查 |

### 禁用 Exec 工具

要完全禁用 `exec` 工具，将 `enabled` 设为 `false`：

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
PICOCLAW_TOOLS_EXEC_ENABLED=false
```

> **注意：** 禁用后，Agent 将无法执行 Shell 命令。这同时会影响 Cron 工具执行定时 Shell 命令的能力。

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

### 已知架构限制

exec 安全检查仅验证发送给 PicoClaw 的顶层命令，**不会**递归检查构建工具或脚本在该命令启动后派生的子进程。

以下工作流在初始命令被允许后，可以绕过直接命令检查：

- `make run`
- `go run ./cmd/...`
- `cargo run`
- `npm run build`

这意味着该检查对于阻止明显危险的直接命令很有用，但它**不是**未审查构建流水线的完整沙箱。如果您的威胁模型包括工作空间中的不可信代码，请使用更强的隔离措施，如容器、虚拟机或围绕构建运行命令的审批流程。

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

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | true | 注册 Agent 端的 cron 工具 |
| `allow_command` | bool | true | 允许命令作业无需额外确认 |
| `exec_timeout_minutes` | int | 5 | 任务执行超时时间（分钟），0 表示不限制 |

有关调度类型、执行模式（`deliver`、Agent 回合、命令作业）、持久化和命令安全策略的详细信息，请参阅[定时任务与 Cron 作业](/docs/cron)。

## Reaction 工具（消息回应）

Reaction 工具为消息添加回应（表情）。它会自动注册，无需配置选项。

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `message_id` | string | 否 | 目标消息 ID；默认为当前入站消息 |
| `channel` | string | 否 | 目标频道（telegram、whatsapp 等） |
| `chat_id` | string | 否 | 目标聊天/用户 ID |

当所有可选参数省略时，工具会在当前频道对当前入站消息添加回应。

## MCP（Model Context Protocol）

PicoClaw 支持 MCP 服务器，通过外部工具扩展 Agent 能力。

### 工具发现（延迟加载）

连接多个 MCP 服务器时，同时暴露数百个工具可能会耗尽 LLM 的上下文窗口并增加 API 成本。**Discovery** 功能通过默认隐藏 MCP 工具来解决此问题。

LLM 不会加载所有工具，而是获得一个轻量级搜索工具（使用 BM25 关键词匹配或正则表达式）。当 LLM 需要特定功能时，它会搜索隐藏的工具库。匹配的工具随后被临时"解锁"并注入上下文，持续配置的回合数（`ttl`）。

### 全局配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | false | 全局启用 MCP 集成 |
| `discovery` | object | `{}` | 工具发现配置（见下文） |
| `servers` | object | `{}` | 服务器名称到服务器配置的映射 |

### Discovery 配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | false | 全局默认：`true` 时所有 MCP 工具隐藏并按需加载；`false` 时所有工具加载到上下文。各服务器可通过 `deferred` 字段覆盖。 |
| `ttl` | int | 5 | 发现的工具保持解锁的对话回合数 |
| `max_search_results` | int | 5 | 每次搜索返回的最大工具数 |
| `use_bm25` | bool | true | 启用自然语言/关键词搜索工具（`tool_search_tool_bm25`）。**注意**：比正则搜索消耗更多资源 |
| `use_regex` | bool | false | 启用正则模式搜索工具（`tool_search_tool_regex`） |

> **注意：** 如果 `discovery.enabled` 为 `true`，您**必须**启用至少一个搜索引擎（`use_bm25` 或 `use_regex`），否则应用将无法启动。

### 每服务器配置

| 配置项 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `enabled` | bool | 是 | 启用此 MCP 服务器 |
| `deferred` | bool | 否 | 覆盖此服务器的延迟模式。`true` = 工具隐藏并可通过搜索发现；`false` = 工具始终在上下文中可见。省略时使用全局 `discovery.enabled` 值。 |
| `type` | string | 否 | 传输类型：`stdio`、`sse`、`http` |
| `command` | string | stdio | stdio 传输的可执行命令 |
| `args` | array | 否 | stdio 传输的命令参数 |
| `env` | object | 否 | stdio 进程的环境变量 |
| `env_file` | string | 否 | stdio 进程的环境变量文件路径 |
| `url` | string | sse/http | `sse`/`http` 传输的端点 URL |
| `headers` | object | 否 | `sse`/`http` 传输的 HTTP 头 |

### 传输行为

- 如果省略 `type`，自动检测传输方式：
    - 设置了 `url` -> `sse`
    - 设置了 `command` -> `stdio`
- `http` 和 `sse` 都使用 `url` + 可选 `headers`。
- `env` 和 `env_file` 仅应用于 `stdio` 服务器。

MCP 工具以 `mcp_<服务器名>_<工具名>` 的命名格式注册，与内置工具并列显示。

### MCP 配置示例

#### 1) Stdio MCP 服务器

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "servers": {
        "filesystem": {
          "enabled": true,
          "command": "npx",
          "args": [
            "-y",
            "@modelcontextprotocol/server-filesystem",
            "/tmp"
          ]
        }
      }
    }
  }
}
```

#### 2) 远程 SSE/HTTP MCP 服务器

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "servers": {
        "remote-mcp": {
          "enabled": true,
          "type": "sse",
          "url": "https://example.com/mcp",
          "headers": {
            "Authorization": "Bearer YOUR_TOKEN"
          }
        }
      }
    }
  }
}
```

#### 3) 大规模 MCP 配置（启用工具发现）

*在此示例中，LLM 只会看到 `tool_search_tool_bm25`。它会在用户请求时动态搜索并解锁 Github 或 Postgres 工具。*

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "discovery": {
        "enabled": true,
        "ttl": 5,
        "max_search_results": 5,
        "use_bm25": true,
        "use_regex": false
      },
      "servers": {
        "github": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-github"],
          "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
          }
        },
        "postgres": {
          "enabled": true,
          "command": "npx",
          "args": [
            "-y",
            "@modelcontextprotocol/server-postgres",
            "postgresql://user:password@localhost/dbname"
          ]
        },
        "slack": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-slack"],
          "env": {
            "SLACK_BOT_TOKEN": "YOUR_SLACK_BOT_TOKEN",
            "SLACK_TEAM_ID": "YOUR_SLACK_TEAM_ID"
          }
        }
      }
    }
  }
}
```

#### 4) 混合配置：每服务器延迟覆盖

*全局启用 Discovery，但 `filesystem` 固定为始终可见，`context7` 遵循全局默认（延迟加载）。`aws` 显式选择延迟模式，尽管这与全局默认相同。*

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "discovery": {
        "enabled": true,
        "ttl": 5,
        "max_search_results": 5,
        "use_bm25": true
      },
      "servers": {
        "filesystem": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
          "deferred": false
        },
        "context7": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "@upstash/context7-mcp"]
        },
        "aws": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "aws-mcp-server"],
          "deferred": true
        }
      }
    }
  }
}
```

> **提示：** 每服务器的 `deferred` 设置与 `discovery.enabled` 是独立的。您可以保持全局 `discovery.enabled: false`（所有工具默认可见），同时将高工具量的服务器标记为 `"deferred": true` 以避免它们的工具污染上下文。

## 文件工具

### 读取文件（read_file）

`read_file` 工具用于从 workspace 中读取文件，支持两种模式：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | true | 启用 read_file 工具 |
| `mode` | string | `"bytes"` | 读取模式：`"bytes"`（按字节偏移切片）或 `"lines"`（按行号切片） |
| `max_read_file_size` | int | 0 | 工具可读取的最大文件大小（字节），0 表示使用默认限制 |

```json
{
  "tools": {
    "read_file": {
      "enabled": true,
      "mode": "bytes"
    }
  }
}
```

`"bytes"` 模式下 Agent 指定字节偏移；`"lines"` 模式下 Agent 指定行号。处理经常按行号引用代码的场景时推荐使用 `"lines"` 模式。

### 加载图片（load_image）

`load_image` 工具将本地图片文件加载到 Agent 上下文中，使支持视觉的模型能够分析本地图片。支持格式：JPEG、PNG、GIF、WebP、BMP。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | true | 启用 load_image 工具 |

```json
{
  "tools": {
    "load_image": {
      "enabled": true
    }
  }
}
```

该工具返回 `media://` 引用，Agent 循环在下一次 LLM 请求中将其解析为 base64 编码的图片。这与 `send_file`（将文件发送给用户）不同；`load_image` 使 LLM 能看到图片内容。

### 发送语音（send_tts）

`send_tts` 工具将文本转换为语音并发送到当前聊天。需要在 `voice.tts_model_name` 中配置 TTS 模型。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | bool | false | 启用 send_tts 工具 |

```json
{
  "tools": {
    "send_tts": {
      "enabled": true
    }
  }
}
```

## Skills 工具（技能商店）

Skills 工具管理通过注册表（如 ClawHub）发现和安装技能。

### 注册表

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `registries.clawhub.enabled` | bool | true | 启用 ClawHub 注册表 |
| `registries.clawhub.base_url` | string | `https://clawhub.ai` | ClawHub 地址 |
| `registries.clawhub.auth_token` | string | `""` | 可选的 Bearer Token，用于获取更高的速率限制 |
| `registries.clawhub.search_path` | string | `""` | 搜索 API 路径 |
| `registries.clawhub.skills_path` | string | `""` | 技能 API 路径 |
| `registries.clawhub.download_path` | string | `""` | 下载 API 路径 |
| `registries.clawhub.timeout` | int | 0 | 请求超时秒数（0 = 默认） |
| `registries.clawhub.max_zip_size` | int | 0 | 技能 zip 最大字节数（0 = 默认） |
| `registries.clawhub.max_response_size` | int | 0 | API 响应最大字节数（0 = 默认） |

### GitHub 集成

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `github.proxy` | string | `""` | GitHub API 请求的 HTTP 代理 |
| `github.token` | string | `""` | GitHub 个人访问令牌 |

### 搜索设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `max_concurrent_searches` | int | 2 | 最大并发技能搜索请求数 |
| `search_cache.max_size` | int | 50 | 最大缓存搜索结果数 |
| `search_cache.ttl_seconds` | int | 300 | 缓存 TTL 秒数 |

### Skills 配置示例

```json
{
  "tools": {
    "skills": {
      "registries": {
        "clawhub": {
          "enabled": true,
          "base_url": "https://clawhub.ai",
          "auth_token": ""
        }
      },
      "github": {
        "proxy": "",
        "token": ""
      },
      "max_concurrent_searches": 2,
      "search_cache": {
        "max_size": 50,
        "ttl_seconds": 300
      }
    }
  }
}
```

## 环境变量

所有配置项均可通过环境变量覆盖，格式为 `PICOCLAW_TOOLS_<区域>_<键>`：

- `PICOCLAW_TOOLS_WEB_BRAVE_ENABLED=true`
- `PICOCLAW_TOOLS_EXEC_ENABLED=false`
- `PICOCLAW_TOOLS_EXEC_ENABLE_DENY_PATTERNS=false`
- `PICOCLAW_TOOLS_CRON_EXEC_TIMEOUT_MINUTES=10`
- `PICOCLAW_TOOLS_MCP_ENABLED=true`

注意：嵌套映射式配置（如 `tools.mcp.servers.<name>.*`）需通过 `config.json` 配置，不支持通过环境变量设置。

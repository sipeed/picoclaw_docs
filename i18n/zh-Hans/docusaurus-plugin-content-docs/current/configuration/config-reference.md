---
id: config-reference
title: 完整配置参考
---

# 完整配置参考

完整带注释的 `config.json` 示例。可从仓库中复制 `config/config.example.json`。

```json
{
  "version": 2,

  "agents": {
    "defaults": {
      "workspace": "~/.picoclaw/workspace",
      "restrict_to_workspace": true,
      "model_name": "gpt-5.4",
      "max_tokens": 32768,
      "max_tool_iterations": 50
    }
  },

  "model_list": [
    {
      "model_name": "ark-code-latest",
      "model": "volcengine/ark-code-latest",
      "api_key": "sk-your-volcengine-key"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "sk-your-openai-key",
      "api_base": "https://api.openai.com/v1"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_key": "sk-ant-your-key",
      "api_base": "https://api.anthropic.com/v1"
    },
    {
      "model_name": "gemini",
      "model": "antigravity/gemini-2.0-flash",
      "auth_method": "oauth"
    },
    {
      "model_name": "deepseek",
      "model": "deepseek/deepseek-chat",
      "api_key": "sk-your-deepseek-key"
    },
    {
      "model_name": "loadbalanced-gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "sk-key1",
      "api_base": "https://api1.example.com/v1"
    },
    {
      "model_name": "loadbalanced-gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "sk-key2",
      "api_base": "https://api2.example.com/v1"
    }
  ],

  "channels": {
    "telegram": {
      "enabled": false,
      "token": "YOUR_TELEGRAM_BOT_TOKEN",
      "base_url": "",
      "proxy": "",
      "allow_from": ["YOUR_USER_ID"],
      "reasoning_channel_id": ""
    },
    "discord": {
      "enabled": false,
      "token": "YOUR_DISCORD_BOT_TOKEN",
      "proxy": "",
      "allow_from": [],
      "group_trigger": {
        "mention_only": false
      },
      "reasoning_channel_id": ""
    },
    "qq": {
      "enabled": false,
      "app_id": "YOUR_QQ_APP_ID",
      "app_secret": "YOUR_QQ_APP_SECRET",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "maixcam": {
      "enabled": false,
      "host": "0.0.0.0",
      "port": 18790,
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "whatsapp": {
      "enabled": false,
      "bridge_url": "ws://localhost:3001",
      "use_native": false,
      "session_store_path": "",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "feishu": {
      "enabled": false,
      "app_id": "",
      "app_secret": "",
      "encrypt_key": "",
      "verification_token": "",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "dingtalk": {
      "enabled": false,
      "client_id": "YOUR_CLIENT_ID",
      "client_secret": "YOUR_CLIENT_SECRET",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "slack": {
      "enabled": false,
      "bot_token": "xoxb-YOUR-BOT-TOKEN",
      "app_token": "xapp-YOUR-APP-TOKEN",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "line": {
      "enabled": false,
      "channel_secret": "YOUR_LINE_CHANNEL_SECRET",
      "channel_access_token": "YOUR_LINE_CHANNEL_ACCESS_TOKEN",
      "webhook_path": "/webhook/line",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "onebot": {
      "enabled": false,
      "ws_url": "ws://127.0.0.1:3001",
      "access_token": "",
      "reconnect_interval": 5,
      "group_trigger_prefix": [],
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "wecom": {
      "enabled": false,
      "token": "YOUR_TOKEN",
      "encoding_aes_key": "YOUR_43_CHAR_ENCODING_AES_KEY",
      "webhook_url": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY",
      "webhook_path": "/webhook/wecom",
      "allow_from": [],
      "reply_timeout": 5,
      "reasoning_channel_id": ""
    },
    "wecom_app": {
      "enabled": false,
      "corp_id": "YOUR_CORP_ID",
      "corp_secret": "YOUR_CORP_SECRET",
      "agent_id": 1000002,
      "token": "YOUR_TOKEN",
      "encoding_aes_key": "YOUR_43_CHAR_ENCODING_AES_KEY",
      "webhook_path": "/webhook/wecom-app",
      "allow_from": [],
      "reply_timeout": 5,
      "reasoning_channel_id": ""
    },
    "wecom_aibot": {
      "enabled": false,
      "token": "YOUR_TOKEN",
      "encoding_aes_key": "YOUR_43_CHAR_ENCODING_AES_KEY",
      "webhook_path": "/webhook/wecom-aibot",
      "max_steps": 10,
      "welcome_message": "你好！我是你的 AI 助手，有什么可以帮你的吗？",
      "reasoning_channel_id": ""
    },
    "matrix": {
      "enabled": false,
      "homeserver": "https://matrix.org",
      "user_id": "@your-bot:matrix.org",
      "access_token": "YOUR_MATRIX_ACCESS_TOKEN",
      "device_id": "",
      "join_on_invite": true,
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "placeholder": {
        "enabled": true,
        "text": "正在思考..."
      },
      "reasoning_channel_id": ""
    }
  },

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
      },
      "perplexity": {
        "enabled": false,
        "api_key": "pplx-xxx",
        "max_results": 5
      },
      "proxy": ""
    },
    "mcp": {
      "enabled": false,
      "servers": {
        "context7": {
          "enabled": false,
          "type": "http",
          "url": "https://mcp.context7.com/mcp"
        },
        "filesystem": {
          "enabled": false,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
        },
        "github": {
          "enabled": false,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-github"],
          "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN" }
        }
      }
    },
    "cron": {
      "exec_timeout_minutes": 5
    },
    "exec": {
      "enable_deny_patterns": true,
      "custom_deny_patterns": [],
      "custom_allow_patterns": []
    },
    "skills": {
      "registries": {
        "clawhub": {
          "enabled": true,
          "base_url": "https://clawhub.ai",
          "search_path": "/api/v1/search",
          "skills_path": "/api/v1/skills",
          "download_path": "/api/v1/download"
        }
      }
    }
  },

  "heartbeat": {
    "enabled": true,
    "interval": 30
  },

  "devices": {
    "enabled": false,
    "monitor_usb": true
  },

  "gateway": {
    "host": "127.0.0.1",
    "port": 18790,
    "log_level": "warn"
  }
}
```

## 字段说明

### `version`

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `version` | int | `0` | 配置架构版本。当前版本为 `2`。新配置应设置为 `2`。 |

### `agents.defaults`

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `workspace` | string | `~/.picoclaw/workspace` | Agent 工作目录（受 `PICOCLAW_HOME` 影响） |
| `restrict_to_workspace` | bool | `true` | 限制文件/命令访问在工作目录内 |
| `allow_read_outside_workspace` | bool | `false` | 允许读取工作目录以外的文件（`restrict_to_workspace` 为 true 时生效） |
| `model_name` | string | — | 默认模型名（必须在 `model_list` 中存在） |
| `model` | string | — | **已废弃**：请使用 `model_name` |
| `model_fallbacks` | array | [] | 备用模型名列表，主模型失败时按顺序尝试 |
| `max_tokens` | int | 32768 | 每次响应最大 token 数 |
| `temperature` | float | — | LLM 温度（省略则使用提供商默认值） |
| `max_tool_iterations` | int | 50 | 每次请求最多工具调用次数 |
| `max_media_size` | int | 20971520 | 最大媒体文件大小（字节），默认 20MB |
| `image_model` | string | — | 图片生成使用的模型名 |
| `image_model_fallbacks` | array | [] | 图片生成备用模型 |
| `routing` | object | — | 智能模型路由设置（见下方） |

#### `routing`

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | 启用智能模型路由 |
| `light_model` | string | — | 用于简单任务的模型名（需在 `model_list` 中存在） |
| `threshold` | float | — | 复杂度评分阈值 [0,1]；评分 >= 阈值使用主模型，低于阈值使用 `light_model` |

启用后，PicoClaw 会根据消息的结构特征（长度、代码块、工具调用历史、对话深度、附件）对每条消息评分，将简单消息路由到更轻量/低成本的模型。

### `model_list[]`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model_name` | string | 是 | 别名（在 `agents.defaults.model_name` 中引用） |
| `model` | string | 是 | `vendor/model-id` 格式 |
| `api_keys` | array | 视情况 | API 认证密钥（数组；支持多个密钥用于负载均衡）。基于 HTTP 的提供商必填，除非 `api_base` 指向本地服务。 |
| `api_base` | string | 否 | 覆盖默认 API 地址 |
| `enabled` | bool | 否 | 该模型条目是否启用。迁移期间默认为 `true`（有 API 密钥或名为 `local-model` 的模型自动启用）。设为 `false` 可禁用模型但不删除配置。 |
| `auth_method` | string | 否 | 认证方式（如 `oauth`） |
| `proxy` | string | 否 | 该模型的 HTTP/SOCKS 代理 |
| `request_timeout` | int | 否 | 请求超时时间（秒）；`<=0` 使用默认值 120s |
| `rpm` | int | 否 | 速率限制（每分钟请求数） |
| `max_tokens_field` | string | 否 | 覆盖 API 请求中的 max tokens 字段名 |
| `connect_mode` | string | 否 | 连接模式覆盖 |
| `workspace` | string | 否 | 模型级工作目录覆盖 |
| `thinking_level` | string | 否 | 扩展思考级别：`off`、`low`、`medium`、`high`、`xhigh` 或 `adaptive` |
| `fallbacks` | array | 否 | 故障转移备用模型名 |
| `extra_body` | object | 否 | 注入 API 请求体的额外字段 |

:::note V2 中 API Key 格式变更
在 V2 中，`api_key`（单数字符串）已移除，仅支持 `api_keys`（数组）。从 V0/V1 迁移时，两种格式会自动合并为 `api_keys` 数组。API 密钥也可使用 `SecureString` 模式：明文、`enc://<base64>`（加密）或 `file://<path>`（文件引用）。详见[凭证加密](../credential-encryption.md)。
:::

### `gateway`

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `host` | string | `127.0.0.1` | 网关监听地址 |
| `port` | int | 18790 | 网关监听端口 |
| `log_level` | string | `warn` | 日志详细程度：`debug`、`info`、`warn`、`error`、`fatal`。也可通过 `PICOCLAW_LOG_LEVEL` 环境变量设置。 |
| `hot_reload` | bool | `false` | 启用配置热重载 |

设置 `host: "0.0.0.0"` 可让网关对外开放。

### 通用渠道字段

所有渠道均支持以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | bool | 启用/禁用该渠道 |
| `allow_from` | array | 允许使用机器人的用户 ID（空数组 = 允许所有人） |
| `reasoning_channel_id` | string | 专用于输出推理过程的频道/群组 ID |
| `group_trigger` | object | 群聊触发设置（见下方） |
| `placeholder` | object | 占位消息设置（见下方） |
| `typing` | object | 输入状态指示器设置（见下方） |

#### `group_trigger`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mention_only` | bool | 仅在群聊中被 @ 时响应 |
| `prefixes` | array | 群聊中触发机器人的关键词前缀 |

#### `placeholder`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | bool | 启用占位消息 |
| `text` | string | 处理期间显示的占位文本（如"正在思考..."） |

支持的通道：飞书、Slack、Matrix。

#### `typing`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | bool | 处理期间显示"正在输入"状态 |

支持的通道：Slack、Matrix。

## 安全配置

### .security.yml 文件

PicoClaw 支持专用的 `.security.yml` 文件来存储敏感凭证（API 密钥、令牌、密钥）。此文件应添加到 `.gitignore` 中，以防止意外提交密钥。

### 密钥优先级顺序

解析凭证时，PicoClaw 使用以下优先级顺序：

1. **config.json**：在主配置文件中定义的凭证优先级最高
2. **.security.yml**：在安全文件中定义的凭证作为备用


---
id: model-list
title: 模型配置（model_list）
---

# 模型配置

为了获得更流畅、直观的配置体验，我们推荐优先通过 Web UI 配置模型。

![Web UI 模型配置](/img/providers/webuimodel.png)

当你需要自动化部署或模板化管理时，也可以手动编辑 `config.json`。

PicoClaw 采用**以模型为中心**的配置方式。只需指定 `vendor/model-id`，即可选择对应协议并接入模型。

这种设计还支持**多 Agent** 灵活调用：

- **不同 Agent 使用不同提供商**：每个 Agent 可以有自己的 LLM 提供商
- **模型备用（Fallback）**：配置主要模型和备用模型，提高可靠性
- **负载均衡**：将请求分发到多个端点
- **集中管理**：所有提供商配置在同一个地方

## 支持的提供商与协议

| 提供商 | `model` 前缀 | 默认 API 地址 | 协议 | 获取 API Key |
| --- | --- | --- | --- | --- |
| **OpenAI** | `openai/` | `https://api.openai.com/v1` | OpenAI | [获取](https://platform.openai.com) |
| **Anthropic** | `anthropic/` | `https://api.anthropic.com/v1` | Anthropic | [获取](https://console.anthropic.com) |
| **Anthropic Messages** | `anthropic-messages/` | `https://api.anthropic.com/v1` | Anthropic Messages | [获取](https://console.anthropic.com) |
| **Azure OpenAI** | `azure/`、`azure-openai/` | 自定义 Azure 端点 | Azure OpenAI | Azure Portal |
| **AWS Bedrock** | `bedrock/` | AWS 区域或运行时端点 | Bedrock | AWS 凭证 |
| **Venice AI** | `venice/` | `https://api.venice.ai/api/v1` | OpenAI 兼容 | [获取](https://venice.ai) |
| **OpenRouter** | `openrouter/` | `https://openrouter.ai/api/v1` | OpenAI 兼容 | [获取](https://openrouter.ai/keys) |
| **LiteLLM** | `litellm/` | `http://localhost:4000/v1` | OpenAI 兼容 | 本地代理 |
| **LM Studio** | `lmstudio/` | `http://localhost:1234/v1` | OpenAI 兼容 | 可选（本地默认无需密钥） |
| **Groq** | `groq/` | `https://api.groq.com/openai/v1` | OpenAI 兼容 | [获取](https://console.groq.com) |
| **智谱 AI（GLM）** | `zhipu/` | `https://open.bigmodel.cn/api/paas/v4` | OpenAI 兼容 | [获取](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys) |
| **Google Gemini** | `gemini/` | `https://generativelanguage.googleapis.com/v1beta` | OpenAI 兼容 | [获取](https://aistudio.google.com/api-keys) |
| **NVIDIA** | `nvidia/` | `https://integrate.api.nvidia.com/v1` | OpenAI 兼容 | [获取](https://build.nvidia.com) |
| **Ollama（本地）** | `ollama/` | `http://localhost:11434/v1` | OpenAI 兼容 | 无需 Key |
| **Moonshot（Kimi）** | `moonshot/` | `https://api.moonshot.cn/v1` | OpenAI 兼容 | [获取](https://platform.moonshot.cn) |
| **神算云** | `shengsuanyun/` | `https://router.shengsuanyun.com/api/v1` | OpenAI 兼容 | [获取](https://router.shengsuanyun.com) |
| **DeepSeek** | `deepseek/` | `https://api.deepseek.com/v1` | OpenAI 兼容 | [获取](https://platform.deepseek.com) |
| **Cerebras** | `cerebras/` | `https://api.cerebras.ai/v1` | OpenAI 兼容 | [获取](https://cerebras.ai) |
| **Vivgrid** | `vivgrid/` | `https://api.vivgrid.com/v1` | OpenAI 兼容 | [获取](https://vivgrid.com) |
| **火山引擎** | `volcengine/` | `https://ark.cn-beijing.volces.com/api/v3` | OpenAI 兼容 | [获取](https://console.volcengine.com) |
| **vLLM（本地）** | `vllm/` | `http://localhost:8000/v1` | OpenAI 兼容 | 本地部署 |
| **Qwen（中国区）** | `qwen/` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI 兼容 | [获取](https://dashscope.console.aliyun.com) |
| **Qwen（国际区）** | `qwen-intl/` | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` | OpenAI 兼容 | [获取](https://dashscope.console.aliyun.com) |
| **Qwen（美国区）** | `qwen-us/` | `https://dashscope-us.aliyuncs.com/compatible-mode/v1` | OpenAI 兼容 | [获取](https://dashscope.console.aliyun.com) |
| **Coding Plan** | `coding-plan/` | `https://coding-intl.dashscope.aliyuncs.com/v1` | OpenAI 兼容 | [获取](https://z.ai/manage-apikey/apikey-list) |
| **Coding Plan（Anthropic）** | `coding-plan-anthropic/` | `https://coding-intl.dashscope.aliyuncs.com/apps/anthropic` | Anthropic 兼容 | [获取](https://z.ai/manage-apikey/apikey-list) |
| **Mistral** | `mistral/` | `https://api.mistral.ai/v1` | OpenAI 兼容 | [获取](https://console.mistral.ai) |
| **Avian** | `avian/` | `https://api.avian.io/v1` | OpenAI 兼容 | [获取](https://avian.io) |
| **Minimax** | `minimax/` | `https://api.minimaxi.com/v1` | OpenAI 兼容 | [获取](https://platform.minimaxi.com) |
| **LongCat** | `longcat/` | `https://api.longcat.chat/openai` | OpenAI 兼容 | [获取](https://longcat.chat/platform) |
| **ModelScope** | `modelscope/` | `https://api-inference.modelscope.cn/v1` | OpenAI 兼容 | [获取](https://modelscope.cn/my/tokens) |
| **Novita** | `novita/` | `https://api.novita.ai/openai` | OpenAI 兼容 | [获取](https://novita.ai) |
| **MiMo** | `mimo/` | `https://api.xiaomimimo.com/v1` | OpenAI 兼容 | [获取](https://platform.xiaomimimo.com) |
| **Antigravity** | `antigravity/` | Google Cloud | OAuth | 仅 OAuth |
| **GitHub Copilot** | `github-copilot/` | `localhost:4321` | gRPC | — |
| **Claude CLI** | `claude-cli/` | 不适用 | CLI | 本地 CLI 鉴权 |
| **Codex CLI** | `codex-cli/` | 不适用 | CLI | 本地 CLI 鉴权 |

另外也支持别名，例如：`qwen-international`、`dashscope-intl`、`dashscope-us`、`alibaba-coding`、`qwen-coding`、`alibaba-coding-anthropic`、`copilot`、`claudecli`、`codexcli`。

## 通过自定义 API Base 接入任意兼容模型

不局限于上表中的提供商。使用 `openai/` 或 `anthropic/` 前缀，并配合第三方 `api_base`，即可接入任意 OpenAI 兼容或 Anthropic 兼容模型。

```json
{
  "model_name": "my-custom-model",
  "model": "openai/my-custom-model",
  "api_base": "https://custom-api.com/v1",
  "api_keys": ["YOUR_API_KEY"]
}
```

## 推荐配置方式

在配置 schema `2` 中，建议将模型结构放在 `config.json`，将密钥放在 `.security.yml`。
以下示例聚焦模型相关字段。作为完整配置文件时，请在顶层保留 `"version": 2`。

```json
{
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6"
    },
    {
      "model_name": "lmstudio-local",
      "model": "lmstudio/openai/gpt-oss-20b"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt-5.4"
    }
  }
}
```

```yaml
# ~/.picoclaw/.security.yml
model_list:
  gpt-5.4:0:
    api_keys:
      - "sk-openai-..."
  claude-sonnet-4.6:0:
    api_keys:
      - "sk-ant-..."
```

## 模型条目字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model_name` | string | 是 | 别名（在 `agents.defaults.model_name` 中引用） |
| `model` | string | 是 | `vendor/model-id` 格式。前导 `vendor/` 仅用于协议与默认 `api_base` 识别，不会原样发送给上游 API。 |
| `api_keys` | array | 视情况 | 模型 API 密钥数组。建议放在 `.security.yml` 中。 |
| `api_base` | string | 否 | 覆盖默认 API 地址 |
| `auth_method` | string | 否 | 认证方式（如 `oauth`） |
| `connect_mode` | string | 否 | 连接模式（如 `grpc`、`stdio`） |
| `proxy` | string | 否 | 该模型 API 调用的 HTTP/SOCKS 代理 |
| `user_agent` | string | 否 | API 请求的自定义 `User-Agent` 请求头 |
| `request_timeout` | int | 否 | 请求超时时间（秒），默认 120 |
| `rpm` | int | 否 | 速率限制 — 每分钟请求数（参见[速率限制](../rate-limiting.md)） |

:::warning `config.json` 中的 `api_key`
在配置 schema `2` 中，`config.json` 里的 `model_list[].api_key` 会被忽略。请在 `.security.yml` 中使用 `api_keys`。旧版 V0/V1 配置中的 `api_key` 仅在迁移过程中会被合并。
:::

## `model` 前缀解析方式

- `openai/gpt-5.4` -> 协议是 `openai`，上游请求模型名是 `gpt-5.4`
- `lmstudio/openai/gpt-oss-20b` -> 协议是 `lmstudio`，上游请求模型名是 `openai/gpt-oss-20b`
- `openrouter/openai/gpt-5.4` -> 协议是 `openrouter`，上游请求模型名是 `openai/gpt-5.4`

## 各提供商示例

### OpenAI

```json
{
  "model_name": "gpt-5.4",
  "model": "openai/gpt-5.4"
}
```

### 火山引擎（Doubao）

```json
{
  "model_name": "ark-code-latest",
  "model": "volcengine/ark-code-latest"
}
```

### Anthropic（Claude）

```json
{
  "model_name": "claude",
  "model": "anthropic/claude-sonnet-4-6"
}
```

> 也可运行 `picoclaw auth login --provider anthropic` 粘贴 API Token。

### OpenRouter

```json
{
  "model_name": "openrouter-gpt",
  "model": "openrouter/openai/gpt-5.4"
}
```

### LM Studio（本地部署）

```json
{
  "model_name": "lmstudio-local",
  "model": "lmstudio/openai/gpt-oss-20b"
}
```

`api_base` 默认为 `http://localhost:1234/v1`。除非 LM Studio 开启了鉴权，否则无需 API Key。

### Azure OpenAI

```json
{
  "model_name": "azure-gpt5",
  "model": "azure/my-gpt5-deployment",
  "api_base": "https://your-resource.openai.azure.com"
}
```

### Ollama（本地部署）

```json
{
  "model_name": "llama3",
  "model": "ollama/llama3"
}
```

### Bedrock

```json
{
  "model_name": "bedrock-claude",
  "model": "bedrock/us.anthropic.claude-sonnet-4-20250514-v1:0",
  "api_base": "us-east-1"
}
```

### 自定义 OpenAI 兼容端点

```json
{
  "model_name": "my-proxy-model",
  "model": "openai/custom-model",
  "api_base": "https://my-proxy.com/v1"
}
```

### 模型级请求超时

```json
{
  "model_name": "slow-model",
  "model": "openai/o1-preview",
  "request_timeout": 300
}
```

## 负载均衡

为同一个 `model_name` 配置多个条目，PicoClaw 会自动轮询：

```json
{
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_base": "https://api1.example.com/v1"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_base": "https://api2.example.com/v1"
    }
  ]
}
```

## 从旧版 `providers` 迁移

`providers` 旧配置不属于配置 schema `2`。当前仅保留对 V0/V1 老配置的迁移兼容：加载时会自动转换到 `model_list`。
在完整的 schema v2 配置文件中，请在顶层保留 `"version": 2`。

**旧配置（已废弃）：**

```json
{
  "providers": {
    "zhipu": {
      "api_key": "your-key",
      "api_base": "https://open.bigmodel.cn/api/paas/v4"
    }
  },
  "agents": {
    "defaults": {
      "provider": "zhipu",
      "model_name": "glm-4.7"
    }
  }
}
```

**新配置（推荐）：**

```json
{
  "model_list": [
    {
      "model_name": "glm-4.7",
      "model": "zhipu/glm-4.7"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "glm-4.7"
    }
  }
}
```

详细迁移步骤请参考[迁移指南](../migration/model-list-migration.md)。

## 语音转文字

:::note
Groq 提供**免费语音转写**（Whisper）。配置后，Telegram 语音消息将自动转文字。
:::

```json
{
  "model_list": [
    {
      "model_name": "whisper",
      "model": "groq/whisper-large-v3"
    }
  ]
}
```

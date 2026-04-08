---
id: security-reference
title: .security.yml 配置参考
---

# .security.yml 配置参考

使用 `.security.yml` 存放敏感值，并将结构配置保留在 `config.json`。

对于配置 schema `2`，推荐采用如下分层：

- `config.json`：模型结构、路由、渠道开关、行为配置
- `.security.yml`：API 密钥、Token、Secret

## 与 config.json 的协作方式

PicoClaw 的加载顺序是：

1. `config.json`
2. `.security.yml`（与当前生效的 `config.json` 同目录）
3. 环境变量

因此生效优先级为：

1. 环境变量
2. `.security.yml`
3. `config.json`

`.security.yml` 是覆盖层，不是独立配置：

- 它不会替代 `config.json`
- 它应只存放敏感字段
- 它依赖 `config.json` 里已经定义好的结构（尤其是 `model_list`）

## 文件位置

- 默认配置路径：`~/.picoclaw/config.json`
- 默认安全文件路径：`~/.picoclaw/.security.yml`

若通过 `PICOCLAW_CONFIG` 指定了自定义配置路径，`.security.yml` 也从该配置文件所在目录加载。

示例：

- `PICOCLAW_CONFIG=/etc/picoclaw/production.json`
- 安全文件路径：`/etc/picoclaw/.security.yml`

## .security.yml 顶层区块

注意：`.security.yml` 的部分顶层区块会映射到 `config.json` 的嵌套路径。

| `.security.yml` 顶层区块 | 映射到 `config.json` |
| --- | --- |
| `model_list` | `model_list` |
| `channels` | `channels` |
| `web` | `tools.web` |
| `skills` | `tools.skills` |

## 模型映射规则

对于 schema v2：

- `config.json` 中的 `model_list[].api_key` 会被忽略
- 请在 `.security.yml` 中使用 `model_list.<name>[:index].api_keys`

`.security.yml` 中的 `model_list` 键支持两种形式：

1. 索引键（精确匹配）：`<model_name>:<index>`
2. 基础键（回退匹配）：`<model_name>`

解析行为：

- 先尝试 `<model_name>:<index>`
- 未命中时再回退到 `<model_name>`

当同一 `model_name` 在 `config.json` 中出现多次时，建议使用索引键分别配置。

### 示例：为负载均衡条目分别配置密钥

```yaml
model_list:
  loadbalanced-gpt-5.4:0:
    api_keys:
      - "sk-key-1"
  loadbalanced-gpt-5.4:1:
    api_keys:
      - "sk-key-2"
```

### 示例：同名模型共享一组密钥

```yaml
model_list:
  loadbalanced-gpt-5.4:
    api_keys:
      - "sk-shared-1"
      - "sk-shared-2"
```

## 支持的敏感字段路径

只有代码中声明了 YAML 标签的字段，才会从 `.security.yml` 读取。

### model_list

| 路径 | 类型 |
| --- | --- |
| `model_list.<model_name_or_model_name:index>.api_keys` | `string[]` |

### channels

| 路径 | 类型 |
| --- | --- |
| `channels.telegram.token` | `string` |
| `channels.feishu.app_secret` | `string` |
| `channels.feishu.encrypt_key` | `string` |
| `channels.feishu.verification_token` | `string` |
| `channels.discord.token` | `string` |
| `channels.qq.app_secret` | `string` |
| `channels.dingtalk.client_secret` | `string` |
| `channels.slack.bot_token` | `string` |
| `channels.slack.app_token` | `string` |
| `channels.matrix.access_token` | `string` |
| `channels.line.channel_secret` | `string` |
| `channels.line.channel_access_token` | `string` |
| `channels.onebot.access_token` | `string` |
| `channels.wecom.secret` | `string` |
| `channels.weixin.token` | `string` |
| `channels.pico.token` | `string` |
| `channels.pico_client.token` | `string` |
| `channels.irc.password` | `string` |
| `channels.irc.nickserv_password` | `string` |
| `channels.irc.sasl_password` | `string` |
| `channels.vk.token` | `string` |
| `channels.teams_webhook.webhooks.<name>.webhook_url` | `string` |

### web（映射到 `tools.web`）

| 路径 | 类型 |
| --- | --- |
| `web.brave.api_keys` | `string[]` |
| `web.tavily.api_keys` | `string[]` |
| `web.perplexity.api_keys` | `string[]` |
| `web.glm_search.api_key` | `string` |
| `web.baidu_search.api_key` | `string` |

### skills（映射到 `tools.skills`）

| 路径 | 类型 |
| --- | --- |
| `skills.github.token` | `string` |
| `skills.clawhub.auth_token` | `string` |

## 支持的值格式

敏感值支持与 SecureString 一致的格式：

- 明文：`sk-...`
- 加密值：`enc://...`
- 文件引用：`file://filename.key`

`file://` 路径相对于配置目录解析，且不能越界到配置目录之外。

关于 `enc://` 的使用与密钥管理，请参考[凭证加密](../credential-encryption.md)。

## 推荐的成对示例

### `config.json`

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6"
    }
  ],
  "channels": {
    "telegram": {
      "enabled": true
    },
    "wecom": {
      "enabled": true,
      "bot_id": "YOUR_BOT_ID"
    }
  },
  "tools": {
    "web": {
      "brave": {
        "enabled": true
      }
    },
    "skills": {
      "github": {}
    }
  }
}
```

### `.security.yml`

```yaml
model_list:
  gpt-5.4:0:
    api_keys:
      - "sk-openai-..."
  claude-sonnet-4.6:0:
    api_keys:
      - "sk-ant-..."

channels:
  telegram:
    token: "123456:telegram-token"
  wecom:
    secret: "wecom-secret"

web:
  brave:
    api_keys:
      - "BSA-..."

skills:
  github:
    token: "ghp-..."
```

## 运维建议

- 将 `.security.yml` 添加到 `.gitignore`
- 限制权限（`chmod 600 ~/.picoclaw/.security.yml`）
- 在 `config.json` 保留可共享结构，在 `.security.yml` 放真实凭证

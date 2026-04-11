---
id: index
title: 配置概览
sidebar_label: 概览
---

# 配置

配置文件：`~/.picoclaw/config.json`

:::tip 配置版本 2
当前使用的是配置 schema 版本 `2`。新配置应在顶层包含 `"version": 2`。已有的 V0/V1 配置会在首次加载时自动迁移。详见[迁移指南](../migration/model-list-migration.md)。
:::

为了提供更流畅和直观的配置体验，我们推荐优先通过 Web UI 进行模型配置与管理。

![Web UI 模型配置](/img/providers/webuimodel.png)

## 配置区域

| 区域 | 用途 |
| --- | --- |
| `version` | 配置架构版本（当前：`2`） |
| `agents.defaults` | Agent 默认设置（模型、工作目录、限制） |
| `bindings` | 按渠道/上下文将消息路由到特定 Agent |
| `model_list` | LLM 提供商定义 |
| `channels` | 聊天应用接入 |
| `tools` | 网络搜索、命令执行、定时任务、技能、MCP |
| `heartbeat` | 周期任务设置 |
| `gateway` | HTTP 网关地址/端口和日志级别 |
| `devices` | USB 设备监控 |

## 工作目录结构

PicoClaw 将数据存储在配置的工作目录中（默认：`~/.picoclaw/workspace`）：

```
~/.picoclaw/workspace/
├── sessions/          # 对话会话和历史记录
├── memory/            # 长期记忆 (MEMORY.md)
├── state/             # 持久化状态（上次使用的通道等）
├── cron/              # 定时任务数据库
├── skills/            # 自定义技能
├── AGENTS.md          # Agent 行为指南
├── HEARTBEAT.md       # 周期任务提示（每 30 分钟检查）
├── IDENTITY.md        # Agent 身份设定
├── SOUL.md            # Agent 灵魂设定
├── TOOLS.md           # 工具说明
└── USER.md            # 用户偏好
```

## 环境变量

大多数配置项可通过环境变量设置，格式为 `PICOCLAW_<区域>_<键>`（大写下划线）：

```bash
export PICOCLAW_AGENTS_DEFAULTS_MODEL_NAME=my-model
export PICOCLAW_HEARTBEAT_ENABLED=false
export PICOCLAW_HEARTBEAT_INTERVAL=60
export PICOCLAW_AGENTS_DEFAULTS_RESTRICT_TO_WORKSPACE=false
```

### 特殊环境变量

| 变量 | 说明 |
| --- | --- |
| `PICOCLAW_HOME` | 覆盖 PicoClaw 主目录（默认：`~/.picoclaw`）。更改 `workspace` 及其他数据目录的默认位置。 |
| `PICOCLAW_CONFIG` | 覆盖配置文件路径。直接告诉 PicoClaw 加载哪个 `config.json`，忽略所有其他路径。 |
| `PICOCLAW_LOG_LEVEL` | 覆盖网关日志级别（见下方） |

**示例：**

```bash
# 使用指定的配置文件运行 picoclaw
PICOCLAW_CONFIG=/etc/picoclaw/production.json picoclaw gateway

# 将所有数据存储在 /opt/picoclaw 中运行 picoclaw
PICOCLAW_HOME=/opt/picoclaw picoclaw agent

# 同时使用两者进行完全自定义配置
PICOCLAW_HOME=/srv/picoclaw PICOCLAW_CONFIG=/srv/picoclaw/main.json picoclaw gateway
```

## 网关日志级别

`gateway.log_level` 控制网关日志详细程度，可在 `config.json` 中配置：

```json
{
  "gateway": {
    "log_level": "warn"
  }
}
```

省略时默认为 `warn`。支持的值：`debug`、`info`、`warn`、`error`、`fatal`。

也可通过环境变量 `PICOCLAW_LOG_LEVEL` 覆盖此设置。

## 安全配置

PicoClaw 支持将敏感数据（API 密钥、令牌、密钥）与主配置文件分离，存储在 `.security.yml` 文件中。详见[`.security.yml 配置参考`](./security-reference.md)了解字段映射与覆盖规则，[安全沙箱](./security-sandbox.md)了解工作目录访问限制，以及[凭证加密](../credential-encryption.md)了解密钥加密格式。

主要优势：
- **安全性**：敏感数据不会出现在主配置文件中
- **便于分享**：分享 `config.json` 时无需担心泄露 API 密钥
- **版本控制**：将 `.security.yml` 添加到 `.gitignore`
- **灵活部署**：不同环境可以使用不同的安全文件

## Agent 绑定

在 `config.json` 中使用 `bindings` 按渠道、账号或上下文将传入消息路由到不同的 Agent。例如，将特定用户的 Telegram 私聊路由到客服 Agent，或将整个 Discord 服务器路由到销售 Agent。

详见[完整配置参考](./config-reference.md)了解完整的 bindings 规范。

## 快速链接

- [**model_list 配置**](./model-list.md) — 添加 LLM 提供商
- [**安全沙箱**](./security-sandbox.md) — 工作目录访问限制和 `.security.yml`
- [**.security.yml 配置参考**](./security-reference.md) — 字段映射与优先级规则
- [**令牌认证**](./token_authentication.md) — 网关 API 和 Web 登录访问令牌
- [**心跳任务**](./heartbeat.md) — 周期性自动任务
- [**工具配置**](./tools.md) — 网络搜索、命令执行、定时任务
- [**凭证加密**](../credential-encryption.md) — 使用 `enc://` 加密 API 密钥
- [**完整配置参考**](./config-reference.md) — 带注释的完整示例

---
id: teams-webhook
title: Microsoft Teams（Webhook）
---

# Microsoft Teams（Webhook）

Teams Webhook 是**只发不收**通道。它通过 [Power Automate 工作流 webhook](https://learn.microsoft.com/zh-cn/power-automate/) 把 Agent 的回复以 Adaptive Card 形式推送到 Microsoft Teams 频道。

适用场景：把 PicoClaw 的通知、摘要或告警推送到 Teams，但**不需要** Agent 接收来自 Teams 的消息。

:::note 仅输出
Teams Webhook 无法接收消息或触发对话。如果需要完整的双向对话，请同时配置另一个通道（Telegram、Slack 等）。
:::

## 设置流程

### 1. 创建 Power Automate 工作流

1. 打开 [Power Automate](https://make.powerautomate.com/)，新建一个流
2. 选择 **"When a Teams webhook request is received"**（或任意 HTTP 触发器 + 发送 Adaptive Card 到 Teams 频道的模板）
3. 保存后复制生成的 webhook URL，格式形如 `https://prod-xx.westus.logic.azure.com/workflows/...`

:::tip 为什么用 Power Automate？
微软已经停用了旧的 Office 365 Connector incoming webhook。Power Automate 工作流是官方推荐的替代方案，也是 PicoClaw 底层库唯一支持的路径。
:::

### 2. 配置 PicoClaw

编辑 `~/.picoclaw/config.json`：

```json
{
  "channels": {
    "teams_webhook": {
      "enabled": true,
      "webhooks": {
        "default": {
          "webhook_url": "https://prod-xx.westus.logic.azure.com/workflows/...",
          "title": "PicoClaw 通知"
        }
      }
    }
  }
}
```

`default` 目标是**必填**的。当收到的消息没有匹配的 `ChatID` 时，PicoClaw 会回退到这个目标。

### 3. 多目标配置

可以注册多个 webhook 目标，并通过设置外发消息的 `ChatID` 来选择投递目标：

```json
{
  "channels": {
    "teams_webhook": {
      "enabled": true,
      "webhooks": {
        "default": {
          "webhook_url": "https://.../default-channel",
          "title": "PicoClaw"
        },
        "alerts": {
          "webhook_url": "https://.../alerts-channel",
          "title": "PicoClaw 告警"
        },
        "reports": {
          "webhook_url": "https://.../reports-channel",
          "title": "每日报告"
        }
      }
    }
  }
}
```

当 Agent 发送的消息 `ChatID = "alerts"` 时，会被路由到 alerts webhook。未识别的 `ChatID` 会回退到 `default` 并打印一条警告日志。

### 4. 把密钥存到 `.security.yml`

Webhook URL 内嵌了认证 token，不应该写到 `config.json` 里：

`~/.picoclaw/.security.yml`:

```yaml
channels:
  teams_webhook:
    webhooks:
      default:
        webhook_url: "https://prod-xx.westus.logic.azure.com/workflows/..."
      alerts:
        webhook_url: "https://prod-xx.westus.logic.azure.com/workflows/..."
```

### 5. 启动

```bash
picoclaw gateway
```

## 字段说明

### `teams_webhook`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `enabled` | bool | 是 | 是否启用通道 |
| `webhooks` | map | 是 | 命名 webhook 目标的字典，必须包含 `default` 键 |

### `webhooks.<name>`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `webhook_url` | string | 是 | Power Automate 工作流 URL，必须是 HTTPS |
| `title` | string | 否 | 该目标发送的所有 Adaptive Card 顶部显示的标题，默认值为 `"PicoClaw Notification"` |

## 消息格式

外发消息会被转换为 Adaptive Card，包含：

- **标题**：取自目标的 `title` 字段
- **正文**：消息内容渲染为 TextBlock（支持加粗、斜体、列表、链接）
- **表格**：自动检测 Markdown 表格（`| col | col |\n| --- | --- |\n| ... |`），并渲染为原生 Adaptive Card Table 元素，因为 Teams TextBlock 本身不支持 Markdown 表格
- **全宽**：卡片以 Teams 频道的全宽渲染

最大 payload 长度为 **24,000 字符**，留出余量以避免触及 Power Automate webhook 的 28KB 上限。超长消息会被截断。

## 错误处理

PicoClaw 会按 HTTP 状态码对 webhook 返回的错误分类：

- **4xx（如 401 Unauthorized、404 Not Found）**：视为**永久错误**，不重试
- **5xx 和网络错误**：视为**临时错误**，按退避策略重试

为避免 webhook URL 泄露到日志中，错误日志**不会**打印底层错误的原始内容。

## 限制

- **只发不收**：无法读取 Teams 中的消息
- **无线程**：每条消息都是独立的卡片
- **无文件上传**：Adaptive Card 正文只支持文本和表格
- **Adaptive Card 子集**：TextBlock 支持加粗、斜体、有序/无序列表、链接，**不**支持标题层级、图片或任意 HTML
- `expose_paths` 等 Teams 端的路由规则需要在 Power Automate 流内设置

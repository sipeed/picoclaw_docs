---
id: antigravity-usage
title: Antigravity 使用指南
---

# 在 PicoClaw 中使用 Antigravity

本指南介绍如何配置并使用 **Antigravity**（Google Cloud Code Assist）提供商。

## 前提条件

1. 一个 Google 账号
2. 已启用 Google Cloud Code Assist（通常可通过 "Gemini for Google Cloud" 开通）

## 1. 认证登录

运行以下命令进行认证：

```bash
picoclaw auth login --provider antigravity
```

### 无头模式认证（服务器/VPS）

如果在服务器（Coolify/Docker）上运行，无法访问 `localhost`，请按以下步骤操作：

1. 运行上述命令
2. 复制输出的 URL，在本地浏览器中打开
3. 完成 Google 账号登录
4. 浏览器会跳转到 `localhost:51121`（页面会加载失败，这是正常的）
5. **复制地址栏中的完整 URL**
6. **粘贴回终端**中等待输入的地方

PicoClaw 会自动提取授权码并完成认证流程。

## 2. 管理模型

日常模型管理推荐优先使用 Web UI。

![Web UI 模型配置](/img/providers/webuimodel.png)

### 查看可用模型

查看你的项目可访问哪些模型及其配额：

```bash
picoclaw auth models
```

### 切换模型

在 `~/.picoclaw/config.json` 中修改默认模型，或通过 CLI 临时指定：

```bash
# 仅对本次命令生效
picoclaw agent -m "你好" --model claude-opus-4-6-thinking
```

## 3. 实际部署（Coolify/Docker）

通过 Coolify 或 Docker 部署时：

1. **环境变量配置**：
   - `PICOCLAW_AGENTS_DEFAULTS_MODEL=gemini-flash`

2. **认证凭据持久化**：
   如果已在本地登录，可将凭据复制到服务器：
   ```bash
   scp ~/.picoclaw/auth.json user@your-server:~/.picoclaw/
   ```
   或者直接在服务器终端上执行一次 `auth login` 命令。

## 4. 故障排查

- **响应为空**：模型可能对该项目有限制，请尝试 `gemini-3-flash` 或 `claude-opus-4-6-thinking`
- **429 限流**：Antigravity 有严格的配额限制，PicoClaw 会在错误信息中显示"重置时间"
- **404 Not Found**：请确认使用的是 `picoclaw auth models` 列出的模型 ID，使用短 ID（如 `gemini-3-flash`）而非完整路径

## 5. 推荐模型

根据测试，以下模型最为稳定：

- `gemini-3-flash`（速度快，可用性高）
- `gemini-2.5-flash-lite`（轻量级）
- `claude-opus-4-6-thinking`（能力强，含推理模式）

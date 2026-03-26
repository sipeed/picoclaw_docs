---
id: changelog
title: 更新日志
---

# 更新日志

PicoClaw 的所有重要更新记录。

---

## v0.2.4

*发布日期：2026-03-25*

### 核心亮点

- **最大规模更新**：539 个文件变更，新增约 86,000 行代码，突破 26K Stars
- **Agent 架构全面重构**：Turn & Sub-turn 生命周期、EventBus 事件总线、Hook 系统、Steering 动态干预
- **微信/企业微信深度集成**：增强的消息处理与上下文管理
- **安全体系升级**：完善的安全配置与权限管理
- **新 Provider 与 Channel**：大量新增模型与渠道支持

### Agent 架构重构 (Phase 1)

- **Turn & Sub-turn 生命周期**：Turn 作为上下文压缩和会话管理的原子单元，支持最大并发数 5、最大嵌套深度 3 的 Sub-turn，支持 evaluator-optimizer 模式
- **EventBus 事件总线**：定义 18 种事件类型，覆盖 Agent 运行全生命周期，包括对话回合、工具调用、LLM 请求/响应、子任务创建/结束、Steering 注入、上下文压缩
- **Hook 系统**：支持 Observer、Interceptor、Approval 三种 Hook 类型，提供 5 个检查点（before_llm、after_llm、before_tool、after_tool、approve_tool），支持进程内和外部进程 Hook（stdio/gRPC，Python/Node.js 等任意语言均可接入）
- **Steering 动态干预**：允许在工具调用间隙向运行中的 Agent 注入新指令
- **上下文预算管理**：每次 LLM 调用前主动检查 Token 消耗，接近上限时自动安全压缩历史对话，基于 Turn 边界检测保留对话连贯性
- **AGENT.md 结构化定义**：通过带 YAML frontmatter 的 AGENT.md 文件定义 Agent 身份、能力和人格

### 渠道与集成

- **微信/企业微信深度集成**：增强消息处理和上下文管理能力
- **安全体系升级**：完善安全配置，优化权限管理机制
- **新 Provider 与 Channel**：扩展更多 Provider 和 Channel 选项

### 完整更新日志
- [GitHub v0.2.3...v0.2.4](https://github.com/sipeed/picoclaw/compare/v0.2.3...v0.2.4)
---

## v0.2.1

*发布日期：2026-03-09*

### 核心亮点

- **Web 端与 UI 架构升级**：Launcher 迁移至模块化的 Web 前后端架构，大幅提升管理界面的交互体验，并新增了全新的启动器 Banner (#1275, #1008)。
- **多模态与视觉能力 (Vision Pipeline)**：Agent 核心完整接入图像/媒体支持，支持将媒体引用转换为 Base64 流并实现自动文件类型检测，全面打通多模态大模型的视觉能力。
- **全新 JSONL 记忆存储引擎**：引入追加写入模式（append-only）的 JSONL Session 存储，支持物理级别的历史记录压缩与崩溃恢复，提供更安全的会话持久化方案。
- **MCP (Model Context Protocol) 深度集成**：全面支持 MCP 协议，支持对接外部 MCP Server，且引入了并行执行 LLM 工具调用的能力，大幅提升工具执行效率 (#1070)。
- **海量模型与搜索源接入**：新增对接 Minimax、Moonshot (Kimi)、Exa AI、SearXNG、Avian 等多家主流大模型与搜索引擎。

### 新特性与增强

#### 模型与搜索服务 (Providers)
- **LLM 新增**：支持 Minimax (#1273)、Kimi (Moonshot) 与 Opencode、Avian、LiteLLM 别名支持 (#930)。
- **模型高级特性**：支持 Anthropic 模型的扩展思考流 (Extended thinking) (#1076)，并新增 Anthropic OAuth setup-token 登录支持 (#926)。
- **搜索源新增**：集成 SearXNG 搜索、Exa AI 搜索以及智谱 GLM Search Web 搜索提供商 (#1057)。
- **模型路由策略**：在 Agent Loop 中引入了基于语言无关的模型复杂度评分机制，实现更智能的模型路由分发。

#### 渠道与即时通讯 (Channels)
- **企业微信 (WeCom)**：全新引入企业微信 AI Bot (AIBot) 集成，支持流式任务上下文管理、推理过程展示 (reasoning_channel_id) 并在超时与清理逻辑上进行了全面增强。
- **Discord**：新增代理 (Proxy) 支持，支持解析频道引用、展开消息链接，并完美支持引用/回复消息的上下文理解 (#1047)。
- **Telegram**：新增自定义 Bot API Server (base_url) 支持 (#1021)，优化命令作用域，并加入了长消息分块发送 (Chunking) 机制。
- **飞书 (Feishu)**：增强飞书卡片（Markdown）、媒体、@提及与编辑功能，并加入了随机回应表情 (Random reaction emoji) 特性 (#1171)。
- **全新渠道接入**：新增对 Matrix 频道和 IRC 频道的原生支持。

#### 核心架构与 Agent (Core & Agent)
- **多模态增强**：在 Message 结构中添加 Media 字段，实现 resolveMediaRefs 功能，打通从代理层到 LLM 的多模态链路。
- **记忆与上下文**：完善多轮对话历史对 reasoning_content（推理内容）的保留；摘要阈值与 Token 比例现在可通过配置文件自定义 (#1029)。
- **系统与配置**：全面支持 .env 环境变量加载及配置覆盖；支持通过 PICOCLAW_HOME 环境变量自定义配置与工作区路径；新增 /clear 命令用于快速清空聊天历史 (#1266)。
- **交互改进**：Agent 现可降级回退至输出 reasoning content (#992)。

#### 工具与能力 (Tools & Skills)
- **MCP 架构完善**：新增工作区级别的环境文件加载、支持相对路径解析，并提供完善的 MCP 注册与生命周期管理机制。
- **工具扩展控制**：新增工具的"启用/禁用"全局切换配置开关 (#1071)，全局技能开关现在能够正确覆盖下游行为。
- **文件发送能力**：新增 send_file 工具，支持 Agent 主动向外（出站）发送多媒体文件 (#1156)。

### 修复与优化

#### 稳定性与并发安全
- **MCP 修复**：解决了导致 TOCTOU 的竞争条件与资源泄漏问题；修复了工具注册阶段可能出现的死锁；确保连接失败时返回聚合错误。
- **内存与存储**：修复 JSONL 迁移过程中的崩溃一致性问题（fsync 增强，写入元数据保证安全）；限制内存锁并增大 scanner 缓冲以防 OOM。
- **频道容错**：修复企业微信应用/机器人的 dedupe 数据竞争（更换为环形队列）；修复 Discord 跨公会（Cross-guild）的消息链接泄露；修复矩阵 (Matrix) 群组提及的正则检测。

#### 工具与网络调用
- **Web Fetch 优化**：修复 web_fetch 工具达到最大载荷限制的问题；修复并行执行下的请求中断与重试时 Response Body 未关闭导致的泄漏 (#940)。
- **ClawHub / Skills**：修复 ClawHub 遇到 429 频控时未重试的问题；修正技能发现功能的 Registry flag 传参逻辑 (#929)。
- **执行沙盒**：修复 exec 工具执行 shell 命令的超时配置不生效问题；加入命令注入安全拦截（过滤 kill -9 模式）。

#### 体验与兼容性
- **Telegram HTML 解析**：增加对超出长度限制的 HTML 内容的降级与多队列重分块处理，避免发送失败。
- **OpenAI 兼容层**：改进对非 JSON 响应（如 HTML 错误页）的错误处理与流式解析支持。
- **重载防崩溃**：修复热重载配置文件时可能触发的 self-kill 保护机制误判。

### 构建、部署与运维
- **Docker 支持**：镜像底层从 Debian 切换至更轻量的 Alpine；全面迁移至 Docker Compose v2 语法；新增包含完整 MCP 工具链的 Docker 镜像配置。
- **平台编译**：交叉编译支持新增 Linux/s390x 与 Linux/mipsle 架构 (#1265)；通过 goreleaser 新增 macOS 二进制文件的公证 (Notarization) 流程 (#1274)。
- **CI/CD**：新增 Nightly 自动构建工作流 (#1226)；引入 govulncheck 漏洞扫描与 dupl 代码重复率检查；自动将构建产物上传至 Volcengine TOS (#1164)。
- **日志与观测**：增加 Cron 定时任务的执行生命周期日志记录 (#1185)。

---

## v0.2.0

*发布日期：2026-02-28*

### 重磅功能

- **全新架构重构**：
  - **Provider 协议重构**：引入了基于协议（Protocol-based）的 Provider 创建机制，统一了 OpenAI、Anthropic、Gemini、Mistral 等主流协议的对接逻辑。
  - **Channel 系统升级**：重构了通道系统架构，支持自动化调度 Placeholder、正在输入状态（Typing）及 Emoji 回应。
- **生态与工具链**：
  - **PicoClaw Launcher & WebUI**：新增 Web 界面，支持可视化配置管理和网关（Gateway）进程调度。
  - **技能发现 (Skill Discovery)**：集成 Clawhub，支持技能的在线搜索、缓存与安装。
- **新增模型支持 (Providers)**：
  - 新增 Cerebras、Mistral AI、Volcengine (豆包)、Perplexity、Qwen (通义千问) 及 Google Antigravity 原生支持。
  - 支持推理模型（Reasoning Models）的思维链（Thought/Reasoning Content）输出及专用频道展示。
- **新增交互通道 (Channels)**：
  - **原生 WhatsApp 支持**：新增高性能的 WhatsApp 原生通道实现。
  - **WeCom (企业微信)**：支持企业微信及企业微信自建应用通道。

### 性能与优化

- **低资源适配**：优化二进制体积，并针对 ARM 架构（ARMv6, ARMv7, ARMv8.1）提供更全面的构建支持。
- **并发性能**：重构 MessageBus 解决死锁问题，并将消息缓冲区从 16 提升至 64。
- **搜索增强**：Tavily 搜索支持代理配置，新增 OpenAI 兼容的 WebSearch 接口。
- **更强健的配置**：新增 model_list 模板，支持零代码添加模型，并提供重复模型名称校验。

### 修复与安全性

- **沙箱安全**：修复了 ExecTool 的工作目录逃逸风险及 TOCTOU 竞争问题，加固了系统指令注入的防御模式。
- **稳定性修复**：
  - 修复了内存泄漏问题（特别是在 WhatsApp 频道中）。
  - 修复了 Gemini API 在特定情况下的 400 错误及 Prompt 缓存失效问题。
- **工程质量**：全面启用 golangci-lint，清理了大量冗余代码并修复了 lint 错误。

### 文档与社区

- **多语言支持**：新增了越南语、葡萄牙语（巴西）版本的 README，并优化了日语翻译。
- **架构指南**：新增了关于通道系统架构和协议架构的详细中英文文档。

---

## v0.1.2

*发布日期：2026-02-17*

### 新功能

- **LINE 通道**：新增 LINE Official Account 通道支持。
- **OneBot 通道**：新增 OneBot 协议通道支持。
- **健康检查**：新增 `/health` 和 `/ready` 端点，支持容器编排存活/就绪探针 (#104)。
- **DuckDuckGo 搜索**：新增 DuckDuckGo 搜索回退，支持可配置的搜索提供商。
- **设备热插拔**：支持 Linux 上的 USB 设备热插拔事件通知 (#158)。
- **Telegram 命令**：结构化命令处理，引入专用命令服务及 `telegohandler` 集成 (#164)。
- **本地 AI**：新增 Ollama 本地推理集成 (#226)。
- **技能校验**：新增技能信息和测试用例验证 (#231)。

### 改进

- **安全性**：阻止关键的符号链接工作区逃逸 (#188)；收紧文件权限并强制 Slack ACL 检查 (#186)。
- **Docker**：Docker 镜像中新增 curl；优化 Docker 构建工作流触发条件。
- **32 位支持**：为飞书添加构建约束以支持 32 位架构。
- **Loong64**：新增 Linux/loong64 构建支持 (#272)。
- **GoReleaser**：迁移至 GoReleaser 进行发布管理 (#180)。

### 问题修复

- 修复 Telegram 消息重复发送 (#105)。
- 修复代码块索引提取 bug (#130)。
- 修复 OneBot 连接处理。
- 修复 MessageBus 关闭后 publish 引发的 panic (#223)。
- 修复 DownloadFile 中的重复文件扩展名 (#230)。
- 修复 OpenAI OAuth 授权 URL 和参数 (#151)。

---

## v0.1.1

*发布日期：2026-02-13*

### 新功能

- **动态上下文压缩**：智能对话上下文压缩 (#3)。
- **新增通道**：飞书 (#6)、QQ (#5)、钉钉 Stream Mode (#12)、Slack Socket Mode (#34)。
- **Agent 记忆系统**：Agent 记忆及工具执行改进 (#14)。
- **定时任务工具 (Cron)**：支持定时任务调度和直接 Shell 命令执行 (#23, #74)。
- **OAuth 登录**：基于 SDK 的订阅提供商 OAuth 认证 (#32)。
- **迁移工具**：`picoclaw migrate` 命令，支持 OpenClaw 工作区迁移 (#33)。
- **Telegram 升级**：迁移至 Telego 库以获得更好的 Telegram 集成 (#40)。
- **CLI Provider**：基于 CLI 的 LLM 提供商，支持子进程集成 (#73, #80)。
- **Provider 选择**：支持显式指定 provider 字段进行模型配置 (#48)。
- **macOS 支持**：新增 Darwin ARM64 构建目标 (#76)。

### 改进

- 统一媒体处理并改善资源清理 (#49)。
- 改进版本信息，包含 git commit hash (#45)。
- 强制系统工具的工作区目录边界 (#26)。

### 问题修复

- 修复心跳服务启动 bug (#64)。
- 修复 CONSCIOUSLY 消息历史清理引发的 LLM 错误 (#55)。
- 修复 OpenAI device-code 流中的字符串 interval (#56)。
- 修复 Telegram 通道权限检查 (#51)。
- 修复 AgentLoop running 状态的原子安全性 (#30)。

---

## v0.0.1

*发布日期：2026-02-09*

PicoClaw 首次发布。请参阅 [README](https://github.com/sipeed/picoclaw) 获取基本使用说明。

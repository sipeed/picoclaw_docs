---
id: changelog
title: 更新日志
---

# 更新日志

PicoClaw 的所有重要更新记录。

---
## v0.2.7

*发布日期：2026-04-22*

### 核心亮点
- **Launcher 认证流程升级**：统一 dashboard 的 `/login` / `/setup` / `/logout` 流程，新增 OAuth 无浏览器登录，并将 launcher 认证迁移到密码模式（#2339、#2549、#2608）
- **Agent Loop 两阶段重构**：拆分并重组核心 loop 管线，降低维护复杂度，为并行执行能力铺路（#2564、#2585）
- **原生 Gemini Provider**：新增 Gemini 原生 provider，并分离 thought 消息与输出消息处理（#2475）
- **工具链与会话稳定性提升**：新增 `/context` 指令与上下文用量指示；`/clear` 支持清理 Seahorse DB；定时任务改为独立会话执行（#2537、#2495、#2474）
- **Web UI 体验改进**：工具页重构为标签化库/设置视图，补齐 Markdown 高亮，完善禁用态原因提示（#2539、#2529、#2523、#2430、#2526）
- **搜索与网络鲁棒性增强**：新增可配置 Sogou 搜索后端，改进代理、错误分类与 fallback 处理（#2524、#2542、#2547、#2517）

### 功能
Core & Agent
- **Loop 重构**：完成 Phase 1/2 的 loop 文件拆分与执行管线重排（#2564、#2585）
- **LLM-as-Judge**：新增评测模式（#2484）
- **并行执行能力演进**：推进 agent loop 对并行执行场景的支持（#2503）

### Provider 与认证
- **Gemini 原生协议支持**：原生 provider + thought/output 分离（#2475）
- **OAuth 登录体验**：新增 `--no-browser` 选项，适配无 GUI 环境（#2549）
- **认证兼容性改进**：不支持平台回退 token 认证；修复 Google Antigravity provider 规范化与凭据一致性（#2466、#2599）

### Channel、工具与交互
- **多实例 Channel 配置方向重构**：向多实例配置模型演进，修复嵌套 `channel_list` patch 保存并增强列表编辑（#2481、#2530、#2595）
- **工具调用一致性**：修复跨轮复用 tool-call ID；保持工具调用摘要与 assistant 输出同步（#2528、#2449）
- **禁用态提示完善**：补充 composer/tooltip 禁用原因提示并修复回归（#2523、#2430、#2526）

### Bug 修复
- **运行时恢复能力**：修复 reload 后 MCP/discovery 工具恢复；修复 image-input-unsupported 后恢复能力（#2489、#2525）
- **Seahorse 搜索安全性**：修复 FTS5 MATCH 查询输入清洗问题（#2436）
- **更新链路稳定性**：修复发布信息拉取瞬时失败重试；启动前错误日志补齐（#2511、#2414）
- **配置与网络边界问题**：修复 `allowFrom` 包含空字符串问题；增强网络错误分类与 fallback（#2507、#2547）
- **前端稳定性**：修复配置刷新重置搜索草稿；清理恢复会话转录并优化聊天 UI（#2536、#2605）
- **工程质量修复**：修复 govet shadow 告警并调整不支持 OS 的隔离测试（#2613、#2434）

### 构建与运维
- **Android 发布链路**：新增 Android arm64 交叉编译，并将 Android bundle 发布纳入 GoReleaser（#2486、#2497）
- **CI 流程更新**：切换到 `pnpm/action-setup` 并同步 README 安装步骤（#2512、#2552）
- **依赖维护**：完成多项前后端依赖升级（React、TanStack、shadcn、sqlite、MCP SDK、router/lint 等）
- **容器行为一致性**：自建镜像改为 root 运行，对齐发布镜像行为（#2435）

### 文档
- **文档结构重组**：按类型重组文档，补充 layout 指南与 session/routing 文档（#2567、#2571）
- **协议文档更新**：更新 Gemini 原生协议文档与跨 provider JSON 转义说明（#2601、#2420）
- **本地化与杂项修复**：新增韩文 README，修复 CONTRIBUTING 中 Conventional Commits 链接（#2418、#2494）

### 完整变更
- [GitHub v0.2.6...v0.2.7](https://github.com/sipeed/picoclaw/compare/v0.2.6...v0.2.7)

---



## v0.2.6

*发布日期：2026-04-08*

### 核心亮点

- **子进程隔离**：全新 `pkg/isolation` 运行时把子进程（exec 工具、CLI 类 provider、进程型 hook、MCP stdio server）放进沙箱执行 —— Linux 用 `bwrap`，Windows 用受限 token + Job Object (#2423)
- **Seahorse 短时记忆引擎（LCM）**：按 Agent 隔离的 SQLite 持久化存储，支持 FTS5 全文检索、分层摘要、新增 `short_grep` / `short_expand` 工具 (#2285)
- **Hook 系统增强**：新增 `respond` 动作，让 `before_tool` hook 可以直接返回工具结果，支持插件式工具注入、结果缓存、工具 mock；上游补齐了完整的协议文档 (#2215)
- **Microsoft Teams 通道**：新增 `teams_webhook` 仅输出通道，通过 Power Automate 工作流 webhook 把 Adaptive Card 推送到 Teams，支持多目标路由和 Markdown 表格自动转换 (#2244)
- **HTTP Provider 自定义请求头**：HTTP 类 LLM Provider 在每条 model 配置中新增 `custom_headers` 字段，可向每次请求注入任意 HTTP 头 (#2402)
- **MCP 工件存储**：MCP 工具的超大文本结果改为以工件形式存储，避免污染上下文 (#2308)

### 新特性与增强

#### 渠道与即时通讯 (Channels)
- **Teams Webhook**：通过 Power Automate 工作流 webhook 实现的全新仅输出通道；支持注册多个命名 webhook 目标，按消息选择投递目标；消息渲染为 Adaptive Card，原生支持 Markdown 表格 (#2244)
- **飞书**：引用回复上下文补全现在也覆盖卡片和文件类回复，30 秒消息缓存，600 字符上限 (#2144)

#### 核心架构与 Agent
- **子进程隔离**：新增 `pkg/isolation` 运行时，顶层配置块 `isolation` 提供 `enabled` 与 `expose_paths` 两个字段。Linux 通过 `bwrap` 实现文件系统和 IPC 命名空间隔离；Windows 使用受限 token + 低完整性级别 + Job Object；macOS 暂未实现 (#2423)
- **Seahorse 短时记忆引擎**：每个 Agent 一份 SQLite 存储，路径为 `<workspace>/sessions/seahorse.db`，对摘要和消息建立 FTS5 索引；两层分级摘要（叶子 + condensed）；引擎激活时自动注册 `short_grep` 和 `short_expand` 工具 (#2285)
- **Hook `respond` 动作**：新的 `HookActionRespond` 让 `before_tool` hook 直接返回 `HookResult`，跳过工具执行；上游补齐了完整的 `hook-json-protocol.md` 和 `plugin-tool-injection.md` 规范；**会绕过 `approve_tool` 检查**，因此请只授权给可信 hook (#2215)
- **故障转移 Provider 按候选独立**：`model_fallbacks` 支持每个候选独立配置 provider (#2143)

#### 模型与服务 (Providers)
- **自定义 HTTP 头**：`ModelConfig` 新增 `custom_headers` 字段（HTTP 类 provider 可用），会注入到每次请求中，常用于鉴权代理、可观测性头、厂商专用路由 (#2402)

#### MCP
- **工件存储**：MCP 工具的超大文本结果会被持久化到工件存储，并以引用方式暴露给上下文，避免膨胀 (#2308)
- **隔离 Command Transport**：MCP `stdio` server 改走统一的隔离启动入口

#### 工具与记忆
- **LOCOMO Membench 工具**：`pkg/membench` 下新增的基准测试工具，用于评估长对话记忆引擎 (#2353)
- **`write_file`**：澄清了嵌套 JSON 的转义语义，并补齐相关测试 (#2320)

#### Web UI
- **WebSocket URL**：浏览器端改为从 `window.location` 解析 WebSocket URL，不再依赖后端硬编码，修复反向代理和远程访问场景 (#2405)
- **Launcher HTTP 流程**：控制台新增标准 `/login` / `/setup` / `/logout` HTTP 接口，并修复 Windows 下 WebSocket 的 PID 锁问题 (#2339)

### 修复与优化

- **WebUI**：修复 WebUI 无法连接到由 WebUI 自己启动的网关 (#2267)
- **网关**：加固 PID 存活检测、所有权校验和 WebSocket 代理状态 (#2403, #2422)
- **工具**：`message` 工具不再丢失对原始聊天的回复 (#2180)
- **Docker**：launcher 增加 `-console` 标志和开放网络访问 (#2314)；自构建镜像改为以 root 运行，与 release 镜像保持一致 (#2435)
- **CLI**：修复 help 横幅版本号中重复出现 `v` (#2316)
- **Seahorse**：在 FreeBSD/ARM 及其他不支持平台禁用上下文管理器 (#2417, #2384)；纠正 BM25 排名注释中的语义错误 (#2360)
- **测试**：在不支持的操作系统上跳过 `TestPrepareCommand_AppliesUserEnv` (#2434)

### 构建与运维

- **依赖**：`modernc.org/sqlite` 1.47.0 → 1.48.0 (#2289)；`github.com/pion/rtp` 1.8.7 → 1.10.1 (#2290)
- **资源**：更新微信 QR code 图片 (#2385)
- **文档**：新增韩语 README 翻译

### 文档

本次发布同步上线了以下文档站更新：
- 新增：[Microsoft Teams（Webhook）通道](./channels/teams-webhook.md)、[子进程隔离](./configuration/isolation.md)
- 更新：[Hook 系统](./hooks.md)、[上下文压缩](./context-compression.md)、[Token 认证登录](./configuration/token_authentication.md)、[飞书通道](./channels/feishu.md)、[完整配置参考](./configuration/config-reference.md)

### 完整更新日志
- [GitHub v0.2.5...v0.2.6](https://github.com/sipeed/picoclaw/compare/v0.2.5...v0.2.6)


## v0.2.5

*发布日期：2026-04-03*

### 核心亮点

- **VK (VKontakte) 通道**：新增俄罗斯最大社交网络的通道支持，基于 Long Poll API，支持群聊和语音功能 (#2276)
- **LLM 速率限制**：内置 Provider API 调用速率限制器，支持可配置的限制策略和自动降级 (#2198)
- **可插拔上下文管理**：全新 ContextManager 抽象层，支持自定义上下文策略 (#2203)
- **新增 Provider**：Venice AI (#2238)、Mimo (#1987)、LMStudio (#2193)，统一本地 Provider 默认配置
- **工具增强**：Exec 工具支持后台执行和 PTY (#1752)、Reaction 表情回应工具 (#2156)、`load_image` 本地图片视觉分析 (#2116)、`read_file` 按行读取 (#1981)
- **Web UI 全面升级**：技能市场 (#2246)、Dashboard 令牌认证 (#1953)、新手引导、Pico 聊天图片消息 (#2299)、日志级别控制 (#2227)

### 新特性与增强

#### 模型与服务 (Providers)
- **Venice AI**：新增 Venice AI 提供商集成 (#2238)
- **Mimo**：新增 Mimo 提供商支持 (#1987)
- **LMStudio**：本地提供商，统一默认认证/地址处理 (#2193)
- **Azure OpenAI**：Azure 端点使用 OpenAI Responses API (#2110)
- **速率限制**：每个模型可配置速率限制，支持自动降级级联 (#2198)
- **User Agent**：`model_list` 中支持自定义 `userAgent` (#2242)
- **模型可用性探测**：增强的退避和缓存机制 (#2231)

#### 渠道与即时通讯 (Channels)
- **VK (VKontakte)**：完整通道实现——文本、媒体附件、语音（ASR/TTS）、群聊触发和用户白名单 (#2276)
- **Telegram**：入站消息支持引用回复上下文和媒体 (#2200)；优化重复消息保护；修复斜体正则匹配导致的 HTML 链接破损 (#2164)
- **钉钉**：支持仅@群组并自动剥离前导@提及 (#2054)
- **飞书**：跳过空的 `random_reaction_emoji` 条目
- **微信**：新协议支持 (#2106)；上下文 Token 持久化到磁盘 (#2124)
- **多消息发送**：通过分割标记支持多消息发送 (#2008)
- **Channel.Send**：现返回已投递的消息 ID (#2190)
- **快速失败**：所有通道启动失败时网关立即报错退出 (#2262)

#### 核心架构与 Agent
- **ContextManager**：可插拔的上下文管理抽象层，支持自定义策略 (#2203)
- **Token 估算**：修复系统消息 Token 重复计算问题；新增推理内容保护
- **上下文溢出**：改进溢出检测与分类 (#2016)
- **轻量 Provider**：路由模型调用使用轻量 Provider (#2038)
- **Prompt Token**：每次请求记录 Prompt Token 使用量 (#2047)
- **时区**：从 `TZ` 和 `ZONEINFO` 环境变量加载时区信息 (#2279)

#### 工具与能力 (Tools)
- **Exec 工具**：支持后台执行和 PTY (#1752)
- **Reaction 工具**：表情回应和带回复感知的消息发送 (#2156)
- **load_image**：加载本地图片文件用于视觉模型分析 (#2116)
- **read_file**：按行范围读取文件 (#1981)
- **web_search**：支持日期范围过滤
- **Cron**：统一 Agent 执行路径；定时任务响应发布到出站总线 (#2147, #2100)
- **MCP**：支持 HTTP 传输的 `DisableStandaloneSSE` 选项 (#2108)

#### Web UI 与 Launcher
- **技能市场**：浏览、搜索和安装 Hub 中的技能 (#2246)
- **Dashboard 认证**：令牌保护的 Launcher Dashboard，支持 SPA 登录 (#1953)
- **新手引导**：首次使用的交互式引导
- **图片消息**：Pico 聊天支持图片消息 (#2299)
- **日志级别控制**：从 Web UI 调整服务日志级别 (#2227)
- **配置页面**：版本信息移至页头；通道配置加载时不暴露密钥 (#2273, #2277)
- **Dashboard 令牌**：持久化存储在 Launcher 配置中 (#2304)

### 修复与优化

- **Telegram**：修复编辑超时 (#2092)；DM 策略安全加固 (#2088)
- **配置**：修复 `FlexibleStringSlice` 导致启动崩溃 (#2078)；默认禁用工具反馈 (#2026)；修复数组占位符
- **网关**：修复重载导致 Pico 通道停止工作 (#2082)；网关端口检查和 Fatal 日志记录 (#2185)
- **重试**：正确处理 429 响应的 `Retry-After` 头，溢出安全 (#2176)
- **循环**：修复轮询行为 (#2103)
- **微信**：修复 Launcher 启动网关时 picoToken 为空 (#2241)
- **Web**：修复 WebSocket 代理中缓存的 Pico Token (#2222)；技能页面暗色模式主题 (#2166)；Discord Token 在通道设置中持久化 (#2024)
- **容器**：SIGINT/SIGTERM 优雅关停
- **BM25**：预计算索引加速重复搜索 (#2177)
- **Panic 恢复**：统一所有 panic 事件到 panic 日志文件 (#2250)；subturn 添加缺失的 recover (#2253)

### 构建与运维

- **Windows**：修复 make 构建错误，支持自定义构建环境 (#2281)
- **日志**：`PICOCLAW_LOG_FILE` 环境变量支持纯文件日志输出；基于组件的 Logger 高亮输出；默认日志级别改为 `warn`
- **配置**：重构 Config 和 Security 结构简化代码 (#2068)；`ModelConfig.Enabled` 字段；占位文本支持字符串或列表
- **自更新**：更健壮的选择和解压逻辑，默认使用 nightly (#2201)
- **安全**：开放默认警告和 `*` allow_from 通配符支持

### 完整更新日志
- [GitHub v0.2.4...v0.2.5](https://github.com/sipeed/picoclaw/compare/v0.2.4...v0.2.5)
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

## v0.2.3

*发布日期：2026-03-17*

### 核心亮点

- **系统托盘 UI**：全平台桌面托盘支持（macOS、Linux、FreeBSD）
- **执行控制**：可配置的 exec 设置，支持 cron 命令权限管控
- **Web 网关**：热重载和轮询状态同步
- **SpawnStatusTool**：新增子 Agent 状态上报工具

### 新特性与增强

- Web UI 中可配置 cron 命令执行设置
- WebSocket 通过 Web 服务器端口代理，统一入口
- 重构网关辅助模块，新增 `server.pid` 健康检查

### 修复与优化

- **GLM**：修复 tool_use 块中的 nil input 处理
- **网关**：服务器未运行时不再自动启动
- **工作区**：符号链接白名单路径检查规范化

### 完整更新日志
- [GitHub v0.2.2...v0.2.3](https://github.com/sipeed/picoclaw/compare/v0.2.2...v0.2.3)
---

## v0.2.2

*发布日期：2026-03-11*

### 核心亮点

- **语音转写**：Echo 语音转文字功能，覆盖 Discord、Slack、Telegram
- **Agent 管理 UI**：新增 Web 端 Agent 管理界面和 Launcher 集成
- **安全加固**：加固未认证的工具执行路径

### 新特性与增强

- Web 设置中新增 exec `allow_remote` 配置项
- 会话 key 中斜杠字符的清洗处理
- 重构技能加载器的 Markdown 元数据解析

### 修复与优化

- **网关**：修复二进制路径解析和 `--config` 标志传递
- **迁移**：会话迁移时跳过 meta JSON 文件
- **Slack**：修复线程中的重复消息

### 完整更新日志
- [GitHub v0.2.1...v0.2.2](https://github.com/sipeed/picoclaw/compare/v0.2.1...v0.2.2)
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

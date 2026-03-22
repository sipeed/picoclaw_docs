---
id: roadmap
title: 路线图
---

# 🦐 PicoClaw 路线图

> **愿景**：打造终极轻量、安全、完全自主的 AI Agent 基础设施。让平凡的事情自动化，释放你的创造力。

---

## 🚀 1. 核心优化：极致轻量

*这是我们的核心特质。我们与软件臃肿作战，确保 PicoClaw 能在最小的嵌入式设备上流畅运行。*

* [**减少内存占用**](https://github.com/sipeed/picoclaw/issues/346)
  * **目标**：在 64MB RAM 嵌入式板（如低端 RISC-V 单板计算机）上流畅运行，核心进程内存占用低于 20MB。
  * **背景**：在边缘设备上，RAM 宝贵且稀缺。内存优化优先于存储体积优化。
  * **行动**：分析各版本间的内存增长，移除冗余依赖，优化数据结构。


## 🛡️ 2. 安全加固：纵深防御

*偿还早期技术债。我们邀请安全专家共同构建"默认安全"的 Agent。*

* **输入防御与权限控制**
  * **提示词注入防御**：强化 JSON 提取逻辑，防止 LLM 被操控。
  * **工具滥用防护**：严格的参数校验，确保生成的命令在安全边界内。
  * **SSRF 防护**：为网络工具内置黑名单，防止访问内部 IP（局域网/元数据服务）。


* **沙箱与隔离**
  * **文件系统沙箱**：将文件读写操作限制在特定目录。
  * **上下文隔离**：防止不同用户会话或通道之间的数据泄漏。
  * **隐私脱敏**：自动从日志和标准输出中脱敏敏感信息（API Key、个人信息）。


* **认证与密钥**
  * **加密升级**：采用 `ChaCha20-Poly1305` 等现代算法进行密钥存储。
  * **OAuth 2.0 流程**：废弃 CLI 中硬编码的 API Key，改用安全的 OAuth 流程。



## 🔌 3. 连接性：协议优先架构

*连接每一个模型，触达每一个平台。*

* **提供商**
  * [**架构升级**](https://github.com/sipeed/picoclaw/issues/283)：从"基于厂商"重构为"基于协议"的分类（如 OpenAI 兼容、Ollama 兼容）。*（状态：进行中，预计 5 天）*
  * **本地模型**：深度集成 **Ollama**、**vLLM**、**LM Studio** 和 **Mistral**（本地推理）。
  * **在线模型**：持续支持前沿闭源模型。


* **通道**
  * **IM 矩阵**：QQ、微信（企业微信）、钉钉、飞书、Telegram、Discord、WhatsApp、LINE、Slack、邮件、KOOK、Signal……
  * **标准协议**：支持 **OneBot** 协议。
  * [**附件支持**](https://github.com/sipeed/picoclaw/issues/348)：原生处理图片、音频和视频附件。


* **技能市场**
  * [**技能发现**](https://github.com/sipeed/picoclaw/issues/287)：实现 `find_skill`，自动从 GitHub 技能仓库或其他注册表发现并安装技能。



## 🧠 4. 高级能力：从聊天机器人到 Agentic AI

*超越对话——聚焦行动与协作。*

* **操作能力**
  * [**MCP 支持**](https://github.com/sipeed/picoclaw/issues/290)：原生支持 **Model Context Protocol（MCP）**。
  * [**浏览器自动化**](https://github.com/sipeed/picoclaw/issues/293)：通过 CDP（Chrome DevTools Protocol）或 ActionBook 控制无头浏览器。
  * [**移动端操作**](https://github.com/sipeed/picoclaw/issues/292)：Android 设备控制（类似 BotDrop）。


* **多 Agent 协作**
  * [**基础多 Agent**](https://github.com/sipeed/picoclaw/issues/294)：实现基本的多 Agent 协作。
  * [**模型路由**](https://github.com/sipeed/picoclaw/issues/295)："智能路由" — 将简单任务分发给小型/本地模型（快速/低成本），将复杂任务分发给 SOTA 模型（更智能）。
  * [**集群模式**](https://github.com/sipeed/picoclaw/issues/284)：同一网络上多个 PicoClaw 实例之间的协作。
  * [**AIEOS**](https://github.com/sipeed/picoclaw/issues/296)：探索 AI 原生操作系统的交互范式。



## 📚 5. 开发者体验（DevEx）与文档

*降低入门门槛，让任何人都能在几分钟内完成部署。*

* [**快速引导（零配置启动）**](https://github.com/sipeed/picoclaw/issues/350)
  * 交互式 CLI 向导：若启动时没有配置文件，自动检测环境，逐步引导用户完成 Token/网络配置。


* **完善的文档**
  * **平台指南**：Windows、macOS、Linux 和 Android 的专项指南。
  * **手把手教程**："保姆级"的提供商和通道配置教程。
  * **AI 辅助文档**：使用 AI 自动生成 API 参考和代码注释（人工校验以防止幻觉）。



## 🤖 6. 工程：AI 赋能开源

*诞生于 Vibe Coding，我们继续用 AI 加速开发。*

* **AI 增强 CI/CD**
  * 集成 AI 进行自动化代码审查、Lint 检查和 PR 标签。
  * **机器人降噪**：优化机器人交互，保持 PR 时间线简洁。
  * **Issue 分类**：AI Agent 分析传入的 Issue 并提出初步修复建议。



<!-- ## 🎨 7. 品牌与社区

* [**Logo 设计**](https://github.com/sipeed/picoclaw/issues/297)：我们正在寻找 **皮皮虾** 的 Logo 设计！
  * *创意概念*：需要体现"小而强大"和"闪电出击"的特质。 -->



---

### 🤝 欢迎贡献

欢迎社区对路线图上的任何条目做出贡献！请在相关 Issue 下留言或提交 PR。让我们一起打造最好的边缘 AI Agent！

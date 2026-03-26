---
id: changelog
title: Changelog
---

# Changelog

All notable changes to PicoClaw are documented here.

---

## v0.2.4

*Released: 2026-03-25*

### Highlights

- **Largest Update Ever**: 539 files changed, ~86,000 lines of code added, surpassing 26K Stars
- **Agent Architecture Overhaul**: Turn & Sub-turn lifecycle, EventBus, Hook system, Steering dynamic intervention
- **Deep WeChat/WeCom Integration**: Enhanced message processing and context management
- **Security System Upgrade**: Comprehensive security configuration and permission management
- **New Providers & Channels**: Extensive new model and channel support

### Agent Architecture Refactor (Phase 1)

- **Turn & Sub-turn Lifecycle**: Turn as atomic unit for context compression and session management, supporting Sub-turn with max concurrency 5 and max nesting depth 3, supporting evaluator-optimizer mode
- **EventBus**: 18 event types defined, covering full Agent lifecycle including conversation turns, tool calls, LLM requests/responses, sub-task creation/termination, Steering injection, context compression
- **Hook System**: Supports Observer, Interceptor, and Approval hook types with 5 checkpoints (before_llm, after_llm, before_tool, after_tool, approve_tool), supporting both in-process and external process hooks (stdio/gRPC, Python/Node.js compatible)
- **Steering Dynamic Intervention**: Inject new instructions into running Agent during tool call gaps
- **Context Budget Management**: Proactively check Token consumption before each LLM call, automatically compress history when approaching limits while preserving conversation coherence based on Turn boundary detection
- **AGENT.md Structured Definition**: Define Agent identity, capabilities, and personality through AGENT.md file with YAML frontmatter

### Channels & Integration

- **Deep WeChat/WeCom Integration**: Enhanced message processing and context management capabilities
- **Security System Upgrade**: Comprehensive security configuration with optimized permission management
- **New Providers & Channels**: Expanded Provider and Channel options

### Full changelog
- [GitHub v0.2.3...v0.2.4](https://github.com/sipeed/picoclaw/compare/v0.2.3...v0.2.4)
---

## v0.2.1

*Released: 2026-03-09*

### Highlights

- **Web & UI Architecture Upgrade**: Launcher migrated to a modular web frontend/backend architecture, greatly improving management UX with a brand-new launcher banner (#1275, #1008).
- **Vision Pipeline (Multimodal)**: Full image/media support in the Agent core — media references are converted to Base64 streams with auto file type detection, enabling multimodal LLM vision capabilities.
- **JSONL Memory Storage Engine**: Append-only JSONL session storage with physical-level history compression and crash recovery for safer session persistence.
- **MCP Deep Integration**: Full Model Context Protocol (MCP) support, including external MCP Server connectivity and parallel LLM tool call execution (#1070).
- **New Providers & Search Sources**: Added Minimax, Moonshot (Kimi), Exa AI, SearXNG, Avian, and more.

### Features

#### Providers
- **New LLMs**: Minimax (#1273), Kimi (Moonshot) & Opencode, Avian, LiteLLM alias support (#930).
- **Advanced Model Features**: Anthropic extended thinking stream (#1076), Anthropic OAuth setup-token login (#926).
- **New Search Sources**: SearXNG, Exa AI, GLM Search Web (#1057).
- **Model Routing**: Language-agnostic model complexity scoring for smarter model dispatch in the Agent Loop.

#### Channels
- **WeCom (Enterprise WeChat)**: New WeCom AIBot integration with streaming task context, reasoning channel display, timeout and cleanup enhancements.
- **Discord**: Proxy support, channel reference parsing, message link expansion, quote/reply context understanding (#1047).
- **Telegram**: Custom Bot API Server (`base_url`) support (#1021), command scope optimization, long message chunking.
- **Feishu (Lark)**: Enhanced card (Markdown), media, @mention, editing; random reaction emoji (#1171).
- **New Channels**: Native Matrix and IRC channel support.

#### Core & Agent
- **Multimodal**: Media field in Message structure, `resolveMediaRefs` for end-to-end multimodal pipeline.
- **Memory & Context**: Reasoning content retention in multi-turn history; configurable summary threshold and token ratio (#1029).
- **System & Config**: `.env` environment variable loading and config override; `PICOCLAW_HOME` for custom config/workspace path; `/clear` command (#1266).
- **Interaction**: Agent fallback to reasoning content output (#992).

#### Tools & Skills
- **MCP Architecture**: Workspace-level env file loading, relative path resolution, full MCP registration and lifecycle management.
- **Tool Control**: Global enable/disable toggle for tools (#1071).
- **File Sending**: New `send_file` tool for outbound multimedia file sending (#1156).

### Bug Fixes

#### Stability & Concurrency
- Fixed MCP TOCTOU race conditions and resource leaks; deadlock during tool registration; aggregated errors on connection failure.
- JSONL migration crash consistency (fsync hardening, safe metadata writes); memory lock limits and scanner buffer increase to prevent OOM.
- WeCom app/bot dedupe data race (switched to ring queue); Discord cross-guild message link leaks; Matrix group mention regex.

#### Tools & Network
- Fixed `web_fetch` max payload limit issue; parallel execution request interrupt and response body leak (#940).
- Fixed ClawHub 429 retry; skill discovery registry flag (#929).
- Fixed exec tool shell command timeout config; command injection interception (kill -9 pattern filter).

#### Experience & Compatibility
- Telegram HTML parsing: degradation and multi-queue re-chunking for oversized content.
- OpenAI compatibility: improved non-JSON response (HTML error page) handling and streaming parsing.
- Fixed hot-reload self-kill protection false positive.

### Build, Deploy & Ops
- **Docker**: Base image switched from Debian to Alpine; Docker Compose v2 syntax migration; MCP-ready Docker image config.
- **Cross-compilation**: Added Linux/s390x and Linux/mipsle (#1265); macOS binary notarization via goreleaser (#1274).
- **CI/CD**: Nightly build workflow (#1226); govulncheck and dupl checks; auto-upload to Volcengine TOS (#1164).
- **Observability**: Cron job lifecycle logging (#1185).

---

## v0.2.0

*Released: 2026-02-28*

### New Features

- **Architecture Overhaul**:
  - **Protocol-based Providers**: Introduced a protocol-based provider creation mechanism, unifying integration logic for OpenAI, Anthropic, Gemini, Mistral, and other major protocols.
  - **Channel System Upgrade**: Rebuilt channel architecture with automated placeholder scheduling, typing indicators, and emoji reactions.
- **Ecosystem & Toolchain**:
  - **PicoClaw Launcher & WebUI**: New web interface for visual configuration management and gateway process scheduling.
  - **Skill Discovery**: ClawHub integration for online skill searching, caching, and installation.
- **New Providers**:
  - Cerebras, Mistral AI, Volcengine (Doubao), Perplexity, Qwen (Tongyi Qianwen), and Google Antigravity native support.
  - Reasoning model thought/reasoning content output with dedicated channel display.
- **New Channels**:
  - **Native WhatsApp**: High-performance native WhatsApp channel implementation.
  - **WeCom**: Enterprise WeChat and self-built WeCom application channels.

### Optimizations

- **Low-resource Adaptation**: Optimized binary size with comprehensive ARM build support (ARMv6, ARMv7, ARMv8.1).
- **Concurrency**: Refactored MessageBus to resolve deadlocks; message buffer increased from 16 to 64.
- **Search Enhancement**: Tavily search proxy support; new OpenAI-compatible WebSearch interface.
- **Robust Configuration**: `model_list` templates for zero-code model addition with duplicate model name validation.

### Bug Fixes & Security

- **Sandbox Security**: Fixed ExecTool working directory escape risk and TOCTOU race conditions; hardened system instruction injection defense.
- **Stability**:
  - Fixed memory leaks (particularly in WhatsApp channel).
  - Fixed Gemini API 400 errors and prompt cache invalidation issues.
- **Code Quality**: Enabled golangci-lint across the project; cleaned up redundant code and lint errors.

### Documentation

- **Multi-language**: Added Vietnamese and Portuguese (Brazil) README translations; improved Japanese translation.
- **Architecture Guides**: New detailed Chinese and English documentation on channel and protocol architecture.

---

## v0.1.2

*Released: 2026-02-17*

### New Features

- **LINE Channel**: Added LINE Official Account channel support.
- **OneBot Channel**: Added OneBot protocol channel support.
- **Health Check**: Added `/health` and `/ready` endpoints for container orchestration (#104).
- **DuckDuckGo Search**: Added DuckDuckGo search fallback with configurable search providers.
- **Device Hotplug**: USB device hotplug event notifications on Linux (#158).
- **Telegram Commands**: Structured command handling with dedicated command service and `telegohandler` integration (#164).
- **Local AI**: Added Ollama integration for local inference (#226).
- **Skill Validation**: Added validation for skill info and test cases (#231).

### Improvements

- **Security**: Blocked critical symlink workspace escape (#188); tightened file permissions and enforced Slack ACL checks (#186).
- **Docker**: Added curl to Docker image; improved Docker build workflow triggers.
- **32-bit Support**: Added build constraints for Feishu to support 32-bit architectures.
- **Loong64**: Added Linux/loong64 build support (#272).
- **GoReleaser**: Migrated to GoReleaser for release management (#180).

### Bug Fixes

- Fixed duplicate Telegram message sending (#105).
- Fixed code block index extraction bug (#130).
- Fixed OneBot connection handling.
- Prevented panic on MessageBus publish after close (#223).
- Removed duplicate file extension in DownloadFile (#230).
- Fixed OpenAI OAuth authorize URL and params (#151).

---

## v0.1.1

*Released: 2026-02-13*

### New Features

- **Dynamic Context Compression**: Intelligent conversation context compression (#3).
- **New Channels**: Feishu (#6), QQ (#5), DingTalk Stream Mode (#12), Slack Socket Mode (#34).
- **Agent Memory System**: Agent memory and tool execution improvements (#14).
- **Cron Tool**: Scheduled task support with direct shell command execution (#23, #74).
- **OAuth Login**: SDK-based subscription provider OAuth authentication (#32).
- **Migration Tool**: `picoclaw migrate` command for OpenClaw workspace migration (#33).
- **Telegram Upgrade**: Migrated to Telego library for better Telegram integration (#40).
- **CLI Provider**: CLI-based LLM provider for subprocess integration (#73, #80).
- **Provider Selection**: Explicit provider field support for model configuration (#48).
- **macOS Support**: Added Darwin ARM64 build target (#76).

### Improvements

- Consolidated media handling and improved resource cleanup (#49).
- Better version info with git commit hash (#45).
- Workspace directory boundary enforcement for system tools (#26).

### Bug Fixes

- Fixed heartbeat service startup bug (#64).
- Fixed LLM error from CONSCIOUSLY message history cleanup (#55).
- Fixed OpenAI device-code flow string interval (#56).
- Fixed Telegram channel permission check (#51).
- Fixed atomic safety for AgentLoop running state (#30).

---

## v0.0.1

*Released: 2026-02-09*

Initial release of PicoClaw. Please refer to the [README](https://github.com/sipeed/picoclaw) for basic usage instructions.

---
id: intro
title: 简介
sidebar_label: 简介
slug: /
---

# PicoClaw: 基于Go语言的超高效 AI 助手

🦐 **PicoClaw** 是一个受 [nanobot](https://github.com/HKUDS/nanobot) 启发的超轻量级个人 AI 助手。它采用 **Go 语言** 从零重构，经历了一个"自举"过程——即由 AI Agent 自身驱动了整个架构迁移和代码优化。

⚡️ **极致轻量**：可在 **10 美元** 的硬件上运行，内存占用不到 **10MB**。这意味着比 OpenClaw 节省 99% 的内存，比 Mac mini 便宜 98%！

> 注意：人手有限，中文文档可能略有滞后，请优先查看英文文档。

![PicoClaw 对比图](/img/compare.jpg)

## 主要特性

| 特性 | 描述 |
| --- | --- |
| 🪶 **超轻量级** | 内存占用不到 10MB — 比同类产品小 99% |
| 💰 **极低成本** | 可在 $10 硬件上运行 — 比 Mac mini 便宜 98% |
| ⚡️ **闪电启动** | 启动速度快 400 倍，即使在 0.6GHz 单核上也能 1 秒内启动 |
| 🌍 **真正可移植** | 跨 RISC-V、ARM64 和 x86_64 的单二进制文件 |
| 🤖 **AI 自举** | 95% 核心代码由 AI Agent 生成，经人机回环微调 |
| 💬 **多通道支持** | 支持 Telegram、Discord、Slack、钉钉、飞书、企业微信、LINE、QQ 等 |

## 对比

|  | OpenClaw | NanoBot | **PicoClaw** |
| --- | --- | --- | --- |
| **语言** | TypeScript | Python | **Go** |
| **RAM** | 超过 1GB | 超过 100MB | **不到 10MB** |
| **启动时间** (0.8GHz) | 超过 500s | 超过 30s | **不到 1s** |
| **成本** | Mac Mini $599 | ~$50 Linux 开发板 | **任意 Linux 开发板，低至 $10** |

## 架构图

![PicoClaw 架构](/img/arch.png)

## 安全声明

> **官方域名**：唯一官方网站是 **[picoclaw.io](https://picoclaw.io)**，公司官网是 **[sipeed.com](https://sipeed.com)**。
>
> **无加密货币 (NO CRYPTO)**：PicoClaw **没有** 发行任何官方代币。所有在 `pump.fun` 或其他交易平台上的相关声称均为**诈骗**。
>
> PicoClaw 正在初期快速功能开发阶段，在 v1.0 正式版发布前，请不要将其部署到生产环境中。

## 社区

- **Discord**: [discord.gg/V4sAZ9XWpN](https://discord.gg/V4sAZ9XWpN)
- **GitHub**: [github.com/sipeed/picoclaw](https://github.com/sipeed/picoclaw)
- **Twitter/X**: [@SipeedIO](https://x.com/SipeedIO)
- **Sipeed GitHub**: [github.com/sipeed](https://github.com/sipeed)
- **官网**: [picoclaw.io](https://picoclaw.io)

### 加入开发者群

向 PicoClaw 提交 PR 后，欢迎加入开发者微信群或 Discord 群。

加入方式：在微信群里加群主，告知你的 GitHub 账号和 PR 号，即可被邀请进入开发者微信群。

如需加入 Discord 群，请发送邮件至 `support@sipeed.com`，邮件主题为：

```
[Join PicoClaw Dev Group] 你的 GitHub 账号
```

我们会将 Discord 邀请链接发送至你的邮箱。

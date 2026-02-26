---
id: intro
title: Introduction
sidebar_label: Introduction
slug: /
---

# PicoClaw: Ultra-Efficient AI Assistant in Go

🦐 PicoClaw is an ultra-lightweight personal AI Assistant inspired by [nanobot](https://github.com/HKUDS/nanobot), refactored from the ground up in Go through a self-bootstrapping process, where the AI agent itself drove the entire architectural migration and code optimization.

⚡️ Runs on $10 hardware with less than 10MB RAM — that's 99% less memory than OpenClaw and 98% cheaper than a Mac mini!

![PicoClaw comparison chart](/img/compare.jpg)

## Key Features

| Feature | Description |
| --- | --- |
| 🪶 **Ultra-Lightweight** | Less than 10MB memory footprint — 99% smaller than comparable solutions |
| 💰 **Minimal Cost** | Runs on $10 hardware — 98% cheaper than a Mac mini |
| ⚡️ **Lightning Fast** | 400x faster startup — boots in under 1 second even on a 0.6GHz single core |
| 🌍 **True Portability** | Single self-contained binary for RISC-V, ARM64, and x86_64 |
| 🤖 **AI-Bootstrapped** | 95% agent-generated core with human-in-the-loop refinement |
| 💬 **Multi-Channel** | Telegram, Discord, Slack, DingTalk, Feishu, WeCom, LINE, QQ, and more |

## Comparison

|  | OpenClaw | NanoBot | **PicoClaw** |
| --- | --- | --- | --- |
| **Language** | TypeScript | Python | **Go** |
| **RAM** | >1GB | >100MB | **< 10MB** |
| **Startup** (0.8GHz core) | >500s | >30s | **< 1s** |
| **Cost** | Mac Mini $599 | ~$50 Linux SBC | **Any Linux Board, as low as $10** |

## Architecture

![PicoClaw architecture](/img/arch.png)

## Security Notice

> **OFFICIAL DOMAIN**: The only official website is **[picoclaw.io](https://picoclaw.io)**, and company website is **[sipeed.com](https://sipeed.com)**.
>
> **NO CRYPTO**: PicoClaw has **NO** official token/coin. All claims on trading platforms are **scams**.
>
> PicoClaw is in early development and may have unresolved security issues. Do not deploy to production environments before the v1.0 release.

## Community

- **Discord**: [discord.gg/V4sAZ9XWpN](https://discord.gg/V4sAZ9XWpN)
- **GitHub**: [github.com/sipeed/picoclaw](https://github.com/sipeed/picoclaw)
- **Twitter/X**: [@SipeedIO](https://x.com/SipeedIO)
- **Sipeed GitHub**: [github.com/sipeed](https://github.com/sipeed)
- **Website**: [picoclaw.io](https://picoclaw.io)

### Join the Developer Group

After submitting a PR to PicoClaw, you're welcome to join the developer WeChat group or Discord server.

To join, please send an email to `support@sipeed.com` with the subject line:

```
[Join PicoClaw Dev Group] Your GitHub account
```

We will send the Discord invite link to your inbox. For the WeChat group, scan the QR code on the homepage and ask the group owner, providing your GitHub account and PR number.

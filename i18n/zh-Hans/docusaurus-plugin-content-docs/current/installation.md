---
id: installation
title: 安装
---

# 安装

## 方式一：使用预编译二进制文件（推荐）

从 [Releases 页面](https://github.com/sipeed/picoclaw/releases/latest) 下载最新版本。所有版本打包为 `.tar.gz`（Linux/macOS/FreeBSD）或 `.zip`（Windows）。

| 平台 | 架构 | 下载 |
| --- | --- | --- |
| 🐧 Linux | x86_64 | [picoclaw_Linux_x86_64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_x86_64.tar.gz) |
| 🐧 Linux | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) |
| 🐧 Linux | ARMv6（32 位）| [picoclaw_Linux_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv6.tar.gz) |
| 🐧 Linux | ARMv7（32 位） | [picoclaw_Linux_armv7.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv7.tar.gz) |
| 🐧 Linux | RISC-V 64 | [picoclaw_Linux_riscv64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_riscv64.tar.gz) |
| 🐧 Linux | LoongArch64 | [picoclaw_Linux_loong64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_loong64.tar.gz) |
| 🍎 macOS | ARM64 (Apple Silicon) | [picoclaw_Darwin_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Darwin_arm64.tar.gz) |
| 🍎 macOS | x86_64 | [picoclaw_Darwin_x86_64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Darwin_x86_64.tar.gz) |
| 🪟 Windows | x86_64 | [picoclaw_Windows_x86_64.zip](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Windows_x86_64.zip) |
| 🪟 Windows | ARM64 | [picoclaw_Windows_arm64.zip](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Windows_arm64.zip) |
| 😈 FreeBSD | x86_64 | [picoclaw_Freebsd_x86_64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Freebsd_x86_64.tar.gz) |
| 😈 FreeBSD | ARM64 | [picoclaw_Freebsd_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Freebsd_arm64.tar.gz) |
| 😈 FreeBSD | ARMv6 | [picoclaw_Freebsd_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Freebsd_armv6.tar.gz) |

```bash
# Linux ARM64 示例
wget https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz
tar -xzf picoclaw_Linux_arm64.tar.gz
./picoclaw onboard
```

## 方式二：从源码构建

需要 Go 1.21+。

```bash
git clone https://github.com/sipeed/picoclaw.git
cd picoclaw

# 安装依赖
make deps

# 为当前平台构建
make build

# 为所有平台构建
make build-all

# 构建并安装到 PATH
make install
```

## 方式三：Docker Compose

无需本地安装，直接运行。

```bash
# 1. 克隆仓库
git clone https://github.com/sipeed/picoclaw.git
cd picoclaw

# 2. 首次运行 — 自动生成 docker/data/config.json 后退出
docker compose -f docker/docker-compose.yml --profile gateway up
# 容器打印 "First-run setup complete." 后停止

# 3. 设置 API Key
vim docker/data/config.json   # 设置提供商 API Key、机器人令牌等

# 4. 启动
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

:::tip Docker 网络配置
默认情况下，Gateway 监听 `127.0.0.1`。如需从外部访问，请在环境变量或 config.json 中设置 `PICOCLAW_GATEWAY_HOST=0.0.0.0`。
:::

```bash
# 5. 查看日志
docker compose -f docker/docker-compose.yml logs -f picoclaw-gateway

# 6. 停止
docker compose -f docker/docker-compose.yml --profile gateway down
```

### Docker: Agent 模式

```bash
# 提问
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent -m "2+2=?"

# 交互模式
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent
```

### Docker: 更新

```bash
docker compose -f docker/docker-compose.yml pull
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

## 低成本硬件部署

PicoClaw 可以运行在几乎任何 Linux 设备上：

| 设备 | 价格 | 用途 |
| --- | --- | --- |
| [荔枝派 RV-Nano](https://www.aliexpress.com/item/1005006519668532.html) E/W | ~$9.9 | 极简家庭助手 |
| [NanoKVM](https://www.aliexpress.com/item/1005007369816019.html) | $30-50 | 自动化服务器运维 |
| [MaixCAM](https://www.aliexpress.com/item/1005008053333693.html) | ~$50 | 智能监控 |
| [NanoKVM Pro](https://www.aliexpress.com/item/1005007369816019.html) | $80-120 | 全功能 KVM + AI 助手 |
| [MaixCAM2](https://www.kickstarter.com/projects/zepan/maixcam2-build-your-next-gen-4k-ai-camera?ref=b7lqud) | $80-120 | 次世代 4K AI 摄像机 |

### 树莓派兼容性

| 型号 | 架构 | 文件名 | 推荐系统 |
| --- | --- | --- | --- |
| Pi Zero / Zero W | ARMv6（32 位）| [picoclaw_Linux_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv6.tar.gz) | Raspberry Pi OS Lite（32 位）|
| Pi Zero 2 W | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite（64 位）|
| Pi 1（A/B/B+）| ARMv6（32 位）| [picoclaw_Linux_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv6.tar.gz) | Raspberry Pi OS Lite（32 位）|
| Pi 3 A+/B/B+ | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite（64 位）|
| Pi 4 B | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite（64 位）|
| Pi 5 | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite（64 位）|

<!-- > Pi 2 B 使用 ARMv7，暂不支持。 -->

## 下一步

- [快速开始](./getting-started.md) — 配置并运行第一次对话
- [配置说明](./configuration/index.md) — 完整配置参考
- [聊天通道](./channels/index.md) — 接入 Telegram、Discord 等

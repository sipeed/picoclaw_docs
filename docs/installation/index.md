---
id: index
title: Installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

## Option 1: Automated Installer (Recommended)

<Tabs>
	<TabItem value="pwsh" label="PowerShell (Cross-platform)" default>

PowerShell installer works on Windows and Unix-like platforms.

- On Linux/macOS/FreeBSD/NetBSD, install PowerShell Core (`pwsh`) first.
- Supports both user mode and system mode.
- Run the following commands in a PowerShell terminal only. Do not paste them into bash/ash/zsh.
- For users in Chinese Mainland, you may append `-Source cdn` to use the CDN source.
- `user` mode installation is **not recommended** on lightweight Linux distros (e.g. OpenWrt) due to potential PATH issues. The better option is to run the installer in `system` mode with root privileges.

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/sipeed/picoclaw_docs/main/static/scripts/picoclaw/install-picoclaw.ps1" -OutFile install-picoclaw.ps1

if (Get-Command pwsh -ErrorAction SilentlyContinue) {
    pwsh -ExecutionPolicy Bypass -File ./install-picoclaw.ps1 -InstallMode user
} elseif ($env:OS -eq "Windows_NT" -and (Get-Command powershell.exe -ErrorAction SilentlyContinue)) {
    powershell.exe -ExecutionPolicy Bypass -File .\install-picoclaw.ps1 -InstallMode user
} else {
    throw "PowerShell executable not found. Please install PowerShell Core (pwsh)."
}
```

```powershell
# System install (requires Administrator/root privileges)
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/sipeed/picoclaw_docs/main/static/scripts/picoclaw/install-picoclaw.ps1" -OutFile install-picoclaw.ps1

if (Get-Command pwsh -ErrorAction SilentlyContinue) {
    pwsh -ExecutionPolicy Bypass -File ./install-picoclaw.ps1 -InstallMode system
} elseif ($env:OS -eq "Windows_NT" -and (Get-Command powershell.exe -ErrorAction SilentlyContinue)) {
    powershell.exe -ExecutionPolicy Bypass -File .\install-picoclaw.ps1 -InstallMode system
} else {
    throw "PowerShell executable not found. Please install PowerShell Core (pwsh)."
}
```

	</TabItem>
	<TabItem value="bash" label="Bash (Unix-like)">

Bash installer supports Unix-like systems only.

- Not supported on Windows.
- Requires GNU Bash 4+.
- `ash` / BusyBox shell are not supported.
- `user` mode installation is **not recommended** on lightweight Linux distros (e.g. OpenWrt) due to potential PATH issues. The better option is to run the installer in `system` mode with root privileges.

```bash
curl -fsSL https://raw.githubusercontent.com/sipeed/picoclaw_docs/main/static/scripts/picoclaw/install-picoclaw.sh -o install-picoclaw.sh
chmod +x ./install-picoclaw.sh
# For users in Chinese Mainland, append: --source cdn
bash ./install-picoclaw.sh --mode user
```

```bash
# System install (requires root privileges)
curl -fsSL https://raw.githubusercontent.com/sipeed/picoclaw_docs/main/static/scripts/picoclaw/install-picoclaw.sh -o install-picoclaw.sh
chmod +x ./install-picoclaw.sh
# For users in Chinese Mainland, append: --source cdn
sudo bash ./install-picoclaw.sh --mode system
```

	</TabItem>
</Tabs>

## Option 2: Precompiled Binary

Download the latest release from the [Releases page](https://github.com/sipeed/picoclaw/releases/latest). All releases are packaged as `.tar.gz` (Linux/macOS/FreeBSD) or `.zip` (Windows).

| Platform | Architecture | Download |
| --- | --- | --- |
| 🐧 Linux | x86_64 | [picoclaw_Linux_x86_64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_x86_64.tar.gz) |
| 🐧 Linux | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) |
| 🐧 Linux | ARMv6 (32-bit) | [picoclaw_Linux_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv6.tar.gz) |
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
# Example for Linux ARM64
wget https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz
tar -xzf picoclaw_Linux_arm64.tar.gz
./picoclaw onboard
```

## Option 3: Build from Source

Requires Go 1.21+.

```bash
git clone https://github.com/sipeed/picoclaw.git
cd picoclaw

# Install dependencies
make deps

# Build for current platform
make build

# Build for all platforms
make build-all

# Build and install to PATH
make install
```

The binary is placed in `build/picoclaw-{platform}-{arch}`.

## Option 4: Docker Compose

Run PicoClaw without installing anything locally.

```bash
# 1. Clone this repo
git clone https://github.com/sipeed/picoclaw.git
cd picoclaw

# 2. First run — auto-generates docker/data/config.json then exits
docker compose -f docker/docker-compose.yml --profile gateway up
# The container prints "First-run setup complete." and stops.

# 3. Set your API keys
vim docker/data/config.json   # Set provider API keys, bot tokens, etc.

# 4. Start
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

:::tip Docker Network
By default, the Gateway listens on `127.0.0.1`. To expose it to the host, set `PICOCLAW_GATEWAY_HOST=0.0.0.0` in your environment or config.json.
:::

```bash
# 5. Check logs
docker compose -f docker/docker-compose.yml logs -f picoclaw-gateway

# 6. Stop
docker compose -f docker/docker-compose.yml --profile gateway down
```

### Docker: Agent Mode

```bash
# Ask a question
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent -m "What is 2+2?"

# Interactive mode
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent
```

### Docker: Update

```bash
docker compose -f docker/docker-compose.yml pull
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

## Innovative Low-Cost Hardware

PicoClaw runs on almost any Linux device:

| Device | Price | Use Case |
| --- | --- | --- |
| [LicheeRV-Nano](https://www.aliexpress.com/item/1005006519668532.html) E/W | ~$9.9 | Minimal home assistant |
| [NanoKVM](https://www.aliexpress.com/item/1005007369816019.html) | $30-50 | Automated server maintenance |
| [MaixCAM](https://www.aliexpress.com/item/1005008053333693.html) | ~$50 | Smart monitoring |
| [NanoKVM Pro](https://www.aliexpress.com/item/1005007369816019.html) | $80-120 | Full-featured KVM with AI assistant |
| [MaixCAM2](https://www.kickstarter.com/projects/zepan/maixcam2-build-your-next-gen-4k-ai-camera?ref=b7lqud) | $80-120 | Next-gen 4K AI camera |

### Raspberry Pi Compatibility

| Model | Architecture | File |  Recommended OS |
| --- | --- | --- | --- |
| Pi Zero / Zero W | ARMv6 (32-bit) | [picoclaw_Linux_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv6.tar.gz) | Raspberry Pi OS Lite (32-bit) |
| Pi Zero 2 W | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite (64-bit) |
| Pi 1 (A/B/B+) | ARMv6 (32-bit) | [picoclaw_Linux_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv6.tar.gz) | Raspberry Pi OS Lite (32-bit) |
| Pi 3 A+/B/B+ | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite (64-bit) |
| Pi 4 B | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite (64-bit) |
| Pi 5 | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite (64-bit) |

> Pi 2 B uses ARMv7 which is not currently supported.

## Next Steps

- [Getting Started](./getting-started) — configure and run your first chat
- [Configuration](./configuration) — full configuration reference
- [Chat Channels](./channels) — connect to Telegram, Discord, and more

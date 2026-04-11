---
id: hardware-compatibility
title: Hardware Compatibility
---

# Hardware Compatibility

PicoClaw is a single static binary with minimal resource requirements, designed to run on a wide range of hardware — from cloud servers to tiny embedded boards.

## Verified Chip Support

### x86

| Vendor | Chip | Architecture |
| --- | --- | --- |
| Intel | Core / Xeon / Atom | x86_64 |
| AMD | Ryzen / EPYC | x86_64 |

### ARM

| Architecture | Chip | Notes |
| --- | --- | --- |
| ARMv6 | BCM2835 | Raspberry Pi 1, Pi Zero |
| ARMv7 | V3s | Allwinner V3s |
| ARM64 | H618 | Allwinner H618 |
| ARM64 | BCM2711 | Raspberry Pi 4 |
| ARM64 | BCM2712 | Raspberry Pi 5 |
| ARM64 | AX630C | Maix series |

### RISC-V

| Chip | Vendor / Notes |
| --- | --- |
| SG2002 | Sophgo, LicheeRV-Nano |
| V861 | Allwinner |
| V881 | Allwinner |
| D213 | Allwinner |
| K1 | SpacemiT |
| K3 | SpacemiT |
| A210 | Sophgo |
| K230 | Canaan |

### MIPS

| Chip | Notes |
| --- | --- |
| MT7620 | MediaTek, OpenWrt routers |

### LoongArch

| Chip | Notes |
| --- | --- |
| 3A5000 | Loongson |
| 3A6000 | Loongson |
| 2K1000LA | Loongson |

## Verified Products

| Product | Chip | Architecture |
| --- | --- | --- |
| Nokia N900 | OMAP3430 | ARMv7 |
| LicheeRV-Nano | SG2002 | RISC-V 64 |
| NanoKVM | SG2002 | RISC-V 64 |
| NanoKVM Pro | SG2002 | RISC-V 64 |
| MaixCAM | SG2002 | RISC-V 64 |
| MaixCAM2 | AX630C | ARM64 |

## Verified Dev Boards

| Board | Chip | Architecture |
| --- | --- | --- |
| Raspberry Pi 1 (A/B/B+) | BCM2835 | ARMv6 |
| Raspberry Pi Zero / Zero W | BCM2835 | ARMv6 |
| Raspberry Pi Zero 2 W | BCM2710A1 | ARM64 |
| Raspberry Pi 3 (A+/B/B+) | BCM2837 | ARM64 |
| Raspberry Pi 4 B | BCM2711 | ARM64 |
| Raspberry Pi 5 | BCM2712 | ARM64 |
| LicheeRV-Nano | SG2002 | RISC-V 64 |
| Milk-V Duo | SG2002 | RISC-V 64 |
| BananaPi F3 | K1 | RISC-V 64 |
| SpacemiT K3 Board | K3 | RISC-V 64 |
| CanMV-K230 | K230 | RISC-V 64 |

## Also Works On

- **Android** — via [Termux](https://termux.dev) (use `proot` for DNS resolution)
- **Desktop / Server / Cloud** — Linux, macOS, Windows, FreeBSD
- **OpenWrt** — routers with MIPS or ARM chips
- **FreeBSD / NetBSD** — FreeBSD x86_64, ARM64, ARMv6 builds available

## Minimum Requirements

| Resource | Minimum |
| --- | --- |
| RAM | 10 MB |
| Storage | 20 MB |
| CPU | Any single core, 0.6 GHz+ |
| Kernel | Linux 3.x+ (or equivalent) |

PicoClaw itself is extremely lightweight. The actual bottleneck is network connectivity to reach the LLM API endpoint — even a 2G modem connection will work.

## How to Test

Run the following on your target device:

```bash
./picoclaw onboard
./picoclaw agent -m "Hello, what device am I running on?"
```

If the binary starts and connects to an API, your hardware is supported.

## Contributing Compatibility Reports

Tested PicoClaw on hardware not listed here? We welcome contributions:

1. Open an issue at [github.com/sipeed/picoclaw](https://github.com/sipeed/picoclaw/issues) with the chip, board/product name, architecture, and OS.
2. Or submit a PR to update this page directly.

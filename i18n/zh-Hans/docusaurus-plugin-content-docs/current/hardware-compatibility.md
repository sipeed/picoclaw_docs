---
id: hardware-compatibility
title: 硬件兼容性
---

# 硬件兼容性

PicoClaw 是一个静态编译的单文件可执行程序，资源占用极低，可运行在从云服务器到微型嵌入式开发板的各类硬件上。

## 已验证芯片支持

### x86

| 厂商 | 芯片 | 架构 |
| --- | --- | --- |
| Intel | Core / Xeon / Atom | x86_64 |
| AMD | Ryzen / EPYC | x86_64 |

### ARM

| 架构 | 芯片 | 备注 |
| --- | --- | --- |
| ARMv6 | BCM2835 | 树莓派 1、Pi Zero |
| ARMv7 | V3s | 全志 V3s |
| ARM64 | H618 | 全志 H618 |
| ARM64 | BCM2711 | 树莓派 4 |
| ARM64 | BCM2712 | 树莓派 5 |
| ARM64 | AX630C | Maix 系列 |

### RISC-V

| 芯片 | 厂商 / 备注 |
| --- | --- |
| SG2002 | 算能，LicheeRV-Nano |
| V861 | 全志 |
| V881 | 全志 |
| D213 | 全志 |
| K1 | 进迭时空 |
| K3 | 进迭时空 |
| A210 | 算能 |
| K230 | 嘉楠 |

### MIPS

| 芯片 | 备注 |
| --- | --- |
| MT7620 | 联发科，OpenWrt 路由器 |

### LoongArch

| 芯片 | 备注 |
| --- | --- |
| 3A5000 | 龙芯 |
| 3A6000 | 龙芯 |
| 2K1000LA | 龙芯 |

## 已验证产品

| 产品 | 芯片 | 架构 |
| --- | --- | --- |
| Nokia N900 | OMAP3430 | ARMv7 |
| LicheeRV-Nano | SG2002 | RISC-V 64 |
| NanoKVM | SG2002 | RISC-V 64 |
| NanoKVM Pro | SG2002 | RISC-V 64 |
| MaixCAM | SG2002 | RISC-V 64 |
| MaixCAM2 | AX630C | ARM64 |

## 已验证开发板

| 开发板 | 芯片 | 架构 |
| --- | --- | --- |
| 树莓派 1（A/B/B+） | BCM2835 | ARMv6 |
| 树莓派 Zero / Zero W | BCM2835 | ARMv6 |
| 树莓派 Zero 2 W | BCM2710A1 | ARM64 |
| 树莓派 3（A+/B/B+） | BCM2837 | ARM64 |
| 树莓派 4 B | BCM2711 | ARM64 |
| 树莓派 5 | BCM2712 | ARM64 |
| LicheeRV-Nano | SG2002 | RISC-V 64 |
| Milk-V Duo | SG2002 | RISC-V 64 |
| BananaPi F3 | K1 | RISC-V 64 |
| SpacemiT K3 Board | K3 | RISC-V 64 |
| CanMV-K230 | K230 | RISC-V 64 |

## 其他支持的平台

- **Android** — 通过 [Termux](https://termux.dev) 运行（使用 `proot` 解决 DNS 解析问题）
- **桌面 / 服务器 / 云** — Linux、macOS、Windows、FreeBSD
- **OpenWrt** — MIPS 或 ARM 芯片的路由器
- **FreeBSD / NetBSD** — 提供 FreeBSD x86_64、ARM64、ARMv6 构建

## 最低要求

| 资源 | 最低要求 |
| --- | --- |
| 内存 | 10 MB |
| 存储 | 20 MB |
| CPU | 任意单核，0.6 GHz+ |
| 内核 | Linux 3.x+（或同等版本） |

PicoClaw 本身极为轻量。实际瓶颈在于访问 LLM API 端点的网络连接 — 即使是 2G 网络也能正常工作。

## 如何测试

在目标设备上运行以下命令：

```bash
./picoclaw onboard
./picoclaw agent -m "你好，我在哪个设备上运行？"
```

如果程序能正常启动并连接 API，则说明你的硬件受支持。

## 贡献兼容性报告

在未列出的硬件上测试过 PicoClaw？欢迎贡献：

1. 在 [github.com/sipeed/picoclaw](https://github.com/sipeed/picoclaw/issues) 提交 Issue，注明芯片、板卡/产品名称、架构和操作系统。
2. 或直接提交 PR 更新本页面。

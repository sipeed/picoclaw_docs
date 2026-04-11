---
id: licheervnano
title: 在 LicheeRV Nano 上部署
---

# 在 LicheeRV Nano 上部署

本文档将指导您在 Sipeed LicheeRV Nano 开发板上部署 PicoClaw。

LicheeRV Nano 是一款超微型开发板（尺寸仅为 22.86 × 35.56 mm），搭载算能 SG2002 处理器（包含 1 GHz 可选 RISC-V/ARM 大核与 700 MHz RISC-V 小核），并内置 256MB DDR3 内存与 1 TOPS 算力的 NPU。此外，它板载了 MIPI-CSI、MIPI-DSI、SDIO、ETH、USB、SPI、UART 及 I2C 等丰富接口，能够满足多样化的应用扩展需求。其直插与半孔兼容设计，也非常便于后期的量产贴片。

LicheeRV Nano 的更多详细信息，请参考 [Sipeed 官方文档](https://wiki.sipeed.com/hardware/zh/lichee/RV_Nano/1_intro.html)。

## 前提条件

- **系统与网络**：LicheeRV Nano 已成功烧录系统并接入网络。推荐使用 Sipeed 官方编译的 [系统镜像](https://github.com/sipeed/LicheeRV-Nano-Build/releases/latest)，您可以使用 Win32DiskImager 或 balenaEtcher 等工具将镜像写入 SD 卡中。

- **SSH 访问**：确保您能够通过 SSH 远程访问该设备。

## 通过 SSH 部署

请确保您的操作设备与 LicheeRV Nano 处于同一局域网内，并通过 SSH 连接到开发板。您可以根据个人习惯选择以下任意一种方式进行安装：

### 方式一：一键安装脚本（推荐）

您可以使用 `curl` 命令一键下载并执行 [`install_picoclaw.py`](/scripts/maixcam/install_picoclaw.py) 安装脚本，免去手动分步操作的繁琐：

```bash
curl -o install_picoclaw.py https://raw.githubusercontent.com/sipeed/picoclaw_docs/main/static/scripts/maixcam/install_picoclaw.py && python3 install_picoclaw.py
```

### 方式二：手动下载与配置

如果您更倾向于手动执行安装步骤，请依次在终端中运行以下命令：

```bash
curl -L# -o picoclaw_Linux_riscv64.tar.gz \
https://picoclaw-downloads.tos-cn-beijing.volces.com/latest/picoclaw_Linux_riscv64.tar.gz

mkdir -p /root/picoclaw
gzip -dc picoclaw_Linux_riscv64.tar.gz | tar -xvf - -C /root/picoclaw

cp /root/picoclaw/picoclaw* /usr/bin

rm -rf /root/picoclaw /root/picoclaw_Linux_riscv64.tar.gz
```

## 启动 TUI

安装完成后，您可以直接运行以下命令，使用 PicoClaw 的 TUI（终端用户界面）进行配置和管理：

```bash
picoclaw-launcher-tui
```

## 启动 Web UI

如果您希望使用更直观的图形化界面进行操作，请在终端中运行以下命令以启动 Web 服务：

```bash
picoclaw-launcher -no-browser -public
```

服务启动后，打开同一局域网内设备的浏览器，访问以下地址即可进入 PicoClaw 的 Web UI：

```text
http://<设备IP>:18800
```

> **提示**：请将 `<设备IP>` 替换为您 LicheeRV Nano 实际分配到的局域网 IP 地址。

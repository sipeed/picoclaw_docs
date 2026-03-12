---
id: maixcam
title: 在 MaixCam / MaixCam2 上部署
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 在 MaixCam / MaixCam2 上部署

本文档将指导您如何将 Sipeed 的 MaixCAM 或 MaixCAM2 AI 摄像头与 PicoClaw 进行集成。

MaixCAM 和 MaixCAM2 是为更好地落地 AI 视觉、听觉和 AIOT 应用而设计的一款硬件产品，一个能快速验证产品原型且能快速量产的平台。提供了强大且高性价比的处理器，配套的摄像头、屏幕、WiFi 等，以及完善和非常易用的软件生态。您可以通过在 MaixCam 和 MaixCAM2 上部署 PicoClaw，实现智能监控、边缘推理等功能。

## 硬件准备

- MaixCAM
- MaixCAM-Pro
- MaixCAM2

## 前提条件

- 已经为 MaixCam 或 MaixCAM2 烧录好固件，可以正常启动并连接到网络。

- 可以正常连接 MaixVision 应用或通过 SSH 访问设备。

## 部署方法

### 配置网络

1. 配置网络：如果设备尚未联网，请先按照 MaixPy 的网络设置进行配置。

- [MaixPy 网络设置](https://wiki.sipeed.com/maixpy/doc/zh/network/network_settings.html)

2. 获取设备 IP：您可以进入设置->设备信息->IP地址，查看设备的 IP 地址，或者在同一个局域网内从 MaixVision 设备列表获取。

### 通过 SSH 连接设备，并部署 PicoClaw

1. 确保当前设备与 MaixCam 或 MaixCam2 在同一局域网内。
2. 使用 SSH 客户端连接到设备的 IP 地址，默认用户名和密码为 `root` / `root`。
3. 在 SSH 连接中，使用以下命令下载并运行 PicoClaw：

<Tabs>
	<TabItem value="maixcam" label="MaixCam / MaixCAM-Pro" default>

```bash
curl -L# -o picoclaw_Linux_riscv64.tar.gz \
https://picoclaw-downloads.tos-cn-beijing.volces.com/latest/picoclaw_Linux_riscv64.tar.gz

mkdir -p /root/picoclaw
gzip -dc picoclaw_Linux_riscv64.tar.gz | tar -xvf - -C /root/picoclaw
cp /root/picoclaw/picoclaw* /usr/bin
rm -rf /root/picoclaw /root/picoclaw_Linux_riscv64.tar.gz

picoclaw-launcher-tui
```

	</TabItem>
	<TabItem value="maixcam2" label="MaixCam2">

```bash
curl -L# -o picoclaw_aarch64.deb \
https://picoclaw-downloads.tos-cn-beijing.volces.com/latest/picoclaw_aarch64.deb

dpkg -i picoclaw_aarch64.deb
rm -rf picoclaw_aarch64.deb

picoclaw-launcher-tui
```

	</TabItem>
</Tabs>
接下来，您就可以使用 PicoClaw 的 TUI 在终端界面中进行配置和管理。

4. 如果要启动 PicoClaw 的 Web UI，可以使用以下命令：

```bash
picoclaw-launcher -no-browser -public
```

然后在同一个局域网的浏览器中访问 `http://<设备IP>:18800` 即可进入 PicoClaw 的 Web UI。

### 通过 MaixVision 应用连接设备，并部署 PicoClaw

1. 使用 MaixVision 连接上 MaixCam 或 MaixCam2 设备。
2. 在 MaixVision 中创建一个新的 Python 文件，并写入以下脚本内容：

   脚本地址：[`install_picoclaw.py`](/scripts/maixcam/install_picoclaw.py)

3. 点击运行，PicoClaw 将会被下载并安装到设备上，并启动 PicoClaw 的 Web UI 界面。
4. 在同一个局域网的浏览器中访问 `http://<设备IP>:18800` 即可进入 PicoClaw 的 Web UI。

## 参考与更多资料

想获得更多 MaixCam 硬件资料和使用方法，请访问：

- [MaixCam 硬件文档](https://wiki.sipeed.com/hardware/zh/maixcam)
- [MaixPy 文档](https://wiki.sipeed.com/maixpy)

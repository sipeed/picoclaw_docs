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

## 使用示例

以下是一个简单的实战示例，展示如何在 MaixCAM 上结合 PicoClaw 进行 AI 视觉开发：

1. **基础配置**：首先在 Web UI 或 TUI 中配置好模型和聊天通道。以下以 `Discord` 和 `glm-4.7` 模型为例：
   - 聊天通道配置：参考 [Discord 配置说明](../channels/discord.md#4-配置)。
   - 模型配置：参考 [模型配置说明](../configuration/model-list.md)。

2. **生成抓图脚本**：在 Discord 中与 PicoClaw 对话，要求其编写并执行 MaixPy 的抓图脚本：

   > 请参考 https://wiki.sipeed.com/maixpy/doc/zh/vision/camera.html
   > 帮我写一个 MaixPy 脚本，抓取一张图片并保存到 /root/capture.jpg

   ![capture](/img/maixcam/capture.jpeg)

3. **生成视觉分析技能**：让 PicoClaw 自动生成一个用于分析刚才所抓取图片的专属技能：

   > 你可以写一个 skill，用于通过大模型分析刚才获取到的那张图像吗？

   ![image_analysis_skill](/img/maixcam/image_analysis_skill.jpeg)

4. **执行图片分析**：调用刚刚创建的技能，对图片内容进行深度解析：

   > 使用刚才创建的技能分析这一张图片，你可以使用 glm-4.6v 模型，API_KEY 可以从 .picoclaw/config.json 中获取。

   ![image_analysis_result](/img/maixcam/image_analysis_result.jpeg)

### 常见问题

- 受限于当前大模型的能力，它不一定能在单次对话中完美完成所有请求。如果遇到执行报错或偏差，您可能需要通过多轮对话引导其修正。
- 以上仅为一个基础的图文联动示例。PicoClaw 的潜力远不止于此，您可以根据实际业务需求，配置不同的模型和复杂的自动化工作流。

## 参考与更多资料

想获得更多 MaixCam 硬件资料和使用方法，请访问：

- [MaixCam 硬件文档](https://wiki.sipeed.com/hardware/zh/maixcam)
- [MaixPy 文档](https://wiki.sipeed.com/maixpy)

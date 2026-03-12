---
id: maixcam
title: Deploy on MaixCam / MaixCam2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Deploy on MaixCam / MaixCam2

This document walks you through integrating Sipeed MaixCAM or MaixCAM2 AI cameras with PicoClaw.

MaixCAM and MaixCAM2 are hardware platforms designed for real-world AI vision, audio, and AIoT applications. They provide cost-effective, high-performance processors, along with cameras, displays, Wi-Fi, and an easy-to-use software ecosystem. By deploying PicoClaw on MaixCam or MaixCAM2, you can enable scenarios such as smart monitoring and edge inference.

## Hardware

- MaixCAM
- MaixCAM-Pro
- MaixCAM2

## Prerequisites

- The firmware has been flashed to your MaixCam or MaixCAM2 device, and the device can boot and connect to the network.

- You can access the device through MaixVision or SSH.

## Deployment

### Configure Network

1. Configure networking: if your device is not connected yet, follow MaixPy network setup first.

- [MaixPy Network Settings](https://wiki.sipeed.com/maixpy/doc/en/network/network_settings.html)

2. Get the device IP: go to Settings -> Device Info -> IP Address, or find it from the MaixVision device list on the same LAN.

### Connect via SSH and Deploy PicoClaw

1. Make sure your computer and MaixCam/MaixCam2 are on the same LAN.
2. Use an SSH client to connect to the device IP. The default username/password is `root` / `root`.
3. In the SSH session, run the commands below to download and start PicoClaw:

<Tabs>
	<TabItem value="maixcam" label="MaixCam / MaixCAM-Pro" default>

```bash
curl -L# -o picoclaw_Linux_riscv64.tar.gz \
https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_riscv64.tar.gz

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
https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_aarch64.deb

dpkg -i picoclaw_aarch64.deb
rm -rf picoclaw_aarch64.deb

picoclaw-launcher-tui
```

	</TabItem>
</Tabs>
You can now use PicoClaw TUI in the terminal for configuration and management.

4. To start PicoClaw Web UI, run:

```bash
picoclaw-launcher -no-browser -public
```

Then open `http://<device-ip>:18800` in a browser on the same LAN.

### Connect via MaixVision and Deploy PicoClaw

1. Connect to your MaixCam or MaixCam2 device in MaixVision.
2. In MaixVision, create a new Python file and paste the script content below:

	Script: [`install_picoclaw.py`](/scripts/maixcam/install_picoclaw.py)

3. Click **Run**. PicoClaw will be downloaded and installed on the device, and the PicoClaw Web UI will start.
4. Open `http://<device-ip>:18800` in a browser on the same LAN to access the PicoClaw Web UI.

## References

For more MaixCam hardware information and usage guides, see:

- [MaixCam Hardware Documentation](https://wiki.sipeed.com/hardware/en/maixcam)
- [MaixPy Documentation](https://wiki.sipeed.com/maixpy/en)

---
id: android
title: Install on Android
---

# Install on Android

PicoClaw provides an Android installation package, allowing you to install PicoClaw on Android devices.
This guide will walk you through installing PicoClaw on Android.

## Installation

### Download the Installation Package

1. Visit [PicoClaw Official Website](https://picoclaw.io/download/android/) to download the Android installation package

![Download](/img/installation/android0.png)

2. Download the APK package and complete installation

![Install](/img/installation/android1.png)

## Launch PicoClaw

After installation, tap the PicoClaw icon to open the app, then tap the "Start Service" button to start the service.
![Launch](/img/installation/android2.png)

Once the service is running, you can access PicoClaw's Web UI from the configuration page.
Alternatively, open your browser and visit the following address to access PicoClaw's Web UI:

```text
http://127.0.0.1:18800
```
![WebUI](/img/installation/android3.png)

- If you need to access PicoClaw's Web UI externally, enable Public Mode in the settings.
![Settings](/img/installation/android4.png)

## Run on Android Termux (Optional)

If you prefer Termux, you can still run PicoClaw this way:

```bash
wget https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz
tar xzf picoclaw_Linux_arm64.tar.gz
pkg install proot
termux-chroot ./picoclaw onboard
```

![PicoClaw running in Termux](https://github.com/sipeed/picoclaw/raw/main/assets/termux.jpg)

## Known Issues

- On some Android devices, an outdated system WebView may cause the configuration page to render incorrectly or behave abnormally.
- Some devices using HiSilicon chipsets may have compatibility issues.

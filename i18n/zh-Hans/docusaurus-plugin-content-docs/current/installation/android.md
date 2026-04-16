---
id: android
title: 在 android 上安装
---

# 在 android 上安装

PicoClaw提供了安卓版本的安装包，您可以在 android 系统上安装 PicoClaw。
本文档将指导您在 android 系统上安装 PicoClaw。

## 安装方式

### 下载对应的安装包

1. 访问 [PicoClaw官网](https://picoclaw.io/download/android/) 下载适用于 android 的安装包

![下载](/img/installation/android0.png)

2. 下载 apk 安装包并完成安装

![解压](/img/installation/android1.png)


## 启动 PicoClaw

安装完成后，点击 PicoClaw 图标打开应用，点击“启动服务”按钮启动服务。
![启动](/img/installation/android2.png)

服务启动后，可以通过配置页访问 PicoClaw 的 Web UI。
也可以在浏览器中打开以下地址进入 PicoClaw 的 Web UI：

```text
http://127.0.0.1:18800
```

![webui](/img/installation/android3.png)

- 如果需要在外部访问 PicoClaw 的 Web UI，需要在设置中打开公共模式。
![safariset](/img/installation/android4.png)

## 在 Android Termux 上运行 (可选)

如果你更希望通过 Termux 运行，也可以使用以下方式：

```bash
wget https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz
tar xzf picoclaw_Linux_arm64.tar.gz
pkg install proot
termux-chroot ./picoclaw onboard
```

![PicoClaw 在 Termux 中运行](https://github.com/sipeed/picoclaw/raw/main/assets/termux.jpg)

## 已知问题

- 在部分 Android 设备上，系统 WebView 版本过旧可能导致配置页显示异常或交互异常。
- 部分海思芯片设备可能存在兼容性异常。

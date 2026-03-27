---
id: macos
title: 在 MacOS 上部署
---

# 在 MacOS 上部署

本文档将指导您在 MacOS 系统上部署 PicoClaw。

## 安装方式


### 下载对应的压缩包

1. 访问 [PicoClaw官网](https://picoclaw.io/) 下载适用于 MacOS 的压缩包
<!-- 
![下载](/img/installation/macdownload.png) -->

## 启动 TUI

安装完成后，您可以通过终端运行以下命令，使用 PicoClaw 的 TUI（终端用户界面）进行配置和管理：

```bash
picoclaw-launcher-tui
```

## 启动 Web UI

如果您希望使用更直观的图形化界面进行操作，请在终端中运行以下命令以启动 Web 服务：

```bash
picoclaw-launcher -no-browser -public
```

服务启动后，打开浏览器，访问以下地址即可进入 PicoClaw 的 Web UI：

```text
http://localhost:18800
```

## 配置与使用

### 基本配置

首次启动 PicoClaw 后，您可以通过 Web UI 或 TUI 进行以下配置：

1. **模型管理**：添加、删除和管理 AI 模型
2. **设备配置**：设置摄像头和其他硬件设备
3. **网络设置**：配置网络连接和端口

### 常见问题

- **无法启动 PicoClaw**：请检查是否具有管理员权限，以及系统版本是否满足要求
- **Web UI 无法访问**：请检查端口 18800 是否已被占用，或尝试使用其他端口
- **模型加载失败**：请确保下载的模型格式正确，并且与您的硬件兼容

## 卸载

如果您需要卸载 PicoClaw，可以使用以下方法：

### 通过 Homebrew 卸载

```bash
brew uninstall picoclaw
brew untap sipeed/picoclaw
```

### 手动卸载

1. 从 Applications 文件夹中删除 PicoClaw 应用程序
2. 删除相关配置文件：

```bash
rm -rf ~/.picoclaw
```
---
id: macos
title: 在 macOS 上部署
---

# 在 macOS 上部署

本文档将指导您在 macOS 系统上部署 PicoClaw。

## 安装方式


### 下载对应的压缩包

1. 访问 [PicoClaw官网](https://picoclaw.io/) 下载适用于 macOS 的压缩包

![下载](/img/installation/macdownload.png)

2. 解压下载的压缩包

![解压](/img/installation/macbin.png)



## 启动 PicoClaw

解压后，通过双击 picoclaw-launcher 启动 PicoClaw
服务启动后，会自动打开浏览器；如果浏览器没有打开，访问以下地址即可进入 PicoClaw 的 Web UI：

```text
http://localhost:18800
```
![webui](/img/installation/macwebui.png)

- 注意，Safari可能会拦截http链接，可以通过取消勾选 Safari 偏好设置->安全性->不安全的站点链接：通过 HTTP 连接网站前接受警告。
![safariset](/img/installation/safariset.png)



## macOS — 首次启动安全警告

macOS 可能会在首次启动时拦截 `picoclaw-launcher`，因为它从互联网下载，未经 Mac App Store 公证。 

**第一步：** 双击 `picoclaw-launcher`，会出现安全警告：

![macsafe](/img/installation/macos.jpg)

> *"picoclaw-launcher" 无法打开 — Apple 无法验证 "picoclaw-launcher" 不含可能损害 Mac 或危及隐私的恶意软件。*

**第二步：** 打开**系统设置** → **隐私与安全性** → 向下滚动找到**安全性**部分 → 点击**仍要打开** → 在弹窗中再次点击**打开**。

![macsafe](/img/installation/macos1.jpg)

完成这一次操作后，后续启动 `picoclaw-launcher` 将不再弹出警告。



---
id: maixcam
title: MaixCam
---

# MaixCam

MaixCam 是专用于连接矽速科技 MaixCAM 与 MaixCAM2 AI 摄像设备的通道。它采用 TCP 套接字实现双向通信，支持边缘 AI 部署场景。

## 硬件

- [MaixCAM](https://www.aliexpress.com/item/1005008053333693.html) — 约 ¥350，带显示屏的 AI 摄像头
- [MaixCAM2](https://www.kickstarter.com/projects/zepan/maixcam2-build-your-next-gen-4k-ai-camera) — 4K AI 摄像头

## 配置

```json
{
  "channels": {
    "maixcam": {
      "enabled": true,
      "host": "0.0.0.0",
      "port": 18790,
      "allow_from": [],
      "reasoning_channel_id": ""
    }
  }
}
```

## 字段参考

| 字段 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| `host` | string | 否 | `0.0.0.0` | TCP 服务器监听地址 |
| `port` | int | 否 | 18790 | TCP 服务器监听端口 |
| `allow_from` | array | 否 | [] | 设备 ID 白名单（空数组 = 允许所有设备） |
| `reasoning_channel_id` | string | 否 | — | 将推理过程输出到单独的频道 |

## 运行

```bash
picoclaw gateway
```

## TCP 协议

MaixCam 通过 TCP 使用基于 JSON 的协议通信：

### 消息类型

| 类型 | 方向 | 描述 |
| --- | --- | --- |
| `person_detected` | 设备 → PicoClaw | 人员检测事件，附带图像数据 |
| `heartbeat` | 设备 → PicoClaw | 心跳保活信号 |
| `status` | 设备 → PicoClaw | 设备状态更新 |

### 设备配置

在 MaixCAM 设备上，将 TCP 连接指向 PicoClaw 服务器：

- **服务器地址**：运行 PicoClaw 的机器 IP 地址
- **端口**：配置中 `port` 的值（默认：18790）

## 使用场景

MaixCam 通道使 PicoClaw 能够作为边缘设备的 AI 后端运行：

- **智能监控** — MaixCAM 发送图像帧，PicoClaw 通过视觉模型进行分析
- **物联网控制** — 设备发送传感器数据，PicoClaw 协调响应
- **离线 AI** — 在本地网络部署 PicoClaw 实现低延迟推理

---
id: maixcam
title: MaixCam
---

# MaixCam

MaixCam is a channel for connecting Sipeed's MaixCAM and MaixCAM2 AI camera devices. It uses TCP sockets for bidirectional communication, supporting edge AI deployment scenarios.

## Hardware

- [MaixCAM](https://www.aliexpress.com/item/1005008053333693.html) — ~$50, AI camera with display
- [MaixCAM2](https://www.kickstarter.com/projects/zepan/maixcam2-build-your-next-gen-4k-ai-camera) — 4K AI camera

## Configuration

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

## Field Reference

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `host` | string | No | `0.0.0.0` | TCP server listen address |
| `port` | int | No | 18790 | TCP server listen port |
| `allow_from` | array | No | [] | Device ID whitelist (empty = allow all) |
| `reasoning_channel_id` | string | No | — | Route reasoning output to a separate channel |

## Run

```bash
picoclaw gateway
```

## TCP Protocol

MaixCam communicates using a JSON-based protocol over TCP:

### Message Types

| Type | Direction | Description |
| --- | --- | --- |
| `person_detected` | Device → PicoClaw | Person detection event with image data |
| `heartbeat` | Device → PicoClaw | Keep-alive signal |
| `status` | Device → PicoClaw | Device status update |

### Device Configuration

On the MaixCAM device, configure the TCP connection to point to your PicoClaw server:

- **Server address**: The IP address of the machine running PicoClaw
- **Port**: The port configured in `port` (default: 18790)

## Use Cases

The MaixCam channel enables PicoClaw to run as an AI backend for edge devices:

- **Smart Surveillance** — MaixCAM sends image frames, PicoClaw analyzes them via vision models
- **IoT Control** — Devices send sensor data, PicoClaw coordinates responses
- **Offline AI** — Deploy PicoClaw on a local network for low-latency inference

---
id: maixcam
title: MaixCam
---

# MaixCam

O MaixCam é uma câmera de IA integrada ao hardware da Sipeed. O PicoClaw oferece suporte nativo para execução no hardware MaixCam.

## Hardware

- [MaixCAM](https://www.aliexpress.com/item/1005008053333693.html) — ~$50, câmera de IA com display
- [MaixCAM2](https://www.kickstarter.com/projects/zepan/maixcam2-build-your-next-gen-4k-ai-camera) — câmera de IA 4K

## Configuração

```json
{
  "channels": {
    "maixcam": {
      "enabled": true,
      "host": "0.0.0.0",
      "port": 18790,
      "allow_from": []
    }
  }
}
```

## Executar

```bash
picoclaw gateway
```

:::note
A documentação completa do MaixCam está disponível em chinês no repositório em `docs/channels/maixcam/README.zh.md`.
:::

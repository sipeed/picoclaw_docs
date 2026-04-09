---
id: installation
title: Instalação
---

# Instalação

## Opção 1: Binário Pré-compilado (Recomendado)

Baixe a versão mais recente na [página de Releases](https://github.com/sipeed/picoclaw/releases/latest). Todas as versões são empacotadas como `.tar.gz` (Linux/macOS/FreeBSD) ou `.zip` (Windows).

| Plataforma | Arquitetura | Download |
| --- | --- | --- |
| 🐧 Linux | x86_64 | [picoclaw_Linux_x86_64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_x86_64.tar.gz) |
| 🐧 Linux | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) |
| 🐧 Linux | ARMv6 (32-bit) | [picoclaw_Linux_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv6.tar.gz) |
| 🐧 Linux | RISC-V 64 | [picoclaw_Linux_riscv64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_riscv64.tar.gz) |
| 🐧 Linux | LoongArch64 | [picoclaw_Linux_loong64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_loong64.tar.gz) |
| 🍎 macOS | ARM64 (Apple Silicon) | [picoclaw_Darwin_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Darwin_arm64.tar.gz) |
| 🍎 macOS | x86_64 | [picoclaw_Darwin_x86_64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Darwin_x86_64.tar.gz) |
| 🪟 Windows | x86_64 | [picoclaw_Windows_x86_64.zip](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Windows_x86_64.zip) |
| 🪟 Windows | ARM64 | [picoclaw_Windows_arm64.zip](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Windows_arm64.zip) |
| 😈 FreeBSD | x86_64 | [picoclaw_Freebsd_x86_64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Freebsd_x86_64.tar.gz) |
| 😈 FreeBSD | ARM64 | [picoclaw_Freebsd_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Freebsd_arm64.tar.gz) |
| 😈 FreeBSD | ARMv6 | [picoclaw_Freebsd_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Freebsd_armv6.tar.gz) |

```bash
# Example for Linux ARM64
wget https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz
tar -xzf picoclaw_Linux_arm64.tar.gz
./picoclaw onboard
```

## Opção 2: Compilar a partir do Código-Fonte

Requer Go 1.21+.

```bash
git clone https://github.com/sipeed/picoclaw.git
cd picoclaw

# Install dependencies
make deps

# Build for current platform
make build

# Build for all platforms
make build-all

# Build and install to PATH
make install
```

O binário é colocado em `build/picoclaw-{platform}-{arch}`.

## Opção 3: Docker Compose

Execute o PicoClaw sem instalar nada localmente.

```bash
# 1. Clone this repo
git clone https://github.com/sipeed/picoclaw.git
cd picoclaw

# 2. First run — auto-generates docker/data/config.json then exits
docker compose -f docker/docker-compose.yml --profile gateway up
# The container prints "First-run setup complete." and stops.

# 3. Set your API keys
vim docker/data/config.json   # Set provider API keys, bot tokens, etc.

# 4. Start
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

:::tip Rede Docker
Por padrão, o Gateway escuta em `127.0.0.1`. Para expô-lo ao host, defina `PICOCLAW_GATEWAY_HOST=0.0.0.0` no seu ambiente ou config.json.
:::

```bash
# 5. Check logs
docker compose -f docker/docker-compose.yml logs -f picoclaw-gateway

# 6. Stop
docker compose -f docker/docker-compose.yml --profile gateway down
```

### Docker: Modo Agent

```bash
# Ask a question
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent -m "What is 2+2?"

# Interactive mode
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent
```

### Docker: Atualização

```bash
docker compose -f docker/docker-compose.yml pull
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

## Hardware Inovador de Baixo Custo

O PicoClaw roda em praticamente qualquer dispositivo Linux:

| Dispositivo | Preço | Caso de Uso |
| --- | --- | --- |
| [LicheeRV-Nano](https://www.aliexpress.com/item/1005006519668532.html) E/W | ~$9.9 | Assistente doméstico mínimo |
| [NanoKVM](https://www.aliexpress.com/item/1005007369816019.html) | $30-50 | Manutenção automatizada de servidores |
| [MaixCAM](https://www.aliexpress.com/item/1005008053333693.html) | ~$50 | Monitoramento inteligente |
| [NanoKVM Pro](https://www.aliexpress.com/item/1005007369816019.html) | $80-120 | KVM completo com assistente de IA |
| [MaixCAM2](https://www.kickstarter.com/projects/zepan/maixcam2-build-your-next-gen-4k-ai-camera?ref=b7lqud) | $80-120 | Câmera de IA 4K de próxima geração |

### Compatibilidade com Raspberry Pi

| Modelo | Arquitetura | Arquivo | SO Recomendado |
| --- | --- | --- | --- |
| Pi Zero / Zero W | ARMv6 (32-bit) | [picoclaw_Linux_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv6.tar.gz) | Raspberry Pi OS Lite (32-bit) |
| Pi Zero 2 W | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite (64-bit) |
| Pi 1 (A/B/B+) | ARMv6 (32-bit) | [picoclaw_Linux_armv6.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_armv6.tar.gz) | Raspberry Pi OS Lite (32-bit) |
| Pi 3 A+/B/B+ | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite (64-bit) |
| Pi 4 B | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite (64-bit) |
| Pi 5 | ARM64 | [picoclaw_Linux_arm64.tar.gz](https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz) | Raspberry Pi OS Lite (64-bit) |

> O Pi 2 B usa ARMv7, que não é suportado atualmente.

## Próximos Passos

- [Primeiros Passos](./getting-started.md) — configure e execute seu primeiro chat
- [Configuração](./configuration/index.md) — referência completa de configuração
- [Canais de Chat](./channels/index.md) — conecte ao Telegram, Discord e mais

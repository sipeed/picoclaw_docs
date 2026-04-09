---
id: hardware-compatibility
title: Compatibilidade de Hardware
---

# Compatibilidade de Hardware

O PicoClaw é um único binário estático com requisitos mínimos de recursos, projetado para rodar em uma ampla variedade de hardwares — de servidores na nuvem a pequenas placas embarcadas.

## Suporte Verificado a Chips

### x86

| Fabricante | Chip | Arquitetura |
| --- | --- | --- |
| Intel | Core / Xeon / Atom | x86_64 |
| AMD | Ryzen / EPYC | x86_64 |

### ARM

| Arquitetura | Chip | Observações |
| --- | --- | --- |
| ARMv6 | BCM2835 | Raspberry Pi 1, Pi Zero |
| ARMv7 | V3s | Allwinner V3s |
| ARM64 | H618 | Allwinner H618 |
| ARM64 | BCM2711 | Raspberry Pi 4 |
| ARM64 | BCM2712 | Raspberry Pi 5 |
| ARM64 | AX630C | Série Maix |

### RISC-V

| Chip | Fabricante / Observações |
| --- | --- |
| SG2002 | Sophgo, LicheeRV-Nano |
| V861 | Allwinner |
| V881 | Allwinner |
| D213 | Allwinner |
| K1 | SpacemiT |
| K3 | SpacemiT |
| A210 | Sophgo |
| K230 | Canaan |

### MIPS

| Chip | Observações |
| --- | --- |
| MT7620 | MediaTek, roteadores OpenWrt |

### LoongArch

| Chip | Observações |
| --- | --- |
| 3A5000 | Loongson |
| 3A6000 | Loongson |
| 2K1000LA | Loongson |

## Produtos Verificados

| Produto | Chip | Arquitetura |
| --- | --- | --- |
| Nokia N900 | OMAP3430 | ARMv7 |
| LicheeRV-Nano | SG2002 | RISC-V 64 |
| NanoKVM | SG2002 | RISC-V 64 |
| NanoKVM Pro | SG2002 | RISC-V 64 |
| MaixCAM | SG2002 | RISC-V 64 |
| MaixCAM2 | AX630C | ARM64 |

## Placas de Desenvolvimento Verificadas

| Placa | Chip | Arquitetura |
| --- | --- | --- |
| Raspberry Pi 1 (A/B/B+) | BCM2835 | ARMv6 |
| Raspberry Pi Zero / Zero W | BCM2835 | ARMv6 |
| Raspberry Pi Zero 2 W | BCM2710A1 | ARM64 |
| Raspberry Pi 3 (A+/B/B+) | BCM2837 | ARM64 |
| Raspberry Pi 4 B | BCM2711 | ARM64 |
| Raspberry Pi 5 | BCM2712 | ARM64 |
| LicheeRV-Nano | SG2002 | RISC-V 64 |
| Milk-V Duo | SG2002 | RISC-V 64 |
| BananaPi F3 | K1 | RISC-V 64 |
| SpacemiT K3 Board | K3 | RISC-V 64 |
| CanMV-K230 | K230 | RISC-V 64 |

## Também Funciona Em

- **Android** — via [Termux](https://termux.dev) (use `proot` para resolução de DNS)
- **Desktop / Servidor / Nuvem** — Linux, macOS, Windows, FreeBSD
- **OpenWrt** — roteadores com chips MIPS ou ARM
- **FreeBSD / NetBSD** — builds disponíveis para FreeBSD x86_64, ARM64 e ARMv6

## Requisitos Mínimos

| Recurso | Mínimo |
| --- | --- |
| RAM | 10 MB |
| Armazenamento | 20 MB |
| CPU | Qualquer núcleo único, 0.6 GHz+ |
| Kernel | Linux 3.x+ (ou equivalente) |

O PicoClaw em si é extremamente leve. O gargalo real é a conectividade de rede para alcançar o endpoint da API do LLM — mesmo uma conexão via modem 2G funciona.

## Como Testar

Execute o seguinte no seu dispositivo de destino:

```bash
./picoclaw onboard
./picoclaw agent -m "Hello, what device am I running on?"
```

Se o binário iniciar e se conectar a uma API, seu hardware é suportado.

## Contribuindo com Relatórios de Compatibilidade

Testou o PicoClaw em um hardware que não está listado aqui? Contribuições são bem-vindas:

1. Abra uma issue em [github.com/sipeed/picoclaw](https://github.com/sipeed/picoclaw/issues) informando o chip, nome da placa/produto, arquitetura e sistema operacional.
2. Ou envie um PR atualizando esta página diretamente.

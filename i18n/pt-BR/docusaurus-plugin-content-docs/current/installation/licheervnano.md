---
id: licheervnano
title: Implantar no LicheeRV Nano
---

# Implantar no LicheeRV Nano

Este documento guia você pela implantação do PicoClaw na placa de desenvolvimento Sipeed LicheeRV Nano.

A LicheeRV Nano é uma placa de desenvolvimento ultracompacta (apenas 22,86 × 35,56 mm), equipada com o processador Sophgo SG2002 (que conta com um núcleo principal RISC-V/ARM selecionável de 1 GHz e um núcleo secundário RISC-V de 700 MHz). Ela inclui 256 MB de memória DDR3 e uma NPU com 1 TOPS de poder computacional. A placa também oferece interfaces variadas, como MIPI-CSI, MIPI-DSI, SDIO, ETH, USB, SPI, UART e I2C, o que a torna adequada para uma ampla gama de cenários de expansão. Seu design compatível com barras de pinos e furos castelados também facilita a integração posterior via SMT em produção em massa.

## Pré-requisitos

- **Sistema e rede**: sua LicheeRV Nano já deve estar com o firmware gravado e conectada à rede. Recomendamos usar a [imagem oficial do sistema](https://github.com/sipeed/LicheeRV-Nano-Build/releases/latest) da Sipeed. Você pode gravar a imagem em um cartão SD usando ferramentas como Win32DiskImager ou balenaEtcher.

- **Acesso SSH**: certifique-se de que é possível acessar o dispositivo remotamente via SSH.

## Implantar via SSH

Certifique-se de que sua máquina host e a LicheeRV Nano estão na mesma LAN e, em seguida, conecte-se à placa via SSH. Você pode instalar o PicoClaw usando qualquer um dos métodos a seguir:

### Método 1: Script de instalação em um clique (recomendado)

Use `curl` para baixar e executar o script [`install_picoclaw.py`](/scripts/maixcam/install_picoclaw.py) em uma única etapa:

```bash
curl -o install_picoclaw.py https://raw.githubusercontent.com/sipeed/picoclaw_docs/main/static/scripts/maixcam/install_picoclaw.py && python3 install_picoclaw.py
```

### Método 2: Download e configuração manuais

Se preferir uma configuração manual, execute os seguintes comandos em sequência:

```bash
curl -L# -o picoclaw_Linux_riscv64.tar.gz \
https://picoclaw-downloads.tos-cn-beijing.volces.com/latest/picoclaw_Linux_riscv64.tar.gz

mkdir -p /root/picoclaw
gzip -dc picoclaw_Linux_riscv64.tar.gz | tar -xvf - -C /root/picoclaw

cp /root/picoclaw/picoclaw* /usr/bin

rm -rf /root/picoclaw /root/picoclaw_Linux_riscv64.tar.gz
```

## Inicie a TUI

Após a instalação, execute o comando a seguir para abrir a TUI (interface de usuário em terminal) do PicoClaw para configuração e gerenciamento:

```bash
picoclaw-launcher-tui
```

## Inicie a Web UI

Se preferir uma interface gráfica, execute o comando a seguir no terminal para iniciar o serviço web:

```bash
picoclaw-launcher -no-browser -public
```

Após o serviço iniciar, abra um navegador em um dispositivo na mesma LAN e acesse:

```text
http://<device-ip>:18800
```

> **Dica**: substitua `<device-ip>` pelo endereço IP real atribuído à sua LicheeRV Nano na LAN.

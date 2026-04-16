---
id: android
title: Instalar no Android
---

# Instalar no Android

O PicoClaw oferece um pacote de instalação para Android, permitindo instalar o PicoClaw em dispositivos Android.
Este guia mostra como instalar o PicoClaw no Android.

## Instalação

### Baixe o Pacote de Instalação

1. Acesse o [Site Oficial do PicoClaw](https://picoclaw.io/download/android/) para baixar o pacote de instalação para Android

![Download](/img/installation/android0.png)

2. Baixe o pacote de instalação APK e conclua a instalação

![Install](/img/installation/android1.png)

## Inicie o PicoClaw

Após a instalação, toque no ícone do PicoClaw para abrir o aplicativo e, em seguida, toque no botão "Start Service" para iniciar o serviço.
![Launch](/img/installation/android2.png)

Com o serviço em execução, você pode acessar a Web UI do PicoClaw a partir da página de configuração.
Como alternativa, abra o navegador e acesse o seguinte endereço para abrir a Web UI do PicoClaw:

```text
http://127.0.0.1:18800
```
![WebUI](/img/installation/android3.png)

- Se precisar acessar a Web UI do PicoClaw externamente, habilite o Public Mode nas configurações.
![Settings](/img/installation/android4.png)

## Rodar no Android Termux (opcional)

Se preferir executar pelo Termux, também é possível usar o método abaixo:

```bash
wget https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz
tar xzf picoclaw_Linux_arm64.tar.gz
pkg install proot
termux-chroot ./picoclaw onboard
```

![PicoClaw rodando no Termux](https://github.com/sipeed/picoclaw/raw/main/assets/termux.jpg)

## Problemas conhecidos

- Em alguns dispositivos Android, uma versão antiga do WebView do sistema pode causar exibição anormal ou falhas de interação na página de configuração.
- Alguns dispositivos com chip HiSilicon podem apresentar problemas de compatibilidade.

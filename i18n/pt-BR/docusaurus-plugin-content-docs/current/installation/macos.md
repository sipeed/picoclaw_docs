---
id: macos
title: Implantar no macOS
---

# Implantar no macOS

Este documento guia você pela implantação do PicoClaw em um sistema macOS.

## Instalação

### Baixe o Pacote

1. Acesse o [site do PicoClaw](https://picoclaw.io/) e baixe o pacote para macOS.

![Download](/img/installation/macdownload.png)

2. Extraia o arquivo compactado baixado.

![Extract](/img/installation/macbin.png)

## Inicie o PicoClaw

Após extrair o arquivo, inicie o PicoClaw dando duplo clique em `picoclaw-launcher`.

Assim que o serviço iniciar, ele abrirá automaticamente o seu navegador. Se o navegador não abrir, acesse o seguinte endereço para abrir a Web UI do PicoClaw:

```text
http://localhost:18800
```

![webui](/img/installation/macwebui.png)

- Observação: o Safari pode bloquear links HTTP. Você pode resolver isso indo em Preferências do Safari → Segurança → e desmarcando "Avisar antes de acessar um site por HTTP".

![safariset](/img/installation/safariset.png)

## macOS — Aviso de Segurança no Primeiro Uso

O macOS pode bloquear o `picoclaw-launcher` no primeiro uso porque ele foi baixado da internet e não é notarizado pela Mac App Store.

**Passo 1:** dê duplo clique em `picoclaw-launcher`. Um aviso de segurança será exibido:

![macsafe](/img/installation/macos.jpg)

> *"picoclaw-launcher" não pode ser aberto — a Apple não pode verificar se "picoclaw-launcher" está livre de malware que possa prejudicar o seu Mac ou comprometer a sua privacidade.*

**Passo 2:** abra **Ajustes do Sistema** → **Privacidade e Segurança** → role até a seção **Segurança** → clique em **Abrir Assim Mesmo** → clique em **Abrir** novamente na caixa de confirmação.

![macsafe](/img/installation/macos1.jpg)

Após concluir essa operação, iniciar o `picoclaw-launcher` não exibirá mais o aviso no futuro.





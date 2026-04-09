---
id: maixcam
title: Implantar no MaixCam / MaixCam2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Implantar no MaixCam / MaixCam2

Este documento guia você pela integração das câmeras de IA Sipeed MaixCAM ou MaixCAM2 com o PicoClaw.

A MaixCAM e a MaixCAM2 são plataformas de hardware projetadas para aplicações reais de visão computacional, áudio e AIoT. Elas oferecem processadores de alto desempenho com bom custo-benefício, além de câmeras, telas, Wi-Fi e um ecossistema de software fácil de usar. Ao implantar o PicoClaw na MaixCam ou MaixCAM2, você habilita cenários como monitoramento inteligente e inferência em edge.

## Hardware

- MaixCAM
- MaixCAM-Pro
- MaixCAM2

## Pré-requisitos

- O firmware já foi gravado no seu dispositivo MaixCam ou MaixCAM2, e o dispositivo consegue iniciar e se conectar à rede.

- Você pode acessar o dispositivo pelo MaixVision ou via SSH.

## Implantação

### Configurar a Rede

1. Configure a rede: se o seu dispositivo ainda não está conectado, siga antes a configuração de rede do MaixPy.

- [Configurações de Rede do MaixPy](https://wiki.sipeed.com/maixpy/doc/en/network/network_settings.html)

2. Obtenha o IP do dispositivo: vá em Settings -> Device Info -> IP Address, ou encontre-o na lista de dispositivos do MaixVision na mesma LAN.

### Conectar via SSH e Implantar o PicoClaw

1. Certifique-se de que o seu computador e a MaixCam/MaixCam2 estão na mesma LAN.
2. Use um cliente SSH para conectar-se ao IP do dispositivo. O usuário/senha padrão é `root` / `root`.
3. Na sessão SSH, execute os comandos abaixo para baixar e iniciar o PicoClaw:

<Tabs>
	<TabItem value="maixcam" label="MaixCam / MaixCAM-Pro" default>

```bash
curl -L# -o picoclaw_Linux_riscv64.tar.gz \
https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_riscv64.tar.gz

mkdir -p /root/picoclaw
gzip -dc picoclaw_Linux_riscv64.tar.gz | tar -xvf - -C /root/picoclaw
cp /root/picoclaw/picoclaw* /usr/bin
rm -rf /root/picoclaw /root/picoclaw_Linux_riscv64.tar.gz

picoclaw-launcher-tui
```

	</TabItem>
	<TabItem value="maixcam2" label="MaixCam2">

```bash
curl -L# -o picoclaw_aarch64.deb \
https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_aarch64.deb

dpkg -i picoclaw_aarch64.deb
rm -rf picoclaw_aarch64.deb

picoclaw-launcher-tui
```

	</TabItem>
</Tabs>
Agora você pode usar o PicoClaw TUI no terminal para configuração e gerenciamento.

4. Para iniciar a Web UI do PicoClaw, execute:

```bash
picoclaw-launcher -no-browser -public
```

Em seguida, abra `http://<device-ip>:18800` em um navegador na mesma LAN.

### Conectar via MaixVision e Implantar o PicoClaw

1. Conecte-se ao seu dispositivo MaixCam ou MaixCam2 no MaixVision.
2. No MaixVision, crie um novo arquivo Python e cole o conteúdo do script abaixo:

	Script: [`install_picoclaw.py`](/scripts/maixcam/install_picoclaw.py)

3. Clique em **Run**. O PicoClaw será baixado e instalado no dispositivo, e a Web UI do PicoClaw será iniciada.
4. Abra `http://<device-ip>:18800` em um navegador na mesma LAN para acessar a Web UI do PicoClaw.

## Exemplo de Uso

Abaixo está um exemplo prático simples mostrando como usar o PicoClaw com a MaixCAM para desenvolvimento de visão computacional com IA:

1. **Configuração básica**: primeiro, configure o modelo e o canal de chat na Web UI ou na TUI. O exemplo abaixo usa o `Discord` e o modelo `glm-4.7`:
   - Configuração do canal: veja o [guia de configuração do Discord](../channels/discord.md#4-configure).
   - Configuração do modelo: veja o [guia de configuração de modelos](../configuration/model-list.md).

2. **Gerar script de captura**: no Discord, converse com o PicoClaw e peça para ele escrever e executar um script MaixPy de captura:

   > Consulte https://wiki.sipeed.com/maixpy/doc/zh/vision/camera.html
   > Por favor, escreva um script MaixPy que capture uma imagem e a salve em /root/capture.jpg

   ![capture](/img/maixcam/capture.jpeg)

3. **Gerar uma Skill de análise de imagem**: peça para o PicoClaw gerar automaticamente uma Skill que analisa a imagem recém-capturada usando um modelo grande:

   > Você pode escrever uma skill que use um modelo grande para analisar a imagem que acabamos de capturar?

   ![image_analysis_skill](/img/maixcam/image_analysis_skill.jpeg)

4. **Executar a análise da imagem**: invoque a skill que você criou para fazer uma análise aprofundada da imagem:

   > Use a skill criada anteriormente para analisar esta imagem. Você pode usar o modelo `glm-4.6v`; a API_KEY pode ser encontrada em `.picoclaw/config.json`.

   ![image_analysis_result](/img/maixcam/image_analysis_result.jpeg)

### FAQ

- Modelos grandes podem não concluir tarefas complexas perfeitamente em um único turno. Se você encontrar erros ou desvios, guie o modelo por turnos conversacionais adicionais para corrigi-los.
- Este é um exemplo básico de fluxo imagem-texto. O PicoClaw pode fazer muito mais — personalize modelos e fluxos automatizados para se adequar ao seu caso de uso.

## Referências

Para mais informações sobre o hardware MaixCam e guias de uso, consulte:

- [Documentação de Hardware da MaixCam](https://wiki.sipeed.com/hardware/en/maixcam)
- [Documentação do MaixPy](https://wiki.sipeed.com/maixpy/en)

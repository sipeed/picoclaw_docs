---
id: wecom
title: WeCom (企业微信)
---

# WeCom

O PicoClaw expõe o WeCom como um único canal `channels.wecom` construído sobre a WebSocket API oficial do WeCom AI Bot.
Isso substitui a antiga divisão em `wecom`, `wecom_app` e `wecom_aibot` por um modelo de configuração unificado.

:::info Não é necessária URL pública
Nenhuma URL de callback de webhook pública é necessária. O PicoClaw abre uma conexão WebSocket de saída para o WeCom.
:::

## O Que Este Canal Suporta

- Entrega em chat direto e em chat de grupo
- Streaming de respostas pelo lado do canal usando o protocolo AI Bot do WeCom
- Recebimento de mensagens de texto, voz, imagem, arquivo, vídeo e mistas
- Envio de respostas em texto e mídia (`image`, `file`, `voice`, `video`)
- Onboarding via QR pela Web UI ou CLI
- Allowlist compartilhada e roteamento via `reasoning_channel_id`

---

## Início Rápido

### Opção 1: Vinculação por QR via Web UI (Recomendado)

Abra a Web UI, navegue até **Channels → WeCom** e clique no botão de vinculação por QR. Escaneie o QR code com o WeCom e confirme no aplicativo — as credenciais são salvas automaticamente.

### Opção 2: Login por QR via CLI

Execute:

```bash
picoclaw auth wecom
```

O comando:
1. Solicita um QR code ao WeCom e o imprime no terminal
2. Também imprime um **QR Code Link** que você pode abrir no navegador caso o QR no terminal esteja difícil de escanear
3. Faz polling até receber a confirmação — após escanear, você também precisa **confirmar o login dentro do app WeCom**
4. Em caso de sucesso, grava `bot_id` e `secret` em `channels.wecom` e salva a configuração

O timeout padrão é de **5 minutos**. Use `--timeout` para estendê-lo:

```bash
picoclaw auth wecom --timeout 10m
```

:::warning
Escanear o QR code não é suficiente — você também precisa tocar em **Confirmar** dentro do app WeCom, caso contrário o comando vai expirar.
:::

### Opção 3: Configuração Manual

Se você já tem `bot_id` e `secret` da plataforma WeCom AI Bot, configure diretamente:

```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "bot_id": "YOUR_BOT_ID",
      "secret": "YOUR_SECRET",
      "websocket_url": "wss://openws.work.weixin.qq.com",
      "send_thinking_message": true,
      "allow_from": [],
      "reasoning_channel_id": ""
    }
  }
}
```

---

## Configuração

| Campo | Tipo | Padrão | Descrição |
| ----- | ---- | ------ | --------- |
| `enabled` | bool | `false` | Ativa o canal WeCom. |
| `bot_id` | string | — | Identificador do WeCom AI Bot. Obrigatório quando habilitado. |
| `secret` | string | — | Secret do WeCom AI Bot. Armazenado criptografado em `.security.yml`. Obrigatório quando habilitado. |
| `websocket_url` | string | `wss://openws.work.weixin.qq.com` | Endpoint WebSocket do WeCom. |
| `send_thinking_message` | bool | `true` | Envia uma mensagem `Processing...` antes do início do streaming da resposta. |
| `allow_from` | array | `[]` | Allowlist de remetentes. Vazio significa permitir todos. |
| `reasoning_channel_id` | string | `""` | ID de chat opcional para direcionar a saída de raciocínio/pensamento para uma conversa separada. |

### Variáveis de Ambiente

Todos os campos podem ser sobrescritos via variáveis de ambiente com o prefixo `PICOCLAW_CHANNELS_WECOM_`:

| Variável de Ambiente | Campo Correspondente |
| -------------------- | -------------------- |
| `PICOCLAW_CHANNELS_WECOM_ENABLED` | `enabled` |
| `PICOCLAW_CHANNELS_WECOM_BOT_ID` | `bot_id` |
| `PICOCLAW_CHANNELS_WECOM_SECRET` | `secret` |
| `PICOCLAW_CHANNELS_WECOM_WEBSOCKET_URL` | `websocket_url` |
| `PICOCLAW_CHANNELS_WECOM_SEND_THINKING_MESSAGE` | `send_thinking_message` |
| `PICOCLAW_CHANNELS_WECOM_ALLOW_FROM` | `allow_from` |
| `PICOCLAW_CHANNELS_WECOM_REASONING_CHANNEL_ID` | `reasoning_channel_id` |

---

## Comportamento em Tempo de Execução

- O PicoClaw mantém um turn ativo no WeCom para que o streaming de respostas possa continuar no mesmo stream quando possível.
- Respostas em streaming têm duração máxima de **5,5 minutos** e intervalo mínimo de envio de **500ms**.
- Se o streaming não estiver mais disponível, as respostas caem em fallback para entrega via active push.
- Associações de rota de chat expiram após **30 minutos** de inatividade.
- Mídia recebida é baixada para o media store local antes de ser repassada ao agente.
- Mídia enviada é feita upload para o WeCom como arquivo temporário e, em seguida, enviada como mensagem de mídia.
- Mensagens duplicadas são detectadas e suprimidas (ring buffer dos últimos 1000 IDs de mensagem).

---

## Migração da Configuração Antiga do WeCom

Os três tipos antigos de canal WeCom (`wecom`, `wecom_app`, `wecom_aibot`) foram consolidados em um único canal `channels.wecom`. Use a tabela abaixo para atualizar sua configuração:

| Configuração anterior | Migração |
| --------------------- | -------- |
| `channels.wecom` (webhook bot) | Substitua por `channels.wecom` usando `bot_id` + `secret`. |
| `channels.wecom_app` | Remova. Use `channels.wecom` no lugar. |
| `channels.wecom_aibot` | Mova `bot_id` e `secret` para `channels.wecom`. |
| `token`, `encoding_aes_key`, `webhook_url`, `webhook_path` | Não são mais usados. Remova da configuração. |
| `corp_id`, `corp_secret`, `agent_id` | Não são mais usados. Remova da configuração. |
| `welcome_message`, `processing_message`, `max_steps` | Não fazem mais parte da configuração do canal WeCom. |

---

## Solução de Problemas

### A vinculação por QR expira

- Depois de escanear o QR code, você também precisa **confirmar o login dentro do app WeCom**. Apenas escanear não basta.
- Execute novamente com um `--timeout` maior: `picoclaw auth wecom --timeout 10m`
- Se o QR code no terminal estiver difícil de escanear, use o **QR Code Link** impresso abaixo dele para abrir no navegador.

### QR code expirado

- O QR code tem validade limitada. Execute `picoclaw auth wecom` de novo para obter um novo.

### Falha na conexão WebSocket

- Verifique se `bot_id` e `secret` estão corretos.
- Confirme se o host consegue alcançar `wss://openws.work.weixin.qq.com` (WebSocket de saída, sem necessidade de porta de entrada).

### As respostas não chegam

- Verifique se `allow_from` não está bloqueando o remetente.
- Verifique se `channels.wecom.bot_id` e `channels.wecom.secret` estão definidos e não vazios.

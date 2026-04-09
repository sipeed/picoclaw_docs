---
id: whatsapp
title: WhatsApp
---

# WhatsApp

O PicoClaw pode se conectar ao WhatsApp de duas formas: por um **bridge WebSocket** genérico (`pkg/channels/whatsapp`) para situações em que outro processo fala o protocolo do WhatsApp, ou por um cliente **nativo** (`pkg/channels/whatsapp_native`) que fala diretamente o protocolo WhatsApp Web via [whatsmeow](https://github.com/tulir/whatsmeow). O modo é selecionado pela flag `use_native`.

## Modo Nativo (whatsmeow)

O modo nativo se conecta diretamente aos servidores do WhatsApp — sem precisar de um processo de bridge externo. Recomendado para a maioria dos usuários.

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "use_native": true,
      "session_store_path": "~/.picoclaw/workspace/whatsapp",
      "allow_from": []
    }
  }
}
```

Na primeira execução, um QR code é impresso no terminal. Escaneie-o com seu celular (WhatsApp → Configurações → Aparelhos Conectados) para parear. A sessão é persistida em `session_store_path`, de modo que execuções seguintes reaproveitam o pareamento sem precisar escanear de novo.

:::tip Re-pareamento
Se o pareamento travar ou você quiser recomeçar, apague o session store e reinicie:
```bash
rm -rf ~/.picoclaw/workspace/whatsapp
```
:::

## Modo Bridge

O modo bridge aponta o PicoClaw para um endpoint WebSocket externo que já fala WhatsApp em seu nome. Use este modo se você já tem um processo de bridge existente com o qual quer integrar.

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "use_native": false,
      "bridge_url": "ws://localhost:3001"
    }
  }
}
```

O PicoClaw vai discar para `bridge_url` por WebSocket simples e trocar mensagens com o bridge. O bridge é responsável por efetivamente conversar com o WhatsApp — o PicoClaw o trata como um transporte opaco.

## Referência de Configuração

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Ativa o canal WhatsApp |
| `use_native` | bool | `false` | Se `true`, usa o modo nativo whatsmeow; se `false`, usa o modo bridge |
| `bridge_url` | string | `""` | URL WebSocket para o modo bridge (ignorado quando `use_native` é `true`) |
| `session_store_path` | string | `""` | Diretório para armazenar a sessão do whatsmeow (somente modo nativo) |
| `allow_from` | array | `[]` | Números de telefone autorizados a interagir com o bot. Array vazio permite todos os contatos. |
| `reasoning_channel_id` | string | `""` | Direcionar a saída de raciocínio para um chat separado |

Cada campo também pode ser definido pela variável de ambiente correspondente, prefixada com `PICOCLAW_CHANNELS_WHATSAPP_` (ex.: `PICOCLAW_CHANNELS_WHATSAPP_USE_NATIVE=true`).

## Controle de Acesso

Use `allow_from` com números de telefone em formato internacional (sem o prefixo `+`):

```json
{
  "allow_from": ["5511999998888", "5521888887777"]
}
```

Defina como `[]` para permitir qualquer contato que mandar mensagem ao bot.

## Suporte a Mídia

Mídias recebidas (imagens, áudio, documentos) são baixadas e incluídas como contexto da conversa. Se um modelo de transcrição de voz compatível com Whisper estiver configurado em `voice.model_name`, mensagens de áudio são transcritas automaticamente antes de serem repassadas ao agente.

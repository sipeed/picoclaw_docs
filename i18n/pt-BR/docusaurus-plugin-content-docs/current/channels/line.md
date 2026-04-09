---
id: line
title: LINE
---

# LINE

O LINE requer HTTPS para webhooks (use um proxy reverso ou túnel como o ngrok).

## Configuração

### 1. Criar uma Conta Oficial LINE

- Acesse o [Console de Desenvolvedores LINE](https://developers.line.biz/)
- Crie um provedor → Crie um canal Messaging API
- Copie o **Channel Secret** e o **Channel Access Token**

### 2. Configurar o PicoClaw

```json
{
  "channels": {
    "line": {
      "enabled": true,
      "channel_secret": "YOUR_CHANNEL_SECRET",
      "channel_access_token": "YOUR_CHANNEL_ACCESS_TOKEN",
      "webhook_path": "/webhook/line",
      "allow_from": []
    }
  }
}
```

O LINE usa o servidor HTTP compartilhado do gateway (porta padrão `18790`). Nenhuma configuração separada de `webhook_host`/`webhook_port` é necessária.

### 3. Configurar Webhook HTTPS

O LINE requer HTTPS. Use um proxy reverso ou túnel:

```bash
# Exemplo com ngrok
ngrok http 18790
```

Defina a URL do Webhook no Console de Desenvolvedores LINE como `https://your-domain/webhook/line` e ative **Use webhook**.

### 4. Executar

```bash
picoclaw gateway
```

## Observações

- Em chats de grupo, o bot responde apenas quando @mencionado (padrão `group_trigger.mention_only: true`)
- As respostas citam a mensagem original

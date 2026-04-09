---
id: onebot
title: OneBot
---

# OneBot

O OneBot é um protocolo compatível com diversos bots de QQ (NapCat, Go-CQHTTP, etc.).

## Configuração

### 1. Iniciar um Cliente Compatível com OneBot

Exemplos:
- [NapCat](https://napcat.napneko.icu/) — implementação moderna do protocolo QQ
- [Go-CQHTTP](https://github.com/Mrs4s/go-cqhttp) — implementação clássica

Configure-o para expor um servidor reverso WebSocket.

### 2. Configurar o PicoClaw

```json
{
  "channels": {
    "onebot": {
      "enabled": true,
      "ws_url": "ws://127.0.0.1:3001",
      "access_token": "",
      "reconnect_interval": 5,
      "group_trigger_prefix": [],
      "allow_from": []
    }
  }
}
```

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ws_url` | string | URL WebSocket do cliente OneBot |
| `access_token` | string | Token de acesso (se configurado) |
| `reconnect_interval` | int | Intervalo de reconexão em segundos |
| `group_trigger_prefix` | array | Prefixos que acionam a resposta do bot em grupos (legado, migrado para `group_trigger.prefixes`) |
| `group_trigger` | object | Configurações de acionamento em grupo (`mention_only`, `prefixes`) |
| `allow_from` | array | IDs de usuários QQ permitidos |
| `reasoning_channel_id` | string | Direcionar a saída de raciocínio para um canal separado |

### 3. Executar

```bash
picoclaw gateway
```

:::note
A documentação completa do OneBot está disponível em chinês no repositório em `docs/channels/onebot/README.zh.md`.
:::

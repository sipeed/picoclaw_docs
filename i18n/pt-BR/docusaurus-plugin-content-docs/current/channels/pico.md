---
id: pico
title: Protocolo Pico
---

# Protocolo Pico

O canal Pico é o protocolo WebSocket nativo do PicoClaw para clientes personalizados e para a Web UI. Ele suporta mensagens em tempo real, edição/exclusão de mensagens, indicadores de digitação, placeholders, envio de mídia e atualizações de feedback de ferramentas.

O PicoClaw pode atuar como servidor WebSocket (`pico`) ou como cliente conectado a um servidor Pico remoto (`pico_client`).

## Modo Servidor

Habilite `pico` quando este gateway deve aceitar clientes WebSocket.

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "YOUR_PICO_TOKEN",
      "allow_token_query": false,
      "allow_origins": ["https://docs.picoclaw.io"],
      "ping_interval": 30,
      "read_timeout": 60,
      "max_connections": 100,
      "allow_from": []
    }
  },
  "gateway": {
    "host": "localhost",
    "port": 18790
  }
}
```

Os clientes se conectam ao gateway compartilhado em `/pico/ws`. A autenticação usa o token configurado. Autenticação por token em query string fica desativada, a menos que `allow_token_query` seja `true`.

## Modo Cliente

Habilite `pico_client` quando esta instância do PicoClaw deve se conectar para fora a outro servidor Pico.

```json
{
  "channels": {
    "pico_client": {
      "enabled": true,
      "url": "wss://remote-pico-server/pico/ws",
      "token": "YOUR_PICO_TOKEN",
      "session_id": "",
      "ping_interval": 30,
      "read_timeout": 60,
      "allow_from": []
    }
  }
}
```

## Referência do Servidor

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Habilita o modo servidor Pico |
| `token` | string | obrigatório | Token compartilhado para autenticação do cliente |
| `allow_token_query` | bool | `false` | Permitir autenticação por token em parâmetro de query |
| `allow_origins` | string[] | `[]` | Origins de navegador permitidas. Array vazio permite todas. |
| `ping_interval` | int | `30` | Intervalo de ping WebSocket em segundos |
| `read_timeout` | int | `60` | Timeout de leitura WebSocket em segundos |
| `write_timeout` | int | `0` | Timeout opcional de escrita WebSocket em segundos |
| `max_connections` | int | `100` | Máximo de conexões WebSocket ativas |
| `allow_from` | array | `[]` | Remetentes de sessão Pico permitidos. Array vazio permite todos. |

## Referência do Cliente

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Habilita o modo cliente Pico |
| `url` | string | obrigatório | URL WebSocket Pico remota |
| `token` | string | obrigatório | Token compartilhado para autenticação no servidor remoto |
| `session_id` | string | `""` | ID de sessão fixo opcional |
| `ping_interval` | int | `30` | Intervalo de ping WebSocket em segundos |
| `read_timeout` | int | `60` | Timeout de leitura WebSocket em segundos |
| `allow_from` | array | `[]` | Remetentes de sessão de entrada permitidos |

## Segurança

Em produção, mantenha `token` em `.security.yml`. Se usar clientes de navegador, configure `allow_origins` com as origins confiáveis exatas em vez de deixar aberto.

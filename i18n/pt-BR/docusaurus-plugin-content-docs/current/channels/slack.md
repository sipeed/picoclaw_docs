---
id: slack
title: Slack
---

# Slack

A integração com o Slack usa o **Socket Mode**, então não é necessário um IP público. O PicoClaw mantém uma conexão WebSocket bidirecional em tempo real com o Slack.

## Configuração

### 1. Criar um App do Slack

- Acesse [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch**
- Escolha o seu workspace

### 2. Ativar o Socket Mode

- Vá em **Settings** → **Socket Mode** → Ative o Socket Mode
- Crie um **App-Level Token** com o escopo `connections:write`
- Copie o token do app (começa com `xapp-`)

### 3. Adicionar Escopos do Bot Token

Vá em **OAuth & Permissions** → **Bot Token Scopes** e adicione:

| Escopo | Descrição |
| --- | --- |
| `chat:write` | Enviar mensagens como o bot |
| `im:history` | Ver o histórico de mensagens das DMs |
| `im:read` | Ver metadados das DMs |
| `reactions:write` | Adicionar reações com emojis |
| `files:write` | Fazer upload de arquivos |
| `channels:history` | Ver o histórico de mensagens de canais públicos |
| `app_mentions:read` | Ler @menções ao bot |

### 4. Instalar no Workspace

- **OAuth & Permissions** → **Install to Workspace**
- Copie o **Bot User OAuth Token** (começa com `xoxb-`)

### 5. Ativar Event Subscriptions

Vá em **Event Subscriptions** → **Enable Events** → **Subscribe to bot events**:

| Evento | Descrição |
| --- | --- |
| `message.im` | Mensagens diretas para o bot |
| `message.channels` | Mensagens em canais públicos em que o bot está |
| `app_mention` | Quando o bot é @mencionado |

### 6. Configurar o PicoClaw

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "bot_token": "xoxb-YOUR-BOT-TOKEN",
      "app_token": "xapp-YOUR-APP-TOKEN",
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "typing": {
        "enabled": true
      },
      "placeholder": {
        "enabled": true,
        "text": "Thinking..."
      },
      "reasoning_channel_id": ""
    }
  }
}
```

### 7. Executar

```bash
picoclaw gateway
```

## Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `bot_token` | string | Sim | Bot User OAuth Token (começa com `xoxb-`) |
| `app_token` | string | Sim | App-Level Token para Socket Mode (começa com `xapp-`) |
| `allow_from` | array | Não | Whitelist de IDs de usuários do Slack (vazio = permitir todos) |
| `group_trigger` | object | Não | Configurações de acionamento em chat de grupo (veja [Campos Comuns dos Canais](../#common-channel-fields)) |
| `typing` | object | Não | Configuração do indicador de digitação (`enabled`) |
| `placeholder` | object | Não | Configuração da mensagem de placeholder (`enabled`, `text`) |
| `reasoning_channel_id` | string | Não | Direcionar a saída de raciocínio para um canal separado |

## Como Funciona

### Socket Mode

O Socket Mode estabelece uma conexão WebSocket do PicoClaw para os servidores do Slack:

- **Não precisa de URL pública** — a conexão é outbound a partir do seu servidor
- **Entrega em tempo real** — os eventos são enviados instantaneamente via WebSocket
- **Reconexão automática** — gerenciada pelo SDK do Slack

### Suporte a Threads

- Quando um usuário envia uma DM, o bot responde diretamente
- Em canais, o bot responde em uma **thread** para manter as conversas organizadas
- O contexto da thread é preservado para conversas de múltiplos turnos

### Indicador de Digitação

Quando `typing.enabled` é `true`, o bot exibe um indicador de digitação enquanto processa a resposta.

### Confirmação por Reação

O bot reage com um emoji ✅ para confirmar o recebimento de uma mensagem.

### Limites de Mensagem

- Tamanho máximo da mensagem: 40.000 caracteres
- Respostas mais longas são automaticamente divididas em várias mensagens

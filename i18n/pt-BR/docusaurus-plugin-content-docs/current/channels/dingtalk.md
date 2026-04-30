---
id: dingtalk
title: DingTalk (钉钉)
---

# DingTalk

O DingTalk é a plataforma de comunicação corporativa da Alibaba, amplamente usada em ambientes de trabalho chineses. O PicoClaw usa o SDK do **Stream Mode** do DingTalk, que mantém uma conexão WebSocket persistente — sem necessidade de IP público nem configuração de webhook.

## Configuração

### 1. Criar um App Interno

1. Acesse a [Plataforma Aberta do DingTalk](https://open.dingtalk.com/)
2. Clique em **Application Development** → **Enterprise Internal Development** → **Create Application**
3. Preencha o nome e a descrição do app

### 2. Obter Credenciais

1. Vá em **Credentials & Basic Info** nas configurações do seu app
2. Copie o **Client ID** (AppKey) e o **Client Secret** (AppSecret)

### 3. Ativar o Recurso de Robô

1. Vá em **App Features** → **Robot**
2. Ative o recurso de robô
3. O robô funciona tanto em **chats de grupo** quanto em **chats privados**

### 4. Configurar Permissões

Em **Permissions & Scopes**, garanta que as seguintes permissões estejam concedidas:

- Receber mensagens (para receber mensagens dos usuários)
- Enviar mensagens (para enviar respostas do bot)

### 5. Configurar o PicoClaw

#### 1. Configuracao pelo WebUI

Recomendamos priorizar a configuracao pelo WebUI, pois e mais rapida e conveniente.

![WebUI DingTalk Connection Interface](/img/channels/webui_dingtalk.png)

Preencha, nesta ordem, o Client ID (`YOUR_CLIENT_ID`) e o Client Secret (`YOUR_CLIENT_SECRET`), depois clique em **Salvar**.

#### 2. Arquivos de Configuracao

Edite `~/.picoclaw/.security.yml`:

```yaml
dingtalk:
  settings:
    client_secret: YOUR_CLIENT_SECRET
```

Edite `~/.picoclaw/config.json`:

```json
{
  "channels": {
      "enabled": true,
      "type": "dingtalk",
      "reasoning_channel_id": "",
      "group_trigger": {},
      "typing": {},
      "placeholder": {
        "enabled": false
      },
      "settings": {
        "client_id": "YOUR_CLIENT_ID"
      }
  }
}
```

### 6. Executar

```bash
picoclaw gateway
```

## Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `client_id` | string | Sim | Client ID do app DingTalk (AppKey) |
| `client_secret` | string | Sim | Client Secret do app DingTalk (AppSecret) |
| `allow_from` | array | Não | Whitelist de IDs de usuários DingTalk (vazio = permitir todos) |
| `group_trigger` | object | Não | Configurações de acionamento em chat de grupo (veja [Campos Comuns dos Canais](../#common-channel-fields)) |
| `reasoning_channel_id` | string | Não | Direcionar a saída de raciocínio para um chat separado |

## Como Funciona

### Stream Mode

O Stream Mode do DingTalk usa uma conexão WebSocket persistente mantida pelo SDK:

- **Não precisa de IP público** — o SDK conecta-se de forma outbound aos servidores do DingTalk
- **Reconexão automática** — o SDK lida com desconexões e reconecta automaticamente
- **Entrega em tempo real** — as mensagens são entregues instantaneamente pelo canal WebSocket

### Tratamento de Mensagens

- **Chats privados**: As mensagens são recebidas diretamente
- **Chats de grupo**: O bot responde quando é @mencionado (configurável via `group_trigger`)
- **Session Webhook**: Cada mensagem recebida traz uma URL `sessionWebhook` para respostas diretas
- **Tamanho máximo da mensagem**: 20.000 caracteres por mensagem (respostas mais longas são automaticamente truncadas)

### Tratamento de Menções em Grupos

Quando o bot é @mencionado em um chat de grupo, o PicoClaw remove automaticamente as tags `@mention` iniciais da mensagem antes de passá-la ao agente. Isso garante que o agente receba o texto de entrada limpo, sem o prefixo `@BotName`. O bot usa o campo `IsInAtList` do DingTalk para detectar de forma confiável se foi mencionado, em vez de analisar o texto manualmente.

### Grupo vs. Chat Privado

| Recurso | Chat Privado | Chat de Grupo |
| --- | --- | --- |
| Gatilho | Qualquer mensagem | @menção por padrão |
| Resposta | Resposta direta | Resposta via session webhook |
| Contexto | Sessão por usuário | Sessão por grupo |

---
id: feishu
title: Feishu / Lark (飞书)
---

# Feishu / Lark

O Feishu (versão internacional: Lark) é a plataforma de colaboração corporativa da ByteDance. O PicoClaw se integra a ele via WebSocket orientado a eventos, suportando tanto o mercado chinês quanto o global.

## Configuração

### 1. Criar um App Feishu

1. Acesse a [Plataforma Aberta do Feishu](https://open.feishu.cn/) (ou [Lark Developer](https://open.larksuite.com/) para a versão internacional)
2. Clique em **Create Custom App** → escolha **Enterprise Self-built Application**
3. Preencha o nome e a descrição do app
4. Anote o **App ID** (começa com `cli_`) e o **App Secret** na página **Credentials & Basic Info**

### 2. Configurar Permissões

Em **Permissions & Scopes**, adicione as seguintes permissões de bot:

| Permissão | Descrição |
| --- | --- |
| `im:message` | Acessar mensagens |
| `im:message:send_v2` | Enviar mensagens como o bot |
| `im:resource` | Acessar recursos de mensagens (imagens, arquivos) |
| `im:chat` | Acessar informações de chat |
| `im:message.reactions:write` | Escrever reações em mensagens |

### 3. Configurar Event Subscriptions

Vá para as configurações de **Event Subscriptions**:

1. **Escolha o modo de conexão**: Selecione **WebSocket Mode** (recomendado — não precisa de IP público)
   - Alternativa: modo de callback HTTP (requer uma URL pública)
2. Inscreva-se no seguinte evento:
   - `im.message.receive_v1` — Receber mensagens

### 4. Configurar Criptografia (Recomendado para Produção)

Na página de **Event Subscriptions**:

1. Clique em **Encrypt Key** → Gere ou defina uma chave personalizada
2. Clique em **Verification Token** → Gere ou defina um token personalizado
3. Copie ambos os valores para a configuração do PicoClaw

:::tip
Para desenvolvimento/testes, você pode deixar `encrypt_key` e `verification_token` vazios. Para produção, é altamente recomendável ativar a criptografia.
:::

### 5. Configurar o PicoClaw

#### 1. Configuracao pelo WebUI

Recomendamos priorizar a configuracao pelo WebUI, pois e mais rapida e conveniente.

![WebUI Feishu Connection Interface](/img/channels/webui_feishu.png)

Preencha, nesta ordem, o App ID (`YOUR_APP_ID`), App Secret (`YOUR_APP_SECRET`), Encrypt Key (`YOUR_ENCRYPT_KEY`) e Verification Token (`YOUR_VERIFICATION_TOKEN`), depois clique em **Salvar**.

#### 2. Arquivos de Configuracao

Edite `~/.picoclaw/config.json`:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "type": "feishu",
      "allow_from": [
        "YOUR_USER_ID"
      ],
      "reasoning_channel_id": "",
      "group_trigger": {},
      "typing": {},
      "placeholder": {
        "enabled": false
      },
      "settings": {
        "app_id": "YOUR_APP_ID",
        "random_reaction_emoji": null,
        "is_lark": false
      }
    }
  }
}
```

Edite `~/.picoclaw/.security.yml`:

```yaml
feishu:
  settings:
    app_secret: "YOUR_APP_SECRET"
    encrypt_key: "YOUR_ENCRYPT_KEY"
    verification_token: "YOUR_VERIFICATION_TOKEN"
```

### 6. Publicar o App

1. Vá em **Version Management & Release**
2. Crie uma nova versão e envie para revisão
3. Defina **Availability** para determinar quais usuários/departamentos podem usar o bot
4. Após a aprovação, o bot ficará disponível nos chats do Feishu

### 7. Executar

```bash
picoclaw gateway
```

## Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `app_id` | string | Sim | App ID do Feishu (começa com `cli_`) |
| `app_secret` | string | Sim | App Secret do Feishu |
| `encrypt_key` | string | Não | Chave de criptografia do callback de eventos |
| `verification_token` | string | Não | Token de verificação de eventos |
| `allow_from` | array | Não | Whitelist de open IDs de usuários (vazio = permitir todos) |
| `group_trigger` | object | Não | Configurações de acionamento em chat de grupo (veja [Campos Comuns dos Canais](../#common-channel-fields)) |
| `placeholder` | object | Não | Configuração da mensagem de placeholder (`enabled`, `text`) |
| `random_reaction_emoji` | array | Não | Lista de emojis personalizados para reações em mensagens (vazio = "Pin" padrão) |
| `reasoning_channel_id` | string | Não | Direcionar a saída de raciocínio para um chat separado |

### Placeholder

Quando ativado, o PicoClaw envia uma mensagem de placeholder (por exemplo, "Thinking...") imediatamente ao receber uma mensagem do usuário e, em seguida, a substitui pela resposta real quando o agente termina o processamento.

```json
"placeholder": {
  "enabled": true,
  "text": "Thinking..."
}
```

### Emojis de Reação Personalizados

O PicoClaw reage às mensagens dos usuários com um emoji para confirmar o recebimento. Você pode personalizar a lista de emojis:

```json
"random_reaction_emoji": ["THUMBSUP", "HEART", "SMILE"]
```

Deixe vazio para usar o emoji "Pin" padrão. Consulte a [Lista de Emojis do Feishu](https://open.larkoffice.com/document/server-docs/im-v1/message-reaction/emojis-introduce) para ver os emojis disponíveis.

:::note
Entradas vazias ou apenas com espaços em branco na lista `random_reaction_emoji` são automaticamente filtradas. Por exemplo, `["", "Pin"]` é tratado da mesma forma que `["Pin"]`. Se a lista não tiver entradas válidas após a filtragem, o emoji "Pin" padrão é usado.
:::

## Como Funciona

- O PicoClaw usa o SDK do Lark em **modo WebSocket** para o tratamento de eventos
- As mensagens são recebidas via assinatura do evento `im.message.receive_v1`
- As respostas são enviadas no formato **Interactive Card JSON 2.0** com suporte a Markdown
- Em chats de grupo, o bot detecta @menções via o `open_id` do bot

### Enriquecimento de contexto em respostas

Quando um usuário **responde** a uma mensagem anterior (incluindo mensagens do bot, cards e mensagens de arquivo/imagem), o PicoClaw automaticamente busca a mensagem original e prefixa um pequeno bloco de contexto antes do texto do usuário. Isso dá ao agente o fio da conversa que ele precisa para entender respostas curtas como "sim, pode fazer" ou "manda aquilo pro bob".

- A mensagem original é buscada via API do Feishu e armazenada em cache por 30 segundos (`messageCacheTTL`)
- O contexto injetado é limitado a **600 caracteres** (`maxReplyContextLen`)
- Respostas a cards e arquivos também são enriquecidas, não apenas texto puro
- A busca tem um timeout de 5 segundos — se falhar, a mensagem é processada sem o enriquecimento

Esse comportamento é automático e não tem opções de configuração.

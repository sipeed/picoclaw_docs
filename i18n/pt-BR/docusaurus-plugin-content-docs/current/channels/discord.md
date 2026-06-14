---
id: discord
title: Discord
---

# Discord

## Configuração

### 1. Criar um Bot

- Acesse [discord.com/developers/applications](https://discord.com/developers/applications)
- Crie um aplicativo → Bot → Add Bot
- Copie o token do bot

### 2. Ativar Intents

- Nas configurações do Bot, ative **MESSAGE CONTENT INTENT**

### 3. Obter Seu ID de Usuário

- Configurações do Discord → Avançado → ative o **Modo Desenvolvedor**
- Clique com o botão direito no seu avatar → **Copiar ID do Usuário**

### 4. Configurar {#4-configure}

#### 1. Configuracao pelo WebUI

Recomendamos priorizar a configuracao pelo WebUI, pois e mais rapida e conveniente.

![WebUI Discord Connection Interface](/img/channels/webui_discord.png)

Preencha, nesta ordem, o Bot Token (`YOUR_BOT_TOKEN`) e as Origens Permitidas (`YOUR_USER_ID`), depois clique em **Salvar**.

#### 2. Arquivos de Configuracao

Edite `~/.picoclaw/.security.yml`:

```yaml
discord:
  settings:
    token: YOUR_BOT_TOKEN
```

Edite `~/.picoclaw/config.json`:

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "type": "discord",
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
        "proxy": "",
        "mention_only": false
      }
    }
  }
}
```

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `enabled` | bool | Ativar/desativar o canal |
| `token` | string | Token do bot obtido no Discord Developer Portal |
| `proxy` | string | URL de proxy HTTP/SOCKS (opcional) |
| `allow_from` | array | Lista de IDs de usuários permitidos (vazio = permitir todos) |
| `group_trigger` | object | Configurações de acionamento em chat de grupo (veja abaixo) |
| `reasoning_channel_id` | string | Direcionar a saída de raciocínio para um canal separado |

### 5. Convidar o Bot

- OAuth2 → URL Generator
- Scopes: `bot`
- Bot Permissions: `Send Messages`, `Read Message History`
- Abra a URL de convite gerada e adicione o bot ao seu servidor

### 6. Executar

```bash
picoclaw gateway
```

## Acionamento em Grupo

Controle como o bot responde nos canais do servidor (não afeta DMs — o bot sempre responde em DMs):

```json
{
  "group_trigger": {
    "mention_only": true,
    "prefixes": ["/ask", "!bot"]
  }
}
```

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `mention_only` | bool | Responder apenas quando @mencionado em grupos |
| `prefixes` | array | Prefixos de palavras-chave que acionam o bot em grupos |

:::note Migração
O antigo campo de nível superior `"mention_only": true` é automaticamente migrado para `"group_trigger": {"mention_only": true}`.
:::

## Canal de Voz

O PicoClaw pode entrar em canais de voz do Discord e participar de conversas por voz:

- Entre em um canal de voz e, em seguida, digite `!vc join` em um canal de texto para fazer o bot entrar
- Saia do canal de voz com `!vc leave`
- A entrada de voz é transcrita usando o modelo ASR configurado e enviada ao agente
- A resposta do agente é convertida em áudio via TTS e reproduzida no canal de voz

A voz requer que `voice.tts_model_name` esteja configurado no `config.json`. Consulte [Configuração de Modelos](../configuration/model-list.md) para mais detalhes.

## Suporte a Mídia

Anexos de áudio do Discord são automaticamente transcritos se um modelo ASR estiver configurado. Outros anexos (imagens, arquivos) são baixados e incluídos como contexto.

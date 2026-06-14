---
id: telegram
title: Telegram
---

# Telegram

O Telegram é o canal **recomendado**. É fácil de configurar e suporta transcrição de voz.

## Configuração

### 1. Criar um Bot

- Abra o Telegram e pesquise por `@BotFather`
- Envie `/newbot` e siga as instruções
- Copie o token do bot

### 2. Obter Seu ID de Usuário

- Envie uma mensagem para `@userinfobot` no Telegram
- Copie seu ID de usuário

### 3. Configurar

#### 1. Configuracao pelo WebUI

Recomendamos priorizar a configuracao pelo WebUI, pois e mais rapida e conveniente.

![WebUI Telegram Connection Interface](/img/channels/webui_telegram.png)

Preencha, nesta ordem, o Bot Token (`YOUR_BOT_TOKEN`) e as Origens Permitidas (`YOUR_USER_ID`), depois clique em **Salvar**.

#### 2. Arquivos de Configuracao

Edite `~/.picoclaw/.security.yml`:

```yaml
telegram:
  settings:
    token: YOUR_BOT_TOKEN
```

Edite `~/.picoclaw/config.json`:

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "allow_from": [
        "YOUR_USER_ID"
      ],
      "reasoning_channel_id": "",
      "group_trigger": {}
    }
  }
}
```

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `enabled` | bool | Ativar/desativar o canal |
| `token` | string | Token do bot obtido no @BotFather |
| `base_url` | string | URL personalizada do servidor da Telegram Bot API (opcional) |
| `proxy` | string | URL de proxy HTTP/SOCKS (opcional, também lê a variável de ambiente `HTTP_PROXY`) |
| `allow_from` | array | Lista de IDs de usuários permitidos (vazio = permitir todos) |
| `reasoning_channel_id` | string | Direcionar a saída de raciocínio para um chat separado |
| `group_trigger` | object | Configurações de acionamento em chat de grupo (`mention_only`, `prefixes`) |

### 4. Executar

```bash
picoclaw gateway
```

## Transcrição de Voz

Mensagens de voz do Telegram podem ser transcritas automaticamente usando o Whisper da Groq:

```json
{
  "model_list": [
    {
      "model_name": "whisper",
      "model": "groq/whisper-large-v3",
      "api_key": "gsk_..."
    }
  ]
}
```

Obtenha uma chave de API Groq gratuita em [console.groq.com](https://console.groq.com).

## Solução de Problemas

**"Conflict: terminated by other getUpdates"**: Apenas uma instância de `picoclaw gateway` pode ser executada por vez. Encerre quaisquer outras instâncias.

**Proxy**: Se o Telegram estiver bloqueado na sua região, use o campo `proxy`:

```json
{
  "channels": {
    "telegram": {
      "proxy": "socks5://127.0.0.1:1080"
    }
  }
}
```

## Comandos do Bot

O canal Telegram registra estes comandos integrados do bot:

| Comando | Descrição |
| --- | --- |
| `/start` | Mensagem de saudação |
| `/help` | Exibir texto de ajuda |
| `/show [model\|channel]` | Mostrar configuração atual |
| `/list [models\|channels]` | Listar opções disponíveis |

## Suporte a Respostas Citadas

Quando um usuário responde a uma mensagem no Telegram (usando o recurso embutido de "Reply"), o PicoClaw inclui automaticamente a mensagem citada como contexto para o agente. Isso funciona tanto para mensagens do usuário quanto para respostas anteriores do próprio bot:

- **Texto**: O texto da mensagem citada é prefixado à nova mensagem do usuário no formato `[quoted user/assistant message from author]: ...`
- **Mídia**: Se a mensagem citada contiver voz ou áudio, esses arquivos também são baixados e incluídos na entrada do agente
- **Detecção de papel**: O bot distingue se a mensagem citada veio de um usuário, do próprio bot (assistente) ou de outro bot

Isso permite que o agente entenda o contexto da conversa mesmo quando as mensagens não são enviadas consecutivamente.

## Suporte a Mídia

O bot lida com fotos, arquivos de áudio, documentos e mensagens de voz. Mensagens de voz são transcritas se um modelo Whisper estiver configurado (veja [Transcrição de Voz](#transcrição-de-voz)).

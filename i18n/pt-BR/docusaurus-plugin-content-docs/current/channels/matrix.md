---
id: matrix
title: Matrix
---

# Matrix

O [Matrix](https://matrix.org/) é um protocolo de comunicação aberto e descentralizado. O PicoClaw se integra a homeservers Matrix, com suporte a mensagens de texto e mídia, chats em grupo, indicadores de digitação e entrada automática em salas para as quais for convidado.

## Configuração

### 1. Criar uma conta Matrix para o bot

Crie uma conta Matrix dedicada para o seu bot no homeserver de sua preferência (por exemplo, matrix.org ou um servidor auto-hospedado).

### 2. Obter um access token

Você pode obter um access token fazendo login pela API de cliente do Matrix:

```bash
curl -X POST "https://matrix.org/_matrix/client/v3/login" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "m.login.password",
    "identifier": {"type": "m.id.user", "user": "your-bot-username"},
    "password": "your-bot-password"
  }'
```

Copie o `access_token` da resposta.

### 3. Configurar o PicoClaw

```json
{
  "channels": {
    "matrix": {
      "enabled": true,
      "homeserver": "https://matrix.org",
      "user_id": "@your-bot:matrix.org",
      "access_token": "YOUR_MATRIX_ACCESS_TOKEN",
      "device_id": "",
      "join_on_invite": true,
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
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

### 4. Executar

```bash
picoclaw gateway
```

O bot vai se conectar ao homeserver e começar a escutar mensagens. Se `join_on_invite` estiver ativado, ele entrará automaticamente em qualquer sala para a qual for convidado.

## Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `homeserver` | string | Sim | URL do homeserver Matrix (ex.: `https://matrix.org`) |
| `user_id` | string | Sim | ID de usuário Matrix do bot (ex.: `@bot:matrix.org`) |
| `access_token` | string | Sim | Access token do bot |
| `device_id` | string | Não | Device ID Matrix opcional |
| `join_on_invite` | bool | Não | Entrar automaticamente nas salas quando convidado (padrão: false) |
| `allow_from` | array | Não | Whitelist de IDs de usuários Matrix (vazio = permitir todos) |
| `group_trigger` | object | Não | Configurações de acionamento em grupo (veja [Campos Comuns de Canal](../#common-channel-fields)) |
| `placeholder` | object | Não | Configuração de mensagem placeholder (`enabled`, `text`) |
| `reasoning_channel_id` | string | Não | Direcionar a saída de raciocínio para uma sala separada |

## Recursos Suportados

- **Mensagens de texto** — Envio e recebimento de mensagens de texto com suporte a Markdown
- **Formatação HTML aprimorada** — Respostas em Markdown são convertidas para HTML usando um parser compatível com CommonMark e saída XHTML, garantindo renderização confiável de listas, blocos de código e outras formatações sem exigir linhas em branco antes de elementos de bloco
- **Mensagens de mídia** — Download de imagens/áudio/vídeo/arquivos recebidos e upload de mídia enviada
- **Transcrição de áudio** — Áudios recebidos são normalizados no fluxo de transcrição existente (`[audio: ...]`)
- **Regras de acionamento em grupo** — Suporta modo somente-menção e prefixos por palavra-chave
- **Indicador de digitação** — Mostra o estado `m.typing` durante o processamento
- **Mensagens placeholder** — Envia uma mensagem temporária (ex.: "Thinking...") e depois a substitui pela resposta real
- **Auto-join** — Entra automaticamente nas salas quando convidado (pode ser desativado)

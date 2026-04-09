---
id: vk
title: VK (VKontakte)
---

# VK (VKontakte)

Conecte o PicoClaw ao [VK](https://vk.com) usando a Bots Long Poll API. Suporta mensagens de texto, anexos de mídia, transcrição de voz e chats em grupo.

## Configuração

### 1. Criar uma Comunidade no VK

- Acesse o [VK](https://vk.com) e faça login
- Crie uma nova comunidade ou use uma existente
- Anote o Community ID (encontrado na URL da comunidade, ex.: `public123456789`)

### 2. Ativar Mensagens

- Acesse a página da sua comunidade
- Clique em **Manage** → **Messages** → **Community Messages**
- Ative as mensagens da comunidade

### 3. Criar Access Token

- Acesse **Manage** → **API usage** → **Access tokens**
- Clique em **Create token**
- Selecione as permissões:
  - `messages` — obrigatório para enviar e receber mensagens
  - `photos` — opcional, para anexos de foto
  - `docs` — opcional, para anexos de documento
- Copie o access token gerado

### 4. Configurar

```json
{
  "channels": {
    "vk": {
      "enabled": true,
      "token": "NOT_HERE",
      "group_id": 123456789,
      "allow_from": ["123456789"]
    }
  }
}
```

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `enabled` | bool | Ativar/desativar o canal |
| `token` | string | Defina como `NOT_HERE` — armazenado de forma segura (veja abaixo) |
| `group_id` | int | Community ID do VK (numérico) |
| `allow_from` | array | IDs de usuários permitidos (vazio = permitir todos) |
| `reasoning_channel_id` | string | Direcionar a saída de raciocínio para um chat separado |
| `group_trigger` | object | Configurações de acionamento em grupo (`mention_only`, `prefixes`) |

### Armazenamento do Token

O token do VK não deve ser armazenado diretamente no arquivo de configuração. Use um destes métodos:

- **Variável de ambiente**: `PICOCLAW_CHANNELS_VK_TOKEN`
- **Armazenamento seguro**: criptografia de credenciais integrada do PicoClaw (veja [Criptografia de Credenciais](/docs/credential-encryption))

```bash
export PICOCLAW_CHANNELS_VK_TOKEN="vk1.a.abc123..."
```

### 5. Executar

```bash
picoclaw gateway
```

## Recursos

### Anexos Suportados

| Tipo | Exibição |
| --- | --- |
| Foto | `[photo]` |
| Vídeo | `[video]` |
| Áudio | `[audio]` |
| Mensagem de voz | `[voice]` (suporta transcrição) |
| Documento | `[document: filename]` |
| Sticker | `[sticker]` |

### Suporte a Voz

O canal VK oferece suporte tanto a ASR (speech-to-text) quanto a TTS (text-to-speech). Para habilitar a transcrição de voz, configure um modelo de voz na sua configuração de providers.

### Chat em Grupo

Controle o comportamento do bot em chats de grupo com `group_trigger`:

```json
{
  "channels": {
    "vk": {
      "enabled": true,
      "token": "NOT_HERE",
      "group_id": 123456789,
      "group_trigger": {
        "mention_only": false,
        "prefixes": ["/bot", "!bot"]
      }
    }
  }
}
```

- **Somente-menção**: o bot só responde quando mencionado
- **Modo prefixo**: o bot responde a mensagens que começam com os prefixos especificados
- **Padrão**: o bot responde a todas as mensagens

### Tamanho da Mensagem

O VK limita mensagens a 4000 caracteres. O PicoClaw divide automaticamente respostas mais longas.

## Solução de Problemas

- **Bot não responde**: verifique se o token é válido, se o `group_id` está correto e se o ID do usuário está em `allow_from` (quando configurado)
- **Erros de permissão**: certifique-se de que o token tem a permissão `messages`
- **Problemas em chat de grupo**: verifique a configuração de `group_trigger` e as permissões do bot no grupo

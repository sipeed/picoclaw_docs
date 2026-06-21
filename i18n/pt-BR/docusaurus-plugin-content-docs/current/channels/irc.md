---
id: irc
title: IRC
---

# IRC

O canal IRC conecta o PicoClaw a redes IRC usando uma conexão normal de cliente IRC. Ele suporta TLS, autenticação por senha/SASL, entrada em canais, gatilhos de grupo e tags de digitação IRCv3 quando o servidor anuncia `message-tags`.

## Configuração

```json
{
  "channels": {
    "irc": {
      "enabled": true,
      "server": "irc.libera.chat:6697",
      "tls": true,
      "nick": "picoclaw-bot",
      "channels": ["#mychannel"],
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "typing": {
        "enabled": false
      }
    }
  }
}
```

Depois de salvar a configuração, execute o gateway:

```bash
picoclaw gateway
```

## Referência de Configuração

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Habilita o canal IRC |
| `server` | string | `irc.libera.chat:6697` | Servidor IRC e porta |
| `tls` | bool | `true` | Conectar usando TLS |
| `nick` | string | `mybot` | Apelido do bot. Obrigatório. |
| `user` | string | `nick` | Nome de usuário IRC. Usa `nick` quando vazio. |
| `real_name` | string | `nick` | Nome real IRC. Usa `nick` quando vazio. |
| `password` | string | `""` | Senha do servidor, se necessária |
| `nickserv_password` | string | `""` | Campo de senha do NickServ mantido na configuração segura |
| `sasl_user` | string | `""` | Usuário SASL. SASL tem prioridade quando configurado. |
| `sasl_password` | string | `""` | Senha SASL, mantida na configuração segura |
| `channels` | string[] | `["#mychannel"]` | Canais para entrar após conectar |
| `request_caps` | string[] | `["server-time", "message-tags"]` | Capabilities IRCv3 solicitadas |
| `allow_from` | array | `[]` | Nicks IRC ou IDs de usuário permitidos. Array vazio permite todos. |
| `group_trigger` | object | `{ "mention_only": true }` | Exigir menção ou prefixos em mensagens de canal |
| `typing.enabled` | bool | `false` | Enviar tags IRCv3 `+typing` quando o servidor suportar |
| `reasoning_channel_id` | string | `""` | Direcionar raciocínio para um destino separado |

## Autenticação

Use `sasl_user` e `sasl_password` em redes que suportam SASL. Sem SASL, você pode configurar `password` para autenticação no servidor. `nickserv_password` é armazenado como configuração segura do canal, mas o conector IRC atual não envia comandos NickServ automaticamente.

Valores sensíveis podem ficar em `.security.yml` em vez de `config.json`.

## Observações de Comportamento

IRC é orientado a linhas, então o PicoClaw envia respostas com múltiplas linhas como mensagens IRC separadas. O canal usa um limite conservador de tamanho de mensagem para caber nos limites comuns de servidores IRC.

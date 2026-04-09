---
id: weixin
title: WeChat 
---


# 💬 Canal Weixin (WeChat Pessoal)

O PicoClaw permite conectar-se à sua conta pessoal do WeChat usando a API oficial iLink da Tencent.



## 🚀 Onboarding Rápido

A maneira mais fácil de configurar o canal Weixin é usando o comando interativo de onboarding:

```bash
picoclaw auth weixin
```

## 🖥️ Interface de Gerenciamento Web (WebUI)

O PicoClaw oferece uma interface web moderna onde você pode obter o QR code com um clique.

![Interface de Conexão WeChat via WebUI](/img/channels/webui_weixin.png)


Este comando vai:
1. Solicitar um QR code à API iLink e exibi-lo no seu terminal.
2. Aguardar que você escaneie o QR code com o app mobile do WeChat.
3. Após a aprovação, salvar automaticamente o access token gerado em `~/.picoclaw/config.json`.

Depois do onboarding, você pode iniciar o gateway:

```bash
picoclaw gateway
```

---

## ⚙️ Configuração

Você também pode configurar manualmente as regras de filtro em `config.json`, na seção `channels.weixin`.

```json
{
  "channels": {
    "weixin": {
      "enabled": true,
      "token": "YOUR_WEIXIN_TOKEN",
      "allow_from": [
        "user_id_1",
        "user_id_2"
      ],
      "proxy": ""
    }
  }
}
```

### Campos de Configuração

| Campo | Descrição |
|---|---|
| `enabled` | Defina como `true` para ativar o canal na inicialização. |
| `token` | O token de autenticação obtido via login por QR. |
| `allow_from` | (Opcional) Lista de IDs de usuários do WeChat permitidos a interagir com o bot. Se vazio, qualquer um que consiga enviar mensagens à conta conectada pode acionar o bot. |
| `proxy` | (Opcional) Endereço de proxy HTTP (ex.: `http://localhost:7890`) para ambientes em que a conexão com `ilinkai.weixin.qq.com` é restrita. |

## Persistência de Sessão

O PicoClaw persiste automaticamente os context tokens do WeChat em disco, de modo que as sessões de conversa sobrevivem a reinícios. Cada mensagem recebida carrega um `context_token` que vincula as respostas à conversa correta; esses tokens são salvos em `~/.picoclaw/channels/weixin/context-tokens/` e restaurados quando o gateway inicia. Isso significa que você pode reiniciar o PicoClaw sem perder a capacidade de responder a conversas em andamento.

## ⚠️ Observações Importantes

- **Apenas uma conta**: o token do iLink é vinculado a uma única sessão. Iniciar uma nova interação geralmente invalida tokens antigos caso outro dispositivo faça a autorização.
- **Limites de taxa de mensagens**: para evitar que sua conta seja restringida pelos sistemas anti-spam do WeChat, evite loops de acionamento ou broadcasts em alta frequência.

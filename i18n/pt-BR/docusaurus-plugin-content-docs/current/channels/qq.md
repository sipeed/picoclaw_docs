---
id: qq
title: QQ
---

# QQ

O PicoClaw suporta o QQ através da API oficial de bots da [Plataforma Aberta do QQ](https://q.qq.com/), usando o modo WebSocket para comunicação em tempo real.

## Configuração

### 1. Criar um Aplicativo de Bot

1. Acesse a [Plataforma Aberta do QQ](https://q.qq.com/#) e registre-se ou faça login
2. Clique em **Create Application** → selecione **Bot**
3. Preencha as informações do aplicativo e envie para revisão

### 2. Obter Credenciais

1. Depois que o aplicativo for aprovado, vá até o dashboard do aplicativo
2. Copie o **AppID** e o **AppSecret** na página de credenciais

### 3. Configurar o Modo Sandbox

:::info
Bots recém-criados entram por padrão em **modo sandbox**. Você precisa adicionar usuários e grupos de teste ao sandbox para que eles possam interagir com o bot.
:::

1. No dashboard do aplicativo, vá em **Sandbox Configuration**
2. Adicione seus usuários QQ de teste ao sandbox
3. Adicione grupos de teste ao sandbox
4. O bot só responderá aos usuários e grupos do sandbox até passar pela revisão

### 4. Configurar o PicoClaw

```json
{
  "channels": {
    "qq": {
      "enabled": true,
      "app_id": "YOUR_APP_ID",
      "app_secret": "YOUR_APP_SECRET",
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      },
      "reasoning_channel_id": ""
    }
  }
}
```

### 5. Executar

```bash
picoclaw gateway
```

## Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `app_id` | string | Sim | AppID do bot QQ |
| `app_secret` | string | Sim | AppSecret do bot QQ |
| `allow_from` | array | Não | Whitelist de IDs de usuários QQ (vazio = permitir todos) |
| `group_trigger` | object | Não | Configurações de acionamento em chat de grupo (veja [Campos Comuns dos Canais](../#common-channel-fields)) |
| `reasoning_channel_id` | string | Não | Direcionar a saída de raciocínio para um chat separado |

## Como Funciona

### Tipos de Mensagem

O PicoClaw lida com dois tipos de mensagens do bot QQ:

| Tipo | Cenário | Gatilho |
| --- | --- | --- |
| **C2C** | Chat privado (DM 1:1) | Qualquer mensagem do usuário |
| **GroupAT** | Chat de grupo | O usuário precisa @mencionar o bot |

### Comportamentos Principais

- **Chats de grupo exigem @menção**: Em chats de grupo, o bot só responde quando é @mencionado (intent GroupAT). Isso é imposto pela própria plataforma QQ.
- **Deduplicação de mensagens**: O PicoClaw rastreia os IDs de mensagens já processadas para evitar processamento duplicado
- **Renovação automática de token**: O SDK do bot gerencia automaticamente a renovação do access token
- **Modo WebSocket**: Usa a conexão WebSocket do SDK do QQ Bot para entrega de mensagens em tempo real

### Sandbox vs. Produção

| | Sandbox | Produção |
| --- | --- | --- |
| Acesso | Apenas usuários/grupos registrados no sandbox | Todos os usuários |
| Ativação | Padrão para bots novos | Após aprovação na revisão |
| Propósito | Desenvolvimento e testes | Deploy em produção |

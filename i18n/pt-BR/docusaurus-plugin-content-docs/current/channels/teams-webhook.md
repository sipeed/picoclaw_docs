---
id: teams-webhook
title: Microsoft Teams (Webhook)
---

# Microsoft Teams (Webhook)

O canal Teams Webhook é **somente saída**. Ele publica respostas do agente no Microsoft Teams via [webhooks de fluxo do Power Automate](https://learn.microsoft.com/pt-br/power-automate/), formatadas como Adaptive Cards.

Use este canal quando quiser enviar notificações, resumos ou alertas do PicoClaw para o Teams sem dar ao agente acesso de entrada às mensagens do Teams.

:::note Somente saída
O Teams Webhook não consegue receber mensagens nem iniciar conversas. Combine-o com outro canal (Telegram, Slack, etc.) se precisar de um loop de chat completo.
:::

## Configuração

### 1. Criar um Fluxo do Power Automate

1. Abra o [Power Automate](https://make.powerautomate.com/) e crie um novo fluxo
2. Use o template **"When a Teams webhook request is received"** (ou qualquer fluxo com gatilho HTTP que envie um Adaptive Card a um canal do Teams)
3. Após salvar, copie a URL do webhook gerada — algo como `https://prod-xx.westus.logic.azure.com/workflows/...`

:::tip Por que Power Automate?
A Microsoft descontinuou os incoming webhooks do conector legado do Office 365. Os fluxos do Power Automate são a substituição oficial e o único caminho que a biblioteca subjacente do PicoClaw suporta.
:::

### 2. Configurar o PicoClaw

Adicione em `~/.picoclaw/config.json`:

```json
{
  "channels": {
    "teams_webhook": {
      "enabled": true,
      "webhooks": {
        "default": {
          "webhook_url": "https://prod-xx.westus.logic.azure.com/workflows/...",
          "title": "Notificação PicoClaw"
        }
      }
    }
  }
}
```

Um destino `default` é **obrigatório**. O PicoClaw usa esse fallback sempre que uma mensagem chega sem um `ChatID` correspondente.

### 3. Múltiplos Destinos

Você pode registrar vários destinos de webhook e selecionar entre eles definindo `ChatID` na mensagem de saída:

```json
{
  "channels": {
    "teams_webhook": {
      "enabled": true,
      "webhooks": {
        "default": {
          "webhook_url": "https://.../canal-padrao",
          "title": "PicoClaw"
        },
        "alerts": {
          "webhook_url": "https://.../canal-alertas",
          "title": "Alertas PicoClaw"
        },
        "reports": {
          "webhook_url": "https://.../canal-relatorios",
          "title": "Relatórios Diários"
        }
      }
    }
  }
}
```

Quando o agente envia uma mensagem com `ChatID = "alerts"`, ela vai para o webhook de alertas. Valores `ChatID` desconhecidos caem para `default` com um aviso no log.

### 4. Guardar Segredos em `.security.yml`

URLs de webhook contêm tokens de autenticação. Mantenha-as fora do `config.json`:

`~/.picoclaw/.security.yml`:

```yaml
channels:
  teams_webhook:
    webhooks:
      default:
        webhook_url: "https://prod-xx.westus.logic.azure.com/workflows/..."
      alerts:
        webhook_url: "https://prod-xx.westus.logic.azure.com/workflows/..."
```

### 5. Executar

```bash
picoclaw gateway
```

## Referência de Campos

### `teams_webhook`

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `enabled` | bool | Sim | Habilita o canal |
| `webhooks` | map | Sim | Mapa de destinos nomeados de webhook. Deve conter uma chave `default`. |

### `webhooks.<name>`

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `webhook_url` | string | Sim | URL do fluxo do Power Automate. Deve ser HTTPS. |
| `title` | string | Não | Título mostrado no topo de todo Adaptive Card enviado por este destino. Padrão: `"PicoClaw Notification"`. |

## Formatação de Mensagens

As mensagens de saída são convertidas em Adaptive Cards com:

- **Título** — extraído do campo `title` do destino
- **Corpo** — conteúdo da mensagem como blocos de texto (suporta negrito, itálico, listas, links)
- **Tabelas** — tabelas Markdown (`| col | col |\n| --- | --- |\n| ... |`) são detectadas e renderizadas como elementos Adaptive Card Table nativos, já que TextBlocks do Teams não suportam tabelas Markdown
- **Largura total** — os cards são renderizados na largura total do canal Teams

O comprimento máximo do payload é de **24.000 caracteres**, deixando margem sob o limite de 28KB do webhook do Power Automate. Mensagens mais longas são truncadas.

## Tratamento de Erros

O PicoClaw classifica os erros HTTP retornados pelo webhook:

- **4xx (ex.: 401 Unauthorized, 404 Not Found)** — tratados como **permanentes**, não são retentados
- **5xx e erros de rede** — tratados como **temporários**, retentados com backoff

Os logs de erro deliberadamente omitem o payload bruto do erro para evitar vazar a URL do webhook nos arquivos de log.

## Limitações

- **Somente saída**: não consegue ler mensagens do Teams
- **Sem threads**: cada mensagem é um card autônomo
- **Sem upload de arquivos**: apenas texto + tabelas no corpo do Adaptive Card
- **Subconjunto de Adaptive Card**: TextBlocks renderizam negrito, itálico, listas com marcadores/numeradas e links — mas não cabeçalhos, imagens ou HTML arbitrário
- O roteamento específico do Teams (`expose_paths` e similares) deve ser feito dentro do fluxo do Power Automate

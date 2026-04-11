---
id: security-reference
title: Referência do .security.yml
---

# Referência do .security.yml

Use o `.security.yml` para armazenar valores sensíveis, mantendo a estrutura no `config.json`.

Para a versão `2` do schema de configuração, essa divisão é altamente recomendada:

- `config.json`: estrutura de modelos, roteamento, flags de habilitação de canais, configurações de comportamento
- `.security.yml`: chaves de API, tokens, segredos

## Como Funciona com o config.json

O PicoClaw carrega a configuração nesta ordem:

1. `config.json`
2. `.security.yml` (mesmo diretório do `config.json` ativo)
3. Variáveis de ambiente

Isso significa que a prioridade efetiva é:

1. Variáveis de ambiente
2. `.security.yml`
3. `config.json`

O `.security.yml` é uma camada de sobreposição (overlay), não uma configuração autônoma:

- Ele não substitui o `config.json`
- Deve conter apenas campos sensíveis
- Depende de entradas já definidas no `config.json` (especialmente `model_list`)

## Localização do Arquivo

- Caminho padrão da configuração: `~/.picoclaw/config.json`
- Caminho padrão do arquivo de segurança: `~/.picoclaw/.security.yml`

Se `PICOCLAW_CONFIG` apontar para um caminho customizado de configuração, o `.security.yml` também será carregado a partir do diretório desse arquivo de configuração.

Exemplo:

- `PICOCLAW_CONFIG=/etc/picoclaw/production.json`
- Caminho do arquivo de segurança: `/etc/picoclaw/.security.yml`

## Seções de Nível Superior no .security.yml

Importante: algumas seções do `.security.yml` mapeiam para caminhos aninhados no `config.json`.

| Seção no `.security.yml` | Mapeia para `config.json` |
| --- | --- |
| `model_list` | `model_list` |
| `channels` | `channels` |
| `web` | `tools.web` |
| `skills` | `tools.skills` |

## Regras de Mapeamento de Modelos

Para o schema v2:

- O `model_list[].api_key` do `config.json` é ignorado
- Use `model_list.<name>[:index].api_keys` no `.security.yml`

As chaves de `model_list` no `.security.yml` suportam duas formas:

1. Chave indexada (entrada exata): `<model_name>:<index>`
2. Chave base (fallback): `<model_name>`

Comportamento de resolução:

- O PicoClaw tenta primeiro `<model_name>:<index>`
- Se não encontrar, faz fallback para `<model_name>`

Use chaves indexadas quando você tiver múltiplas entradas com o mesmo `model_name`.

### Exemplo: uma chave por entrada com load balance

```yaml
model_list:
  loadbalanced-gpt-5.4:0:
    api_keys:
      - "sk-key-1"
  loadbalanced-gpt-5.4:1:
    api_keys:
      - "sk-key-2"
```

### Exemplo: chaves compartilhadas para o mesmo model_name

```yaml
model_list:
  loadbalanced-gpt-5.4:
    api_keys:
      - "sk-shared-1"
      - "sk-shared-2"
```

## Caminhos Sensíveis Suportados

Apenas os campos preparados com tags YAML são lidos a partir do `.security.yml`.

### model_list

| Caminho | Tipo |
| --- | --- |
| `model_list.<model_name_or_model_name:index>.api_keys` | `string[]` |

### channels

| Caminho | Tipo |
| --- | --- |
| `channels.telegram.token` | `string` |
| `channels.feishu.app_secret` | `string` |
| `channels.feishu.encrypt_key` | `string` |
| `channels.feishu.verification_token` | `string` |
| `channels.discord.token` | `string` |
| `channels.qq.app_secret` | `string` |
| `channels.dingtalk.client_secret` | `string` |
| `channels.slack.bot_token` | `string` |
| `channels.slack.app_token` | `string` |
| `channels.matrix.access_token` | `string` |
| `channels.line.channel_secret` | `string` |
| `channels.line.channel_access_token` | `string` |
| `channels.onebot.access_token` | `string` |
| `channels.wecom.secret` | `string` |
| `channels.weixin.token` | `string` |
| `channels.pico.token` | `string` |
| `channels.pico_client.token` | `string` |
| `channels.irc.password` | `string` |
| `channels.irc.nickserv_password` | `string` |
| `channels.irc.sasl_password` | `string` |
| `channels.vk.token` | `string` |
| `channels.teams_webhook.webhooks.<name>.webhook_url` | `string` |

### web (mapeia para `tools.web`)

| Caminho | Tipo |
| --- | --- |
| `web.brave.api_keys` | `string[]` |
| `web.tavily.api_keys` | `string[]` |
| `web.perplexity.api_keys` | `string[]` |
| `web.glm_search.api_key` | `string` |
| `web.baidu_search.api_key` | `string` |

### skills (mapeia para `tools.skills`)

| Caminho | Tipo |
| --- | --- |
| `skills.github.token` | `string` |
| `skills.clawhub.auth_token` | `string` |

## Formatos de Valores

Os valores sensíveis suportam os mesmos formatos de SecureString:

- Texto puro: `sk-...`
- Criptografado: `enc://...`
- Referência a arquivo: `file://filename.key`

Caminhos `file://` são resolvidos de forma relativa ao diretório de configuração e não podem sair desse diretório.

Consulte [Criptografia de Credenciais](../credential-encryption.md) para configuração do `enc://` e gerenciamento de chaves.

## Exemplo Recomendado em Conjunto

### `config.json`

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6"
    }
  ],
  "channels": {
    "telegram": {
      "enabled": true
    },
    "wecom": {
      "enabled": true,
      "bot_id": "YOUR_BOT_ID"
    }
  },
  "tools": {
    "web": {
      "brave": {
        "enabled": true
      }
    },
    "skills": {
      "github": {}
    }
  }
}
```

### `.security.yml`

```yaml
model_list:
  gpt-5.4:0:
    api_keys:
      - "sk-openai-..."
  claude-sonnet-4.6:0:
    api_keys:
      - "sk-ant-..."

channels:
  telegram:
    token: "123456:telegram-token"
  wecom:
    secret: "wecom-secret"

web:
  brave:
    api_keys:
      - "BSA-..."

skills:
  github:
    token: "ghp-..."
```

## Notas Operacionais

- Adicione `.security.yml` ao `.gitignore`
- Restrinja as permissões (`chmod 600 ~/.picoclaw/.security.yml`)
- Prefira o `.security.yml` para credenciais reais e mantenha o `config.json` compartilhável

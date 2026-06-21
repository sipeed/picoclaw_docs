---
id: config-reference
title: Referência Completa da Configuração
---

# Referência Completa da Configuração

Exemplo completo e anotado do `config.json`. Copie a partir de `config/config.example.json` no repositório.

`"version": 2` aqui significa **versão 2 do schema de configuração**, não uma versão de release do produto.

Para o gerenciamento diário de modelos, recomenda-se a Web UI. Use edição manual do JSON para templates de automação e fluxos de deployment avançados.

![Web UI Model Setup](/img/providers/webuimodel.png)

```json
{
  "version": 2,

  "agents": {
    "defaults": {
      "workspace": "~/.picoclaw/workspace",
      "restrict_to_workspace": true,
      "model_name": "gpt-5.4",
      "max_tokens": 8192,
      "context_window": 131072,
      "max_tool_iterations": 20,
      "summarize_message_threshold": 20,
      "summarize_token_percent": 75,
      "split_on_marker": false,
      "tool_feedback": {
        "enabled": false,
        "max_args_length": 300,
        "separate_messages": false
      }
    }
  },

  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "sk-your-openai-key",
      "api_base": "https://api.openai.com/v1"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_key": "sk-ant-your-key",
      "api_base": "https://api.anthropic.com/v1",
      "thinking_level": "high"
    },
    {
      "model_name": "azure-gpt5",
      "model": "azure/my-gpt5-deployment",
      "api_key": "your-azure-api-key",
      "api_base": "https://your-resource.openai.azure.com"
    },
    {
      "model_name": "gemini",
      "model": "antigravity/gemini-2.0-flash",
      "auth_method": "oauth"
    },
    {
      "model_name": "deepseek",
      "model": "deepseek/deepseek-chat",
      "api_key": "sk-your-deepseek-key"
    },
    {
      "model_name": "loadbalanced-gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "sk-key1",
      "api_base": "https://api1.example.com/v1"
    },
    {
      "model_name": "loadbalanced-gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "sk-key2",
      "api_base": "https://api2.example.com/v1"
    }
  ],

  "channels": {
    "telegram": {
      "enabled": false,
      "token": "YOUR_TELEGRAM_BOT_TOKEN",
      "base_url": "",
      "proxy": "",
      "allow_from": ["YOUR_USER_ID"],
      "use_markdown_v2": false,
      "reasoning_channel_id": ""
    },
    "discord": {
      "enabled": false,
      "token": "YOUR_DISCORD_BOT_TOKEN",
      "proxy": "",
      "allow_from": [],
      "group_trigger": {
        "mention_only": false
      },
      "reasoning_channel_id": ""
    },
    "qq": {
      "enabled": false,
      "app_id": "YOUR_QQ_APP_ID",
      "app_secret": "YOUR_QQ_APP_SECRET",
      "allow_from": [],
      "placeholder": {
        "enabled": true,
        "text": ["Thinking...", "Processing...", "Typing..."]
      },
      "reasoning_channel_id": ""
    },
    "maixcam": {
      "enabled": false,
      "host": "0.0.0.0",
      "port": 18790,
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "whatsapp": {
      "enabled": false,
      "bridge_url": "ws://localhost:3001",
      "use_native": false,
      "session_store_path": "",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "feishu": {
      "enabled": false,
      "app_id": "",
      "app_secret": "",
      "encrypt_key": "",
      "verification_token": "",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "dingtalk": {
      "enabled": false,
      "client_id": "YOUR_CLIENT_ID",
      "client_secret": "YOUR_CLIENT_SECRET",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "slack": {
      "enabled": false,
      "bot_token": "xoxb-YOUR-BOT-TOKEN",
      "app_token": "xapp-YOUR-APP-TOKEN",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "line": {
      "enabled": false,
      "channel_secret": "YOUR_LINE_CHANNEL_SECRET",
      "channel_access_token": "YOUR_LINE_CHANNEL_ACCESS_TOKEN",
      "webhook_path": "/webhook/line",
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "onebot": {
      "enabled": false,
      "ws_url": "ws://127.0.0.1:3001",
      "access_token": "",
      "reconnect_interval": 5,
      "group_trigger_prefix": [],
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "wecom": {
      "enabled": false,
      "bot_id": "YOUR_BOT_ID",
      "secret": "YOUR_SECRET",
      "websocket_url": "wss://openws.work.weixin.qq.com",
      "send_thinking_message": true,
      "allow_from": [],
      "reasoning_channel_id": ""
    },
    "matrix": {
      "enabled": false,
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
        "text": ["Thinking...", "Processing...", "Typing..."]
      },
      "reasoning_channel_id": ""
    },
    "pico": {
      "enabled": false,
      "token": "YOUR_PICO_TOKEN",
      "allow_token_query": false,
      "allow_origins": [],
      "ping_interval": 30,
      "read_timeout": 60,
      "max_connections": 100,
      "allow_from": []
    },
    "irc": {
      "enabled": false,
      "server": "irc.libera.chat:6697",
      "tls": true,
      "nick": "mybot",
      "channels": ["#mychannel"],
      "request_caps": ["server-time", "message-tags"],
      "allow_from": [],
      "group_trigger": {
        "mention_only": true
      }
    }
  },

  "tools": {
    "allow_read_paths": null,
    "allow_write_paths": null,
    "web": {
      "enabled": true,
      "prefer_native": true,
      "fetch_limit_bytes": 10485760,
      "format": "plaintext",
      "brave": {
        "enabled": false,
        "api_key": "YOUR_BRAVE_API_KEY",
        "api_keys": ["YOUR_BRAVE_API_KEY"],
        "max_results": 5
      },
      "provider": "auto",
      "sogou": {
        "enabled": true,
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": false,
        "max_results": 5
      },
      "perplexity": {
        "enabled": false,
        "api_keys": ["pplx-xxx"],
        "max_results": 5
      },
      "private_host_whitelist": []
    },
    "mcp": {
      "enabled": false,
      "servers": {
        "context7": {
          "enabled": false,
          "type": "http",
          "url": "https://mcp.context7.com/mcp"
        },
        "filesystem": {
          "enabled": false,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
        },
        "github": {
          "enabled": false,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-github"],
          "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN" }
        }
      }
    },
    "cron": {
      "exec_timeout_minutes": 5
    },
    "exec": {
      "enabled": true,
      "enable_deny_patterns": true,
      "custom_deny_patterns": null,
      "custom_allow_patterns": null
    },
    "skills": {
      "registries": {
        "clawhub": {
          "enabled": true,
          "base_url": "https://clawhub.ai",
          "search_path": "/api/v1/search",
          "skills_path": "/api/v1/skills",
          "download_path": "/api/v1/download"
        }
      }
    },
    "serial": {
      "enabled": false
    }
  },

  "heartbeat": {
    "enabled": true,
    "interval": 30
  },

  "devices": {
    "enabled": false,
    "monitor_usb": true
  },

  "gateway": {
    "host": "127.0.0.1",
    "port": 18790,
    "log_level": "warn"
  }
}
```

## Referência de Campos

### `version`

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `version` | int | `0` | Versão do schema de configuração. A versão atual é `2`. Novas configurações devem definir isso como `2`. |

### `agents.defaults`

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `workspace` | string | `~/.picoclaw/workspace` | Diretório de trabalho do agente (respeita `PICOCLAW_HOME`) |
| `restrict_to_workspace` | bool | `true` | Restringe acesso a arquivos/comandos ao workspace |
| `allow_read_outside_workspace` | bool | `false` | Permite leitura de arquivos fora do workspace (quando `restrict_to_workspace` está ativo) |
| `model_name` | string | — | Nome do modelo padrão (deve corresponder a uma entrada em `model_list`) |
| `model` | string | — | **Descontinuado**: use `model_name` no lugar |
| `model_fallbacks` | array | [] | Nomes de modelos de fallback testados em ordem se o primário falhar |
| `max_tokens` | int | 32768 | Máximo de tokens por resposta |
| `context_window` | int | 0 | Sobrescrita opcional da janela de contexto. `0` usa o padrão do provider/modelo. |
| `temperature` | float | — | Temperatura do LLM (omita para usar o padrão do provedor) |
| `max_tool_iterations` | int | 50 | Máximo de iterações de chamadas de ferramentas por requisição |
| `summarize_message_threshold` | int | 20 | Limite de quantidade de mensagens que pode acionar resumo |
| `summarize_token_percent` | int | 75 | Percentual de uso de contexto que pode acionar resumo |
| `max_media_size` | int | 20971520 | Tamanho máximo de arquivo de mídia em bytes (padrão 20MB) |
| `image_model` | string | — | Nome do modelo para geração de imagens |
| `image_model_fallbacks` | array | [] | Modelos de fallback para imagens |
| `tool_feedback.enabled` | bool | `false` | Mostra progresso/argumentos de ferramentas nos canais de chat |
| `tool_feedback.max_args_length` | int | 300 | Tamanho máximo da prévia de argumentos no feedback de ferramentas |
| `tool_feedback.separate_messages` | bool | `false` | Envia cada atualização como mensagem separada em vez de editar uma mensagem de progresso |
| `split_on_marker` | bool | `false` | Divide mensagens de saída no marcador `&lt;|[SPLIT]|&gt;` |
| `routing` | object | — | Configurações de roteamento inteligente de modelos (veja abaixo) |

#### `routing`

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Habilitar roteamento inteligente de modelos |
| `light_model` | string | — | Nome do modelo (do `model_list`) a ser usado para tarefas simples |
| `threshold` | float | — | Score de complexidade no intervalo [0,1]; mensagens com score >= threshold usam o modelo primário, abaixo usam o `light_model` |

Quando habilitado, o PicoClaw pontua cada mensagem recebida com base em características estruturais (tamanho, blocos de código, histórico de chamadas de ferramentas, profundidade da conversa, anexos) e roteia mensagens simples para um modelo mais leve/barato.

### `model_list[]`

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `model_name` | string | Sim | Alias usado em `agents.defaults.model_name` |
| `model` | string | Sim | Formato `vendor/model-id`. O prefixo `vendor/` é usado apenas para resolução de protocolo/API base e não é enviado ao upstream como está. |
| `api_keys` | array | Depende | Chaves de autenticação da API (array; suporta múltiplas chaves para load balancing). Obrigatório para provedores baseados em HTTP, a menos que `api_base` aponte para um servidor local. |
| `api_key` | string | Legado | Campo de chave única ainda aceito por migrações e exemplos; prefira `api_keys` ou `.security.yml` para credenciais persistidas. |
| `api_base` | string | Não | Sobrescreve a URL base da API padrão |
| `enabled` | bool | Não | Indica se esta entrada de modelo está ativa. Durante a migração, o padrão é `true` para modelos com chaves de API ou nomeados `local-model`. Defina como `false` para desabilitar um modelo sem remover sua configuração. |
| `auth_method` | string | Não | Método de autenticação (ex.: `oauth`) |
| `proxy` | string | Não | Proxy HTTP/SOCKS para este modelo |
| `request_timeout` | int | Não | Timeout de requisição em segundos; `<=0` usa o padrão de 120s |
| `rpm` | int | Não | Limite de taxa (requisições por minuto) |
| `max_tokens_field` | string | Não | Sobrescreve o nome do campo de max tokens nas requisições da API |
| `connect_mode` | string | Não | Sobrescrita do modo de conexão |
| `workspace` | string | Não | Sobrescrita de workspace por modelo |
| `thinking_level` | string | Não | Nível de extended thinking: `off`, `low`, `medium`, `high`, `xhigh`, ou `adaptive` |
| `fallbacks` | array | Não | Nomes de modelos de fallback para failover |
| `extra_body` | object | Não | Campos adicionais a injetar no corpo da requisição da API |
| `custom_headers` | object | Não | Cabeçalhos HTTP adicionais a injetar em toda requisição a este provider (apenas providers baseados em HTTP) |
| `user_agent` | string | Não | Sobrescrever o HTTP User-Agent usado nas requisições ao provider |

:::note Comportamento de API Key no Schema V2
Na versão V2 do schema de configuração, `model_list[].api_key` em `config.json` é ignorado. Use `api_keys` e prefira armazenar credenciais reais em `.security.yml`. Durante a migração de V0/V1, os campos legados `api_key` e `api_keys` são mesclados automaticamente em `api_keys`. As chaves de API podem usar formatos `SecureString`: texto puro, `enc://<base64>`, ou `file://<path>`. Consulte [Credential Encryption](../credential-encryption.md).
:::

### `gateway`

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `host` | string | `127.0.0.1` | Host de escuta do gateway |
| `port` | int | 18790 | Porta de escuta do gateway |
| `log_level` | string | `warn` | Verbosidade do log: `debug`, `info`, `warn`, `error`, `fatal`. Também pode ser definido via variável de ambiente `PICOCLAW_LOG_LEVEL`. |
| `hot_reload` | bool | `false` | Habilita hot-reload de mudanças na configuração |

Defina `host: "0.0.0.0"` para tornar o gateway acessível a partir de outros dispositivos.

### Campos Comuns de Canais

Todos os canais suportam estes campos:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `enabled` | bool | Habilitar/desabilitar o canal |
| `allow_from` | array | IDs de usuários autorizados a usar o bot (vazio = permitir todos) |
| `reasoning_channel_id` | string | Canal/chat dedicado para rotear saída de raciocínio |
| `group_trigger` | object | Configurações de gatilho para chats em grupo (veja abaixo) |
| `placeholder` | object | Configurações de mensagem de placeholder (veja abaixo) |
| `typing` | object | Configurações do indicador de digitação (veja abaixo) |

### Canais Pico e IRC

O PicoClaw v0.2.8 adiciona configuração de primeira classe para o canal WebSocket Pico nativo e para IRC:

| Canal | Campos principais | Observações |
| --- | --- | --- |
| `pico` | `token`, `allow_token_query`, `allow_origins`, `ping_interval`, `read_timeout`, `write_timeout`, `max_connections` | Servidor WebSocket nativo para clientes personalizados e Web UI. |
| `pico_client` | `url`, `token`, `session_id`, `ping_interval`, `read_timeout` | Modo cliente outbound para conectar a um servidor Pico remoto. |
| `irc` | `server`, `tls`, `nick`, `user`, `real_name`, `password`, `nickserv_password`, `sasl_user`, `sasl_password`, `channels`, `request_caps` | Conexão de cliente IRC com TLS/SASL e tags de digitação opcionais. |

#### `group_trigger`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `mention_only` | bool | Responder apenas quando mencionado com @ em grupos |
| `prefixes` | array | Prefixos de palavras-chave que acionam o bot em grupos |

#### `placeholder`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `enabled` | bool | Habilitar mensagens de placeholder |
| `text` | string | Texto de placeholder exibido durante o processamento (ex.: "Thinking...") |

Suportado por: Feishu, Slack, Matrix.

#### `typing`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `enabled` | bool | Mostrar indicador de digitação durante o processamento |

Suportado por: Slack, Matrix.

## Configuração de Segurança

### Arquivo .security.yml

O PicoClaw suporta um arquivo dedicado `.security.yml` para credenciais sensíveis (chaves de API, tokens, secrets). Ele é carregado a partir do mesmo diretório do `config.json` ativo (incluindo caminhos customizados definidos por `PICOCLAW_CONFIG`).

### Ordem de Prioridade das Chaves

Ao resolver credenciais, o PicoClaw aplica os valores nesta ordem:

1. **Variáveis de ambiente**: Prioridade mais alta (`env.Parse` roda após o carregamento dos arquivos)
2. **.security.yml**: Sobrescreve valores do mesmo caminho em `config.json`
3. **config.json**: Valores base

Para `model_list` no schema V2, o `api_key` em `config.json` é ignorado; use `.security.yml` + `api_keys`.

Para os caminhos campo a campo do `.security.yml`, regras de mapeamento e exemplos completos, consulte [`.security.yml Reference`](./security-reference.md).

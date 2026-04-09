---
id: tools
title: Configuração de Ferramentas
---

# Configuração de Ferramentas

A configuração de ferramentas do PicoClaw fica no campo `tools` do `config.json`.

```json
{
  "tools": {
    "web": { ... },
    "mcp": { ... },
    "exec": { ... },
    "cron": { ... },
    "skills": { ... }
  }
}
```

## Filtragem de Dados Sensíveis

Antes que os resultados das ferramentas sejam enviados para o LLM, o PicoClaw pode filtrar valores sensíveis (chaves de API, tokens, secrets) da saída. Isso evita que o LLM veja as próprias credenciais.

Veja [Sensitive Data Filtering](/docs/sensitive-data-filtering) para a documentação completa.

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `filter_sensitive_data` | bool | `true` | Habilitar/desabilitar a filtragem |
| `filter_min_length` | int | `8` | Tamanho mínimo do conteúdo para acionar a filtragem |

## Ferramentas Web

As ferramentas web são usadas para busca e fetching na web.

No schema de configuração `2`, `brave`, `tavily`, e `perplexity` usam `api_keys` (array). O campo `api_key` destas em `config.json` é ignorado.

### Web Fetcher

Configurações gerais para buscar e processar o conteúdo de páginas web.

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | true | Habilitar a capacidade de fetching de páginas |
| `fetch_limit_bytes` | int | 10485760 | Tamanho máximo do payload da página a ser buscado, em bytes (padrão: 10MB) |
| `format` | string | `"plaintext"` | Formato de saída do conteúdo obtido. Opções: `plaintext` ou `markdown` (recomendado) |

### Brave Search

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | false | Habilitar busca Brave |
| `api_keys` | string[] | — | Uma ou mais chaves de API do Brave Search para rotação |
| `max_results` | int | 5 | Número máximo de resultados |

Obtenha uma chave de API gratuita em [brave.com/search/api](https://brave.com/search/api) (2000 consultas gratuitas/mês).

### DuckDuckGo

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | true | Habilitar busca DuckDuckGo |
| `max_results` | int | 5 | Número máximo de resultados |

O DuckDuckGo é habilitado por padrão e não requer chave de API.

### Baidu Search

O Baidu Search usa a [Qianfan AI Search API](https://cloud.baidu.com/doc/qianfan-api/s/Wmbq4z7e5), que é baseada em IA e otimizada para consultas em chinês.

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | false | Habilitar Baidu Search |
| `api_key` | string | — | Chave de API do Qianfan |
| `base_url` | string | `https://qianfan.baidubce.com/v2/ai_search/web_search` | URL da API do Baidu Search |
| `max_results` | int | 5 | Número máximo de resultados |

```json
{
  "tools": {
    "web": {
      "baidu_search": {
        "enabled": true,
        "api_key": "YOUR_BAIDU_QIANFAN_API_KEY",
        "max_results": 10
      }
    }
  }
}
```

### Perplexity

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | false | Habilitar busca Perplexity |
| `api_keys` | string[] | — | Uma ou mais chaves de API do Perplexity para rotação |
| `max_results` | int | 5 | Número máximo de resultados |

### Tavily

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | false | Habilitar busca Tavily |
| `api_keys` | string[] | — | Uma ou mais chaves de API do Tavily para rotação |
| `base_url` | string | — | URL base customizada da API Tavily |
| `max_results` | int | 5 | Número máximo de resultados |

### SearXNG

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | false | Habilitar busca SearXNG |
| `base_url` | string | `http://localhost:8888` | URL da instância SearXNG |
| `max_results` | int | 5 | Número máximo de resultados |

### GLM (智谱)

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | false | Habilitar GLM Search |
| `api_key` | string | — | Chave de API do GLM |
| `base_url` | string | `https://open.bigmodel.cn/api/paas/v4/web_search` | URL da API do GLM Search |
| `search_engine` | string | `search_std` | Tipo de search engine |
| `max_results` | int | 5 | Número máximo de resultados |

### Proxy Web

Todas as ferramentas web (busca e fetch) podem usar um proxy compartilhado:

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `proxy` | string | — | URL do proxy para todas as ferramentas web (http, https, socks5) |
| `fetch_limit_bytes` | int64 | 10485760 | Máximo de bytes a buscar por URL (padrão 10MB) |

### Configurações Web Adicionais

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `prefer_native` | bool | true | Preferir a busca nativa do provedor sobre os search engines configurados |
| `private_host_whitelist` | string[] | `[]` | Hosts privados/internos autorizados para web fetching |

### Parâmetros da Ferramenta `web_search`

Em tempo de execução, a ferramenta `web_search` aceita os seguintes parâmetros:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|----------|-------------|
| `query` | string | sim | String de consulta de busca |
| `count` | integer | não | Número de resultados a retornar. Padrão: `10`, máximo: `10` |
| `range` | string | não | Filtro opcional de tempo: `d` (dia), `w` (semana), `m` (mês), `y` (ano) |

Se `range` for omitido, o PicoClaw executa uma busca sem restrição.

**Exemplo de chamada do `web_search`:**

```json
{
  "query": "ai agent news",
  "count": 10,
  "range": "w"
}
```

### Exemplo de Configuração de Ferramentas Web

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "api_keys": ["YOUR_BRAVE_API_KEY"],
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": true,
        "max_results": 5
      },
      "baidu_search": {
        "enabled": false,
        "api_key": "YOUR_BAIDU_QIANFAN_API_KEY"
      },
      "perplexity": {
        "enabled": false,
        "api_keys": ["pplx-xxx"],
        "max_results": 5
      },
      "proxy": "socks5://127.0.0.1:1080"
    }
  }
}
```

## Ferramenta Exec

A ferramenta exec executa comandos shell em nome do agente.

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | true | Habilitar a ferramenta exec |
| `enable_deny_patterns` | bool | true | Habilitar bloqueio padrão de comandos perigosos |
| `custom_deny_patterns` | array | [] | Padrões de negação customizados (expressões regulares) |
| `custom_allow_patterns` | array | [] | Padrões de permissão customizados — comandos correspondentes ignoram as verificações de negação |

### Desabilitando a Ferramenta Exec

Para desabilitar completamente a ferramenta `exec`, defina `enabled` como `false`:

**Via arquivo de configuração:**
```json
{
  "tools": {
    "exec": {
      "enabled": false
    }
  }
}
```

**Via variável de ambiente:**
```bash
PICOCLAW_TOOLS_EXEC_ENABLED=false
```

> **Nota:** Quando desabilitada, o agente não conseguirá executar comandos shell. Isso também afeta a capacidade da ferramenta Cron de rodar comandos shell agendados.

### Padrões de Comandos Bloqueados por Padrão

Por padrão, o PicoClaw bloqueia estes comandos perigosos:

- Comandos de exclusão: `rm -rf`, `del /f/q`, `rmdir /s`
- Operações de disco: `format`, `mkfs`, `diskpart`, `dd if=`, escrita em dispositivos de bloco (`/dev/sd*`, `/dev/nvme*`, `/dev/mmcblk*`, etc.)
- Operações de sistema: `shutdown`, `reboot`, `poweroff`
- Substituição de comandos: `$()`, `${}`, backticks
- Pipe para shell: `| sh`, `| bash`
- Escalação de privilégios: `sudo`, `chmod`, `chown`
- Controle de processos: `pkill`, `killall`, `kill -9`
- Operações remotas: `curl | sh`, `wget | sh`, `ssh`
- Gerenciamento de pacotes: `apt`, `yum`, `dnf`, `npm install -g`, `pip install --user`
- Containers: `docker run`, `docker exec`
- Git: `git push`, `git force`
- Outros: `eval`, `source *.sh`

### Padrões de Permissão Customizados

Use `custom_allow_patterns` para permitir explicitamente comandos que seriam bloqueados pelos padrões de negação:

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": ["^git push origin main$"]
    }
  }
}
```

### Limitação Arquitetural Conhecida

O exec guard valida apenas o comando de nível mais alto enviado ao PicoClaw. Ele **não** inspeciona recursivamente processos filhos criados por build tools ou scripts depois que o comando inicia.

Exemplos de workflows que podem burlar o guard do comando direto uma vez que o comando inicial é permitido:

- `make run`
- `go run ./cmd/...`
- `cargo run`
- `npm run build`

Isso significa que o guard é útil para bloquear comandos diretos obviamente perigosos, mas **não** é um sandbox completo para pipelines de build não revisados. Se o seu modelo de ameaça inclui código não confiável no workspace, use isolamento mais forte como containers, VMs, ou um fluxo de aprovação em torno dos comandos de build-and-run.

### Exemplo de Configuração do Exec

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_deny_patterns": ["\\brm\\s+-r\\b", "\\bkillall\\s+python"],
      "custom_allow_patterns": []
    }
  }
}
```

## Ferramenta Cron

A ferramenta cron é usada para agendar tarefas periódicas.

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | true | Registra a ferramenta cron disponível para o agente |
| `allow_command` | bool | true | Permite jobs de comando sem confirmação adicional |
| `exec_timeout_minutes` | int | 5 | Timeout de execução em minutos (0 = sem limite) |

Para tipos de schedule, modos de execução (`deliver`, turno de agente, e jobs de comando), persistência, e os gates de segurança de comando atuais, veja [Scheduled Tasks and Cron Jobs](/docs/cron).

## Ferramenta Reaction

A ferramenta reaction adiciona uma reação (emoji) a uma mensagem. Ela é registrada automaticamente e não tem opções de configuração.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|-------------|
| `message_id` | string | Não | ID da mensagem alvo; por padrão, a mensagem recebida atual |
| `channel` | string | Não | Canal alvo (telegram, whatsapp, etc.) |
| `chat_id` | string | Não | ID do chat/usuário alvo |

Quando todos os parâmetros opcionais são omitidos, a ferramenta reage à mensagem recebida atual no canal atual.

## MCP (Model Context Protocol)

O PicoClaw suporta servidores MCP para estender as capacidades do agente com ferramentas externas.

### Descoberta de Ferramentas (Lazy Loading)

Ao conectar-se a múltiplos servidores MCP, expor centenas de ferramentas simultaneamente pode esgotar a janela de contexto do LLM e aumentar os custos da API. O recurso **Discovery** resolve isso mantendo as ferramentas MCP *ocultas* por padrão.

Em vez de carregar todas as ferramentas, o LLM recebe uma ferramenta leve de busca (usando correspondência por palavra-chave BM25 ou Regex). Quando o LLM precisa de uma capacidade específica, ele busca na biblioteca oculta. Ferramentas correspondentes são então temporariamente "desbloqueadas" e injetadas no contexto por um número configurado de turnos (`ttl`).

### Config Global

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | false | Habilita a integração MCP globalmente |
| `discovery` | object | `{}` | Configuração do Tool Discovery (veja abaixo) |
| `servers` | object | `{}` | Mapa de nome do servidor para configuração do servidor |

### Config do Discovery (`discovery`)

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | false | Padrão global: se `true`, todas as ferramentas MCP ficam ocultas e são carregadas sob demanda via busca; se `false`, todas as ferramentas são carregadas no contexto. Servidores individuais podem sobrescrever isso com o campo `deferred` por servidor. |
| `ttl` | int | 5 | Número de turnos conversacionais em que uma ferramenta descoberta permanece desbloqueada |
| `max_search_results` | int | 5 | Número máximo de ferramentas retornadas por consulta de busca |
| `use_bm25` | bool | true | Habilita a ferramenta de busca por linguagem natural/palavra-chave (`tool_search_tool_bm25`). **Aviso**: consome mais recursos que a busca regex |
| `use_regex` | bool | false | Habilita a ferramenta de busca por padrão regex (`tool_search_tool_regex`) |

> **Nota:** Se `discovery.enabled` for `true`, você DEVE habilitar pelo menos um search engine (`use_bm25` ou `use_regex`), caso contrário a aplicação não iniciará.

### Config por Servidor

| Config | Tipo | Obrigatório | Descrição |
|--------|------|----------|-------------|
| `enabled` | bool | sim | Habilita este servidor MCP |
| `deferred` | bool | não | Sobrescreve o modo deferred apenas para este servidor. `true` = ferramentas ocultas e descobertas via busca; `false` = ferramentas sempre visíveis no contexto. Quando omitido, o valor global de `discovery.enabled` se aplica. |
| `type` | string | não | Tipo de transporte: `stdio`, `sse`, `http` |
| `command` | string | stdio | Comando executável para transporte stdio |
| `args` | array | não | Argumentos do comando para transporte stdio |
| `env` | object | não | Variáveis de ambiente para o processo stdio |
| `env_file` | string | não | Caminho para arquivo env do processo stdio |
| `url` | string | sse/http | URL do endpoint para transporte `sse`/`http` |
| `headers` | object | não | Headers HTTP para transporte `sse`/`http` |

### Comportamento do Transporte

- Se `type` for omitido, o transporte é detectado automaticamente:
    - `url` está definido -> `sse`
    - `command` está definido -> `stdio`
- `http` e `sse` usam ambos `url` + `headers` opcional.
- `env` e `env_file` são aplicados apenas a servidores `stdio`.

As ferramentas MCP são registradas com a convenção de nomenclatura `mcp_<server>_<tool>` e aparecem junto com as ferramentas nativas.

### Exemplos de Configuração MCP

#### 1) Servidor MCP stdio

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "servers": {
        "filesystem": {
          "enabled": true,
          "command": "npx",
          "args": [
            "-y",
            "@modelcontextprotocol/server-filesystem",
            "/tmp"
          ]
        }
      }
    }
  }
}
```

#### 2) Servidor MCP remoto SSE/HTTP

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "servers": {
        "remote-mcp": {
          "enabled": true,
          "type": "sse",
          "url": "https://example.com/mcp",
          "headers": {
            "Authorization": "Bearer YOUR_TOKEN"
          }
        }
      }
    }
  }
}
```

#### 3) Setup massivo de MCP com Tool Discovery habilitado

*Neste exemplo, o LLM verá apenas a `tool_search_tool_bm25`. Ele buscará e desbloqueará as ferramentas do Github ou Postgres dinamicamente apenas quando solicitado pelo usuário.*

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "discovery": {
        "enabled": true,
        "ttl": 5,
        "max_search_results": 5,
        "use_bm25": true,
        "use_regex": false
      },
      "servers": {
        "github": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-github"],
          "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
          }
        },
        "postgres": {
          "enabled": true,
          "command": "npx",
          "args": [
            "-y",
            "@modelcontextprotocol/server-postgres",
            "postgresql://user:password@localhost/dbname"
          ]
        },
        "slack": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-slack"],
          "env": {
            "SLACK_BOT_TOKEN": "YOUR_SLACK_BOT_TOKEN",
            "SLACK_TEAM_ID": "YOUR_SLACK_TEAM_ID"
          }
        }
      }
    }
  }
}
```

#### 4) Setup misto: sobrescrita de deferred por servidor

*O Discovery está habilitado globalmente, mas `filesystem` é fixado como sempre visível, enquanto `context7` segue o padrão global (deferred). `aws` escolhe explicitamente o modo deferred, mesmo sendo o mesmo que o padrão global.*

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "discovery": {
        "enabled": true,
        "ttl": 5,
        "max_search_results": 5,
        "use_bm25": true
      },
      "servers": {
        "filesystem": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
          "deferred": false
        },
        "context7": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "@upstash/context7-mcp"]
        },
        "aws": {
          "enabled": true,
          "command": "npx",
          "args": ["-y", "aws-mcp-server"],
          "deferred": true
        }
      }
    }
  }
}
```

> **Dica:** `deferred` por servidor é independente de `discovery.enabled`. Você pode manter `discovery.enabled: false` globalmente (todas as ferramentas visíveis por padrão) e ainda marcar servidores específicos de alto volume como `"deferred": true` para evitar poluir o contexto com as ferramentas deles.

## Ferramentas de Arquivo

### Read File

A ferramenta `read_file` lê arquivos do workspace. Ela suporta dois modos:

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | true | Habilita a ferramenta read_file |
| `mode` | string | `"bytes"` | Modo de leitura: `"bytes"` (slicing por offset/length) ou `"lines"` (slicing baseado em número de linha) |
| `max_read_file_size` | int | 0 | Tamanho máximo do arquivo em bytes que a ferramenta lerá (0 = limite padrão) |

```json
{
  "tools": {
    "read_file": {
      "enabled": true,
      "mode": "bytes"
    }
  }
}
```

No modo `"bytes"`, o agente especifica offsets de bytes; no modo `"lines"`, ele especifica números de linha. Escolha `"lines"` ao trabalhar com código-fonte em que o agente navega frequentemente por referência de linha.

### Load Image

A ferramenta `load_image` carrega um arquivo de imagem local no contexto do agente para que modelos com capacidade de visão possam analisá-lo. Formatos suportados: JPEG, PNG, GIF, WebP, BMP.

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | true | Habilita a ferramenta load_image |

```json
{
  "tools": {
    "load_image": {
      "enabled": true
    }
  }
}
```

A ferramenta retorna uma referência `media://` que o loop do agente resolve para uma imagem codificada em base64 na próxima requisição do LLM. Isso é distinto de `send_file` (que envia o arquivo para o usuário); `load_image` torna a imagem visível para o LLM.

### Send TTS

A ferramenta `send_tts` converte texto em fala e envia o áudio para o chat atual. Ela requer um modelo TTS configurado em `voice.tts_model_name`.

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | false | Habilita a ferramenta send_tts |

```json
{
  "tools": {
    "send_tts": {
      "enabled": true
    }
  }
}
```

## Ferramenta Skills

A ferramenta skills gerencia a descoberta e instalação de skills via registries como o ClawHub.

### Registries

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `registries.clawhub.enabled` | bool | true | Habilitar registry ClawHub |
| `registries.clawhub.base_url` | string | `https://clawhub.ai` | URL base do ClawHub |
| `registries.clawhub.auth_token` | string | `""` | Token Bearer opcional para rate limits mais altos |
| `registries.clawhub.search_path` | string | `""` | Caminho da API de busca |
| `registries.clawhub.skills_path` | string | `""` | Caminho da API de skills |
| `registries.clawhub.download_path` | string | `""` | Caminho da API de download |
| `registries.clawhub.timeout` | int | 0 | Timeout de requisição em segundos (0 = padrão) |
| `registries.clawhub.max_zip_size` | int | 0 | Tamanho máximo do zip de skill em bytes (0 = padrão) |
| `registries.clawhub.max_response_size` | int | 0 | Tamanho máximo da resposta da API em bytes (0 = padrão) |

### Integração com GitHub

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `github.proxy` | string | `""` | Proxy HTTP para requisições da API do GitHub |
| `github.token` | string | `""` | Personal access token do GitHub |

### Configurações de Busca

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `max_concurrent_searches` | int | 2 | Número máximo de requisições concorrentes de busca de skills |
| `search_cache.max_size` | int | 50 | Número máximo de resultados de busca em cache |
| `search_cache.ttl_seconds` | int | 300 | TTL do cache em segundos |

### Exemplo de Configuração de Skills

```json
{
  "tools": {
    "skills": {
      "registries": {
        "clawhub": {
          "enabled": true,
          "base_url": "https://clawhub.ai",
          "auth_token": ""
        }
      },
      "github": {
        "proxy": "",
        "token": ""
      },
      "max_concurrent_searches": 2,
      "search_cache": {
        "max_size": 50,
        "ttl_seconds": 300
      }
    }
  }
}
```

## Variáveis de Ambiente

Todas as opções de configuração podem ser sobrescritas por variáveis de ambiente no formato `PICOCLAW_TOOLS_<SEÇÃO>_<CHAVE>`:

- `PICOCLAW_TOOLS_WEB_BRAVE_ENABLED=true`
- `PICOCLAW_TOOLS_EXEC_ENABLED=false`
- `PICOCLAW_TOOLS_EXEC_ENABLE_DENY_PATTERNS=false`
- `PICOCLAW_TOOLS_CRON_EXEC_TIMEOUT_MINUTES=10`
- `PICOCLAW_TOOLS_MCP_ENABLED=true`

Nota: Configurações de mapa aninhadas (por exemplo `tools.mcp.servers.<name>.*`) devem ser feitas no `config.json`, não por variáveis de ambiente.

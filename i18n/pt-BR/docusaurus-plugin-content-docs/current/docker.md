---
id: docker
title: Deploy com Docker
---

# Deploy com Docker

Rode o PicoClaw com Docker Compose sem precisar instalar nada localmente.

## Configuração do Docker Compose

```bash
# 1. Clone the repo
git clone https://github.com/sipeed/picoclaw.git
cd picoclaw

# 2. First run — auto-generates docker/data/config.json then exits
docker compose -f docker/docker-compose.yml --profile gateway up
# The container prints "First-run setup complete." and stops.

# 3. Set your API keys
vim docker/data/config.json   # Set provider API keys, bot tokens, etc.

# 4. Start
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

:::tip Rede do Docker
Por padrão, o Gateway escuta em `127.0.0.1`. Defina `PICOCLAW_GATEWAY_HOST=0.0.0.0` no seu ambiente ou no `config.json` para expô-lo à rede do host Docker.
:::

:::note Profile Gateway
O profile `gateway` serve apenas os handlers de webhook (incluindo o Pico, quando habilitado) e os endpoints de health no porto do gateway. Ele não expõe endpoints REST genéricos de chat. O modo Launcher adiciona a UI do navegador na porta 18800.
:::

:::info Política de Restart
Os serviços do gateway e do launcher usam `restart: unless-stopped`, então reiniciam automaticamente após crashes ou reboots do sistema, a menos que sejam parados explicitamente.
:::

## Modo Launcher (Console Web)

O Launcher oferece uma UI de configuração via navegador na porta **18800**:

```bash
docker compose -f docker/docker-compose.yml --profile launcher up -d
```

Abra `http://localhost:18800` para gerenciar modelos, canais e o processo do gateway.

:::warning Token do Dashboard
O console web usa um token de dashboard (gerado em memória a cada execução, a menos que `PICOCLAW_LAUNCHER_TOKEN` esteja definido). Não exponha o launcher para redes não confiáveis ou para a internet pública sem adicionar sua própria camada de autenticação (reverse proxy, VPN, etc.).
:::

## Modo Agent

```bash
# One-shot question
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent -m "What is 2+2?"

# Interactive mode
docker compose -f docker/docker-compose.yml run --rm picoclaw-agent
```

## Atualização

```bash
docker compose -f docker/docker-compose.yml pull
docker compose -f docker/docker-compose.yml --profile gateway up -d
```

## Início Rápido

### 1. Inicializar

```bash
picoclaw onboard
```

### 2. Configure o `~/.picoclaw/config.json`

#### Lista de Modelos

Adicione um ou mais provedores de modelo:

```json
{
  "model_list": [
    {
      "model_name": "ark-code-latest",
      "model": "volcengine/ark-code-latest",
      "api_key": "sk-your-volcengine-key"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "your-openai-key"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6",
      "api_key": "your-anthropic-key"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt-5.4"
    }
  }
}
```

#### Ferramentas Web (Opcional)

Configure um provedor de busca na web para a ferramenta de busca do agent:

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "api_key": "YOUR_BRAVE_API_KEY",
        "max_results": 5
      },
      "tavily": {
        "enabled": false,
        "api_key": "YOUR_TAVILY_API_KEY",
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": false,
        "max_results": 5
      },
      "perplexity": {
        "enabled": false,
        "api_key": "YOUR_PERPLEXITY_API_KEY"
      },
      "searxng": {
        "enabled": false,
        "base_url": "http://localhost:8080"
      }
    }
  }
}
```

**Obter Chaves de API:**

| Serviço | Link |
| --- | --- |
| Brave Search | [brave.com/search/api](https://brave.com/search/api) (2000 consultas gratuitas/mês) |
| Tavily | [tavily.com](https://tavily.com) (1000 consultas gratuitas/mês) |
| DuckDuckGo | Não requer chave |
| Perplexity | [perplexity.ai](https://docs.perplexity.ai) |
| SearXNG | Auto-hospedado, veja [docs.searxng.org](https://docs.searxng.org) |

### 3. Comece a Conversar

```bash
picoclaw agent -m "Summarize the latest Rust release notes"
```

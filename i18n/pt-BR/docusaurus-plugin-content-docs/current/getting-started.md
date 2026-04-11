---
id: getting-started
title: Começar agora
---

# Começar agora

Coloque o PicoClaw para rodar em 2 minutos.

:::tip Chaves de API
Defina sua chave de API em `~/.picoclaw/config.json`. Onde obter chaves: [Volcengine (CodingPlan)](https://console.volcengine.com) (LLM) · [OpenRouter](https://openrouter.ai/keys) (LLM) · [Zhipu](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys) (LLM). Busca na web é **opcional** — pegue uma chave gratuita em [Tavily API](https://tavily.com) (1000 consultas grátis/mês) ou [Brave Search API](https://brave.com/search/api) (2000 consultas grátis/mês).
:::

## Passo 1: Inicializar

```bash
picoclaw onboard
```

Esse comando cria seu workspace em `~/.picoclaw/` e gera um arquivo de configuração padrão.

## Passo 2: Configurar

Edite `~/.picoclaw/config.json`:

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.picoclaw/workspace",
      "model_name": "gpt-5.4",
      "max_tokens": 32768,
      "max_tool_iterations": 50
    }
  },
  "model_list": [
    {
      "model_name": "ark-code-latest",
      "model": "volcengine/ark-code-latest",
      "api_key": "sk-your-api-key"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_key": "your-api-key"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6",
      "api_key": "your-anthropic-key"
    }
  ]
}
```

Veja [Configuração de modelos](./configuration/model-list.md) para todos os provedores suportados.

## Passo 3: Conversar

```bash
# Chat de uma única rodada
picoclaw agent -m "Quanto é 2+2?"

# Modo interativo
picoclaw agent
```

Pronto! Você já tem um assistente de IA funcionando.

## Referência da CLI

| Comando | Descrição |
| --- | --- |
| `picoclaw onboard` | Inicializa configuração e workspace |
| `picoclaw agent -m "..."` | Chat de uma única rodada |
| `picoclaw agent` | Modo de chat interativo |
| `picoclaw gateway` | Inicia o gateway (para apps de chat) |
| `picoclaw status` | Mostra o status |
| `picoclaw cron list` | Lista todos os jobs agendados |
| `picoclaw cron add ...` | Adiciona um job agendado |

## Launcher (configuração visual)

Não quer editar JSON na mão? O pacote de release inclui dois launchers — basta dar duplo clique para executar:

### Launcher web (`picoclaw-launcher`)

Dê duplo clique em `picoclaw-launcher` (ou `picoclaw-launcher.exe` no Windows). Ele abre uma UI de configuração no navegador em `http://localhost:18800`.

A partir da interface você pode:
- **Adicionar modelos** — gerenciamento de modelos no estilo de cartões, definir modelo principal, sem chave de API = desabilitado
- **Configurar canais** — formulários para Telegram, Discord, Slack, WeCom etc.
- **Login OAuth** — login com um clique para OpenAI, Anthropic, Google Antigravity
- **Iniciar/parar gateway** — gerencie o processo `picoclaw gateway` diretamente

Para permitir acesso a partir de outros dispositivos da LAN (por exemplo, configurar pelo celular):

```bash
./picoclaw-launcher -public
```

### Launcher TUI (`picoclaw-launcher-tui`)

Para ambientes headless (SSH, dispositivos embarcados), execute `picoclaw-launcher-tui` no terminal. Ele oferece uma interface por menu para seleção de modelo, configuração de canais, iniciar agente/gateway e visualizar logs.

## Tarefas agendadas

O PicoClaw suporta lembretes e tarefas recorrentes através da ferramenta `cron`:

- **Uma única vez**: "Me lembre em 10 minutos"
- **Recorrente**: "Me lembre a cada 2 horas"
- **Expressões cron**: "Me lembre todo dia às 9h"

Os jobs são armazenados em `~/.picoclaw/workspace/cron/` e processados automaticamente.

## Rodar no Android (Termux)

Dê uma segunda vida ao seu celular antigo como assistente de IA:

```bash
wget https://github.com/sipeed/picoclaw/releases/latest/download/picoclaw_Linux_arm64.tar.gz
tar xzf picoclaw_Linux_arm64.tar.gz
pkg install proot
termux-chroot ./picoclaw onboard
```

![PicoClaw rodando no Termux](https://github.com/sipeed/picoclaw/raw/main/assets/termux.jpg)

## Solução de problemas

### A busca na web diz "API key configuration issue"

Isso é normal se você ainda não configurou uma chave de API de busca. O PicoClaw fornecerá links úteis para busca manual.

Para habilitar busca na web:

1. **Opção 1 (recomendada)**: Pegue uma chave gratuita em [https://brave.com/search/api](https://brave.com/search/api) (2000 consultas grátis/mês) para os melhores resultados.
2. **Opção 2 (sem cartão de crédito)**: Se você não tiver uma chave, usamos **DuckDuckGo** automaticamente como fallback (não requer chave).

Adicione a chave em `~/.picoclaw/config.json` se for usar o Brave:

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": false,
        "api_key": "YOUR_BRAVE_API_KEY",
        "max_results": 5
      },
      "duckduckgo": {
        "enabled": true,
        "max_results": 5
      }
    }
  }
}
```

### Erros de filtragem de conteúdo

Alguns provedores (como o Zhipu) têm filtragem de conteúdo. Tente reformular sua pergunta ou usar outro modelo.

### Bot do Telegram "Conflict: terminated by other getUpdates"

Apenas uma instância de `picoclaw gateway` pode rodar por vez. Pare quaisquer outras instâncias.

## Comparativo de chaves de API

| Serviço | Camada gratuita | Caso de uso |
| --- | --- | --- |
| **OpenRouter** | 200K tokens/mês | Múltiplos modelos (Claude, GPT-4 etc.) |
| **Volcengine CodingPlan** | ¥9.9 no primeiro mês | Melhor para usuários chineses, vários modelos SOTA (Doubao, DeepSeek etc.) |
| **Zhipu** | 200K tokens/mês | Para usuários chineses |
| **Brave Search** | 2000 consultas/mês | Funcionalidade de busca na web |
| **Tavily** | 1000 consultas/mês | Busca otimizada para AI Agent |
| **Groq** | Camada gratuita | Inferência rápida (Llama, Mixtral) |
| **Cerebras** | Camada gratuita | Inferência rápida (Llama, Qwen) |

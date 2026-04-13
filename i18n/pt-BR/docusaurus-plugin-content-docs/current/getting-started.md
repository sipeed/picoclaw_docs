---
id: getting-started
title: Começar agora
---

# Começar agora

Coloque o PicoClaw para rodar em 2 minutos.

## Caminho padrão de configuração (recomendado): WebUI

Para a maioria das pessoas, o caminho padrão é configurar pelo **WebUI via Launcher** (em vez de editar JSON manualmente).

1. Inicialize uma vez:

```bash
picoclaw onboard
```

2. Inicie o launcher WebUI:

```bash
picoclaw-launcher
```

3. Abra `http://localhost:18800` e conclua no painel:
- Adicione pelo menos um modelo LLM e defina como padrão
- Configure busca web (recomendado antes do primeiro uso real; veja a próxima seção)
- Inicie o Gateway no painel do launcher

4. Comece a conversar:

```bash
picoclaw agent
```

## Configuração de busca web

Sem busca web, muitas tarefas reais (notícias recentes, links, verificação de fatos) ficam limitadas.
Configure pelo menos um mecanismo de busca na configuração inicial.

### Opção A: configurar no WebUI (recomendado)

No Launcher WebUI, abra as configurações de ferramentas e habilite os provedores de busca:
- `Brave Search` (melhor padrão; possui cota gratuita)
- fallback `DuckDuckGo` (não exige chave)

### Opção B: `config.json` + `.security.yml` (padrão no schema v2)

No schema v2, mantenha a estrutura no `config.json` e as chaves reais no `.security.yml`.

Edite `~/.picoclaw/config.json`:

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
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

Depois, coloque os segredos em `~/.picoclaw/.security.yml`:

```yaml
web:
  brave:
    api_keys:
      - "YOUR_BRAVE_API_KEY"
```

Obtenha chaves:
- [Brave Search API](https://brave.com/search/api) (2000 consultas grátis/mês)
- [Tavily API](https://tavily.com) (1000 consultas grátis/mês)

## Configuração de modelos (se preferir JSON)

Se preferir configuração manual, use `config.json` + `.security.yml`:

```json
{
  "version": 2,
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
      "model": "volcengine/ark-code-latest"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6"
    }
  ]
}
```

`~/.picoclaw/.security.yml`:

```yaml
model_list:
  ark-code-latest:0:
    api_keys:
      - "sk-your-volcengine-key"
  gpt-5.4:0:
    api_keys:
      - "sk-your-openai-key"
  claude-sonnet-4.6:0:
    api_keys:
      - "sk-your-anthropic-key"
```

Veja [Configuração de modelos](./configuration/model-list.md) para todos os provedores suportados.
Veja [Referência do `.security.yml`](./configuration/security-reference.md) para regras de mapeamento de segredos.

## Referência da CLI

| Comando | Descrição |
| --- | --- |
| `picoclaw onboard` | Inicializa configuração e workspace |
| `picoclaw agent -m "..."` | Chat de uma rodada |
| `picoclaw agent` | Modo interativo |
| `picoclaw gateway` | Inicia o gateway (para apps de chat) |
| `picoclaw status` | Mostra status |
| `picoclaw cron list` | Lista tarefas agendadas |
| `picoclaw cron add ...` | Adiciona tarefa agendada |

## Launcher (configuração visual)

O pacote de release usa o launcher Web como caminho principal:

### Launcher Web (`picoclaw-launcher`)

Dê duplo clique em `picoclaw-launcher` (ou `picoclaw-launcher.exe` no Windows) para abrir o WebUI em `http://localhost:18800`.

`picoclaw-launcher-tui` é um caminho legado e está sendo descontinuado gradualmente. Prefira `picoclaw-launcher`.

### Parâmetros do `picoclaw-launcher`

| Parâmetro | Descrição | Exemplo |
| --- | --- | --- |
| `-console` | Executa no terminal (sem GUI de bandeja) e mostra dica de login/origem do token no startup | `picoclaw-launcher -console` |
| `-public` | Escuta em `0.0.0.0` e permite acesso via LAN ao WebUI | `picoclaw-launcher -public` |
| `-no-browser` | Não abre o navegador automaticamente ao iniciar | `picoclaw-launcher -no-browser` |
| `-port <port>` | Define porta do launcher (padrão `18800`) | `picoclaw-launcher -port 19999` |
| `-lang <en|zh>` | Define idioma da interface | `picoclaw-launcher -lang zh` |
| `[config.json]` | Caminho opcional para arquivo de configuração | `picoclaw-launcher ./config.json` |

Combinações comuns:

```bash
# Servidor headless/SSH: modo console + sem abrir navegador + acesso LAN
picoclaw-launcher -console -no-browser -public

# Porta customizada com arquivo de configuração explícito
picoclaw-launcher -port 19999 ./config.json
```

## Tarefas agendadas

O PicoClaw suporta lembretes e tarefas recorrentes via ferramenta `cron`:

- **Uma vez**: "Me lembre em 10 minutos"
- **Recorrente**: "Me lembre a cada 2 horas"
- **Expressão cron**: "Me lembre diariamente às 9h"

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

### A busca web mostra "API key configuration issue"

Isso é normal se você ainda não configurou uma chave de API de busca.

Para habilitar a busca web:

1. **Opção 1 (recomendada)**: pegue uma chave gratuita em [https://brave.com/search/api](https://brave.com/search/api) (2000 consultas grátis/mês).
2. **Opção 2 (sem cartão de crédito)**: use fallback **DuckDuckGo** (sem chave).

### Erros de filtragem de conteúdo

Alguns provedores (como Zhipu) têm filtragem de conteúdo. Tente reformular sua pergunta ou usar outro modelo.

### Bot do Telegram "Conflict: terminated by other getUpdates"

Apenas uma instância de `picoclaw gateway` pode rodar por vez. Pare outras instâncias.

## Comparativo de chaves de API

| Serviço | Camada gratuita | Caso de uso |
| --- | --- | --- |
| **OpenRouter** | 200K tokens/mês | Vários modelos (Claude, GPT-4 etc.) |
| **Volcengine CodingPlan** | ¥9.9 no primeiro mês | Melhor para usuários chineses, vários modelos SOTA (Doubao, DeepSeek etc.) |
| **Zhipu** | 200K tokens/mês | Para usuários chineses |
| **Brave Search** | 2000 consultas/mês | Busca na web |
| **Tavily** | 1000 consultas/mês | Busca otimizada para agentes de IA |
| **Groq** | Camada gratuita | Inferência rápida (Llama, Mixtral) |
| **Cerebras** | Camada gratuita | Inferência rápida (Llama, Qwen) |

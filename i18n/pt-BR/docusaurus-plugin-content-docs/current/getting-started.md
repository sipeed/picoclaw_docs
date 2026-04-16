---
id: getting-started
title: Começar agora
---

# Começar agora

Inicie o PicoClaw em 2 minutos.

:::tip Lembrete
Primeiro, obtenha e confirme que sua API Key está funcionando. Para a lista de modelos suportados, veja [Configuração de Modelos](./configuration/model-list.md). A busca na web é **opcional**: você pode obter [Tavily API](https://tavily.com) grátis (1000 consultas/mês) ou [Brave Search API](https://brave.com/search/api) grátis (2000 consultas/mês).
:::

## Configurar com WebUI (`picoclaw-launcher`)

Para a maioria dos usuários, recomendamos concluir a configuração pelo **Launcher WebUI**, em vez de editar arquivos manualmente primeiro.

1. Inicie o launcher WebUI diretamente (sem pré-inicialização), com o comando:

```bash
picoclaw-launcher
```

Ou dê duplo clique em `picoclaw-launcher` (`picoclaw-launcher.exe` no Windows).

<div style={{textAlign: 'center'}}>
  <img src="/img/launcher.png" alt="picoclaw-launcher icon" width="120" />
</div>

> `picoclaw-launcher-tui` não é mais mantido e está sendo descontinuado gradualmente. Prefira `picoclaw-launcher`.

2. Abra `http://localhost:18800` e conclua na interface:
- Adicione pelo menos um modelo LLM e defina como padrão
- Configure a busca web (atualmente via arquivo de configuração; veja [Configuração de Busca Web](./configuration/web-search-setup.md))
- Inicie o Gateway no Launcher

![WebUI](/img/picoclaw-launcher.png)

Para mais campos de modelo e o arquivo de configuração completo, veja [Configuração de Modelos](./configuration/model-list.md).

Após concluir a configuração, você já pode usar o PicoClaw.
![WebUI](/img/Hello.png)

## Habilitar Busca na Web

Se a busca na web não estiver habilitada, muitos cenários reais (buscar informações mais recentes, encontrar links, verificar fatos) ficam claramente limitados.
Recomendamos habilitar pelo menos um mecanismo de busca na configuração inicial.

Na versão atual, a busca na web precisa ser configurada via arquivo (`config.json` + `.security.yml`) e o WebUI ainda não possui entrada correspondente. Veja [Configuração de Busca na Web](./configuration/web-search-setup.md).

## Referência de Comandos CLI

Para comandos CLI e parâmetros de `picoclaw-launcher`, veja [Comandos e Parâmetros CLI](./configuration/cli-parameters.md).

## Tarefas agendadas

O PicoClaw suporta lembretes e tarefas recorrentes via ferramenta `cron`:

- **Uma vez**: "Me lembre em 10 minutos"
- **Recorrente**: "Me lembre a cada 2 horas"
- **Expressão cron**: "Me lembre diariamente às 9h"

Os jobs são armazenados em `~/.picoclaw/workspace/cron/` e processados automaticamente.

## Solução de problemas

### A busca web mostra "API key configuration issue"

Isso é normal se você ainda não configurou uma chave de API de busca.

Para habilitar a busca web:

1. **Opção 1 (recomendada)**: pegue uma chave gratuita em [https://brave.com/search/api](https://brave.com/search/api) (2000 consultas grátis/mês).
2. **Opção 2 (sem cartão de crédito)**: use [**DuckDuckGo**](https://duckduckgo.com/) fallback (sem chave).
3. **Opção 3 (prioridade para conteúdo da China continental)**: use [**Baidu Search**](https://www.baidu.com/) (1000 consultas grátis/dia).

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
| [**Brave Search**](https://brave.com/search/api) | 2000 consultas/mês | Busca na web |
| [**Tavily**](https://tavily.com) | 1000 consultas/mês | Busca otimizada para agentes de IA |
| [**Baidu Search**](https://www.baidu.com/) | 1000 consultas/dia | Melhor cobertura para conteúdo da China continental |
| **Groq** | Camada gratuita | Inferência rápida (Llama, Mixtral) |
| **Cerebras** | Camada gratuita | Inferência rápida (Llama, Qwen) |


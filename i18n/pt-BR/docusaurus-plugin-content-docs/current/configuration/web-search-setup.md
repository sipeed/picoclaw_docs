---
id: web-search-setup
title: Configuração da Busca na Web
---

# Configuração da Busca na Web

Sem busca na web, muitas tarefas reais (notícias recentes, links, verificação de fatos) ficam limitadas.
Configure um mecanismo de busca durante a configuração inicial.

Na versão atual, a busca na web precisa ser configurada por arquivos (`config.json` + `.security.yml`); o WebUI ainda não oferece essa opção.

## Configuração: `config.json` + `.security.yml`

No schema v2, mantenha a estrutura em `config.json` e armazene as chaves reais em `.security.yml`.

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
- [Baidu Search](https://www.baidu.com/) (1000 consultas grátis/dia; melhor para conteúdo da China continental)

Para opções completas das ferramentas web (Baidu, Brave, Tavily, DuckDuckGo etc.), veja [Configuração de Ferramentas](./tools.md).

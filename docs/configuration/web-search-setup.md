---
id: web-search-setup
title: Web Search Setup
---

# Web Search Setup

Without web search, many real tasks (latest news, links, fact checking) are hard to use.
Configure one search engine during initial setup.

In the current version, web search must be configured via config files (`config.json` + `.security.yml`); WebUI does not yet provide this setting.

## Configuration: `config.json` + `.security.yml`

In schema v2, keep structure in `config.json` and store real keys in `.security.yml`.

Edit `~/.picoclaw/config.json`:

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

Then put secrets in `~/.picoclaw/.security.yml`:

```yaml
web:
  brave:
    api_keys:
      - "YOUR_BRAVE_API_KEY"
```

Get keys:
- [Brave Search API](https://brave.com/search/api) (2000 free queries/month)
- [Tavily API](https://tavily.com) (1000 free queries/month)
- [Baidu Search](https://www.baidu.com/) (1000 free queries/day; better for Mainland China content)

For full web tool options (Baidu, Brave, Tavily, DuckDuckGo, etc.), see [Tools Configuration](./tools.md).

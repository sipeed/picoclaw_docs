---
id: troubleshooting
title: Solução de Problemas
---

# Solução de Problemas

## "model ... not found in model_list" ou erros do OpenRouter

**Sintoma:** Você vê um erro como:

```
Error creating provider: model "openrouter/free" not found in model_list
```

Ou o OpenRouter retorna um erro 400 ao fazer requisições.

**Causa:** O campo `model` em `model_list` é enviado diretamente para a API upstream. Para o OpenRouter, você precisa usar o ID completo do modelo (por exemplo, `openrouter/google/gemma-2-9b-it:free`), e não uma abreviação como `openrouter/free`.

- Errado: `"model": "openrouter/free"`
- Certo: `"model": "openrouter/google/gemma-2-9b-it:free"`

**Solução:**

1. `agents.defaults.model_name` precisa corresponder a uma entrada de `model_name` em `model_list`.
2. O campo `model` dessa entrada precisa ser um ID de modelo válido e reconhecido pelo provedor.

Exemplo de uma configuração correta:

```json
{
  "agents": {
    "defaults": {
      "model_name": "openrouter-free"
    }
  },
  "model_list": [
    {
      "model_name": "openrouter-free",
      "model": "openrouter/google/gemma-2-9b-it:free",
      "api_key": "sk-or-v1-your-openrouter-key"
    }
  ]
}
```

## Busca na web diz "API key configuration issue"

Isso é normal se você ainda não configurou uma chave de API de busca. O PicoClaw fornecerá links úteis para busca manual.

Para habilitar a busca na web:

1. **Opção 1 (Recomendada)**: Obtenha uma chave de API gratuita em [https://brave.com/search/api](https://brave.com/search/api) (2000 consultas gratuitas/mês) para os melhores resultados.
2. **Opção 2 (Sem Cartão de Crédito)**: Se você não tiver uma chave, o PicoClaw usa automaticamente o **DuckDuckGo** como fallback (não requer chave).

Adicione a chave ao `~/.picoclaw/config.json`:

```json
{
  "tools": {
    "web": {
      "brave": {
        "enabled": true,
        "api_key": "YOUR_BRAVE_API_KEY",
        "max_results": 5
      }
    }
  }
}
```

## Erros de filtragem de conteúdo

Alguns provedores (como Zhipu) possuem filtragem de conteúdo. Tente reformular sua pergunta ou use um modelo diferente.

## Bot do Telegram "Conflict: terminated by other getUpdates"

Apenas uma instância do `picoclaw gateway` deve rodar por vez. Pare quaisquer outras instâncias antes de iniciar uma nova.

## Gateway não está acessível a partir de outros dispositivos

Por padrão, o gateway escuta em `127.0.0.1` (apenas localhost). Para expô-lo na rede local:

- Defina `PICOCLAW_GATEWAY_HOST=0.0.0.0` no seu ambiente ou configuração.
- Se estiver usando o Launcher Web, execute `./picoclaw-launcher -public`.

## O agente trava ou atinge timeout

- Verifique sua conexão de internet e a validade da chave de API.
- Tente um provedor de modelo diferente para descartar indisponibilidades upstream.
- Aumente `max_tokens` ou `max_tool_iterations` em `agents.defaults` se a tarefa for complexa.

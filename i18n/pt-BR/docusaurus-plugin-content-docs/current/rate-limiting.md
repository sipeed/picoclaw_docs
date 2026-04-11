---
id: rate-limiting
title: Limitação de Taxa
---

# Limitação de Taxa

O PicoClaw previne erros 429 das APIs de provedores de LLM aplicando limites configuráveis de taxa de requisições por modelo **antes** de enviar cada requisição. Diferente do sistema reativo de cooldown/fallback (que é acionado *depois* do recebimento de um 429), a limitação de taxa é **proativa**: ela mantém o QPS de saída dentro dos limites do plano gratuito ou pago do provedor.

## Como funciona

Cada modelo com rate limit recebe um token bucket:

- **Capacidade** = `rpm` (o tamanho do burst é igual ao limite por minuto)
- **Taxa de recarga** = `rpm / 60` tokens por segundo
- Um token é consumido por chamada ao LLM; se o bucket estiver vazio, a chamada fica bloqueada até um token ser reposto ou até o contexto da requisição ser cancelado

### Integração com a cadeia de chamadas

O rate limiter roda **depois** da verificação de cooldown e **antes** da chamada ao provedor:

```
FallbackChain.Execute()
  ├─ CooldownTracker.IsAvailable()   ← skip if post-429 cooldown active
  ├─ RateLimiterRegistry.Wait()      ← block until token available
  └─ provider.Chat()                 ← actual LLM HTTP call
```

Candidatos que já estão em cooldown são completamente ignorados. Candidatos disponíveis passam por throttling de acordo com o RPM configurado.

## Configuração

Defina `rpm` em qualquer entrada de modelo em `model_list`:

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-free",
      "model": "openai/gpt-4o",
      "api_keys": ["sk-..."],
      "rpm": 3
    },
    {
      "model_name": "claude-haiku",
      "model": "anthropic/claude-haiku-4-5",
      "api_keys": ["sk-ant-..."],
      "rpm": 60
    },
    {
      "model_name": "local-llm",
      "model": "ollama/llama3"
    }
  ]
}
```

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `rpm` | int | `0` | Requisições por minuto. `0` significa sem limite. |

## Interação com fallbacks

Quando um modelo tem fallbacks configurados, cada candidato é limitado independentemente. Se o bucket do candidato atual estiver vazio, o PicoClaw o ignora e tenta o próximo fallback imediatamente. Apenas o último candidato restante aguarda a reposição de um token.

```json
{
  "model_list": [
    {
      "model_name": "primary",
      "model": "openai/gpt-4o",
      "api_keys": ["sk-..."],
      "rpm": 5
    },
    {
      "model_name": "backup",
      "model": "gemini/gemini-2.5-flash",
      "api_keys": ["your-gemini-key"],
      "rpm": 60
    }
  ],
  "agents": {
    "defaults": {
      "model": {
        "primary": "primary",
        "fallbacks": ["backup"]
      }
    }
  }
}
```

## Comportamento de burst

O bucket inicia **cheio** com `rpm` tokens. Para `rpm: 3`, as primeiras 3 requisições disparam instantaneamente (um token cada); após o bucket esvaziar, um token é reposto a cada 20 s (= 60 / rpm), espaçando as requisições subsequentes de acordo.

---
id: openrouter-api
title: OpenRouter API
---

# Guia de Configuração da OpenRouter API

## Visão Geral

A **OpenRouter API** é uma plataforma de interface unificada que agrega múltiplos serviços de LLM, com suporte a modelos da OpenAI, Anthropic, Google, Meta e outros.

Com a OpenRouter, você pode:

- Usar uma API unificada para chamar modelos de diferentes providers
- Rotear automaticamente para os modelos ótimos ou para os nós de menor custo
- Evitar problemas de rate limiting de uma plataforma única
- Trocar de modelo com flexibilidade sem mudar o código

Modelos populares disponíveis:

| Modelo | Provider | Características | Casos de Uso |
|-------|----------|----------|-----------|
| openai/gpt-4o-mini | OpenAI | Rápido, baixo custo | Conversas do dia a dia |
| openai/gpt-4o | OpenAI | Alta qualidade | Tarefas multimodais |
| anthropic/claude-3-haiku | Anthropic | Rápido | Tarefas leves |
| anthropic/claude-3-opus | Anthropic | Alto poder de raciocínio | Análises complexas |
| google/gemini-pro | Google | Multimodal forte | Tarefas gerais |

---

## Obtendo a API Key

### Passo 1: Acesse a OpenRouter

Vá até o [OpenRouter](https://openrouter.ai/)

### Passo 2: Fazer login

Suporta login via GitHub / Google.

### Passo 3: Criar a API Key

1. Navegue até **Dashboard → Keys**
2. Clique em **Create Key**
3. **Copie e guarde** sua API Key

> ⚠️ **Atenção**: mantenha sua API Key segura e evite expô-la.

![OpenRouter API Key](/img/providers/openrouterapi.png)

![OpenRouter API Key](/img/providers/openrouterapi1.png)

---

## Configurando o PicoClaw

### Opção 1: Usando a WebUI (Recomendado)

O PicoClaw oferece uma interface WebUI onde você pode configurar modelos facilmente sem editar os arquivos de configuração manualmente.

Edite as configurações do preset, ou clique no botão **"Add Model"** no canto superior direito:

![Add Model](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Model Alias | Nome personalizado, ex.: `gpt-4o-mini` |
| Model Identifier | `openrouter/openai/gpt-4o-mini` (ou outros modelos suportados) |
| API Key | OpenRouter API Key |
| API Base URL | Deixe em branco (padrão: `https://openrouter.ai/api/v1`) |

### Opção 2: Editar o Arquivo de Configuração

Adicione em `config.json`:

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-mini",
      "model": "openrouter/openai/gpt-4o-mini",
      "api_keys": ["YOUR_OPENROUTER_API_KEY"],
      "custom_headers": {
        "HTTP-Referer": "http://localhost",
        "X-Title": "PicoClaw"
      }
    },
    {
      "model_name": "claude-3-haiku",
      "model": "openrouter/anthropic/claude-3-haiku",
      "api_keys": ["YOUR_OPENROUTER_API_KEY"]
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt-4o-mini"
    }
  }
}
```

Em produção, mantenha as chaves em `~/.picoclaw/.security.yml` e deixe o `config.json` focado na estrutura dos modelos.

---

## Limites e Cotas

### Cobrança

A OpenRouter usa um modelo **pay-as-you-go**, cobrando com base no modelo efetivamente usado e no consumo de tokens.

### Rate Limits

- Modelos diferentes têm rate limits diferentes
- Modelos gratuitos podem ter limites mais rígidos
- Usuários pagantes têm cotas de taxa mais altas

---

## Problemas Comuns

### Modelo Indisponível

**Causa**: modelo descontinuado ou saldo insuficiente na conta

**Soluções**:
- Verifique se o modelo ainda está disponível
- Recarregue o saldo da conta

### Timeout de Resposta

**Causa**: resposta lenta do modelo ou problemas de rede

**Soluções**:
- Tente usar um modelo mais rápido
- Verifique a conexão de rede

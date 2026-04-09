---
id: model-list-migration
title: "Migração: providers → model_list"
---

# Guia de migração: de `providers` para `model_list`

Este guia explica como migrar da configuração legada `providers` para o novo formato `model_list`.

## Por que migrar?

A nova configuração `model_list` oferece várias vantagens:

- **Adicionar provedor sem código**: integre provedores compatíveis com OpenAI apenas pela configuração
- **Balanceamento de carga**: configure múltiplos endpoints para o mesmo modelo
- **Roteamento por protocolo**: use prefixos como `openai/`, `anthropic/` etc.
- **Configuração mais limpa**: centrada no modelo, em vez de centrada no fornecedor

## Linha do tempo

| Versão | Status |
|---------|--------|
| v1.x | `model_list` introduzido, `providers` depreciado mas funcional |
| v1.x+1 | Avisos de depreciação proeminentes, ferramenta de migração disponível |
| config schema v2 | `providers` removido do schema ativo; configs legadas são migradas automaticamente |

## Antes e depois

### Antes: configuração legada `providers`

```json
{
  "providers": {
    "openai": {
      "api_key": "sk-your-openai-key",
      "api_base": "https://api.openai.com/v1"
    },
    "anthropic": {
      "api_key": "sk-ant-your-key"
    },
    "deepseek": {
      "api_key": "sk-your-deepseek-key"
    }
  },
  "agents": {
    "defaults": {
      "provider": "openai",
      "model": "gpt-5.4"
    }
  }
}
```

### Depois: nova configuração `model_list` (Schema v2)

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-your-openai-key"],
      "api_base": "https://api.openai.com/v1"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_keys": ["sk-ant-your-key"]
    },
    {
      "model_name": "deepseek",
      "model": "deepseek/deepseek-chat",
      "api_keys": ["sk-your-deepseek-key"]
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt4"
    }
  }
}
```

:::note Campo `enabled`
O campo `enabled` pode ser omitido — durante a migração V1 → V2 ele é inferido automaticamente (modelos com chaves de API ou com nome `local-model` são habilitados por padrão). Em configurações novas, você pode definir `"enabled": false` explicitamente para desabilitar uma entrada de modelo sem removê-la.
:::

## Prefixos de protocolo

O campo `model` usa um formato de prefixo de protocolo: `[protocolo/]identificador-do-modelo`

| Prefixo | Descrição | Exemplo |
|--------|-------------|---------|
| `openai/` | API da OpenAI (padrão) | `openai/gpt-5.4` |
| `anthropic/` | API da Anthropic | `anthropic/claude-opus-4` |
| `antigravity/` | Google via OAuth do Antigravity | `antigravity/gemini-2.0-flash` |
| `gemini/` | API do Google Gemini | `gemini/gemini-2.0-flash-exp` |
| `claude-cli/` | Claude CLI (local) | `claude-cli/claude-sonnet-4.6` |
| `codex-cli/` | Codex CLI (local) | `codex-cli/codex-4` |
| `github-copilot/` | GitHub Copilot | `github-copilot/gpt-4o` |
| `openrouter/` | OpenRouter | `openrouter/anthropic/claude-sonnet-4.6` |
| `groq/` | API da Groq | `groq/llama-3.1-70b` |
| `deepseek/` | API da DeepSeek | `deepseek/deepseek-chat` |
| `cerebras/` | API da Cerebras | `cerebras/llama-3.3-70b` |
| `qwen/` | Alibaba Qwen | `qwen/qwen-max` |
| `zhipu/` | Zhipu AI | `zhipu/glm-4` |
| `nvidia/` | NVIDIA NIM | `nvidia/llama-3.1-nemotron-70b` |
| `ollama/` | Ollama (local) | `ollama/llama3` |
| `vllm/` | vLLM (local) | `vllm/my-model` |
| `moonshot/` | Moonshot AI | `moonshot/moonshot-v1-8k` |
| `shengsuanyun/` | ShengSuanYun | `shengsuanyun/deepseek-v3` |
| `volcengine/` | Volcengine | `volcengine/doubao-pro-32k` |

**Nota**: se nenhum prefixo for especificado, `openai/` é usado por padrão.

## Campos de `ModelConfig`

| Campo | Obrigatório | Descrição |
|-------|----------|-------------|
| `model_name` | Sim | Apelido visível ao usuário para o modelo |
| `model` | Sim | Identificador do protocolo e do modelo (ex.: `openai/gpt-5.4`) |
| `api_base` | Não | URL do endpoint da API |
| `api_keys` | Não* | Chaves de autenticação da API (array; suporta múltiplas chaves para balanceamento de carga) |
| `enabled` | Não | Se esta entrada de modelo está ativa. Padrão `true` durante a migração para modelos com chaves de API ou chamados `local-model`. Defina como `false` para desabilitar. |
| `proxy` | Não | URL do proxy HTTP |
| `auth_method` | Não | Método de autenticação: `oauth`, `token` |
| `connect_mode` | Não | Modo de conexão para provedores CLI: `stdio`, `grpc` |
| `rpm` | Não | Limite de requisições por minuto |
| `max_tokens_field` | Não | Nome do campo de tokens máximos |
| `request_timeout` | Não | Timeout de requisição HTTP em segundos; `<=0` usa o padrão `120s` |

*`api_keys` é obrigatório para protocolos baseados em HTTP, exceto quando `api_base` aponta para um servidor local.

:::note Mudança no formato da chave de API
No config schema V2, `api_key` (singular) foi **removido**. Apenas `api_keys` (array) é suportado. Durante a migração de V0/V1, tanto `api_key` quanto `api_keys` são mesclados automaticamente no novo array `api_keys`.
:::

## Balanceamento de carga

Existem duas formas de configurar balanceamento de carga:

### Opção 1: múltiplas chaves de API em `api_keys` (recomendado)

```json
{
  "model_list": [
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key1", "sk-key2", "sk-key3"],
      "api_base": "https://api.openai.com/v1"
    }
  ]
}
```

Ou via `.security.yml`:

```yaml
model_list:
  gpt4:
    api_keys:
      - "sk-key1"
      - "sk-key2"
      - "sk-key3"
```

### Opção 2: múltiplas entradas de modelo

```json
{
  "model_list": [
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key1"],
      "api_base": "https://api1.example.com/v1"
    },
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key2"],
      "api_base": "https://api2.example.com/v1"
    },
    {
      "model_name": "gpt4",
      "model": "openai/gpt-5.4",
      "api_keys": ["sk-key3"],
      "api_base": "https://api3.example.com/v1"
    }
  ]
}
```

Ao requisitar o modelo `gpt4`, as requisições serão distribuídas entre os três endpoints usando seleção round-robin.

## Adicionando um novo provedor compatível com OpenAI

Com `model_list`, adicionar um novo provedor não exige nenhuma alteração de código:

```json
{
  "model_list": [
    {
      "model_name": "my-custom-llm",
      "model": "openai/my-model-v1",
      "api_keys": ["your-api-key"],
      "api_base": "https://api.your-provider.com/v1"
    }
  ]
}
```

Basta especificar `openai/` como protocolo (ou omitir para usar o padrão) e fornecer a URL base da API do seu provedor.

## Compatibilidade retroativa

Durante o período de migração, sua configuração V0/V1 existente é migrada automaticamente para V2:

1. Se `model_list` estiver vazio e `providers` tiver dados, o sistema converte internamente
2. Tanto `api_key` (singular) quanto `api_keys` (array) em configs V0/V1 são mesclados no novo array `api_keys`
3. Um aviso de depreciação é registrado: `"providers config is deprecated, please migrate to model_list"`
4. Toda a funcionalidade existente permanece inalterada

## Checklist de migração

- [ ] Identifique todos os provedores que você está usando atualmente
- [ ] Crie entradas em `model_list` para cada provedor
- [ ] Use os prefixos de protocolo apropriados
- [ ] Atualize `agents.defaults.model_name` para referenciar o novo `model_name`
- [ ] Teste se todos os modelos funcionam corretamente
- [ ] Remova ou comente a seção antiga `providers`

## Solução de problemas

### Erro de modelo não encontrado

```
model "xxx" not found in model_list or providers
```

**Solução**: garanta que o `model_name` em `model_list` corresponda ao valor em `agents.defaults.model_name`.

### Erro de protocolo desconhecido

```
unknown protocol "xxx" in model "xxx/model-name"
```

**Solução**: use um prefixo de protocolo suportado. Veja a tabela [Prefixos de protocolo](#prefixos-de-protocolo) acima.

### Erro de chave de API ausente

```
api_key or api_base is required for HTTP-based protocol "xxx"
```

**Solução**: forneça `api_keys` e/ou `api_base` para provedores baseados em HTTP.

## Precisa de ajuda?

- [GitHub Issues](https://github.com/sipeed/picoclaw/issues)
- [Discussion #122](https://github.com/sipeed/picoclaw/discussions/122): proposta original

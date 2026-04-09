---
id: provider-refactoring
title: Design de Refatoração da Arquitetura de Providers
---

# Design de Refatoração da Arquitetura de Providers

> Issue: #283
> Discussion: #122
> Branch: feat/refactor-provider-by-protocol

## 1. Problemas Atuais

### 1.1 Problemas na Estrutura de Configuração

**Estado Atual**: Cada Provider requer um campo predefinido em `ProvidersConfig`

```go
type ProvidersConfig struct {
    Anthropic     ProviderConfig `json:"anthropic"`
    OpenAI        ProviderConfig `json:"openai"`
    DeepSeek      ProviderConfig `json:"deepseek"`
    Qwen          ProviderConfig `json:"qwen"`
    Cerebras      ProviderConfig `json:"cerebras"`
    VolcEngine    ProviderConfig `json:"volcengine"`
    // ... cada novo provider requer alterações aqui
}
```

**Problemas**:
- Adicionar um novo Provider requer modificar código Go (definição de struct)
- A função `CreateProvider` em `http_provider.go` tem mais de 200 linhas de switch-case
- A maioria dos Providers é compatível com OpenAI, mas o código é duplicado

### 1.2 Tendência de Inchaço de Código

PRs recentes demonstram esse problema:

| PR | Provider | Alterações de Código |
|----|----------|---------------------|
| #365 | Qwen | +17 linhas em http_provider.go |
| #333 | Cerebras | +17 linhas em http_provider.go |
| #368 | Volcengine | +18 linhas em http_provider.go |

Cada Provider compatível com OpenAI requer:
1. Modificar `config.go` para adicionar campo de configuração
2. Modificar `http_provider.go` para adicionar caso no switch
3. Atualizar documentação

### 1.3 Acoplamento Agente-Provider

```json
{
  "agents": {
    "defaults": {
      "provider": "deepseek",  // precisa saber o nome do provider
      "model": "deepseek-chat"
    }
  }
}
```

Problema: O agente precisa saber tanto o `provider` quanto o `model`, adicionando complexidade.

---

## 2. Nova Abordagem: model_list

### 2.1 Princípios Fundamentais

Inspirado no design do [LiteLLM](https://docs.litellm.ai/docs/proxy/configs):

1. **Centrado no modelo**: Usuários se importam com modelos, não com providers
2. **Prefixo de protocolo**: Usa formato `protocol/model_name`, ex.: `openai/gpt-5.2`, `anthropic/claude-sonnet-4.6`
3. **Orientado por configuração**: Adicionar novos Providers requer apenas mudanças na configuração, sem alterações de código

### 2.2 Nova Estrutura de Configuração

```json
{
  "model_list": [
    {
      "model_name": "deepseek-chat",
      "model": "openai/deepseek-chat",
      "api_base": "https://api.deepseek.com/v1",
      "api_key": "sk-xxx"
    },
    {
      "model_name": "gpt-5.2",
      "model": "openai/gpt-5.2",
      "api_key": "sk-xxx"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_key": "sk-xxx"
    },
    {
      "model_name": "gemini-3-flash",
      "model": "antigravity/gemini-3-flash",
      "auth_method": "oauth"
    },
    {
      "model_name": "my-company-llm",
      "model": "openai/company-model-v1",
      "api_base": "https://llm.company.com/v1",
      "api_key": "xxx"
    }
  ],

  "agents": {
    "defaults": {
      "model": "deepseek-chat",
      "max_tokens": 8192,
      "temperature": 0.7
    }
  }
}
```

### 2.3 Definição de Struct em Go

```go
type Config struct {
    ModelList []ModelConfig `json:"model_list"`  // novo
    Providers ProvidersConfig `json:"providers"`  // antigo, descontinuado

    Agents   AgentsConfig   `json:"agents"`
    Channels ChannelsConfig `json:"channels"`
    // ...
}

type ModelConfig struct {
    // Obrigatório
    ModelName string `json:"model_name"`  // nome voltado ao usuário (alias)
    Model     string `json:"model"`       // protocol/model, ex.: openai/gpt-5.2

    // Configuração comum
    APIBase   string `json:"api_base,omitempty"`
    APIKey    string `json:"api_key,omitempty"`
    Proxy     string `json:"proxy,omitempty"`

    // Configuração especial do provider
    AuthMethod  string `json:"auth_method,omitempty"`   // oauth, token
    ConnectMode string `json:"connect_mode,omitempty"`  // stdio, grpc

    // Otimizações opcionais
    RPM            int    `json:"rpm,omitempty"`              // limite de taxa
    MaxTokensField string `json:"max_tokens_field,omitempty"` // max_tokens ou max_completion_tokens
}
```

### 2.4 Reconhecimento de Protocolo

Identifica o protocolo pelo prefixo no campo `model`:

| Prefixo | Protocolo | Descrição |
|---------|-----------|-----------|
| `openai/` | Compatível com OpenAI | Mais comum, inclui DeepSeek, Qwen, Groq, etc. |
| `anthropic/` | Anthropic | Específico da série Claude |
| `antigravity/` | Antigravity | Google Cloud Code Assist |
| `gemini/` | Gemini | API nativa do Google Gemini (se necessário) |

---

## 3. Justificativa do Design

### 3.1 Problemas Resolvidos

| Problema | Abordagem Antiga | Nova Abordagem |
|----------|-------------------|----------------|
| Adicionar Provider compatível com OpenAI | Alterar 3 locais de código | Adicionar uma entrada de configuração |
| Agente especifica modelo | Precisa de provider + model | Precisa apenas de model |
| Duplicação de código | Cada Provider duplica lógica | Compartilha implementação de protocolo |
| Suporte multi-agente | Complexo | Naturalmente compatível |

### 3.2 Compatibilidade Multi-Agente

```json
{
  "model_list": [...],

  "agents": {
    "defaults": {
      "model": "deepseek-chat"
    },
    "coder": {
      "model": "gpt-5.2",
      "system_prompt": "You are a coding assistant..."
    },
    "translator": {
      "model": "claude-sonnet-4.6"
    }
  }
}
```

Cada agente precisa apenas especificar `model` (corresponde ao `model_name` em `model_list`).

### 3.3 Comparação com a Indústria

O **LiteLLM** (proxy LLM open-source mais maduro) usa design similar:

```yaml
model_list:
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-5.2
      api_key: xxx
  - model_name: my-custom
    litellm_params:
      model: openai/custom-model
      api_base: https://my-api.com/v1
```

---

## 4. Plano de Migração

### 4.1 Fase 1: Período de Compatibilidade (v1.x)

Suporta tanto `providers` quanto `model_list`:

```go
func (c *Config) GetModelConfig(modelName string) (*ModelConfig, error) {
    // Prefere nova configuração
    if len(c.ModelList) > 0 {
        return c.findModelByName(modelName)
    }

    // Compatibilidade retroativa com configuração antiga
    if !c.Providers.IsEmpty() {
        logger.Warn("'providers' config is deprecated, please migrate to 'model_list'")
        return c.convertFromProviders(modelName)
    }

    return nil, fmt.Errorf("model %s not found", modelName)
}
```

### 4.2 Fase 2: Período de Aviso (v1.x final)

- Exibir avisos mais proeminentes na inicialização
- Fornecer script de migração automática
- Marcar `providers` como descontinuado na documentação

### 4.3 Fase 3: Período de Remoção (v2.0)

- Remover completamente o suporte a `providers`
- Remover campo `agents.defaults.provider`
- Suportar apenas `model_list`

### 4.4 Exemplo de Migração de Configuração

**Configuração Antiga**:
```json
{
  "providers": {
    "deepseek": {
      "api_key": "sk-xxx",
      "api_base": "https://api.deepseek.com/v1"
    }
  },
  "agents": {
    "defaults": {
      "provider": "deepseek",
      "model": "deepseek-chat"
    }
  }
}
```

**Configuração Nova**:
```json
{
  "model_list": [
    {
      "model_name": "deepseek-chat",
      "model": "openai/deepseek-chat",
      "api_base": "https://api.deepseek.com/v1",
      "api_key": "sk-xxx"
    }
  ],
  "agents": {
    "defaults": {
      "model": "deepseek-chat"
    }
  }
}
```

---

## 5. Checklist de Implementação

### 5.1 Camada de Configuração

- [ ] Adicionar struct `ModelConfig`
- [ ] Adicionar campo `Config.ModelList`
- [ ] Implementar método `GetModelConfig(modelName)`
- [ ] Implementar conversão de compatibilidade da configuração antiga
- [ ] Adicionar validação de unicidade do `model_name`

### 5.2 Camada de Provider

- [ ] Criar diretório `pkg/providers/factory/`
- [ ] Implementar `CreateProviderFromModelConfig()`
- [ ] Refatorar `http_provider.go` para `openai/provider.go`
- [ ] Manter compatibilidade retroativa para `CreateProvider()` antigo

### 5.3 Testes

- [ ] Testes unitários da nova configuração
- [ ] Testes de compatibilidade com configuração antiga
- [ ] Testes de integração

### 5.4 Documentação

- [ ] Atualizar README
- [ ] Atualizar config.example.json
- [ ] Escrever guia de migração

---

## 6. Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Quebrar configurações existentes | Período de compatibilidade mantém configuração antiga funcionando |
| Custo de migração para usuários | Fornecer script de migração automática |
| Incompatibilidade de Providers especiais | Manter `auth_method` e outros campos de extensão |

---

## 7. Referências

- [Documentação de Configuração do LiteLLM](https://docs.litellm.ai/docs/proxy/configs)
- [One-API GitHub](https://github.com/songquanpeng/one-api)
- Discussion #122: Refatoração da Arquitetura de Providers

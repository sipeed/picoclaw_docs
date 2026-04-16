---
id: model-list
title: Configuração de Modelos (model_list)
---

# Configuração de Modelos

Para uma experiência de setup mais intuitiva e eficiente, recomendamos configurar os modelos primeiro pela Web UI.

![Web UI Model Setup](/img/providers/webuimodel.png)

Você ainda pode gerenciar modelos manualmente no `config.json` quando precisar de automação ou deployment baseado em templates.

O PicoClaw usa uma abordagem de configuração **centrada no modelo**. Basta especificar `vendor/model-id` para conectar um protocolo de provedor.

Isso possibilita **suporte multi-agente** com seleção flexível de provedores:

- **Agentes diferentes, provedores diferentes**: Cada agente pode usar seu próprio provedor de LLM
- **Fallback de modelos**: Configure modelos primários e de fallback para resiliência
- **Balanceamento de carga**: Distribua requisições entre múltiplos endpoints
- **Configuração centralizada**: Gerencie todos os provedores em um único lugar

## Vendors e Protocolos Suportados

| Vendor | Prefixo `model` | API Base Padrão | Protocolo | Obter Chave de API |
| --- | --- | --- | --- | --- |
| **OpenAI** | `openai/` | `https://api.openai.com/v1` | OpenAI | [Obter Chave](https://platform.openai.com) |
| **Anthropic** | `anthropic/` | `https://api.anthropic.com/v1` | Anthropic | [Obter Chave](https://console.anthropic.com) |
| **Anthropic Messages** | `anthropic-messages/` | `https://api.anthropic.com/v1` | Anthropic Messages | [Obter Chave](https://console.anthropic.com) |
| **Azure OpenAI** | `azure/`, `azure-openai/` | Endpoint Azure customizado | Azure OpenAI | Azure Portal |
| **AWS Bedrock** | `bedrock/` | Região AWS ou endpoint de runtime | Bedrock | Credenciais AWS |
| **Venice AI** | `venice/` | `https://api.venice.ai/api/v1` | Compatível com OpenAI | [Obter Chave](https://venice.ai) |
| **OpenRouter** | `openrouter/` | `https://openrouter.ai/api/v1` | Compatível com OpenAI | [Obter Chave](https://openrouter.ai/keys) |
| **LiteLLM** | `litellm/` | `http://localhost:4000/v1` | Compatível com OpenAI | Proxy local |
| **LM Studio** | `lmstudio/` | `http://localhost:1234/v1` | Compatível com OpenAI | Opcional (padrão local: sem chave) |
| **Groq** | `groq/` | `https://api.groq.com/openai/v1` | Compatível com OpenAI | [Obter Chave](https://console.groq.com) |
| **Zhipu AI (GLM)** | `zhipu/` | `https://open.bigmodel.cn/api/paas/v4` | Compatível com OpenAI | [Obter Chave](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys) |
| **Google Gemini** | `gemini/` | `https://generativelanguage.googleapis.com/v1beta` | Compatível com OpenAI | [Obter Chave](https://aistudio.google.com/api-keys) |
| **NVIDIA** | `nvidia/` | `https://integrate.api.nvidia.com/v1` | Compatível com OpenAI | [Obter Chave](https://build.nvidia.com) |
| **Ollama** | `ollama/` | `http://localhost:11434/v1` | Compatível com OpenAI | Local (sem chave) |
| **Moonshot** | `moonshot/` | `https://api.moonshot.cn/v1` | Compatível com OpenAI | [Obter Chave](https://platform.moonshot.cn) |
| **ShengSuanYun** | `shengsuanyun/` | `https://router.shengsuanyun.com/api/v1` | Compatível com OpenAI | [Obter Chave](https://router.shengsuanyun.com) |
| **DeepSeek** | `deepseek/` | `https://api.deepseek.com/v1` | Compatível com OpenAI | [Obter Chave](https://platform.deepseek.com) |
| **Cerebras** | `cerebras/` | `https://api.cerebras.ai/v1` | Compatível com OpenAI | [Obter Chave](https://cerebras.ai) |
| **Vivgrid** | `vivgrid/` | `https://api.vivgrid.com/v1` | Compatível com OpenAI | [Obter Chave](https://vivgrid.com) |
| **VolcEngine** | `volcengine/` | `https://ark.cn-beijing.volces.com/api/v3` | Compatível com OpenAI | [Obter Chave](https://console.volcengine.com) |
| **vLLM** | `vllm/` | `http://localhost:8000/v1` | Compatível com OpenAI | Local |
| **Qwen (CN)** | `qwen/` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Compatível com OpenAI | [Obter Chave](https://dashscope.console.aliyun.com) |
| **Qwen (Intl)** | `qwen-intl/` | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` | Compatível com OpenAI | [Obter Chave](https://dashscope.console.aliyun.com) |
| **Qwen (US)** | `qwen-us/` | `https://dashscope-us.aliyuncs.com/compatible-mode/v1` | Compatível com OpenAI | [Obter Chave](https://dashscope.console.aliyun.com) |
| **Coding Plan** | `coding-plan/` | `https://coding-intl.dashscope.aliyuncs.com/v1` | Compatível com OpenAI | [Obter Chave](https://z.ai/manage-apikey/apikey-list) |
| **Coding Plan (Anthropic)** | `coding-plan-anthropic/` | `https://coding-intl.dashscope.aliyuncs.com/apps/anthropic` | Compatível com Anthropic | [Obter Chave](https://z.ai/manage-apikey/apikey-list) |
| **Mistral** | `mistral/` | `https://api.mistral.ai/v1` | Compatível com OpenAI | [Obter Chave](https://console.mistral.ai) |
| **Avian** | `avian/` | `https://api.avian.io/v1` | Compatível com OpenAI | [Obter Chave](https://avian.io) |
| **Minimax** | `minimax/` | `https://api.minimaxi.com/v1` | Compatível com OpenAI | [Obter Chave](https://platform.minimaxi.com) |
| **LongCat** | `longcat/` | `https://api.longcat.chat/openai` | Compatível com OpenAI | [Obter Chave](https://longcat.chat/platform) |
| **ModelScope** | `modelscope/` | `https://api-inference.modelscope.cn/v1` | Compatível com OpenAI | [Obter Chave](https://modelscope.cn/my/tokens) |
| **Novita** | `novita/` | `https://api.novita.ai/openai` | Compatível com OpenAI | [Obter Chave](https://novita.ai) |
| **MiMo** | `mimo/` | `https://api.xiaomimimo.com/v1` | Compatível com OpenAI | [Obter Chave](https://platform.xiaomimimo.com) |
| **Antigravity** | `antigravity/` | Google Cloud | OAuth | Apenas OAuth |
| **GitHub Copilot** | `github-copilot/` | `localhost:4321` | gRPC | — |
| **Claude CLI** | `claude-cli/` | N/A | CLI | Auth local do CLI |
| **Codex CLI** | `codex-cli/` | N/A | CLI | Auth local do CLI |

Aliases de protocolo também são suportados, por exemplo: `qwen-international`/`dashscope-intl`, `dashscope-us`, `alibaba-coding`, `qwen-coding`, `alibaba-coding-anthropic`, `copilot`, `claudecli`, e `codexcli`.

## Nota de Seleção de Modelos Locais

Com base em testes práticos com diferentes tamanhos do Qwen3.5:

- **9B**: adequado para demonstrações simples.
- **27B**: consegue concluir tarefas simples do dia a dia.
- **397B-A17B**: consegue lidar com parte de tarefas longas e complexas.

Observações adicionais:

- A série Gemma4 não é otimizada para cenários de Agent. Em seguimento de instruções e iniciativa de chamada de ferramentas, o desempenho é relativamente fraco, então não é recomendado.
- Modelos abaixo de **5B** normalmente têm janela de contexto muito curta e não são adequados para fluxos de trabalho de Agent.

## Qualquer Modelo Compatível via API Base Customizada

Você não está limitado aos vendors listados acima. É possível usar `openai/` ou `anthropic/` com um `api_base` de terceiros para conectar qualquer modelo compatível com OpenAI ou Anthropic.

```json
{
  "model_name": "my-custom-model",
  "model": "openai/my-custom-model",
  "api_base": "https://custom-api.com/v1",
  "api_keys": ["YOUR_API_KEY"]
}
```

## Padrão de Configuração Recomendado

Na versão `2` do schema de configuração, mantenha a estrutura dos modelos em `config.json` e coloque as credenciais em `.security.yml`.
Os snippets abaixo focam nos campos relacionados a modelos. Em um arquivo de configuração completo, mantenha o `"version": 2` no nível superior.

```json
{
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4"
    },
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4-6"
    },
    {
      "model_name": "lmstudio-local",
      "model": "lmstudio/openai/gpt-oss-20b"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gpt-5.4"
    }
  }
}
```

```yaml
# ~/.picoclaw/.security.yml
model_list:
  gpt-5.4:0:
    api_keys:
      - "sk-openai-..."
  claude-sonnet-4.6:0:
    api_keys:
      - "sk-ant-..."
```

## Campos de Entrada do Modelo

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `model_name` | string | Sim | Alias usado em `agents.defaults.model_name` |
| `model` | string | Sim | Formato `vendor/model-id`. O prefixo `vendor/` é usado apenas para resolução de protocolo/API base e não é enviado ao upstream como está. |
| `api_keys` | array | Depende | Chaves de API para este modelo. Sempre que possível, coloque as credenciais em `.security.yml`. |
| `api_base` | string | Não | Sobrescreve a URL base da API padrão |
| `auth_method` | string | Não | Método de autenticação (ex.: `oauth`) |
| `connect_mode` | string | Não | Modo de conexão (ex.: `grpc`, `stdio`) |
| `proxy` | string | Não | Proxy HTTP/SOCKS para as chamadas de API deste modelo |
| `user_agent` | string | Não | Header `User-Agent` customizado para requisições da API |
| `request_timeout` | int | Não | Timeout de requisição em segundos (padrão: 120) |
| `rpm` | int | Não | Limite de taxa — requisições por minuto (veja [Rate Limiting](../rate-limiting.md)) |

:::warning `api_key` no `config.json`
Na versão `2` do schema de configuração, `model_list[].api_key` em `config.json` é ignorado. Use `.security.yml` com `api_keys` para credenciais de modelos. Valores legados de `api_key` só são mesclados durante a migração de V0/V1.
:::

## Como Funciona a Resolução do Prefixo `model`

- `openai/gpt-5.4` -> protocolo é `openai`, modelo enviado ao upstream é `gpt-5.4`
- `lmstudio/openai/gpt-oss-20b` -> protocolo é `lmstudio`, modelo enviado ao upstream é normalizado para `openai/gpt-oss-20b`
- `openrouter/openai/gpt-5.4` -> protocolo é `openrouter`, modelo enviado ao upstream é `openai/gpt-5.4`

## Exemplos por Vendor

### OpenAI

```json
{
  "model_name": "gpt-5.4",
  "model": "openai/gpt-5.4"
}
```

### VolcEngine (Doubao)

```json
{
  "model_name": "ark-code-latest",
  "model": "volcengine/ark-code-latest"
}
```

### Anthropic (Claude)

```json
{
  "model_name": "claude",
  "model": "anthropic/claude-sonnet-4-6"
}
```

> Execute `picoclaw auth login --provider anthropic` para colar seu token de API.

### OpenRouter

```json
{
  "model_name": "openrouter-gpt",
  "model": "openrouter/openai/gpt-5.4"
}
```

### LM Studio (Local)

```json
{
  "model_name": "lmstudio-local",
  "model": "lmstudio/openai/gpt-oss-20b"
}
```

`api_base` tem como padrão `http://localhost:1234/v1`. A chave de API é opcional, a menos que o seu servidor LM Studio tenha autenticação habilitada.

### Azure OpenAI

```json
{
  "model_name": "azure-gpt5",
  "model": "azure/my-gpt5-deployment",
  "api_base": "https://your-resource.openai.azure.com"
}
```

### Ollama (Local)

```json
{
  "model_name": "llama3",
  "model": "ollama/llama3"
}
```

### Bedrock

```json
{
  "model_name": "bedrock-claude",
  "model": "bedrock/us.anthropic.claude-sonnet-4-20250514-v1:0",
  "api_base": "us-east-1"
}
```

### Endpoint Customizado Compatível com OpenAI

```json
{
  "model_name": "my-proxy-model",
  "model": "openai/custom-model",
  "api_base": "https://my-proxy.com/v1"
}
```

### Timeout de Requisição por Modelo

```json
{
  "model_name": "slow-model",
  "model": "openai/o1-preview",
  "request_timeout": 300
}
```

## Balanceamento de Carga

Configure múltiplas entradas com o mesmo `model_name` e o PicoClaw fará round-robin entre elas:

```json
{
  "model_list": [
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_base": "https://api1.example.com/v1"
    },
    {
      "model_name": "gpt-5.4",
      "model": "openai/gpt-5.4",
      "api_base": "https://api2.example.com/v1"
    }
  ]
}
```

## Migração do `providers` Legado

O `providers` legado não faz parte da versão `2` do schema de configuração. O PicoClaw apenas mantém compatibilidade de migração para configurações V0/V1 antigas e as converte para `model_list` durante o carregamento.
Em um arquivo de configuração schema v2 completo, mantenha `"version": 2` no nível superior.

**Configuração Antiga (descontinuada):**

```json
{
  "providers": {
    "zhipu": {
      "api_key": "your-key",
      "api_base": "https://open.bigmodel.cn/api/paas/v4"
    }
  },
  "agents": {
    "defaults": {
      "provider": "zhipu",
      "model_name": "glm-4.7"
    }
  }
}
```

**Configuração Nova (recomendada):**

```json
{
  "model_list": [
    {
      "model_name": "glm-4.7",
      "model": "zhipu/glm-4.7"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "glm-4.7"
    }
  }
}
```

Consulte o [Migration Guide](../migration/model-list-migration.md) completo para mais detalhes.

## Transcrição de Voz

:::note
O Groq oferece **transcrição de voz gratuita** via Whisper. Se configurado, mensagens de voz do Telegram serão transcritas automaticamente.
:::

```json
{
  "model_list": [
    {
      "model_name": "whisper",
      "model": "groq/whisper-large-v3"
    }
  ]
}
```

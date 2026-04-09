---
id: openai-api
title: OpenAI API
---

# Guia de Configuração da OpenAI API

## Visão Geral

A **OpenAI API** é uma interface de IA de uso geral fornecida pela OpenAI, com suporte a geração de texto, conversas, geração de código e mais. Oferece uma especificação de interface altamente unificada e é amplamente suportada.

A OpenAI disponibiliza várias séries de modelos para diferentes cenários de desempenho e custo:

| Modelo | Características | Casos de Uso |
|-------|----------|-----------|
| gpt-4o-mini | Rápido, baixo custo | Alta concorrência, conversas do dia a dia |
| gpt-4o | Multimodal de alta qualidade | Tarefas complexas, compreensão de imagens |
| gpt-4.1 | Capacidades mais fortes de raciocínio e código | Geração de código, raciocínio lógico |

---

## Obtendo a API Key

### Passo 1: Acesse a Plataforma OpenAI

Vá até a [OpenAI Platform](https://platform.openai.com/) e faça login na sua conta.

### Passo 2: Gerar a API Key

1. Navegue até **Dashboard → API Keys**
2. Clique em **"Create new secret key"**
3. **Copie e guarde** sua API Key

> ⚠️ **Atenção**: a API Key é exibida apenas uma vez. Mantenha-a segura e não a compartilhe.

![API Keys Page](/img/providers/openaiapi.png)

![Create New API Key](/img/providers/openaiapi1.png)

---

## Configurando o PicoClaw

### Opção 1: Usando a WebUI (Recomendado)

O PicoClaw oferece uma interface WebUI onde você pode configurar modelos facilmente sem editar os arquivos de configuração manualmente.

Edite as configurações do preset, ou clique no botão **"Add Model"** no canto superior direito:

![Add Model](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Model Alias | Nome personalizado, ex.: `gpt-4o` |
| Model Identifier | `openai/gpt-4o-mini` (ou outros modelos suportados) |
| API Key | OpenAI API Key (`sk-xxxxx`) |
| API Base URL | Deixe em branco (padrão: `https://api.openai.com/v1`) |

### Opção 2: Editar o Arquivo de Configuração

Adicione os modelos da OpenAI em `config.json` (o schema v2 usa `api_keys`):

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o-mini",
      "model": "openai/gpt-4o-mini",
      "api_keys": ["YOUR_OPENAI_API_KEY_HERE"]
    },
    {
      "model_name": "gpt-4o",
      "model": "openai/gpt-4o",
      "api_keys": ["YOUR_OPENAI_API_KEY_HERE"]
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

A OpenAI usa um modelo **Pay-as-you-go**, cobrando com base no uso real de tokens.

### Rate Limits

Diferentes tiers de conta e modelos têm limites diferentes:

- **RPM** (Requests Per Minute): número de requisições por minuto
- **TPM** (Tokens Per Minute): número de tokens por minuto

Ao exceder os limites, você recebe um erro `429 Too Many Requests`.

---

## Problemas Comuns

### Erro de max_tokens

```
Invalid max_tokens value
```

**Causa**: excede o limite do modelo

**Solução**: reduza o valor do parâmetro `max_tokens` (ex.: 1024 ou 2048)

### Erro 429 de Rate Limit

**Soluções**:

- Reduza a frequência de requisições
- Faça upgrade do tier da sua conta OpenAI
- Ative o rate limiting de requisições no PicoClaw

### Não consigo conectar à API

**Cheque o seguinte**:

- A `base_url` está correta? (Padrão: `https://api.openai.com/v1`)
- Você precisa de um proxy? (Para usuários na China continental)
- A resolução de DNS está funcionando corretamente?
- Conectividade de rede

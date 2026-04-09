---
id: gemini-api
title: Gemini API (Google AI Studio)
---

# Guia de Configuração da Gemini API

## Visão Geral

A **Gemini API** é a interface de IA do Google fornecida pelo **Google AI Studio**. Comparada ao Vertex AI do Google Cloud, o AI Studio oferece um método de autenticação mais simples via **API Key**, ideal para desenvolvimento rápido e integração pessoal.

O Gemini oferece várias séries de modelos para diferentes cenários de desempenho e custo:

| Modelo | Características | Casos de Uso |
|-------|----------|-----------|
| gemini-2.0-flash | Rápido, baixo custo | Alta concorrência, conversas do dia a dia |
| gemini-1.5-pro | Multimodal de alta qualidade | Tarefas complexas, compreensão de contexto longo |
| gemini-1.5-flash | Desempenho e custo equilibrados | Casos de uso gerais |

---

## Obtendo a API Key

### Passo 1: Acesse o Google AI Studio

Vá até o [Google AI Studio](https://aistudio.google.com/) e faça login com sua conta Google.

### Passo 2: Gerar a API Key

1. Clique em **"Get API key"** na barra de navegação à esquerda
2. Clique em **"Create API key in new project"** (ou selecione um projeto existente no Google Cloud)
3. **Copie e guarde** sua API Key

> ⚠️ **Atenção**: mantenha sua API Key segura e não a exponha em repositórios de código públicos.

![Gemini API Key](/img/providers/geminiapi.png)

![Gemini API Key](/img/providers/geminiapi1.png)

---

## Configurando o PicoClaw

### Opção 1: Usando a WebUI (Recomendado)

O PicoClaw oferece uma interface WebUI onde você pode configurar modelos facilmente sem editar os arquivos de configuração manualmente.

Edite as configurações do preset, ou clique no botão **"Add Model"** no canto superior direito:

![Add Model](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Model Alias | Nome personalizado, ex.: `gemini-flash` |
| Model Identifier | `gemini/gemini-2.0-flash` (ou outros modelos suportados) |
| API Key | API Key do Google AI Studio |
| API Base URL | Deixe em branco (usa o padrão) |

### Opção 2: Editar o Arquivo de Configuração

Adicione os modelos Gemini em `config.json` (o schema v2 usa `api_keys`):

```json
{
  "model_list": [
    {
      "model_name": "gemini-flash",
      "model": "gemini/gemini-2.0-flash",
      "api_keys": ["YOUR_GEMINI_API_KEY_HERE"]
    },
    {
      "model_name": "gemini-pro",
      "model": "gemini/gemini-1.5-pro",
      "api_keys": ["YOUR_GEMINI_API_KEY_HERE"]
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "gemini-flash"
    }
  }
}
```

Em produção, mantenha as chaves em `~/.picoclaw/.security.yml` e deixe o `config.json` focado na estrutura dos modelos.

---

## Limites e Cotas

### Plano Gratuito

O Google AI Studio oferece um plano gratuito para desenvolvedores:

- **Cota Gratuita**: allowance diária de requisições gratuitas
- **Rate Limits**: limites de requisições por minuto (RPM) no plano gratuito
- **Privacidade de Dados**: no plano gratuito, o Google pode usar os dados de entrada/saída para melhorar os modelos

### Plano Pago

Para cotas maiores ou proteção de privacidade em nível empresarial, faça upgrade para o plano pago ou use o Google Cloud Vertex AI.

---

## Problemas Comuns

### API Key Inválida

**Causa**: API Key expirada ou revogada

**Solução**: Gere uma nova API Key no Google AI Studio

### Timeout na Requisição

**Causa**: problemas de rede ou requisições em excesso

**Soluções**:
- Verifique a conexão de rede
- Reduza a frequência de requisições
- Use um proxy, se necessário

### Modelo Indisponível

**Causa**: alguns modelos não estão disponíveis em determinadas regiões

**Soluções**:
- Verifique se o modelo é suportado na sua região
- Tente usar outros modelos Gemini

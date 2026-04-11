---
id: moonshot-api
title: Moonshot (Kimi) API
---

# Guia de Configuração do Moonshot (Kimi)

## Visão Geral

**Kimi** (Moonshot) é uma das startups de grandes modelos mais observadas na China, começando com capacidades de processamento de contexto ultra-longo. A série Kimi-K2 alcançou avanços significativos na geração de código e raciocínio complexo, classificando-se entre os melhores modelos da China.

A Plataforma Open do Kimi fornece interfaces padrão compatíveis com OpenAI com integração simples, tornando-a uma excelente escolha para desenvolvedores que desejam experimentar as melhores capacidades de inferência da China.

![Visão Geral do Kimi](/img/providers/kimi-overview.png)

Documentação Oficial: https://platform.kimi.com/docs/api/chat

***Nota**: A associação Kimi Code restringe explicitamente o uso apenas no Claude Code e Roo Code*

*Usar a Chave da API de associação no PicoClaw carrega risco de banimento da conta*

*Este artigo apresenta apenas a API pay-as-you-go da platform.kimi.com*

## Obtendo Chave da API

### Passo 1: Visitar Plataforma

Acesse [Plataforma Open do Kimi](https://platform.kimi.com/), registre-se e faça login.

### Passo 2: Criar Chave da API

1. Entre no Console → página **API Keys**
2. Crie Chave da API, copie e salve com segurança

   *⚠️ **Nota**: A Chave da API é mostrada apenas uma vez, salve imediatamente.*

### Modelos e Preços

| Modelo | Entrada (Cache Hit) | Entrada (Cache Miss) | Saída | Comprimento do Contexto |
|--------|---------------------|-----------------------|-------|-------------------------|
| kimi-k2.5 | ¥0.70/M tokens | ¥4.00/M tokens | ¥21.00/M tokens | 262.144 tokens |

## Configurando PicoClaw

### Opção 1: Usando WebUI (Recomendado)

Abra o WebUI do PicoClaw, vá para a página **Models** na navegação esquerda, clique em "Adicionar Modelo" no canto superior direito:

![Adicionar Modelo](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Alias do Modelo | Nome personalizado, ex., kimi |
| Identificador do Modelo | moonshot/kimi-k2.5 |
| Chave da API | Sua Chave da API do Kimi |
| URL Base da API | Deixe vazio (usa automaticamente o endpoint padrão) |

### Opção 2: Editar Arquivo de Configuração

config.json:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "kimi",
      "model": "moonshot/kimi-k2.5"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "kimi"
    }
  }
}
```

~/.picoclaw/.security.yml:

```yaml
model_list:
  kimi:0:
    api_keys:
      - "your-kimi-api-key"
```

O prefixo do protocolo moonshot tem endpoint padrão integrado https://api.moonshot.cn/v1, não é necessário preencher api_base

## Notas

- Não use a Chave da API de associação Kimi Code, use apenas a Chave da API pay-as-you-go da platform.kimi.com
- Para produção, armazene a Chave da API em .security.yml, evite texto simples no config.json
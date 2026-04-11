---
id: zhipu-api
title: Zhipu AI (GLM) API
---

# Guia de Configuração do Zhipu AI (GLM)

## Visão Geral

**Zhipu AI** é uma força importante no campo de grandes modelos da China, confiando no profundo background acadêmico da Universidade Tsinghua. Os modelos da série GLM continuam avançando na compreensão chinesa, geração de código e raciocínio complexo.

GLM-4.7 tornou-se uma escolha confiável para tarefas diárias de programação com desempenho equilibrado e alta custo-efetividade, enquanto a série GLM-5 compara-se aos melhores modelos internacionais em tarefas complexas.

O Plano de Codificação Zhipu fornece aos desenvolvedores cotas de assinatura estáveis e é uma parte importante do ecossistema de programação AI da China.

![Plano de Codificação Zhipu](/img/providers/zhipu-coding-plan.png)

Documentação Oficial: https://docs.bigmodel.cn/cn/coding-plan/tool/openclaw

## Obtendo Chave da API

### Passo 1: Visitar Plataforma

Acesse [Plataforma Open do Zhipu AI](https://open.bigmodel.cn/), registre-se e faça login.

### Passo 2: Criar Chave da API

1. Assine o Plano de Codificação (ou pay-as-you-go)
2. Crie e copie a Chave da API na página de gerenciamento de Chave da API do console.

   *⚠️ **Nota**: A Chave da API é mostrada apenas uma vez, salve imediatamente.*

## Configurando PicoClaw

### Plano de Codificação (Recomendado)

### Modelos Suportados

| Modelo | Descrição |
|--------|-----------|
| GLM-4.7 | Recomendado para a maioria das tarefas, uso de cota mais econômico |
| GLM-5.1 | Modelo de alta ponta, comparável ao Claude Opus. Consome 3x cota durante pico, 2x durante fora do pico |
| GLM-5 | Modelo de alta ponta, mesmo coeficiente de consumo que GLM-5.1 |
| GLM-5-Turbo | Modelo de alta ponta, mesmo coeficiente de consumo que GLM-5.1 |
| GLM-4.6 | Mais opções |
| GLM-4.5 | Mais opções |
| GLM-4.5-Air | Mais opções |
| GLM-4.5V | Mais opções |
| GLM-4.6V | Mais opções |

*Recomende usar GLM-4.7 primeiro, mude para GLM-5.1 apenas para tarefas particularmente complexas para evitar consumir cota muito rapidamente.*

*Não selecione modelos Flash, FlashX, etc., caso contrário, o saldo da conta será deduzido.*

### Opção 1: Usando WebUI (Recomendado)

Abra o WebUI do PicoClaw, vá para a página **Models** na navegação esquerda, clique em "Adicionar Modelo" no canto superior direito:

![Adicionar Modelo](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Alias do Modelo | Nome personalizado, ex., glm |
| Identificador do Modelo | zhipu/GLM-4.7 (ou outros modelos suportados) |
| Chave da API | Sua Chave da API do Zhipu |
| URL Base da API | https://open.bigmodel.cn/api/coding/paas/v4 |

### Opção 2: Editar Arquivo de Configuração

config.json:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "glm",
      "model": "zhipu/GLM-4.7",
      "api_base": "https://open.bigmodel.cn/api/coding/paas/v4"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "glm"
    }
  }
}
```

~/.picoclaw/.security.yml:

```yaml
model_list:
  glm:0:
    api_keys:
      - "your-zhipu-api-key"
```

### Pay-as-you-go

### Opção 1: Usando WebUI

| Campo | Valor |
|-------|-------|
| Alias do Modelo | Nome personalizado, ex., glm |
| Identificador do Modelo | zhipu/GLM-4.7 |
| Chave da API | Sua Chave da API do Zhipu |
| URL Base da API | Deixe vazio (usa automaticamente o endpoint padrão) |

### Opção 2: Editar Arquivo de Configuração

config.json:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "glm",
      "model": "zhipu/GLM-4.7"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "glm"
    }
  }
}
```

~/.picoclaw/.security.yml:

```yaml
model_list:
  glm:0:
    api_keys:
      - "your-zhipu-api-key"
```

O prefixo do protocolo zhipu tem endpoint padrão integrado https://open.bigmodel.cn/api/paas/v4, não é necessário preencher api_base

## Notas

- O endpoint do Plano de Codificação é https://open.bigmodel.cn/api/coding/paas/v4, o endpoint pay-as-you-go é https://open.bigmodel.cn/api/paas/v4, eles são diferentes, não preencha errado
- Pay-as-you-go deduz diretamente do saldo da conta, recomende usar Plano de Codificação primeiro
- GLM-5.1, GLM-5, GLM-5-Turbo consomem cota rapidamente, recomende GLM-4.7 para tarefas diárias
- Para produção, armazene a Chave da API em .security.yml, evite texto simples no config.json
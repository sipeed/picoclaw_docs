---
id: qwen-api
title: Alibaba Bailian (Qwen) API
---

# Guia de Configuração do Alibaba Bailian (Qwen)

## Visão Geral

**Alibaba Bailian** é a plataforma de serviço de grandes modelos da Alibaba Cloud, confiando na poderosa infraestrutura da Alibaba Cloud para fornecer serviços de inferência estáveis e de baixa latência.

Os modelos da série Tongyi Qianwen (Qwen) continuam liderando nas direções de código, multilíngue e contexto longo. Qwen3.5-Plus classificou-se entre os melhores em vários benchmarks globais.

O Plano de Codificação Bailian é um pacote de assinatura que agrupa vários modelos de topo, tornando-o um dos pacotes de programação AI mais econômicos para desenvolvedores domésticos.

Documentação Oficial: https://help.aliyun.com/zh/model-studio/coding-plan

![Plano de Codificação Alibaba Bailian](/img/providers/qwen-coding-plan.png)

## Obtendo Chave da API

O Alibaba Bailian oferece dois métodos de uso: **pacote de assinatura do Plano de Codificação** (recomendado) e **pay-as-you-go**.

Eles usam endpoints e Chaves da API diferentes, por favor, distingua entre eles.

### Chave Exclusiva do Plano de Codificação

1. Visite [Página do Plano de Codificação Alibaba Bailian](https://bailian.console.aliyun.com/coding-plan)

2. Após assinar o plano, obtenha a **Chave da API Exclusiva do Plano de Codificação** (formato: sk-sp-xxxxx) na página.

   *⚠️ A Chave Exclusiva do Plano de Codificação é diferente da Chave da API Bailian comum. Obtenha separadamente na página do Plano de Codificação.*

### Chave Pay-as-you-go

1. Visite [Console Alibaba Bailian](https://bailian.console.aliyun.com/)

   ![Console Alibaba Bailian](/img/providers/qwen-console.png)

2. Crie uma Chave da API comum na página de gerenciamento de Chave da API.

## Configurando PicoClaw

### Plano de Codificação (Recomendado)

O Plano de Codificação suporta vários modelos mainstream como qwen3.5-plus, kimi-k2.5, glm-5, MiniMax-M2.5.

### Modelos Suportados

| Modelo | Descrição |
|--------|-----------|
| qwen3.5-plus | Recomendado, suporta compreensão de imagem |
| kimi-k2.5 | Recomendado, suporta compreensão de imagem |
| glm-5 | Recomendado |
| MiniMax-M2.5 | Recomendado |
| qwen3-max-2026-01-23 | Mais opções |
| qwen3-coder-next | Mais opções |
| qwen3-coder-plus | Mais opções |
| glm-4.7 | Mais opções |

### Opção 1: Usando WebUI (Recomendado)

Abra o WebUI do PicoClaw, vá para a página **Models** na navegação esquerda, clique em "Adicionar Modelo" no canto superior direito:

![Adicionar Modelo](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Alias do Modelo | Nome personalizado, ex., qwen-coding |
| Identificador do Modelo | openai/qwen3.5-plus (ou outros modelos suportados) |
| Chave da API | Chave da API Exclusiva do Plano de Codificação (sk-sp-xxxxx) |
| URL Base da API | https://coding.dashscope.aliyuncs.com/v1 |

### Opção 2: Editar Arquivo de Configuração

config.json:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "qwen-coding",
      "model": "openai/qwen3.5-plus",
      "api_base": "https://coding.dashscope.aliyuncs.com/v1"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "qwen-coding"
    }
  }
}
```

~/.picoclaw/.security.yml:

```yaml
model_list:
  qwen-coding:0:
    api_keys:
      - "sk-sp-your-coding-plan-key"
```

### Pay-as-you-go

### Opção 1: Usando WebUI

| Campo | Valor |
|-------|-------|
| Alias do Modelo | Nome personalizado, ex., qwen |
| Identificador do Modelo | qwen/qwen3.5-plus (ou outros modelos) |
| Chave da API | Chave da API Bailian comum |
| URL Base da API | Deixe vazio (usa automaticamente o endpoint padrão) |

### Opção 2: Editar Arquivo de Configuração

config.json:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "qwen",
      "model": "qwen/qwen3.5-plus"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "qwen"
    }
  }
}
```

~/.picoclaw/.security.yml:

```yaml
model_list:
  qwen:0:
    api_keys:
      - "your-ordinary-bailian-api-key"
```

## Limites e Cotas

### Cobrança

O Plano de Codificação usa um modelo de assinatura, enquanto pay-as-you-go cobra com base no uso real.

### Limites de Taxa

Planos diferentes têm limites de taxa diferentes. Consulte a documentação oficial para detalhes.
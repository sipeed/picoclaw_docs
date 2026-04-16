---
id: volcengine-api
title: VolcEngine (Doubao) API
---

# Guia de Configuração do VolcEngine (Doubao)

## Visão Geral

**VolcEngine** é a plataforma de serviço em nuvem da ByteDance. A série de grandes modelos Doubao se destaca na velocidade de resposta e estabilidade de concorrência graças à profunda expertise da ByteDance em sistemas de recomendação e engenharia em grande escala.

A Plataforma Ark do VolcEngine agrega modelos de topo de Doubao, MiniMax, Kimi, GLM, DeepSeek, etc., através do Plano de Codificação, fornecendo aos desenvolvedores grande conveniência por meio de interfaces unificadas e preços de assinatura. É um dos pacotes de agregação de modelos mais abrangentes da China.

![Plataforma Ark do VolcEngine](/img/providers/volcengine-ark.png)

Documentação Oficial: https://www.volcengine.com/docs/82379/1928262?lang=zh

## Obtendo Chave da API

### Passo 1: Visitar Plataforma

Acesse [Console Ark do VolcEngine](https://console.volcengine.com/ark), registre-se e faça login.

### Passo 2: Assinar Plano e Obter Chave

1. Assine o Plano de Codificação (ou pay-as-you-go)
2. Crie e copie a Chave da API na página de gerenciamento de Chave da API do console.

## Configurando PicoClaw

### Plano de Codificação (Recomendado)

### Uso do Plano

| Plano | Por 5 Horas | Semanal | Por Mês de Assinatura |
|-------|-------------|---------|-----------------------|
| Lite | ~1.200 chamadas | ~9.000 chamadas | ~18.000 chamadas |
| Pro | ~6.000 chamadas | ~45.000 chamadas | ~90.000 chamadas |

### Modelos Suportados

| Modelo | Descrição |
|--------|-----------|
| Doubao-Seed-2.0-pro | Bandeira Doubao |
| Doubao-Seed-2.0-lite | Leve Doubao |
| Doubao-Seed-2.0-Code | Especializado em código Doubao |
| Doubao-Seed-Code | Código Doubao |
| MiniMax-M2.5 | MiniMax |
| Kimi-K2.5 | Kimi |
| GLM-4.7 | Zhipu GLM |
| DeepSeek-V3.2 | DeepSeek |
| ark-code-latest | Selecionar automaticamente o modelo ótimo |

*Ao usar ark-code-latest, você pode alternar modelos alvo na página de gerenciamento do VolcEngine ou habilitar o modo Auto para seleção automática do sistema. As mudanças entram em vigor em 3-5 minutos.*

### Opção 1: Usando WebUI (Recomendado)

Abra o WebUI do PicoClaw, vá para a página **Models** na navegação esquerda, clique em "Adicionar Modelo" no canto superior direito:

![Adicionar Modelo](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Alias do Modelo | Nome personalizado, ex., volcengine |
| Identificador do Modelo | volcengine/Doubao-Seed-2.0-pro (ou outros modelos suportados) |
| Chave da API | Chave da API do VolcEngine |
| URL Base da API | https://ark.cn-beijing.volces.com/api/coding/v3 |

### Opção 2: Editar Arquivo de Configuração

config.json:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "volcengine",
      "model": "volcengine/Doubao-Seed-2.0-pro",
      "api_base": "https://ark.cn-beijing.volces.com/api/coding/v3"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "volcengine"
    }
  }
}
```

*Se usar roteamento automático ark-code-latest, mude o modelo para volcengine/ark-code-latest*

~/.picoclaw/.security.yml:

```yaml
model_list:
  volcengine:0:
    api_keys:
      - "your-volcengine-api-key"
```

### Pay-as-you-go

### Opção 1: Usando WebUI

| Campo | Valor |
|-------|-------|
| Alias do Modelo | Nome personalizado, ex., volcengine |
| Identificador do Modelo | volcengine/Doubao-Seed-2.0-pro (ou outros modelos) |
| Chave da API | Chave da API do VolcEngine |
| URL Base da API | Deixe vazio (usa automaticamente o endpoint padrão) |

### Opção 2: Editar Arquivo de Configuração

config.json:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "volcengine",
      "model": "volcengine/Doubao-Seed-2.0-pro"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "volcengine"
    }
  }
}
```

~/.picoclaw/.security.yml:

```yaml
model_list:
  volcengine:0:
    api_keys:
      - "your-volcengine-api-key"
```

O prefixo do protocolo volcengine tem endpoint padrão integrado https://ark.cn-beijing.volces.com/api/v3, não é necessário preencher api_base

## Notas

- O endpoint do Plano de Codificação é https://ark.cn-beijing.volces.com/api/coding/v3, o endpoint pay-as-you-go é https://ark.cn-beijing.volces.com/api/v3, eles são diferentes, não preencha errado
- Pay-as-you-go deduz diretamente do saldo da conta, recomende usar Plano de Codificação primeiro
- Para produção, armazene a Chave da API em .security.yml, evite texto simples no config.json
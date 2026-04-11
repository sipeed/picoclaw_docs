---
id: minimax-api
title: MiniMax API
---

# Guia de Configuração do MiniMax

## Visão Geral

**MiniMax** é uma empresa líder em grandes modelos multimodais na China. A série MiniMax-M2 se destaca na compreensão de contexto longo, processamento multimodal e capacidades de raciocínio.

O Plano de Token do MiniMax fornece cotas de solicitação de alta frequência por meio de assinaturas, e os planos de edição de velocidade fornecem garantias de throughput suficientes para cenários de alta concorrência, tornando-o uma excelente escolha para desenvolvedores que buscam estabilidade e velocidade.

![Visão Geral do MiniMax](/img/providers/minimax-overview.png)

Documentação Oficial: https://platform.minimaxi.com/docs/token-plan/intro

## Obtendo Chave da API

O MiniMax oferece **pacotes de assinatura do Plano de Token** e **pay-as-you-go**, ambos usando o mesmo endpoint, mas Chaves da API diferentes. Obtenha da página correspondente.

### Chave Exclusiva do Plano de Token

1. Visite [Plataforma Open do MiniMax](https://platform.minimaxi.com/), registre-se e faça login
2. Vá para [Página de Assinatura](https://platform.minimaxi.com/subscribe/token-plan) para assinar um plano
3. Obtenha Chave da API exclusiva na página de gerenciamento do plano

### Chave Pay-as-you-go

1. Visite [Plataforma Open do MiniMax](https://platform.minimaxi.com/), registre-se e faça login
2. Crie Chave da API na página API Keys do console

   *⚠️ **Nota**: A Chave da API é mostrada apenas uma vez, salve imediatamente.*

### Uso do Plano de Token (solicitações M2.7 apenas)

| Plano | Solicitações por 5 horas |
|-------|---------------------------|
| Starter | 600 chamadas |
| Plus | 1.500 chamadas |
| Max | 4.500 chamadas |
| Plus-Speed | 1.500 chamadas (M2.7-highspeed) |
| Max-Speed | 4.500 chamadas (M2.7-highspeed) |
| Ultra-Speed | 30.000 chamadas (M2.7-highspeed) |

Os planos de edição de velocidade podem usar o modelo MiniMax-M2.7-highspeed, velocidade mais rápida.

## Configurando PicoClaw

### Opção 1: Usando WebUI (Recomendado)

Abra o WebUI do PicoClaw, vá para a página **Models** na navegação esquerda, clique em "Adicionar Modelo" no canto superior direito:

![Adicionar Modelo](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Alias do Modelo | Nome personalizado, ex., minimax |
| Identificador do Modelo | minimax/MiniMax-M2.7 (use minimax/MiniMax-M2.7-highspeed para edição de velocidade) |
| Chave da API | Sua Chave da API do MiniMax |
| URL Base da API | Deixe vazio (usa automaticamente o endpoint padrão) |

### Opção 2: Editar Arquivo de Configuração

config.json:

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "minimax",
      "model": "minimax/MiniMax-M2.7"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "minimax"
    }
  }
}
```

*Para edição de velocidade, mude o modelo para minimax/MiniMax-M2.7-highspeed*

~/.picoclaw/.security.yml:

```yaml
model_list:
  minimax:0:
    api_keys:
      - "your-minimax-api-key"
```

O prefixo do protocolo minimax tem endpoint padrão integrado https://api.minimaxi.com/v1, não é necessário preencher api_base

## Notas

- Plano de Token e pay-as-you-go usam o mesmo endpoint, mas as Chaves da API são diferentes, obtenha da página correspondente
- O modelo de edição de velocidade MiniMax-M2.7-highspeed está disponível apenas quando assinado aos planos de edição de velocidade
- Para produção, armazene a Chave da API em .security.yml, evite texto simples no config.json
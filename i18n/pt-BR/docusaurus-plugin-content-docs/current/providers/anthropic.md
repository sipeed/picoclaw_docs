---
id: Anthropic-api
title: Claude(Anthropic) API
---
# Guia de Configuração da API do Claude (Anthropic)

## Visão geral

O **Claude (Anthropic)** oferece o método de **pagamento por uso (Pay-as-you-go)**, realizado por meio da chave API oficial da Anthropic, com cobrança baseada na quantidade real de tokens consumidos.

> ⚠️ **Observação importante**
>
> 
>
> - Os **planos de assinatura** do Claude (Pro / Max / Team / Enterprise) e a **API** são dois produtos **totalmente separados**. Os planos de assinatura são válidos apenas para a interface web, desktop e mobile do claude.ai, **não incluem permissão de uso da API** e não podem ser utilizados em ferramentas de desenvolvimento como o PicoClaw.
> - A API nativa da Anthropic utiliza o formato de interface `/v1/messages`, **não sendo** compatível com a interface da OpenAI (`/v1/chat/completions`). O uso do modo compatível com a OpenAI desativará funções essenciais como cache de prompt, raciocínio estendido e processamento de PDF.
> - A chamada do Claude em ferramentas de terceiros por meio do token OAuth da conta de assinatura **viola os Termos de Serviço da Anthropic** e esse método foi oficialmente bloqueado em abril de 2026; não tente utilizá-lo.

Documentação oficial: https://docs.anthropic.com/en/api/getting-started

---



![image-20260409215655752](/img/providers/Claude(Anthropic)1.png)

## Obtenção da chave API

1. Acesse o console da Anthropic [Anthropic Console](https://console.anthropic.com/), registe-se e inicie sessão
* No menu de navegação à esquerda, vá para a página API Keys e clique em "Create Key" para gerar a API Key
* Na página Billing, adicione um método de pagamento e faça um depósito; as chamadas à API serão debitadas do saldo conforme o uso real de Tokens

![image-20260409215733096](/img/providers/Claude(Anthropic)2.png)

### Modalidade de cobrança

|      Modelo       | Entrada (por milhão de tokens) | Saída (por milhão de tokens) |
| :------: | :-----------: | :---------------------------------------------------------------------------------------: |
| claude-sonnet-4.6 |             US$ 3              |            US$ 15            |
|  claude-opus-4.6  |             US$ 15             |            US$ 75            |
| claude-haiku-4.6  |            US$ 0,8             |            US$ 4             |

> Os preços mais recentes seguem a página oficial de preços da Anthropic.

### Modelos suportados

|           Modelo           |                          Descrição                           |
| :------------------------: | :-------------------------------------------------------------------------: |
|     claude-sonnet-4.6      | Recomendado, equilíbrio entre desempenho e custo, excelente contexto longo |
|      claude-opus-4.6       | Modelo avançado, raciocínio complexo, contexto muito extenso |
|      claude-haiku-4.6      |          Modelo leve, resposta rápida, baixo custo           |
| claude-3-5-sonnet-20241022 |        Versão estável clássica, ampla compatibilidade        |

> Para codificação diária, priorize o **claude-sonnet-4.6**; mude para o Opus apenas em tarefas complexas para evitar consumo excessivo de créditos.

## Configuração do PicoClaw



### Configuração na interface web

Abra a WebUI do PicoClaw, acesse a página **Modelos** no menu lateral esquerdo e clique em **Adicionar modelo** no canto superior direito.

![image-20260409221239555](/img/providers/Claude(Anthropic)3.png)

|          Campo          |                  Conteúdo a preencher                   |
| :---------------------: | :-----------------------------------------------------: |
|     Nome do modelo      |            Nome personalizado, ex: anthropic            |
| Identificador do modelo | anthropic/claude-sonnet-4.6 (ou outro modelo suportado) |
|        Chave API        |        Chave API gerada no Console da Anthropic         |
|     URL base da API     |              https://api.anthropic.com/v1               |

### Edição do arquivo de configuração

Configuração no config.json

```
    {
      "model_name": "claude-sonnet-4.6",
      "model": "anthropic/claude-sonnet-4.6",
      "api_base": "https://api.anthropic.com/v1"
    },
```

---

`~/.picoclaw/.security.yml`：

```YAML
model_list:
  claude-sonnet-4.6:0:
    api_keys:
      - "your-anthropic-api-key"
```

## Observações

- Cobrança por uso: quanto mais utilizado, maior o custo. Tarefas frequentes ou de contexto longo aumentam os gastos rapidamente; recomenda-se configurar alertas de uso na página de cobrança do Console.
- O custo da série Claude Opus é significativamente maior que o Sonnet; evite o uso prolongado sem necessidade.
- Os planos de assinatura e o saldo da API são independentes e não intercambiáveis: o saldo depositado no Console é válido apenas para chamadas da API, não tendo relação com os planos de assinatura do claude.ai.

---
id: Anthropic-api
title: Claude(Anthropic) API
---

# Guia de Configuração da API do Claude (Anthropic)

## Visão geral

**Claude (Anthropic)** oferece dois métodos: **planos de assinatura** e **pagamento por uso**, ambos utilizam interface compatível com a OpenAI. Os planos de assinatura e o pagamento por uso compartilham o mesmo endpoint, diferenciando apenas na chave API e no método de cobrança.

Documentação oficial: https://docs.anthropic.com/en/api/getting-started

---

## Plano de assinatura (recomendado)

O plano de assinatura do Claude é voltado para desenvolvedores, oferecendo uso frequente dentro de um limite fixo, ideal para cenários de codificação diária, contexto longo e compreensão de código.

![image-20260409215655752](/img/providers/Claude(Anthropic)1.png)

## Obtenção da chave API

1. Acesse o console da Anthropic
2. Registre-se e faça login, ativando o plano de assinatura correspondente (Pro / Max 5× / Max 20×)
3. Na página de Chaves API do console, obtenha a **chave API exclusiva da assinatura**

![image-20260409215733096](/img/providers/Claude(Anthropic)2.png)

### Uso do plano (referência para cenários de codificação)

|  Plano  | Preço mensal |                                  Cenários aplicáveis                                  |
| :-----: | :----------: | :-----------------------------------------------------------------------------------: |
|   Pro   |  US$ 20/mês  |          Desenvolvimento leve pessoal, sessões curtas, repositórios pequenos          |
| Max 5×  | US$ 100/mês  |           Uso frequente diário, leitura de múltiplos arquivos, uso estável            |
| Max 20× | US$ 200/mês  | Uso paralelo intensivo em múltiplos repositórios, colaboração principal a longo prazo |

### Modelos suportados

|           Modelo           |                                 Descrição                                  |
| :------------------------: | :------------------------------------------------------------------------: |
|     claude-sonnet-4-6      | Recomendado, equilíbrio entre desempenho e custo, excelente contexto longo |
|      claude-opus-4-6       |         Modelo avançado, raciocínio complexo, contexto super longo         |
|      claude-haiku-4-6      |                 Modelo leve, resposta rápida, baixo custo                  |
| claude-3-5-sonnet-20241022 |               Versão estável clássica, ampla compatibilidade               |

> Para codificação diária, priorize o **claude-sonnet-4-6**; mude para o Opus apenas em tarefas complexas para evitar consumo excessivo de cota.

## Configuração do PicoClaw

### Configuração na interface web

Abra a WebUI do PicoClaw, acesse a página **Modelos** no menu lateral esquerdo e clique em **Adicionar modelo** no canto superior direito.

![image-20260409221239555](/img/providers/Claude(Anthropic)3.png)
| Campo | Conteúdo a preencher |
| :---------------------: | :-----------------------------------------------------: |
| Nome do modelo | Nome personalizado, ex: anthropic |
| Identificador do modelo | anthropic/claude-sonnet-4-6 (ou outro modelo suportado) |
| Chave API | Chave API exclusiva da assinatura da Anthropic |
| URL base da API | https://api.anthropic.com/v1 |

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
      - "your-volcengine-api-key"
```

## Observações

- Planos de assinatura e pagamento por uso **compartilham o mesmo endpoint**: `https://api.anthropic.com/v1`, mas as **chaves API não podem ser misturadas**; obtenha-as na página correspondente.
- No pagamento por uso, o saldo da conta é deduzido em tempo real por token; para uso frequente, recomenda-se priorizar o plano de assinatura.
  - Os modelos da série Claude Opus consomem mais cota/custo; evite uso prolongado sem necessidade.
- A cota da assinatura e a cota da API são **independentes** e não podem ser usadas de forma intercambiável.

---

id: grop-api

title: Grop API

---

# Guia de Configuração da API do Groq

## Visão geral

O Groq é uma plataforma de inferência de IA com **latência ultrabaixa e inferência ultrarrápida**, baseada em arquitetura Tensor proprietária. Oferece resposta extremamente rápida em cenários como geração de código e interação por chat, ideal para desenvolvimento com chamadas frequentes e rápidas. Suporta modelos open source principais como Llama e Mixtral, com método de pagamento por uso.

Documentação oficial: https://console.groq.com/docs/quickstart

------

## Obtenção da chave API

### Passo 1: Acesse a plataforma

Acesse [GroqCloud](https://console.groq.com/home)

 registre-se e faça login.

### Passo 2: Crie a chave API

1. Acesse a página de gerenciamento de Chaves API
2. Clique em **Create API Key** para gerar a chave
3. Copie e salve a chave API

> ⚠️  **Aviso**: A chave API é exibida apenas uma vez; salve imediatamente e evite vazamentos.

------

![image-20260410163359795](./grop/image-20260410163359795.png)

## Configuração do PicoClaw

### Pagamento por uso (Groq suporta apenas pagamento por uso)

#### Modelos suportados

|         Modelo          |                          Descrição                           |
| :---------------------: | :----------------------------------------------------------: |
| llama-3.3-70b-versatile | Recomendado, desempenho geral equilibrado, velocidade extremamente rápida |
|    llama-3.3-8b-chat    |          Modelo leve, resposta rápida e baixo custo          |
|  mixtral-8x7b-instruct  | Modelo de múltiplos especialistas, excelente processamento de texto longo |
|      gemma-2-9b-it      |                Modelo de chat leve do Google                 |

#### Método 1: Uso da WebUI (recomendado)

Abra a WebUI do PicoClaw, acesse a página **Modelos** no menu lateral esquerdo e clique em **Adicionar modelo** no canto superior direito:

![image-20260410163514016](./grop/image-20260410163514016.png)

|          Campo          |                    Conteúdo a preencher                    |
| :---------------------: | :--------------------------------------------------------: |
|     Nome do modelo      |               Nome personalizado, ex: `groq`               |
| Identificador do modelo | `groq/llama-3.3-70b-versatile` (ou outro modelo suportado) |
|        Chave API        |                   Sua chave API do Groq                    |
|     URL base da API     |              `https://api.groq.com/openai/v1`              |

#### Método 2: Edição do arquivo de configuração

`config.json`：

```
{
  "version": 2,
  "model_list": [
    {
      "model_name": "llama-3.3-70b",
      "model": "groq/llama-3.3-70b-versatile",
      "api_base": "https://api.groq.com/openai/v1"
    },
  ],
  "agents": {
    "defaults": {
      "model_name": "llama-3.3-70b"
    }
  }
}
```

`~/.picoclaw/.security.yml`：

```
model_list:
  llama-3.3-70b:0:
    api_keys:
      - "your-groq-api-key"
```

------

## Observações

- O Groq **não possui planos de assinatura**, suportando apenas pagamento por uso, com dedução em tempo real do saldo por token.
- O endpoint padrão é fixo: `https://api.groq.com/openai/v1`, não pode ser omitido.
- Em ambiente de produção, armazene a chave API no `.security.yml` para evitar gravação em texto claro no `config.json`.
- A velocidade de chamada dos modelos é extremamente rápida; controle a frequência de chamadas para evitar consumo excessivo acidental.

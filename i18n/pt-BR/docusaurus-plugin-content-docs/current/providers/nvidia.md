---
id: nvidia-api
title: Nim(NVIDIA) API
---
# Guia de Configuração da API do NVIDIA NIM

## Visão geral

**NVIDIA NIM (NVIDIA Inference Microservice)** é um microserviço de inferência acelerado por GPU lançado pela NVIDIA, oferecendo interface compatível com a OpenAI padrão do setor. Suporta chamada com um clique dos modelos principais de diversos fabricantes, com velocidade de inferência rápida e alta estabilidade. Desenvolvedores individuais podem obter cota gratuita, sendo a solução ideal para programação, texto longo e troca de múltiplos modelos.

Documentação oficial: https://build.nvidia.com/

Documentação oficial da API: https://docs.nvidia.com/nim/

---

## Obtenção da chave API

### Passo 1: Acesse a plataforma

Acesse a plataforma [Try NVIDIA NIM APIs](https://build.nvidia.com/) da NVIDIA Build, registre-se e faça login.

### Passo 2: Crie a chave API

1. Clique no avatar no canto superior direito e selecione **API Keys** (acesso direto: [API Keys](https://build.nvidia.com/settings/api-keys))
2. Clique em **Generate API Key**, preencha o nome e selecione a validade
3. Após gerar, copie e salve a chave API (começa com `nvapi-`)

> ⚠️  **Aviso**: A chave API é exibida apenas uma vez; salve imediatamente e não divulgue.

---

![image-20260410164719609](/img/providers/nim1.png)

## Configuração do PicoClaw

### Pagamento por uso (NVIDIA NIM suporta apenas cota gratuita + pagamento por uso)

#### Modelos suportados

|              Modelo              |                              Descrição                              |
| :-------------------------------: | :-------------------------------------------------------------------: |
|       moonshotai/kimi-k2.5       |                 Recomendado, excelente contexto longo                 |
|          zhipuai/GLM-4.7          | Equilíbrio custo-benefício, amigável para programação em chinês |
|      minimaxai/minimax-m2.5      |            Equilíbrio entre capacidade de chat e código            |
|   meta/llama-3.3-70b-versatile   |                 Modelo open source de alto desempenho                 |
| nvidia/nemotron-3-super-120b-a12b |              Modelo MoE flagship proprietário da NVIDIA              |
|       google/gemma-4-31b-it       |                 Modelo de chat mais recente do Google                 |

#### Método 1: Uso da WebUI (recomendado)

Abra a WebUI do PicoClaw, acesse a página **Modelos** no menu lateral esquerdo e clique em **Adicionar modelo** no canto superior direito

![image-20260410164756785](/img/providers/nim2.png)

|          Campo          |                  Conteúdo a preencher                  |
| :---------------------: | :-----------------------------------------------------: |
|     Nome do modelo     |          Nome personalizado, ex:`nvidia-nim`          |
| Identificador do modelo | nvidia/moonshotai/kimi-k2.5 (ou outro modelo suportado) |
|        Chave API        |               Sua chave API do NVIDIA NIM               |
|     URL base da API     |           https://integrate.api.nvidia.com/v1           |

#### Método 2: Edição do arquivo de configuração

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "nemotron-4-340b",
      "model": "nvidia/nemotron-3-super-120b-a12b",
      "api_base": "https://integrate.api.nvidia.com/v1"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "nemotron-4-340b"
    }
  }
}
```

`~/.picoclaw/.security.yml`:

```yaml
model_list:
  nemotron-4-340b:0:
    api_keys:
      - "nvapi-your-nvidia-api-key"
```

---

## Observações

- O NVIDIA NIM **não possui planos de assinatura**, suportando apenas cota gratuita + pagamento por uso, com cobrança em tempo real por token.
- Endpoint API fixo: `https://integrate.api.nvidia.com/v1`, não pode ser omitido ou preenchido incorretamente.
- A chave API começa com `nvapi-`; certifique-se de gerá-la na página oficial de Chaves API.
- Em ambiente de produção, armazene a chave API no `.security.yml` para evitar gravação em texto claro no `config.json`.
- A cota gratuita é limitada; para uso frequente, acompanhe o número restante de chamadas na conta.

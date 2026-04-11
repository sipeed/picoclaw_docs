---
id: siliconflow-api
title: SiliconFlow API
---

# Guia de Configuração da SiliconFlow API

## Visão Geral

O **SiliconFlow** é uma plataforma que fornece serviços de inferência de LLM com ótimo custo-benefício, com suporte a vários modelos open-source e comerciais (como DeepSeek, Qwen, LLaMA, etc.).

Principais recursos:

- Inferência de alto desempenho (otimizada para inferência)
- Baixo custo (mais barato que as APIs oficiais)
- Interface compatível com OpenAI (integração direta com ferramentas existentes)
- Acesso amigável para a China (sem necessidade de proxies complexos)

Modelos populares:

| Modelo | Provider | Características | Casos de Uso |
|-------|----------|----------|-----------|
| deepseek-chat | DeepSeek | Capacidade geral forte | Conversas do dia a dia |
| deepseek-coder | DeepSeek | Boa capacidade de código | Tarefas de programação |
| qwen2-7b-instruct | Alibaba | Otimizado para chinês | Cenários em chinês |
| llama3-70b-instruct | Meta | LLM open-source | Tarefas gerais |

---

## Obtendo a API Key

### Passo 1: Acesse a Plataforma

Vá até o [SiliconFlow Cloud](https://cloud.siliconflow.cn/)

### Passo 2: Fazer login

Suporta cadastro por número de telefone ou outros métodos.

### Passo 3: Criar a API Key

1. Navegue até **Console → API Key Management**
2. Clique em **Create API Key**
3. **Copie e guarde** sua Key

> ⚠️ **Atenção**: a API Key é exibida apenas uma vez, guarde-a com segurança.

---

## Configurando o PicoClaw

### Opção 1: Usando a WebUI (Recomendado)

O PicoClaw oferece uma interface WebUI onde você pode configurar modelos facilmente sem editar os arquivos de configuração manualmente.

Edite as configurações do preset, ou clique no botão **"Add Model"** no canto superior direito:

![Add Model](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Model Alias | Nome personalizado, ex.: `deepseek-chat` |
| Model Identifier | `openai/deepseek-ai/DeepSeek-V3` (ou outro ID de modelo do SiliconFlow) |
| API Key | SiliconFlow API Key |
| API Base URL | `https://api.siliconflow.cn/v1` |

### Opção 2: Editar o Arquivo de Configuração

Adicione em `config.json`:

```json
{
  "model_list": [
    {
      "model_name": "deepseek-chat",
      "model": "openai/deepseek-ai/DeepSeek-V3",
      "api_base": "https://api.siliconflow.cn/v1",
      "api_keys": ["YOUR_SILICONFLOW_API_KEY"]
    },
    {
      "model_name": "deepseek-coder",
      "model": "openai/deepseek-ai/DeepSeek-Coder-V2-Instruct",
      "api_base": "https://api.siliconflow.cn/v1",
      "api_keys": ["YOUR_SILICONFLOW_API_KEY"]
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "deepseek-chat"
    }
  }
}
```

Em produção, mantenha as chaves em `~/.picoclaw/.security.yml` e deixe o `config.json` focado na estrutura dos modelos.

---

## Limites e Cotas

### Cobrança

O SiliconFlow usa um modelo **pay-as-you-go**, cobrando com base no modelo efetivamente usado e no consumo de tokens.

### Rate Limits

- Modelos diferentes têm rate limits diferentes
- Novos usuários podem ter cota gratuita
- Cotas de taxa maiores ficam disponíveis após recarga

---

## Problemas Comuns

### Saldo Insuficiente

**Causa**: saldo da conta esgotado

**Solução**: recarregue no console

### Modelo Indisponível

**Causa**: nome do modelo incorreto ou modelo descontinuado

**Soluções**:
- Verifique se o nome do modelo está correto
- Consulte a documentação do SiliconFlow para saber quais modelos estão disponíveis

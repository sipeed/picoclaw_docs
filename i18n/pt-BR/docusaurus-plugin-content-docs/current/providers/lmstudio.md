---
id: lmstudio-api
title: LM Studio API
---

# Guia de Configuração da API do LM Studio

## Visão Geral

O **LM Studio** é um gerenciador de modelos LLM local que roda modelos na sua máquina e expõe uma **API compatível com a OpenAI**.

Principais recursos:

- Inferência local-first (os dados ficam na sua máquina)
- Interface compatível com OpenAI (fácil integração com ferramentas existentes)
- Nenhuma API key exigida por padrão
- GUI integrada para carregar e gerenciar modelos locais

Mapeamento de identificadores de modelo no PicoClaw:

| Identificador da API do LM Studio | Identificador do Modelo no PicoClaw | Observações | Casos de Uso |
|-------|----------|----------|-----------|
| `openai/gpt-oss-20b` | `lmstudio/openai/gpt-oss-20b` | Do painel direito do LM Studio | Conversas do dia a dia e código |
| `your-model-id` | `lmstudio/your-model-id` | Funciona com qualquer modelo carregado | Workflows locais personalizados |

---

## Obtendo a API Key

### Passo 1: Abrir o Local Server do LM Studio

No LM Studio, vá em **Developer -> Local Server**.

### Passo 2: Iniciar o servidor e carregar um modelo

1. Garanta que o **Status** esteja `Running`
2. Clique em **Load Model** e carregue o modelo que você quer usar
3. Confirme o endpoint local (padrão: `http://localhost:1234/v1`)

### Passo 3: Copiar o API Model Identifier

1. Copie o **API Model Identifier** no painel direito
2. Use-o no PicoClaw como `lmstudio/<identifier>`

> Observação: o LM Studio não exige API Key por padrão. Só defina uma API Key no PicoClaw se o servidor do LM Studio tiver autenticação habilitada.

![LM Studio Local Server](/img/providers/lmstudio.png)

---

## Configurando o PicoClaw

### Opção 1: Usando a WebUI (Recomendado)

O PicoClaw oferece uma interface WebUI onde você pode configurar modelos facilmente sem editar os arquivos de configuração manualmente.

Edite as configurações do preset, ou clique no botão **"Add Model"** no canto superior direito:

![Add Model](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Model Alias | Nome personalizado, ex.: `lmstudio-local` |
| Model Identifier | `lmstudio/openai/gpt-oss-20b` (substitua o sufixo pelo seu identificador) |
| API Key | Deixe em branco por padrão (só é necessário quando a autenticação está ativada) |
| API Base URL | Deixe em branco (padrão: `http://localhost:1234/v1`) |

### Opção 2: Editar o Arquivo de Configuração

Adicione em `config.json`:

```json
{
  "model_list": [
    {
      "model_name": "lmstudio-local",
      "model": "lmstudio/openai/gpt-oss-20b"
    },
    {
      "model_name": "lmstudio-lan",
      "model": "lmstudio/deepseek-r1-distill-llama-8b",
      "api_base": "http://10.20.30.40:1234/v1"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "lmstudio-local"
    }
  }
}
```

O PicoClaw remove o prefixo `lmstudio/` antes de enviar as requisições. Se `api_base` não estiver definido, o padrão é `http://localhost:1234/v1`.

Se seu servidor LM Studio tiver autenticação habilitada, configure as credenciais com `api_keys` em `~/.picoclaw/.security.yml`.

---

## Limites e Cotas

### Cobrança

A inferência local do LM Studio não tem cobrança por token via nuvem. Os custos vêm principalmente do uso do seu hardware local.

### Rate Limits

- A throughput depende da sua CPU/GPU e do tamanho do modelo
- Modelos maiores ou configurações com mais paralelismo aumentam a latência
- O acesso via LAN/remoto também depende da estabilidade da rede

---

## Problemas Comuns

### Não consigo conectar ao Local Server

**Causa**: o servidor local do LM Studio não está rodando, a porta está errada ou há restrições de firewall

**Soluções**:
- Verifique se o **Status** está `Running`
- Cheque o endpoint e a porta no LM Studio
- Garanta que o firewall/política de rede local permite o acesso

### Modelo Não Encontrado

**Causa**: o modelo não está carregado, ou o identificador do modelo não bate

**Soluções**:
- Carregue o modelo no LM Studio primeiro
- Copie novamente o **API Model Identifier** e use `lmstudio/<identifier>`

### 401 Unauthorized

**Causa**: a autenticação do LM Studio está habilitada, mas nenhum token foi fornecido

**Solução**:
- Defina a API Key na configuração do modelo no PicoClaw

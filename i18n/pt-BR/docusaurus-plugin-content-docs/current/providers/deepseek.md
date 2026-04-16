---
id: deepseek-api
title: DeepSeek API
---

# Guia de Configuração do DeepSeek

## Visão Geral

**DeepSeek** é um benchmark no campo de grandes modelos da China.

A série DeepSeek-V3 atraiu atenção generalizada globalmente com desempenho de inferência altamente competitivo e preços de API extremamente baixos, tornando-se um dos modelos mais econômicos preferidos pelos desenvolvedores.

Sua interface compatível com OpenAI torna a integração quase sem limiar e é um dos provedores domésticos mais comumente usados pelos usuários do PicoClaw.

![Visão Geral do DeepSeek](/img/providers/deepseek-overview.png)

Documentação Oficial: https://api-docs.deepseek.com/zh-cn/api/deepseek-api/

***Nota**: DeepSeek atualmente suporta apenas pay-as-you-go, sem planos de assinatura*

*deepseek-chat atualmente corresponde ao DeepSeek-V3.2*

## Obtendo Chave da API

### Passo 1: Visitar Plataforma

Acesse [Plataforma Open do DeepSeek](https://platform.deepseek.com/), registre-se e faça login.

### Passo 2: Criar Chave da API

1. Entre no Console → página **API Keys**
2. Clique em "Criar Chave da API"
3. Copie e salve com segurança

   *⚠️ **Nota**: A Chave da API é mostrada apenas uma vez, salve imediatamente.*

## Configurando PicoClaw

### Opção 1: Usando WebUI (Recomendado)

Abra o WebUI do PicoClaw, vá para a página **Models** na navegação esquerda, clique em "Adicionar Modelo" no canto superior direito:

![Adicionar Modelo](/img/providers/webuimodel.png)

| Campo | Valor |
|-------|-------|
| Alias do Modelo | Nome personalizado, ex., deepseek |
| Identificador do Modelo | deepseek/deepseek-chat |
| Chave da API | Sua Chave da API do DeepSeek |
| URL Base da API | Deixe vazio (usa automaticamente o endpoint padrão) |

Clique em "Adicionar Modelo" para salvar. Para definir como modelo padrão, ative o switch "Definir como Modelo Padrão" na parte inferior.

### Opção 2: Editar Arquivo de Configuração

Adicione ao model_list no config.json (sem chaves):

```json
{
  "version": 2,
  "model_list": [
    {
      "model_name": "deepseek",
      "model": "deepseek/deepseek-chat"
    }
  ],
  "agents": {
    "defaults": {
      "model_name": "deepseek"
    }
  }
}
```

Armazene chaves em ~/.picoclaw/.security.yml:

```yaml
model_list:
  deepseek:0:
    api_keys:
      - "sk-your-deepseek-key"
```

O prefixo do protocolo deepseek tem endpoint padrão integrado https://api.deepseek.com/v1, não é necessário preencher api_base

## Notas

- DeepSeek atualmente suporta apenas pay-as-you-go, sem planos de assinatura
- deepseek-chat atualmente corresponde ao DeepSeek-V3.2
- Para produção, armazene a Chave da API em .security.yml, evite texto simples no config.json
---
id: antigravity-usage
title: Guia de uso do Antigravity
---

# Como usar o provedor Antigravity no PicoClaw

Este guia explica como configurar e usar o provedor **Antigravity** (Google Cloud Code Assist) no PicoClaw.

## Pré-requisitos

1.  Uma conta Google.
2.  Google Cloud Code Assist habilitado (geralmente disponível através do onboarding "Gemini for Google Cloud").

## 1. Autenticação

Para autenticar no Antigravity, execute o seguinte comando:

```bash
picoclaw auth login --provider antigravity
```

### Autenticação manual (Headless/VPS)
Se você está rodando em um servidor (Coolify/Docker) e não consegue acessar `localhost`, siga estes passos:
1.  Execute o comando acima.
2.  Copie a URL fornecida e abra no seu navegador local.
3.  Faça o login.
4.  Seu navegador será redirecionado para uma URL do tipo `localhost:51121` (que vai falhar ao carregar).
5.  **Copie essa URL final** da barra de endereços do navegador.
6.  **Cole de volta no terminal** onde o PicoClaw está aguardando.

O PicoClaw extrai o código de autorização e completa o processo automaticamente.

## 2. Gerenciando modelos

Para o gerenciamento de modelos no dia a dia, a Web UI é a abordagem recomendada.

![Configuração de modelo na Web UI](/img/providers/webuimodel.png)

### Listar modelos disponíveis
Para ver quais modelos seu projeto tem acesso e verificar suas cotas:

```bash
picoclaw auth models
```

### Trocar de modelo
Você pode mudar o modelo padrão em `~/.picoclaw/config.json` ou sobrescrever via CLI:

```bash
# Sobrescrever para um único comando
picoclaw agent -m "Olá" --model claude-opus-4-6-thinking
```

## 3. Uso real (Coolify/Docker)

Se você está fazendo deploy via Coolify ou Docker, siga estes passos para testar:

1.  **Variáveis de ambiente**:
    *   `PICOCLAW_AGENTS_DEFAULTS_MODEL=gemini-flash`
2.  **Persistência de autenticação**:
    Se você já fez login localmente, pode copiar suas credenciais para o servidor:
    ```bash
    scp ~/.picoclaw/auth.json user@your-server:~/.picoclaw/
    ```
    *Alternativamente*, execute o comando `auth login` uma vez no servidor se tiver acesso ao terminal.

## 4. Solução de problemas

*   **Resposta vazia**: se um modelo retornar uma resposta vazia, ele pode estar restrito para o seu projeto. Tente `gemini-3-flash` ou `claude-opus-4-6-thinking`.
*   **429 Rate Limit**: o Antigravity tem cotas estritas. O PicoClaw exibe o "reset time" na mensagem de erro caso você atinja o limite.
*   **404 Not Found**: garanta que está usando um ID de modelo da lista `picoclaw auth models`. Use o ID curto (ex.: `gemini-3-flash`), não o caminho completo.

## 5. Resumo dos modelos que funcionam

Com base nos testes, os modelos a seguir são os mais confiáveis:
*   `gemini-3-flash` (rápido, alta disponibilidade)
*   `gemini-2.5-flash-lite` (leve)
*   `claude-opus-4-6-thinking` (poderoso, inclui raciocínio)

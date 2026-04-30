---
id: chat-commands
title: Referência de Comandos de Chat
sidebar_label: Referência de Comandos de Chat
---

O PicoClaw suporta interação com o Agent por meio de comandos de chat.
> Os comandos de chat do PicoClaw são definidos centralmente em `pkg/commands` e são processados pelo Agent quando uma mensagem começa com um prefixo de comando.

Prefixos suportados:

- `/` ex. `/help`
- `!` ex. `!help`

O estilo Telegram `/command@botname` também é normalizado para o nome do comando.

## Lista de Comandos

### `/start`

Inicia ou cumprimenta o bot. Responde com "Hello! I am PicoClaw 🦞".

Uso: `/start`

### `/help`

Mostra todos os comandos disponíveis com descrições curtas.

Uso: `/help`

### `/show [model|channel|agents|mcp <server>]`

Mostra a configuração atual ou informações de execução.

**Subcomandos:**

| Subcomando | Descrição |
|---|---|
| `/show model` | Mostra o modelo e o provider atuais. |
| `/show channel` | Mostra o canal atual. |
| `/show agents` | Mostra os agents registrados. |
| `/show mcp <server>` | Mostra as ferramentas ativas de um servidor MCP específico. |

### `/list [models|channels|agents|skills|mcp]`

Lista opções disponíveis ou recursos configurados.

**Subcomandos:**

| Subcomando | Descrição |
|---|---|
| `/list models` | Mostra as informações do modelo e provider configurados. |
| `/list channels` | Lista os canais habilitados. |
| `/list agents` | Lista os agents registrados. |
| `/list skills` | Lista as skills instaladas e indica como usar `/use`. |
| `/list mcp` | Lista os servidores MCP configurados, status habilitado/adiado/conectado e quantidade de ferramentas ativas. |

### `/use <skill> [message]`

Força o uso de uma skill instalada específica.

**Padrões de uso:**

| Padrão | Comportamento |
|---|---|
| `/use <skill> <message>` | Usa a skill especificada para esta mensagem. |
| `/use <skill>` | Prepara a skill para a próxima mensagem normal. |
| `/use clear` ou `/use off` | Cancela o override de skill pendente. |

### `/btw <question>`

Faz uma pergunta lateral sem alterar o histórico da sessão atual. Útil para consultas temporárias ou perguntas de interrupção.

Uso: `/btw <question>`

Exemplo: `/btw what is 2+2?`

### `/switch model to <name>`

Alterna o modelo usado pelo Agent atual.

Uso: `/switch model to <name>`

:::note
`/switch channel` foi migrado para `/check channel`.
:::

### `/check channel <name>`

Verifica se um canal está disponível e habilitado.

Uso: `/check channel <name>`

### `/clear`

Limpa o histórico de chat da sessão atual.

Uso: `/clear`

Resposta: `Chat history cleared!`

### `/context`

Mostra o contexto e o uso de tokens da sessão atual, incluindo contagem de mensagens, tokens usados, janela total de contexto, limiar de compressão, progresso da compressão e tokens restantes.

Uso: `/context`

### `/subagents`

Mostra os subagents em execução ou a árvore de tarefas ativas na sessão atual. Se não houver tarefas em execução, informa que nenhuma tarefa ativa existe.

Uso: `/subagents`

### `/reload`

Recarrega o arquivo de configuração.

Uso: `/reload`

Resposta: `Config reload triggered!` ou uma mensagem de erro.

## Locais de Implementação

| Área | Caminho |
|---|---|
| Definições de comandos | `pkg/commands/builtin.go` e `pkg/commands/cmd_*.go` |
| Análise de comandos | `pkg/commands/request.go` |
| Execução de comandos | `pkg/commands/executor.go` |
| Integração com Agent | `pkg/agent/agent_command.go` |
| Subcomandos CLI de nível superior | `cmd/picoclaw/main.go` |

## Adicional: Subcomandos CLI de Nível Superior

Além dos comandos slash de chat, o binário `picoclaw` também oferece subcomandos Cobra CLI, incluindo:

`picoclaw onboard` · `picoclaw agent` · `picoclaw auth` · `picoclaw gateway` · `picoclaw status` · `picoclaw cron` · `picoclaw mcp` · `picoclaw migrate` · `picoclaw skills` · `picoclaw model` · `picoclaw update` · `picoclaw version`

Esses comandos CLI e comandos de chat são pontos de entrada separados: comandos CLI são executados no terminal, enquanto comandos de chat são acionados por mensagens de canais como Telegram, Feishu, WeChat, etc.

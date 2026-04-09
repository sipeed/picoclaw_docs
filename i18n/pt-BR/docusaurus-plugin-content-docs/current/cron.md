---
id: cron
title: Tarefas Agendadas e Cron Jobs
---

# Tarefas Agendadas e Cron Jobs

O PicoClaw armazena jobs agendados no workspace atual e pode executá-los como agent turns, entregas diretas ou comandos shell.

## Tipos de Agendamento

A ferramenta cron suporta três formas de agendamento:

| Tipo | Descrição | Única vez? |
|------|-------------|-----------|
| `at_seconds` | Dispara uma única vez, relativa ao instante atual. O job é excluído após executar. | Sim |
| `every_seconds` | Intervalo recorrente, em segundos. | Não |
| `cron_expr` | Expressão cron padrão (ex.: `0 9 * * *`). | Não |

### Prioridade

Quando múltiplos campos de agendamento são fornecidos, a ferramenta usa esta ordem de prioridade: `at_seconds` > `every_seconds` > `cron_expr`.

### Uso via CLI

O comando de CLI `picoclaw cron add` suporta apenas jobs recorrentes:

- `--every <seconds>` -- intervalo recorrente
- `--cron '<expr>'` -- expressão cron

Atualmente, não há uma flag de CLI para um job `at` de execução única. Jobs de execução única só podem ser criados através da ferramenta do agent.

**Exemplos:**

```bash
picoclaw cron add --name "Daily summary" --message "Summarize today's logs" --cron "0 18 * * *"
picoclaw cron add --name "Ping" --message "heartbeat" --every 300 --deliver
```

## Modos de Execução

Os jobs são armazenados com um payload de mensagem e podem executar em três modos:

### Agent Turn (`deliver: false`)

Este é o modo **padrão** da ferramenta cron.

Quando o job dispara, o PicoClaw reenvia a mensagem salva pelo agent loop como um novo agent turn. Use isso para trabalhos agendados que possam precisar de raciocínio, ferramentas ou uma resposta gerada.

### Entrega Direta (`deliver: true`)

Quando o job dispara, o PicoClaw publica a mensagem salva diretamente no canal de destino e no destinatário, sem processamento pelo agent.

A flag de CLI `picoclaw cron add --deliver` usa este modo.

### Execução de Comando

Quando um cron job inclui um campo `command`, o PicoClaw executa esse comando shell através da ferramenta `exec` e publica a saída do comando de volta no canal.

Para jobs de comando:
- `deliver` é forçado para `false` quando o job é criado
- A `message` salva torna-se apenas texto descritivo; a ação agendada é o comando shell
- Jobs de comando requerem um canal interno
- O comando atual da CLI `picoclaw cron add` não expõe uma flag `command`

## Ações da Ferramenta

A ferramenta cron exposta ao agent suporta estas ações:

| Ação | Descrição | Parâmetros obrigatórios |
|--------|-------------|---------------------|
| `add` | Criar um novo job agendado | `message`, mais um de `at_seconds` / `every_seconds` / `cron_expr` |
| `list` | Listar todos os jobs agendados habilitados | -- |
| `remove` | Remover um job pelo ID | `job_id` |
| `enable` | Habilitar um job desabilitado | `job_id` |
| `disable` | Desabilitar um job (mantém no store) | `job_id` |

### Parâmetros da Ferramenta

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|-------------|
| `action` | string | Sim | `add`, `list`, `remove`, `enable` ou `disable` |
| `message` | string | Para `add` | A mensagem de lembrete/tarefa a ser exibida quando disparada |
| `command` | string | Não | Comando shell para executar diretamente |
| `command_confirm` | boolean | Não | Flag de confirmação explícita para agendar um comando shell |
| `at_seconds` | integer | Não | Única vez: segundos a partir de agora (ex.: `600` para 10 minutos) |
| `every_seconds` | integer | Não | Intervalo recorrente em segundos (ex.: `3600` para cada hora) |
| `cron_expr` | string | Não | Expressão cron (ex.: `0 9 * * *`) |
| `job_id` | string | Para `remove`/`enable`/`disable` | ID do job de destino |

## Configuração e Segurança

### `tools.cron`

| Config | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `enabled` | bool | `true` | Registrar a ferramenta cron exposta ao agent |
| `allow_command` | bool | `true` | Permitir jobs de comando sem confirmação extra |
| `exec_timeout_minutes` | int | `5` | Timeout para execução de comandos agendados (0 = sem limite) |

Se você desabilitar `tools.cron.enabled`, os usuários não poderão mais criar ou gerenciar jobs através da ferramenta do agent. O gateway continua iniciando o CronService, mas não instala o callback de execução de job. Como resultado, jobs devidos não chegam a rodar; jobs de execução única podem ser excluídos e jobs recorrentes podem ser reagendados sem executar seu payload.

### Dependência de `tools.exec`

Jobs de comando agendados dependem de `tools.exec.enabled` (padrão: `true`).

Se `tools.exec.enabled` for `false`:
- Novos jobs de comando são rejeitados pela ferramenta cron
- Jobs de comando existentes publicam um erro "command execution is disabled" quando disparam

### Comportamento de `allow_command`

`tools.cron.allow_command` tem padrão `true`. Esta não é uma chave de desligamento total. Se você definir `allow_command` como `false`, o PicoClaw ainda permite um job de comando quando o chamador passa explicitamente `command_confirm: true`.

Jobs de comando também requerem um canal interno. Lembretes que não são de comando não possuem essa restrição.

**Exemplo de configuração:**

```json
{
  "tools": {
    "cron": {
      "enabled": true,
      "exec_timeout_minutes": 5,
      "allow_command": true
    },
    "exec": {
      "enabled": true
    }
  }
}
```

## Persistência e Armazenamento

Os cron jobs são armazenados em:

```
<workspace>/cron/jobs.json
```

Por padrão, o workspace é:

```
~/.picoclaw/workspace
```

Se `PICOCLAW_HOME` estiver definido, o workspace padrão passa a ser:

```
$PICOCLAW_HOME/workspace
```

Tanto o gateway quanto os subcomandos da CLI `picoclaw cron` usam o mesmo arquivo `cron/jobs.json`.

### Comportamento de armazenamento

- Jobs `at_seconds` de execução única são excluídos após rodarem
- Jobs recorrentes permanecem no store até serem removidos explicitamente
- Jobs desabilitados permanecem no store e continuam aparecendo em `picoclaw cron list`

## Ciclo de Vida do Job

```
Job created (enabled=true)
      |
      v
CronService computes nextRunAtMS
      |
      v
Timer fires when nextRunAtMS is reached
      |
      +-- at (one-time) ------> Execute -> Delete job
      |
      +-- every / cron -------> Execute -> Recompute nextRunAtMS
```

Cada job rastreia o estado de execução:

| Campo | Descrição |
|-------|-------------|
| `nextRunAtMs` | Próxima execução agendada |
| `lastRunAtMs` | Horário de início da última execução |
| `lastStatus` | `ok` ou `error` |
| `lastError` | Mensagem de erro da última execução que falhou |

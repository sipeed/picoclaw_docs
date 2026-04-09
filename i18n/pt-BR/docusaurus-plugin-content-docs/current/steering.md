---
id: steering
title: Steering
---

# Steering

O steering permite injetar mensagens em um loop de agente em execução entre as chamadas de ferramentas. Isso é útil quando você precisa redirecionar o agente, fornecer novo contexto ou cancelar um plano em andamento — sem esperar o turno atual terminar.

## Como Funciona

Após cada ferramenta ser concluída, o PicoClaw verifica uma fila de steering por sessão. Se uma ou mais mensagens forem encontradas:

1. **As ferramentas restantes na fila são ignoradas** — seus resultados são substituídos por um placeholder.
2. **As mensagens de steering são injetadas** na conversa como mensagens do usuário.
3. **O modelo é chamado novamente** com o contexto atualizado.

### Diagrama de Fluxo

```
Agent loop running
      │
      ▼
Tool N completes
      │
      ▼
Check steering queue ──── empty ──► continue to Tool N+1
      │
      │ (messages found)
      ▼
Skip remaining tools
      │
      ▼
Inject steering messages into conversation
      │
      ▼
Call LLM with updated context
      │
      ▼
Agent loop continues with new direction
```

## Filas Com Escopo

As filas de steering são **isoladas por escopo de sessão resolvido** — elas não são globais. Cada sessão ativa mantém sua própria fila, então mensagens de steering enviadas a uma sessão nunca vazam para outra.

## Configuração

O modo de steering é configurado em `agents.defaults.steering_mode`:

| Valor | Comportamento |
|-------|---------------|
| `"one-at-a-time"` (padrão) | Retira uma mensagem por ciclo de poll. |
| `"all"` | Esvazia a fila inteira de uma só vez. |

Você também pode definir isso via variável de ambiente:

```bash
export PICOCLAW_AGENTS_DEFAULTS_STEERING_MODE=all
```

## Pontos de Polling

O PicoClaw verifica a fila de steering em quatro pontos durante o loop do agente:

1. **No início do loop** — antes de qualquer ferramenta ser executada.
2. **Após cada ferramenta** — o principal ponto de interceptação.
3. **Após uma resposta direta do LLM** — quando o modelo responde sem chamadas de ferramenta.
4. **Antes da finalização do turno** — última chance antes do resultado do turno ser retornado.

## Por Que as Ferramentas Restantes São Ignoradas

Quando uma mensagem de steering chega no meio de um turno, todas as ferramentas que ainda não começaram são ignoradas. Isso é intencional por três motivos:

| Motivo | Exemplo |
|--------|---------|
| **Prevenir efeitos colaterais indesejados** | O usuário diz "pare, não delete isso" — mas uma ferramenta `file_delete` ainda está na fila. Ignorar previne danos irreversíveis. |
| **Evitar desperdício de tempo** | O agente planejou 5 chamadas de API, mas a mensagem de steering do usuário as torna irrelevantes. Ignorar economiza latência e custo. |
| **O LLM recebe o contexto completo** | O modelo vê a mensagem de steering junto com os resultados anteriores e pode tomar uma decisão mais bem-informada sobre o que fazer em seguida. |

### Formato do Resultado de Ferramentas Ignoradas

Ferramentas que são ignoradas devido ao steering têm seu resultado definido como:

```
Skipped due to queued user message.
```

Isso aparece no histórico da conversa para que o LLM entenda que essas ferramentas não foram executadas.

## Exemplo de Fluxo Completo

```
Agent receives: "Search for config files and then delete any temp files."
      │
      ▼
Tool 1: search_files("*.conf")  ──► completes, returns results
      │
      ▼
Check steering queue ──► user sent: "Actually, don't delete anything."
      │
      ▼
Tool 2: delete_files("*.tmp")   ──► SKIPPED ("Skipped due to queued user message.")
Tool 3: delete_files("*.bak")   ──► SKIPPED ("Skipped due to queued user message.")
      │
      ▼
Inject steering message: "Actually, don't delete anything."
      │
      ▼
LLM sees: search results + skipped tools + user correction
      │
      ▼
LLM responds: "Understood, I found 3 config files but won't delete anything."
```

## Drenagem Automática do Bus

Quando o agente está ocupado processando um turno, uma goroutine em segundo plano consome automaticamente as mensagens de entrada do bus e as coloca na fila de steering. Isso garante que mensagens enviadas enquanto o agente está trabalhando não sejam perdidas.

Detalhes importantes:

- **O áudio é transcrito primeiro** — mensagens de voz são convertidas em texto antes de entrarem na fila.
- **Ciente do escopo** — as mensagens são roteadas para a fila de steering da sessão correta com base em seu escopo.

## Steering com Mídia

As mensagens de steering podem conter referências `media://`. Elas são preservadas na fila e resolvidas pelo pipeline normal de mídia quando a mensagem é injetada na conversa.

## Observações

- **O tamanho máximo da fila é 10.** Mensagens acima desse limite são descartadas com um log de aviso.
- **O steering não interrompe uma ferramenta em execução.** A ferramenta precisa terminar (ou atingir timeout) antes da fila de steering ser verificada.

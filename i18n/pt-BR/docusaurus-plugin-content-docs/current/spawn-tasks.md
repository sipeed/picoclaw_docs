---
id: spawn-tasks
title: Spawn e Tarefas Assíncronas
---

# Spawn e Tarefas Assíncronas

O PicoClaw suporta execução assíncrona de tarefas por meio da ferramenta **spawn**. Isso permite que o agente principal delegue trabalhos de longa duração a subagentes independentes enquanto continua processando outras tarefas.

## Como Funciona

O sistema de **heartbeat** verifica periodicamente o arquivo `workspace/HEARTBEAT.md` em busca de tarefas agendadas.

- **Tarefas rápidas** são tratadas inline pelo agente principal.
- **Tarefas longas** são delegadas a um subagente via `spawn`.
- O **subagente** possui seu próprio contexto independente e devolve os resultados usando a ferramenta `message`.

### Diagrama de Fluxo

```
Heartbeat triggers
      │
      ▼
Agent reads HEARTBEAT.md
      │
      ├── Quick task ──► Handle inline ──► Continue to next task
      │
      └── Long task  ──► spawn subagent ──► Continue to next task
                              │
                              ▼
                     Subagent works independently
                              │
                              ▼
                     Subagent uses message tool
                              │
                              ▼
                     User receives result
```

## Configuração

Adicione a seção `heartbeat` ao seu `~/.picoclaw/config.json`:

```json
{
  "heartbeat": {
    "enabled": true,
    "interval": 30
  }
}
```

| Opção      | Tipo    | Padrão | Descrição                                           |
|------------|---------|--------|-----------------------------------------------------|
| `enabled`  | boolean | `true` | Habilita ou desabilita o sistema de heartbeat.      |
| `interval` | integer | `30`   | Intervalo de verificação em minutos. Mínimo é `5`.  |

## Variáveis de Ambiente

| Variável                        | Descrição                                   |
|---------------------------------|---------------------------------------------|
| `PICOCLAW_HEARTBEAT_ENABLED`    | Sobrescreve a configuração `heartbeat.enabled`. |
| `PICOCLAW_HEARTBEAT_INTERVAL`   | Sobrescreve a configuração `heartbeat.interval`. |

:::tip
Defina o intervalo para um valor mais baixo (por exemplo, `5`) durante o desenvolvimento para iterar mais rápido nas tarefas agendadas.
:::

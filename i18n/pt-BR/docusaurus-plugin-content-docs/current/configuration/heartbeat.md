---
id: heartbeat
title: Heartbeat (Tarefas Periódicas)
---

# Heartbeat

O PicoClaw pode executar tarefas periódicas automaticamente. Crie um arquivo `HEARTBEAT.md` no seu workspace:

```markdown
# Periodic Tasks

- Check my email for important messages
- Review my calendar for upcoming events
- Check the weather forecast
```

O agente lê este arquivo a cada 30 minutos (configurável) e executa as tarefas usando as ferramentas disponíveis.

## Configuração

```json
{
  "heartbeat": {
    "enabled": true,
    "interval": 30
  }
}
```

| Opção | Padrão | Descrição |
| --- | --- | --- |
| `enabled` | `true` | Habilitar/desabilitar heartbeat |
| `interval` | `30` | Intervalo de verificação em minutos (mín: 5) |

**Variáveis de ambiente:**
- `PICOCLAW_HEARTBEAT_ENABLED=false` — desabilitar heartbeat
- `PICOCLAW_HEARTBEAT_INTERVAL=60` — alterar intervalo

## Tarefas Assíncronas com Spawn

Para tarefas de longa duração (busca web, chamadas de API), use a ferramenta `spawn` para criar um **subagente**:

```markdown
# Periodic Tasks

## Quick Tasks (respond directly)

- Report current time

## Long Tasks (use spawn for async)

- Search the web for AI news and summarize
- Check email and report important messages
```

**Comportamentos principais:**

| Recurso | Descrição |
| --- | --- |
| **spawn** | Cria subagente assíncrono, não bloqueia o heartbeat |
| **Contexto independente** | O subagente tem seu próprio contexto, sem histórico de sessão |
| **ferramenta message** | O subagente se comunica diretamente com o usuário |
| **Não-bloqueante** | Após o spawn, o heartbeat continua para a próxima tarefa |

## Como Funciona a Comunicação do Subagente

```
Heartbeat dispara
    ↓
Agente lê HEARTBEAT.md
    ↓
Para tarefas longas: spawn subagente
    ↓                           ↓
Continua para próxima tarefa  Subagente trabalha independentemente
    ↓                           ↓
Todas as tarefas prontas      Subagente usa ferramenta "message"
    ↓                           ↓
Responde HEARTBEAT_OK         Usuário recebe resultado diretamente
```

O subagente tem acesso às ferramentas (message, web_search, etc.) e se comunica com o usuário de forma independente, sem passar pelo agente principal.

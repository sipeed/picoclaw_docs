---
id: hooks
title: Sistema de Hooks
---

# Sistema de Hooks

O PicoClaw expõe um sistema de hooks que permite observar eventos, interceptar chamadas ao LLM e a ferramentas, além de controlar a execução de ferramentas com lógica de aprovação — tudo isso sem modificar o código do núcleo.

## Tipos de Hook

| Tipo | Interface | Estágio | Pode modificar dados |
|------|-----------|---------|----------------------|
| Observer | EventObserver | Broadcast do EventBus | Não |
| Interceptor de LLM | LLMInterceptor | before_llm / after_llm | Sim |
| Interceptor de ferramenta | ToolInterceptor | before_tool / after_tool | Sim |
| Aprovador de ferramenta | ToolApprover | approve_tool | Não, retorna allow/deny |

## Pontos de Hook

- **before_llm** — disparado antes de toda requisição ao LLM. Interceptors podem reescrever a requisição.
- **after_llm** — disparado após a resposta do LLM. Interceptors podem reescrever a resposta.
- **before_tool** — disparado antes de uma ferramenta ser executada. Interceptors podem reescrever os argumentos.
- **after_tool** — disparado após uma ferramenta ser executada. Interceptors podem reescrever o resultado.
- **approve_tool** — disparado antes da execução de uma ferramenta (depois de before_tool). Aprovadores retornam allow ou deny.

## Ações de Hook

Interceptors retornam um `HookDecision` cujo `action` controla o restante do fluxo:

| Ação | Estágios Aplicáveis | Efeito |
| --- | --- | --- |
| `continue` | Todos os interceptors | Passa adiante sem modificações |
| `modify` | `before_llm`, `after_llm`, `before_tool`, `after_tool` | Modifica requisição/resposta e continua |
| `respond` | `before_tool` | Retorna o resultado da ferramenta diretamente, **pulando a execução real da ferramenta** |
| `deny_tool` | `before_tool` | Nega a execução da ferramenta, retorna mensagem de erro |
| `abort_turn` | Todos os interceptors | Aborta o turno atual |
| `hard_abort` | Todos os interceptors | Força a parada de todo o loop do agente |

### A Ação `respond`

`respond` permite que um hook `before_tool` forneça o resultado da ferramenta diretamente, fazendo com que o corpo real da ferramenta nunca execute. Use para:

1. **Injeção de ferramenta plugin** — implementar ferramentas a partir de um hook sem registrá-las no registro de ferramentas
2. **Cache de resultados** — atalho para chamadas de ferramentas repetidas com resultados em cache
3. **Mock de ferramenta** — retornar resultados pré-definidos para testes

Quando um hook retorna `respond` com um `HookResult`, o loop do agente:

1. Pula a execução real da ferramenta
2. Usa o resultado fornecido pelo hook como se a ferramenta tivesse executado
3. Continua o turno normalmente com esse resultado

:::caution Segurança
`respond` **ignora as verificações de `approve_tool`**. Um hook pode retornar resultados para qualquer ferramenta — incluindo as sensíveis como `bash` — sem passar pelo pipeline de aprovação. Restrinja hooks com capacidade de `respond` aos que você confia, e prefira `deny_tool` para bloquear chamadas inseguras.
:::

Exemplo Go in-process:

```go
func (h *MyHook) BeforeTool(
    ctx context.Context,
    call *agent.ToolCallHookRequest,
) (*agent.ToolCallHookRequest, agent.HookDecision, error) {
    if call.Tool == "my_plugin_tool" {
        next := call.Clone()
        next.HookResult = &tools.ToolResult{
            ForLLM:  "Plugin tool executed successfully",
            Silent:  false,
            IsError: false,
        }
        return next, agent.HookDecision{Action: agent.HookActionRespond}, nil
    }
    return call, agent.HookDecision{Action: agent.HookActionContinue}, nil
}
```

Exemplo de process-hook (Python, JSON-RPC sobre stdio):

```python
def handle_before_tool(id, params):
    if params.get("name") == "my_plugin_tool":
        _respond(id, {
            "decision": {"action": "respond"},
            "hook_result": {
                "for_llm": "Plugin tool executed successfully",
                "is_error": False,
            },
        })
        return
    _respond(id, {"decision": {"action": "continue"}})
```

Para o esquema completo dos campos JSON-RPC e os padrões de injeção de ferramenta plugin que isso habilita, veja as specs upstream em [`docs/hooks/hook-json-protocol.md`](https://github.com/sipeed/picoclaw/blob/main/docs/hooks/hook-json-protocol.md) e [`docs/hooks/plugin-tool-injection.md`](https://github.com/sipeed/picoclaw/blob/main/docs/hooks/plugin-tool-injection.md).

## Ordem de Execução

1. **Hooks in-process** são executados primeiro.
2. **Hooks de processo** são executados em segundo lugar.
3. Dentro de cada grupo, os hooks são ordenados por **prioridade** (número menor executa primeiro).
4. Se dois hooks tiverem a mesma prioridade, o **nome** (ordem lexicográfica) é usado como critério de desempate.

## Timeouts

Os valores padrão globais são configurados em `hooks.defaults`:

| Campo | Descrição |
|-------|-----------|
| `observer_timeout_ms` | Tempo máximo que um callback de observer pode levar antes de ser cancelado. |
| `interceptor_timeout_ms` | Tempo máximo que um interceptor pode levar antes de ser cancelado. |
| `approval_timeout_ms` | Tempo máximo que um aprovador pode levar antes da chamada da ferramenta ser negada por padrão. |

## Início Rápido

Adicione o seguinte à sua configuração do PicoClaw para habilitar um process-hook em Python:

```json
{
  "hooks": {
    "enabled": true,
    "processes": {
      "py_review_gate": {
        "enabled": true,
        "priority": 100,
        "transport": "stdio",
        "command": ["python3", "/tmp/review_gate.py"],
        "observe": ["tool_exec_start", "tool_exec_end", "tool_exec_skipped"],
        "intercept": ["before_tool", "approve_tool"],
        "env": {
          "PICOCLAW_HOOK_LOG_FILE": "/tmp/picoclaw-hook-review-gate.log"
        }
      }
    }
  }
}
```

## Exemplo In-Process em Go

Registre um hook diretamente em Go:

```go
package main

import (
    "context"
    "log"

    "github.com/anthropics/picoclaw/hook"
)

type auditHook struct{}

func (h *auditHook) Name() string { return "audit" }

func (h *auditHook) BeforeTool(ctx context.Context, req *hook.ToolRequest) (*hook.ToolRequest, error) {
    log.Printf("tool=%s args=%v", req.Name, req.Args)
    return req, nil // pass through unmodified
}

func init() {
    hook.Register(&auditHook{})
}
```

## Exemplo de Process-Hook em Python

O `review_gate.py` a seguir implementa um process-hook que observa eventos de ferramentas e participa da interceptação em before_tool e da aprovação em approve_tool. Ele apenas registra logs e nunca reescreve ou nega chamadas.

```python
#!/usr/bin/env python3
"""review_gate.py – PicoClaw process-hook (JSON-RPC over stdio).

Supports:
  hook.hello      – handshake
  hook.event      – observe events (log only)
  hook.before_tool – intercept before tool execution (pass-through)
  hook.approve_tool – approve tool execution (always allow)
"""

import json
import os
import sys

LOG_FILE = os.environ.get("PICOCLAW_HOOK_LOG_FILE", "/tmp/picoclaw-hook-review-gate.log")


def _log(msg: str) -> None:
    with open(LOG_FILE, "a") as f:
        f.write(msg + "\n")


def _respond(id: int | str | None, result: dict) -> None:
    payload = {"jsonrpc": "2.0", "id": id, "result": result}
    line = json.dumps(payload)
    sys.stdout.write(line + "\n")
    sys.stdout.flush()


def handle_hello(id, params):
    _log(f"hello: protocol_version={params.get('protocol_version')}")
    _respond(id, {"name": "py_review_gate", "protocol_version": 1})


def handle_event(id, params):
    _log(f"event: {params.get('type')} — {json.dumps(params.get('data', {}))}")
    _respond(id, {})


def handle_before_tool(id, params):
    tool = params.get("name", "<unknown>")
    _log(f"before_tool: {tool}")
    # Pass through unmodified
    _respond(id, {"args": params.get("args", {})})


def handle_approve_tool(id, params):
    tool = params.get("name", "<unknown>")
    _log(f"approve_tool: {tool} → allow")
    _respond(id, {"allow": True})


DISPATCH = {
    "hook.hello": handle_hello,
    "hook.event": handle_event,
    "hook.before_tool": handle_before_tool,
    "hook.approve_tool": handle_approve_tool,
}


def main() -> None:
    _log("review_gate started")
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            _log(f"bad json: {line}")
            continue

        method = msg.get("method", "")
        handler = DISPATCH.get(method)
        if handler:
            handler(msg.get("id"), msg.get("params", {}))
        else:
            _log(f"unknown method: {method}")
    _log("review_gate exiting")


if __name__ == "__main__":
    main()
```

## Protocolo de Process-Hook

Os process hooks se comunicam com o PicoClaw via **JSON-RPC 2.0** sobre **stdio** (um objeto JSON por linha).

1. O PicoClaw inicia o processo e envia `hook.hello` com `{"protocol_version": 1}`.
2. O processo deve responder com `{"name": "<hook_name>", "protocol_version": 1}`.
3. Em seguida, o PicoClaw envia mensagens `hook.event`, `hook.before_tool`, `hook.after_tool` ou `hook.approve_tool` conforme apropriado.
4. O processo responde com uma resposta JSON-RPC para cada requisição.

Toda a comunicação é síncrona sob a perspectiva do PicoClaw: ele envia uma requisição e aguarda exatamente uma resposta (respeitando o timeout configurado).

## Referência de Configuração

### Hooks embutidos — `hooks.builtins.<name>`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `enabled` | bool | Se este hook embutido está ativo. |
| `priority` | int | Ordem de execução (menor = mais cedo). |
| `config` | object | Configuração específica do hook, repassada ao builtin. |

### Process hooks — `hooks.processes.<name>`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `enabled` | bool | Se este process hook está ativo. |
| `priority` | int | Ordem de execução (menor = mais cedo). |
| `transport` | string | Protocolo de transporte. Atualmente apenas `"stdio"` é suportado. |
| `command` | string[] | Comando e argumentos para iniciar o processo. |
| `dir` | string | Diretório de trabalho do processo iniciado. |
| `env` | object | Variáveis de ambiente extras passadas ao processo. |
| `observe` | string[] | Lista de tipos de evento que este hook deseja observar. |
| `intercept` | string[] | Lista de pontos de hook que este hook deseja interceptar. |

## Escopo e Limites

O sistema de hooks é mais adequado para:

- **Reescrita de requisições ao LLM** — normalizar prompts, injetar contexto de sistema, aplicar políticas.
- **Normalização de argumentos de ferramentas** — sanitizar ou transformar argumentos antes da execução.
- **Aprovação de ferramentas pré-execução** — controlar operações perigosas com lógica customizada.
- **Auditoria** — registrar toda a atividade de LLM e ferramentas para conformidade ou depuração.

Ainda não suportado:

- Suspender a execução indefinidamente para aprovação human-in-the-loop (use `approval_timeout_ms` e um process hook para aprovação síncrona).
- Interceptação completa em nível de mensagem (apenas requisição/resposta do LLM e chamada/resultado de ferramenta são interceptáveis).

## Solução de Problemas

- **Hook não dispara** — Verifique se `enabled: true` está definido e se o tipo de evento ou ponto de hook está listado em `observe` ou `intercept`.
- **Erros de timeout** — Aumente o timeout correspondente em `hooks.defaults`. Verifique se o process hook faz flush do stdout após cada resposta.
- **Process hook trava na inicialização** — Execute o comando manualmente para verificar dependências ausentes ou erros de sintaxe.
- **Erros de parsing de JSON** — Garanta exatamente um objeto JSON por linha, sem saída extra no stdout (use stderr ou um arquivo de log para saída de depuração).

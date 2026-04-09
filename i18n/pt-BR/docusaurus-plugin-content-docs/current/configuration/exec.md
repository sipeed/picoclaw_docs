---
id: exec
title: Configurações de Execução de Comandos
---

# Guia de Configurações de Execução de Comandos

O PicoClaw fornece duas configurações-chave para controlar as permissões de execução de comandos, ajudando você a equilibrar funcionalidade e segurança.

## Visão Geral

| Configuração | Caminho no Config | Padrão | Descrição |
|--------|------------|--------|-----------|
| Ativar Execução de Comandos | `tools.exec.enabled` | `true` | Controla globalmente se a execução de comandos é permitida |
| Permitir Execução Remota de Comandos | `tools.exec.allow_remote` | `true` | Controla se sessões remotas podem executar comandos |

## Ativar Execução de Comandos

### Descrição

Controla se a aplicação tem permissão para executar comandos. Quando desativado, todas as requisições de comando são rejeitadas.

### Configuração

**Via arquivo de configuração:**

```json
{
  "tools": {
    "exec": {
      "enabled": false
    }
  }
}
```
**Via variável de ambiente:**

```bash
export PICOCLAW_TOOLS_EXEC_ENABLED=false
```


### Casos de Uso
| Cenário                                                          | Configuração Recomendada            |
| ---------------------------------------------------------------- | ----------------------------------- |
| Produção / modo somente leitura                                  | `enabled: false`                    |
| Desenvolvimento com automação                                    | `enabled: true`                     |
| Ambientes de alta segurança                                      | `enabled: false`                    |

### Impacto

Quando esta configuração está desativada:

- Agentes não podem rodar comandos shell pela tool `exec`
- Comandos shell em tarefas cron não podem rodar
- Todas as requisições de comando são rejeitadas imediatamente

## Permitir Execução Remota de Comandos

### Descrição

Quando ativado, a execução de comandos é permitida para sessões remotas e contextos não-locais. Quando desativado, apenas contextos locais confiáveis podem executar comandos.

### Configuração

**Via arquivo de configuração:**

```json
{
  "tools": {
    "exec": {
      "allow_remote": false
    }
  }
}
```

**Via variável de ambiente:**

```bash
export PICOCLAW_TOOLS_EXEC_ALLOW_REMOTE=false
```

### Casos de Uso

| Cenário                                                          | Configuração Recomendada            |
| ---------------------------------------------------------------- | ----------------------------------- |
| Uso apenas local                                                 | `allow_remote: false`               |
| Canais remotos (Telegram, Discord, etc.) precisam executar comandos | `allow_remote: true`             |
| Acesso remoto multiusuário                                       | `allow_remote: false` (mais seguro) |


### Contexto de Segurança
| Tipo de Contexto        | Descrição                                                  |
| ----------------------- | ---------------------------------------------------------- |
| Contexto local confiável | Comandos executados diretamente em um terminal local ou CLI |
| Sessão remota           | Requisições vindas de Telegram, Discord, WeChat, etc.      |
| Contexto não-local      | Chamadas via HTTP API, triggers de Webhook, etc.           |

## Exemplos de Uso Combinado

### Cenário 1: Desativar Totalmente a Execução de Comandos

Adequado para ambientes de alta segurança e somente leitura:
```json
{
  "tools": {
    "exec": {
      "enabled": false
    }
  }
}
```
**Efeito:** todas as requisições de comando são rejeitadas, tanto locais quanto remotas.

### Cenário 2: Permitir Apenas Execução Local

Adequado quando é preciso automação local, mas execução remota de comandos não é permitida:
```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "allow_remote": false
    }
  }
}
```
**Efeito:**

- Comandos no terminal local podem rodar
- Requisições vindas de canais remotos (Telegram, Discord, etc.) são rejeitadas

### Cenário 3: Totalmente Aberto (Padrão)

Adequado para ambientes de desenvolvimento ou redes confiáveis:
```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "allow_remote": true
    }
  }
}
```
**Efeito:** tanto a execução local quanto a remota de comandos são permitidas.


## Interação com Outras Configurações de Segurança

| Configuração                   | Caminho no Config                       | Descrição                           |
| ------------------------------ | --------------------------------------- | ----------------------------------- |
| Restrição de Workspace         | `agents.defaults.restrict_to_workspace` | Limita os caminhos de execução de comandos |
| Bloqueio de Comandos Perigosos | `tools.exec.enable_deny_patterns`       | Bloqueia padrões de comandos perigosos |
| Padrões de Bloqueio Personalizados | `tools.exec.custom_deny_patterns`   | Adiciona regras de bloqueio personalizadas |

### Exemplo Completo de Configuração de Segurança

```json
{
  "agents": {
    "defaults": {
      "restrict_to_workspace": true
    }
  },
  "tools": {
    "exec": {
      "enabled": true,
      "allow_remote": false,
      "enable_deny_patterns": true,
      "custom_deny_patterns": [
        "\\brm\\s+-rf\\b",
        "\\bsudo\\b"
      ]
    }
  }
}
```

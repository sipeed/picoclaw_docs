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
| Bloqueio de Padrões Perigosos | `tools.exec.enable_deny_patterns` | `true` | Ativa a proteção integrada que bloqueia padrões de comandos shell perigosos |
| Padrões de Bloqueio Personalizados | `tools.exec.custom_deny_patterns` | `[]` | Regras regex adicionais para bloqueio |
| Padrões de Permissão Personalizados | `tools.exec.custom_allow_patterns` | `[]` | Comandos que correspondam a estas regras ignoram todas as verificações de bloqueio |
| Timeout de Execução | `tools.exec.timeout_seconds` | `60` | Timeout por comando em segundos (0 = usar padrão de 60 s) |

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

## Bloqueio de Padrões Perigosos (`enable_deny_patterns`)

Com `enable_deny_patterns: true` (padrão), o PicoClaw aplica um conjunto de regras regex integradas a cada comando antes de executá-lo. **Esta verificação é independente das chaves `enabled` e `allow_remote`** — ativá-las não desativa o bloqueio por padrões.

Lista completa de padrões bloqueados:

| Categoria | Exemplos |
|-----------|----------|
| Exclusão em massa | `rm -rf`, `del /f/q`, `rmdir /s` |
| Operações em disco | `format`, `mkfs`, `diskpart`, `dd if=`, escrita em dispositivos de bloco (`/dev/sd*`, `/dev/hd*`, `/dev/vd*`, `/dev/xvd*`, `/dev/nvme*`, `/dev/mmcblk*`, `/dev/loop*`, `/dev/dm-*`, `/dev/md*`, `/dev/sr*`, `/dev/nbd*`) |
| Controle do sistema | `shutdown`, `reboot`, `poweroff` |
| Fork bomb | `:(){ :\|:& };:` |
| **Substituição de shell** | **`$(...)`, `${...}`, backticks**, `$(cat ...)`, `$(curl ...)`, `$(wget ...)`, `$(which ...)` |
| Exclusão encadeada | `; rm -rf`, `&& rm -rf`, `\|\| rm -rf` |
| Pipe para shell | `\| sh`, `\| bash` |
| Heredoc | `<< EOF` |
| Escalada de privilégio | `sudo`, `chmod NNN` (modo numérico), `chown` |
| Controle de processos | `pkill`, `killall`, `kill` |
| Execução remota de código | `curl \| sh`, `wget \| sh`, `ssh user@host` |
| Gerenciadores de pacotes | `apt install/remove/purge`, `yum install/remove`, `dnf install/remove`, `npm install -g`, `pip install --user` |
| Contêineres | `docker run`, `docker exec` |
| Mutações Git | `git push`, `git force` |
| Outros | `eval`, `source *.sh` |

:::caution Falso Positivo Comum: Sintaxe de Variável Shell
A regra `\$\{[^}]+\}` bloqueia **qualquer** comando que contenha `${...}`, incluindo a sintaxe legítima de valor padrão do bash como `${VAR:-default}`. Esta é uma limitação conhecida — o padrão foi adicionado para prevenir ataques de injeção de variáveis.

Mensagem de erro que você verá:
```
Command blocked by safety guard (dangerous pattern detected)
```

Exemplo de comando que dispara o bloqueio:
```bash
echo "HOST=${AIEXCEL_API_HOST:-não configurado}"
```

Consulte [Permitindo Padrões Específicos](#permitindo-padrões-específicos) abaixo para soluções.
:::

### Desativando o Bloqueio de Padrões Completamente

:::warning
Desativar `enable_deny_patterns` remove **todas** as 41 regras de segurança integradas, incluindo `rm -rf` e `sudo`. Faça isso apenas em ambientes completamente controlados e confiáveis.
:::

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": false
    }
  }
}
```

Variável de ambiente:
```bash
export PICOCLAW_TOOLS_EXEC_ENABLE_DENY_PATTERNS=false
```

## Permitindo Padrões Específicos

Use `custom_allow_patterns` para isentar comandos específicos das verificações de bloqueio **sem desativar toda a proteção**. Um comando que corresponda a qualquer padrão de permissão ignora todas as verificações de bloqueio.

> **Preenchimento no WebUI**: No campo de texto "Lista de permissões de comandos", insira uma expressão regular por linha, usando barras invertidas simples (sem necessidade de escape duplo como no JSON).

### Exemplo 1: Permitir sintaxe de valor padrão de variável bash

Solução para `${VAR:-default}` sendo bloqueado:

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": [
        "\\$\\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\\}"
      ]
    }
  }
}
```

Campo de permissões no WebUI:
```
\$\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\}
```

Este padrão só permite a sintaxe `${VAR:-fallback}`. Comandos que usam `${}` para injeção de comandos (ex.: `${evil_cmd}`) ainda são bloqueados por não corresponderem ao formato `:-`.

### Exemplo 2: Permitir `git push` para um remote específico

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": [
        "\\bgit\\s+push\\s+origin\\b"
      ]
    }
  }
}
```

`git push origin main` é permitido; `git push upstream main` ainda é bloqueado.

### Exemplo 3: Permitir execução de scripts Python

```json
{
  "tools": {
    "exec": {
      "enable_deny_patterns": true,
      "custom_allow_patterns": [
        "^python3?\\s+[^\\s|;&`]+\\.py\\b"
      ]
    }
  }
}
```

:::note
Os padrões de permissão são comparados com a string do comando **em letras minúsculas**. A verificação ocorre antes de todos os padrões de bloqueio — se um comando corresponder a qualquer padrão de permissão, as verificações de bloqueio são completamente ignoradas para esse comando.
:::

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
| Padrões de Permissão Personalizados | `tools.exec.custom_allow_patterns` | Isenta comandos específicos das verificações de bloqueio |

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
      ],
      "custom_allow_patterns": [
        "\\$\\{[A-Za-z_][A-Za-z0-9_]*:-[^}]*\\}"
      ]
    }
  }
}
```

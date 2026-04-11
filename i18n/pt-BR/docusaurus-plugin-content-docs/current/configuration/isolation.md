---
id: isolation
title: Isolamento de Subprocessos
---

# Isolamento de Subprocessos

O PicoClaw pode executar os processos filhos que ele inicia dentro de um ambiente isolado por instância. Isso se aplica a:

- a ferramenta `exec`
- providers baseados em CLI (`claude-cli`, `codex-cli`, etc.)
- hooks baseados em processo
- servidores MCP `stdio`

O processo principal do PicoClaw em si **não** é colocado em sandbox — apenas os filhos que ele inicia.

O isolamento está **desligado por padrão**, para que instalações existentes mantenham o comportamento atual. Habilite-o explicitamente quando quiser uma fronteira mais forte entre as chamadas de ferramentas do agente e o sistema de arquivos do host.

:::caution Linux exige bubblewrap
O backend Linux depende do `bwrap` (pacote `bubblewrap`). Não há fallback automático se o `bwrap` estiver ausente — a inicialização falhará. Instale-o com seu gerenciador de pacotes:

- Debian/Ubuntu: `apt install bubblewrap`
- Fedora/RHEL: `dnf install bubblewrap`
- Arch: `pacman -S bubblewrap`
- Alpine: `apk add bubblewrap`
:::

## Configuração

Adicione um bloco `isolation` em `~/.picoclaw/config.json`:

```json
{
  "isolation": {
    "enabled": false,
    "expose_paths": []
  }
}
```

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `enabled` | bool | `false` | Habilita o isolamento de subprocessos |
| `expose_paths` | array | `[]` | Caminhos do host expostos dentro do ambiente isolado (apenas Linux) |

### Entradas de `expose_paths`

```json
{
  "source": "/opt/toolchains/go",
  "target": "/opt/toolchains/go",
  "mode": "ro"
}
```

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `source` | string | Sim | Caminho no host |
| `target` | string | Não | Caminho dentro do ambiente isolado. Quando omitido, é igual a `source`. |
| `mode` | string | Sim | `ro` (somente leitura) ou `rw` (leitura e escrita) |

Regras:

- Apenas uma regra final pode existir para o mesmo `target` — configurações carregadas depois sobrescrevem as anteriores
- `expose_paths` é **somente Linux**; configurar `expose_paths` no Windows fará a inicialização falhar

### Exemplo

```json
{
  "isolation": {
    "enabled": true,
    "expose_paths": [
      {
        "source": "/opt/toolchains/go",
        "target": "/opt/toolchains/go",
        "mode": "ro"
      },
      {
        "source": "/data/shared-assets",
        "target": "/opt/picoclaw-instance-a/workspace/assets",
        "mode": "rw"
      }
    ]
  }
}
```

## Como Funciona

A implementação tem quatro camadas:

1. **Camada de configuração** — lê `isolation` da sua config e a injeta em runtime
2. **Camada de layout de instância** — resolve `PICOCLAW_HOME` (ou `~/.picoclaw`), prepara os diretórios da instância e monta um ambiente de usuário por instância
3. **Backend de plataforma** — Linux usa `bwrap`; Windows usa um token restrito, baixa integridade e um Job Object; macOS e outras plataformas não estão implementadas
4. **Inicialização unificada** — todo caminho de código que cria processos filhos passa por `PrepareCommand` / `Start` / `Run` em vez de chamar `cmd.Start` diretamente

Quando o isolamento está habilitado, os processos filhos recebem um ambiente de usuário redirecionado por instância:

- **Linux**: `HOME`, `TMPDIR`, `XDG_CONFIG_HOME`, `XDG_CACHE_HOME`, `XDG_STATE_HOME`
- **Windows**: `USERPROFILE`, `HOME`, `TEMP`, `TMP`, `APPDATA`, `LOCALAPPDATA`

Esses caminhos apontam para dentro do diretório `runtime-user-env/` sob a raiz da instância PicoClaw. As ferramentas e providers CLI do agente verão esse ambiente em vez do seu ambiente de usuário normal.

## Comportamento por Plataforma

### Linux (bubblewrap)

- Visão mínima do sistema de arquivos via `bwrap`
- Isolamento de namespace IPC
- Bind mounts `source -> target` somente leitura ou leitura/escrita
- Mounts padrão incluem a raiz da instância mais `/usr`, `/bin`, `/lib`, `/lib64` e `/etc/resolv.conf`
- O PicoClaw também monta automaticamente o caminho do executável, o diretório dele, o diretório de trabalho e os argumentos com caminhos absolutos quando necessário

O backend Linux **não** habilita um namespace PID dedicado por padrão.

### Windows

- Token primário restrito
- Nível de integridade baixo
- Processo dentro de um Job Object
- Ambiente de usuário por instância redirecionado

O isolamento Windows **não** implementa remapeamento real de sistema de arquivos `source -> target`. Definir `expose_paths` no Windows fará a inicialização falhar.

### macOS e Outras Plataformas

Ainda não implementado. Se você definir `enabled: true` em uma plataforma não suportada, o runtime deve tratar isso como uma configuração não suportada em vez de fingir silenciosamente que o isolamento foi aplicado.

## Logs e Depuração

Quando o isolamento está habilitado, o PicoClaw registra o plano de isolamento gerado na inicialização:

- **Linux**: entrada de log chamada `linux isolation mount plan`
- **Windows**: entrada de log chamada `windows isolation access rules`

Se você suspeitar que o isolamento está vazando, verifique se aparecem caminhos do host inesperados nesses logs.

## Relação com `restrict_to_workspace`

`restrict_to_workspace` e `isolation` resolvem problemas diferentes e se complementam:

| | `restrict_to_workspace` | `isolation` |
| --- | --- | --- |
| **Camada** | Validação de chamadas de ferramenta | Sandbox de subprocesso no nível do SO |
| **O que bloqueia** | Caminhos de arquivo que o agente *pode pedir* | O que um processo filho *realmente vê* |
| **Aplicação** | Dentro do processo picoclaw | bwrap / Job Object |
| **Risco de bypass** | Uma ferramenta com bug pode esquecer de validar | Aplicado pelo kernel |

Use ambos para defesa em profundidade.

## Limites Atuais

- O backend Linux usa `bwrap`, não um sandbox dentro do processo
- Linux não habilita um namespace PID dedicado por padrão
- Windows ainda não implementa aplicação completa de ACL de host para todos os caminhos permitidos/negados
- macOS não está implementado
- Apenas processos filhos são isolados; o processo principal do PicoClaw não é

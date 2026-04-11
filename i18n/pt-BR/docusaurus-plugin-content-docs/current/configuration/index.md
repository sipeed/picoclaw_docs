---
id: index
title: Visão Geral da Configuração
sidebar_label: Visão Geral
---

# Configuração

Arquivo de configuração: `~/.picoclaw/config.json`

:::tip Config Versão 2
A versão `2` do schema de configuração é o formato atual. Novas configurações devem incluir `"version": 2` no nível superior. Configurações V0/V1 existentes são migradas automaticamente no primeiro carregamento. Consulte o [Migration Guide](../migration/model-list-migration.md) para mais detalhes.
:::

Para uma experiência de setup mais tranquila, recomendamos usar a Web UI como a forma principal de configurar e gerenciar modelos.

![Web UI Model Setup](/img/providers/webuimodel.png)

## Seções

| Seção | Finalidade |
| --- | --- |
| `version` | Versão do schema de configuração (atual: `2`) |
| `agents.defaults` | Configurações padrão do agente (modelo, workspace, limites) |
| `bindings` | Roteamento de mensagens para agentes específicos por canal/contexto |
| `model_list` | Definições de provedores de LLM |
| `channels` | Integrações com aplicativos de chat |
| `tools` | Busca web, exec, cron, skills, MCP |
| `heartbeat` | Configurações de tarefas periódicas |
| `gateway` | Host/porta do gateway HTTP e nível de log |
| `devices` | Monitoramento de dispositivos USB |

## Layout do Workspace

O PicoClaw armazena dados no workspace configurado (padrão: `~/.picoclaw/workspace`):

```
~/.picoclaw/workspace/
├── sessions/          # Sessões de conversa e histórico
├── memory/            # Memória de longo prazo (MEMORY.md)
├── state/             # Estado persistente (último canal, etc.)
├── cron/              # Banco de dados de tarefas agendadas
├── skills/            # Skills personalizadas
├── AGENTS.md          # Guia de comportamento do agente
├── HEARTBEAT.md       # Prompts de tarefas periódicas (verificadas a cada 30 min)
├── IDENTITY.md        # Identidade do agente
├── SOUL.md            # Alma do agente
├── TOOLS.md           # Descrições das ferramentas
└── USER.md            # Preferências do usuário
```

## Variáveis de Ambiente

A maioria dos valores de configuração pode ser definida via variáveis de ambiente usando o padrão `PICOCLAW_<SEÇÃO>_<CHAVE>` em UPPER_SNAKE_CASE:

```bash
export PICOCLAW_AGENTS_DEFAULTS_MODEL_NAME=my-model
export PICOCLAW_HEARTBEAT_ENABLED=false
export PICOCLAW_HEARTBEAT_INTERVAL=60
export PICOCLAW_AGENTS_DEFAULTS_RESTRICT_TO_WORKSPACE=false
```

### Variáveis de Ambiente Especiais

| Variável | Descrição |
| --- | --- |
| `PICOCLAW_HOME` | Sobrescreve o diretório home do PicoClaw (padrão: `~/.picoclaw`). Altera a localização padrão do `workspace` e de outros diretórios de dados. |
| `PICOCLAW_CONFIG` | Sobrescreve o caminho do arquivo de configuração. Informa diretamente ao PicoClaw qual `config.json` carregar, ignorando todas as outras localizações. |
| `PICOCLAW_LOG_LEVEL` | Sobrescreve o nível de log do gateway (veja abaixo) |

**Exemplos:**

```bash
# Rodar picoclaw usando um arquivo de configuração específico
PICOCLAW_CONFIG=/etc/picoclaw/production.json picoclaw gateway

# Rodar picoclaw com todos os dados armazenados em /opt/picoclaw
PICOCLAW_HOME=/opt/picoclaw picoclaw agent

# Usar ambos para um setup totalmente customizado
PICOCLAW_HOME=/srv/picoclaw PICOCLAW_CONFIG=/srv/picoclaw/main.json picoclaw gateway
```

## Nível de Log do Gateway

`gateway.log_level` controla a verbosidade dos logs do Gateway e é configurável em `config.json`:

```json
{
  "gateway": {
    "log_level": "warn"
  }
}
```

Quando omitido, o padrão é `warn`. Valores suportados: `debug`, `info`, `warn`, `error`, `fatal`.

Você também pode sobrescrever isso com a variável de ambiente `PICOCLAW_LOG_LEVEL`.

## Configuração de Segurança

O PicoClaw permite separar dados sensíveis (chaves de API, tokens, secrets) da configuração principal armazenando-os em um arquivo `.security.yml`. Consulte [`.security.yml Reference`](./security-reference.md) para o mapeamento de campos e regras de overlay, [Security Sandbox](./security-sandbox.md) para restrições de workspace, e [Credential Encryption](../credential-encryption.md) para formatos de secrets criptografados.

Principais benefícios:
- **Segurança**: Dados sensíveis nunca ficam no arquivo de configuração principal
- **Compartilhamento fácil**: Compartilhe `config.json` sem expor chaves de API
- **Controle de versão**: Adicione `.security.yml` ao `.gitignore`
- **Deployment flexível**: Ambientes diferentes podem usar arquivos de segurança diferentes

## Agent Bindings

Use `bindings` no `config.json` para rotear mensagens de entrada para agentes diferentes por canal, conta ou contexto. Por exemplo, roteie todas as DMs do Telegram de um usuário específico para um agente de suporte, ou direcione um servidor Discord inteiro para um agente de vendas.

Consulte a [Referência Completa da Configuração](./config-reference.md) para a especificação completa de bindings.

## Links Rápidos

- [Configuração de Modelos (model_list)](./model-list.md) — adicionar provedores de LLM
- [Security Sandbox](./security-sandbox.md) — restrições de workspace e `.security.yml`
- [`.security.yml` Reference](./security-reference.md) — mapeamento de campos e precedência
- [Heartbeat](./heartbeat.md) — tarefas periódicas
- [Configuração de Ferramentas](./tools.md) — busca web, exec, cron
- [Credential Encryption](../credential-encryption.md) — criptografar chaves de API com `enc://`
- [Referência Completa da Configuração](./config-reference.md) — exemplo completo anotado

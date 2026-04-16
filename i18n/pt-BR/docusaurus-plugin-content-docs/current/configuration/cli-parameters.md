---
id: cli-parameters
title: Comandos e Parâmetros CLI
---

# Comandos e Parâmetros CLI

## Comandos principais da CLI

| Comando | Descrição |
| --- | --- |
| `picoclaw onboard` | Inicializa configuração e workspace |
| `picoclaw agent -m "hello"` | Chat de uma rodada |
| `picoclaw agent` | Modo de chat interativo |
| `picoclaw gateway` | Inicia o gateway (para apps de chat) |
| `picoclaw status` | Mostra o status |
| `picoclaw cron list` | Lista todas as tarefas agendadas |
| `picoclaw cron add ...` | Adiciona uma tarefa agendada |

## Parâmetros do `picoclaw-launcher`

| Parâmetro | Descrição | Exemplo |
| --- | --- | --- |
| `-console` | Executa no terminal (sem GUI de bandeja), imprime dica de login/origem do token no startup | `picoclaw-launcher -console` |
| `-public` | Escuta em `0.0.0.0`, permite acesso ao WebUI por dispositivos na LAN | `picoclaw-launcher -public` |
| `-no-browser` | Não abre o navegador automaticamente ao iniciar | `picoclaw-launcher -no-browser` |
| `-port &lt;port&gt;` | Define a porta do launcher (padrão `18800`) | `picoclaw-launcher -port 19999` |
| `-lang &lt;en|zh&gt;` | Define o idioma da interface do launcher | `picoclaw-launcher -lang zh` |
| `[config.json]` | Caminho posicional opcional para arquivo de configuração | `picoclaw-launcher ./config.json` |

Combinações comuns:

```bash
# Servidor headless/SSH: executa em modo console e expõe para LAN
picoclaw-launcher -console -no-browser -public

# Porta customizada com arquivo de configuração explícito
picoclaw-launcher -port 19999 ./config.json
```

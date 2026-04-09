---
id: changelog
title: Changelog
---

# Changelog

Todas as mudanças notáveis do PicoClaw são documentadas aqui.

---

## v0.2.5

*Lançado: 2026-04-03*

### Destaques

- **Canal VK (VKontakte)**: Novo canal para a maior rede social da Rússia, com Long Poll API, suporte a chat em grupo e capacidades de voz (#2276)
- **Rate Limiting de LLM**: Rate limiter embutido para chamadas de API dos providers, com limites configuráveis e fallback automático (#2198)
- **Gerenciamento de Contexto Plugável**: Nova abstração ContextManager que habilita estratégias de contexto customizadas (#2203)
- **Novos Providers**: Venice AI (#2238), Mimo (#1987), LMStudio (#2193) com defaults de provider local alinhados
- **Ferramentas Aprimoradas**: Ferramenta exec com execução em background e suporte a PTY (#1752), ferramenta de reação com envios que reconhecem replies (#2156), `load_image` para vision de arquivos locais (#2116), `read_file` por faixa de linhas (#1981)
- **Reforma da Web UI**: Hub de marketplace de skills (#2246), autenticação por token no dashboard (#1953), guia de tour para primeira execução, mensagens com imagem no chat Pico (#2299), controles de nível de log dos serviços (#2227)

### Features

#### Providers
- **Venice AI**: Nova integração com o provider Venice AI (#2238)
- **Mimo**: Novo suporte ao provider Mimo (#1987)
- **LMStudio**: Provider local com tratamento de auth/base padrão alinhado (#2193)
- **Azure OpenAI**: Usa a OpenAI Responses API para endpoints do Azure (#2110)
- **Rate Limiting**: Rate limiting por modelo com cascata de fallback automático (#2198)
- **User Agent**: `userAgent` configurável por modelo em `model_list` (#2242)
- **Disponibilidade de Modelos**: Probing aprimorado com backoff e cache (#2231)

#### Canais
- **VK (VKontakte)**: Implementação completa do canal — texto, anexos de mídia, voz (ASR/TTS), triggers de grupo e allowlists de usuário (#2276)
- **Telegram**: Contexto de reply citado e mídia em turns de entrada (#2200); proteção refinada contra mensagens duplicadas; corrigidos links HTML quebrados pelo regex de itálico (#2164)
- **DingTalk**: Respeita grupos de menção-apenas e remove menções iniciais (#2054)
- **Feishu**: Ignora entradas vazias em `random_reaction_emoji`
- **WeChat**: Suporte a novo protocolo (#2106); persiste tokens de contexto em disco (#2124)
- **Multi-mensagem**: Canais suportam envio de múltiplas mensagens via marcador de split (#2008)
- **Channel.Send**: Agora retorna os IDs das mensagens entregues (#2190)
- **Fail-fast**: Gateway falha rapidamente quando todas as inicializações de canal falham (#2262)

#### Core e Agent
- **ContextManager**: Abstração de gerenciamento de contexto plugável para estratégias customizadas (#2203)
- **Estimativa de Tokens**: Corrigida a contagem duplicada de tokens de mensagem de sistema; adicionadas proteções para conteúdo de reasoning
- **Estouro de Contexto**: Melhor detecção e classificação de erros de estouro de contexto (#2016)
- **Light Provider**: Usa light provider para chamadas de modelo roteadas (#2038)
- **Tokens de Prompt**: Loga o uso de tokens de prompt por requisição (#2047)
- **Fuso horário**: Carrega zoneinfo das variáveis de ambiente `TZ` e `ZONEINFO` (#2279)

#### Ferramentas
- **Ferramenta Exec**: Execução em background e suporte a PTY (#1752)
- **Ferramenta de Reação**: Reações com emoji e envios de mensagem que reconhecem replies (#2156)
- **load_image**: Carrega arquivos de imagem locais para análise por modelo de vision (#2116)
- **read_file**: Lê arquivos por faixa de linhas (#1981)
- **web_search**: Suporte a filtro por faixa de data
- **Cron**: Caminho unificado de execução do agent; publica respostas no bus de saída (#2147, #2100)
- **MCP**: Suporta `DisableStandaloneSSE` para transporte HTTP (#2108)

#### Web UI e Launcher
- **Marketplace de Skills**: Navegue, busque e instale skills a partir do hub (#2246)
- **Auth do Dashboard**: Dashboard do launcher protegido por token com login via SPA (#1953)
- **Tour Guide**: Tour interativo na primeira execução para novos usuários
- **Mensagens com Imagem**: Suporte a mensagens com imagem no chat Pico (#2299)
- **Controles de Nível de Log**: Ajuste os níveis de log dos serviços pela web UI (#2227)
- **Página de Config**: Exibição de versão movida para o header; configs de canal carregam sem expor secrets (#2273, #2277)
- **Token do Dashboard**: Persistido na configuração do launcher (#2304)

### Bug Fixes

- **Telegram**: Corrigido timeout de edição (#2092); hardening de segurança da política de DM (#2088)
- **Config**: Corrigido crash de `FlexibleStringSlice` no startup (#2078); feedback de ferramenta desabilitado por padrão (#2026); correção de placeholder de array
- **Gateway**: Corrigido reload que fazia o canal pico parar de funcionar (#2082); verificação da porta do gateway e registro em log fatal (#2185)
- **Retry**: Tratamento adequado do header `Retry-After` em respostas 429, com clamping seguro contra overflow (#2176)
- **Loop**: Corrigido comportamento do polling (#2103)
- **WeChat**: Corrigido pico token vazio quando o gateway era iniciado pelo launcher (#2241)
- **Web**: Hidrata o pico token em cache para o proxy websocket (#2222); cores do tema dark da página de skills (#2166); persistência do token do Discord a partir das configurações do canal (#2024)
- **Container**: Graceful shutdown em SIGINT/SIGTERM
- **BM25**: Índice pré-computado para buscas repetidas (#2177)
- **Panic Recovery**: Unificação de todos os eventos de panic para o arquivo de panic log (#2250); adicionado recover faltante em subturn (#2253)

### Build e Ops

- **Windows**: Corrigido erro de make build, suporte a env de build customizado (#2281)
- **Logging**: Variável de ambiente `PICOCLAW_LOG_FILE` para logging apenas em arquivo; logger baseado em componentes com saída destacada; nível de log padrão alterado para `warn`
- **Config**: Refatorada a estrutura de config e segurança para simplificação (#2068); campo `ModelConfig.Enabled`; texto de placeholder suporta string ou lista
- **Self-update**: Seleção e extração robustas com nightly como padrão (#2201)
- **Segurança**: Aviso de open-by-default e suporte a curinga `*` em `allow_from`

### Changelog completo
- [GitHub v0.2.4...v0.2.5](https://github.com/sipeed/picoclaw/compare/v0.2.4...v0.2.5)
---

## v0.2.4

*Lançado: 2026-03-25*

### Destaques

- **Maior Atualização de Todas**: 539 arquivos alterados, ~86.000 linhas de código adicionadas, ultrapassando 26K Stars
- **Reforma da Arquitetura do Agent**: Ciclo de vida Turn e Sub-turn, EventBus, sistema de Hook, intervenção dinâmica via Steering
- **Integração Profunda com WeChat/WeCom**: Processamento de mensagens e gerenciamento de contexto aprimorados
- **Upgrade do Sistema de Segurança**: Configuração de segurança e gerenciamento de permissões abrangentes
- **Novos Providers e Canais**: Amplo suporte a novos modelos e canais

### Refatoração da Arquitetura do Agent (Fase 1)

- **Ciclo de vida Turn e Sub-turn**: Turn como unidade atômica para compressão de contexto e gerenciamento de sessão, suportando Sub-turn com concorrência máxima de 5 e profundidade máxima de aninhamento de 3, suportando o modo evaluator-optimizer
- **EventBus**: 18 tipos de evento definidos, cobrindo todo o ciclo de vida do Agent, incluindo turns de conversa, chamadas de ferramentas, requests/responses do LLM, criação/término de sub-tasks, injeção de Steering e compressão de contexto
- **Sistema de Hook**: Suporta tipos de hook Observer, Interceptor e Approval com 5 checkpoints (before_llm, after_llm, before_tool, after_tool, approve_tool), suportando hooks in-process e de processo externo (stdio/gRPC, compatível com Python/Node.js)
- **Intervenção Dinâmica via Steering**: Injetar novas instruções em um Agent em execução durante intervalos de chamadas de ferramentas
- **Gerenciamento de Budget de Contexto**: Verifica proativamente o consumo de Token antes de cada chamada ao LLM, comprimindo o histórico automaticamente ao se aproximar dos limites, preservando a coerência da conversa com base na detecção de limites de Turn
- **Definição Estruturada via AGENT.md**: Define identidade, capacidades e personalidade do Agent através do arquivo AGENT.md com YAML frontmatter

### Canais e Integração

- **Integração Profunda com WeChat/WeCom**: Capacidades aprimoradas de processamento de mensagens e gerenciamento de contexto
- **Upgrade do Sistema de Segurança**: Configuração de segurança abrangente com gerenciamento de permissões otimizado
- **Novos Providers e Canais**: Expandidas as opções de Provider e Channel

### Changelog completo
- [GitHub v0.2.3...v0.2.4](https://github.com/sipeed/picoclaw/compare/v0.2.3...v0.2.4)
---

## v0.2.1

*Lançado: 2026-03-09*

### Destaques

- **Upgrade da Arquitetura Web e UI**: Launcher migrado para uma arquitetura modular de frontend/backend web, melhorando muito a UX de gerenciamento com um banner de launcher completamente novo (#1275, #1008).
- **Pipeline de Vision (Multimodal)**: Suporte completo a imagem/mídia no core do Agent — referências de mídia são convertidas em streams Base64 com detecção automática de tipo de arquivo, habilitando capacidades multimodais de vision do LLM.
- **Engine de Armazenamento de Memória JSONL**: Armazenamento de sessão JSONL append-only com compressão de histórico em nível físico e recuperação de crash para persistência mais segura de sessões.
- **Integração Profunda com MCP**: Suporte completo a Model Context Protocol (MCP), incluindo conectividade com MCP Servers externos e execução paralela de chamadas de ferramenta do LLM (#1070).
- **Novos Providers e Fontes de Busca**: Adicionados Minimax, Moonshot (Kimi), Exa AI, SearXNG, Avian e mais.

### Features

#### Providers
- **Novos LLMs**: Minimax (#1273), Kimi (Moonshot) e Opencode, Avian, suporte a alias de LiteLLM (#930).
- **Features Avançadas de Modelo**: Stream de extended thinking do Anthropic (#1076), login via Anthropic OAuth setup-token (#926).
- **Novas Fontes de Busca**: SearXNG, Exa AI, GLM Search Web (#1057).
- **Roteamento de Modelos**: Pontuação de complexidade de modelo agnóstica a linguagem para dispatch de modelo mais inteligente no Agent Loop.

#### Canais
- **WeCom (WeChat Corporativo)**: Nova integração com WeCom AIBot com contexto de task streaming, exibição do canal de reasoning, melhorias de timeout e cleanup.
- **Discord**: Suporte a proxy, parsing de referência de canal, expansão de message link, entendimento de contexto de quote/reply (#1047).
- **Telegram**: Suporte a Bot API Server customizado (`base_url`) (#1021), otimização de escopo de comando, chunking de mensagens longas.
- **Feishu (Lark)**: Cards aprimorados (Markdown), mídia, @mention, edição; emoji de reação aleatório (#1171).
- **Novos Canais**: Suporte nativo a canais Matrix e IRC.

#### Core e Agent
- **Multimodal**: Campo Media na estrutura Message, `resolveMediaRefs` para pipeline multimodal ponta a ponta.
- **Memória e Contexto**: Retenção de conteúdo de reasoning no histórico multi-turn; threshold de summary e razão de token configuráveis (#1029).
- **Sistema e Config**: Carregamento de variáveis de ambiente via `.env` e override de config; `PICOCLAW_HOME` para caminho customizado de config/workspace; comando `/clear` (#1266).
- **Interação**: Fallback do Agent para saída de conteúdo de reasoning (#992).

#### Ferramentas e Skills
- **Arquitetura MCP**: Carregamento de arquivo env a nível de workspace, resolução de caminhos relativos, registro completo e gerenciamento de ciclo de vida de MCP.
- **Controle de Ferramentas**: Toggle global de enable/disable para ferramentas (#1071).
- **Envio de Arquivos**: Nova ferramenta `send_file` para envio de arquivos multimídia de saída (#1156).

### Bug Fixes

#### Estabilidade e Concorrência
- Corrigidas race conditions de TOCTOU e vazamentos de recursos do MCP; deadlock durante registro de ferramentas; erros agregados em falhas de conexão.
- Consistência de crashes durante migração de JSONL (hardening de fsync, escritas seguras de metadata); limites de memory lock e aumento do buffer do scanner para prevenir OOM.
- Race de dados de dedupe de app/bot do WeCom (trocado por ring queue); vazamentos de message link do Discord entre guilds; regex de menção em grupo do Matrix.

#### Ferramentas e Rede
- Corrigido problema do limite máximo de payload do `web_fetch`; interrupt de request e vazamento do response body em execução paralela (#940).
- Corrigido retry 429 do ClawHub; flag de registry do skill discovery (#929).
- Corrigido config de timeout de comando shell da ferramenta exec; interceptação de command injection (filtro de padrão kill -9).

#### Experiência e Compatibilidade
- Parsing HTML do Telegram: degradação e re-chunking multi-fila para conteúdo muito grande.
- Compatibilidade com OpenAI: melhor tratamento de respostas não-JSON (página HTML de erro) e parsing de streaming.
- Corrigido falso positivo na proteção self-kill do hot-reload.

### Build, Deploy e Ops
- **Docker**: Imagem base trocada de Debian para Alpine; migração para sintaxe Docker Compose v2; configuração de imagem Docker pronta para MCP.
- **Cross-compilation**: Adicionados Linux/s390x e Linux/mipsle (#1265); notarização de binário macOS via goreleaser (#1274).
- **CI/CD**: Workflow de nightly build (#1226); checks de govulncheck e dupl; upload automático para Volcengine TOS (#1164).
- **Observabilidade**: Logging de ciclo de vida de cron job (#1185).

---

## v0.2.0

*Lançado: 2026-02-28*

### Novas Features

- **Reforma da Arquitetura**:
  - **Providers Baseados em Protocolo**: Introduzido um mecanismo de criação de provider baseado em protocolo, unificando a lógica de integração para OpenAI, Anthropic, Gemini, Mistral e outros protocolos principais.
  - **Upgrade do Sistema de Canais**: Arquitetura de canais reconstruída com agendamento automatizado de placeholders, indicadores de digitação e reações com emoji.
- **Ecossistema e Toolchain**:
  - **Launcher e WebUI do PicoClaw**: Nova interface web para gerenciamento visual de configuração e agendamento de processos do gateway.
  - **Skill Discovery**: Integração ClawHub para busca, cache e instalação de skills online.
- **Novos Providers**:
  - Suporte nativo a Cerebras, Mistral AI, Volcengine (Doubao), Perplexity, Qwen (Tongyi Qianwen) e Google Antigravity.
  - Saída de thought/reasoning de modelos de reasoning com exibição em canal dedicado.
- **Novos Canais**:
  - **WhatsApp Nativo**: Implementação nativa de alto desempenho do canal WhatsApp.
  - **WeCom**: Canais para WeChat Corporativo e aplicações WeCom self-built.

### Otimizações

- **Adaptação para Recursos Baixos**: Tamanho de binário otimizado com suporte abrangente a build para ARM (ARMv6, ARMv7, ARMv8.1).
- **Concorrência**: MessageBus refatorado para resolver deadlocks; buffer de mensagem aumentado de 16 para 64.
- **Melhoria de Busca**: Suporte a proxy na busca Tavily; nova interface WebSearch compatível com OpenAI.
- **Configuração Robusta**: Templates de `model_list` para adição de modelo zero-code com validação de nomes de modelo duplicados.

### Bug Fixes e Segurança

- **Segurança do Sandbox**: Corrigido risco de escape do diretório de trabalho do ExecTool e race conditions de TOCTOU; defesa reforçada contra injeção de instrução de sistema.
- **Estabilidade**:
  - Corrigidos vazamentos de memória (particularmente no canal WhatsApp).
  - Corrigidos erros 400 da Gemini API e problemas de invalidação de prompt cache.
- **Qualidade de Código**: Habilitado golangci-lint em todo o projeto; limpeza de código redundante e erros de lint.

### Documentação

- **Multi-idioma**: Adicionadas traduções do README para Vietnamita e Português (Brasil); tradução para Japonês aprimorada.
- **Guias de Arquitetura**: Nova documentação detalhada em Chinês e Inglês sobre arquitetura de canais e protocolos.

---

## v0.1.2

*Lançado: 2026-02-17*

### Novas Features

- **Canal LINE**: Adicionado suporte a canal LINE Official Account.
- **Canal OneBot**: Adicionado suporte a canal de protocolo OneBot.
- **Health Check**: Adicionados endpoints `/health` e `/ready` para orquestração de contêineres (#104).
- **Busca DuckDuckGo**: Adicionado fallback de busca DuckDuckGo com provedores de busca configuráveis.
- **Hotplug de Dispositivos**: Notificações de eventos de hotplug de dispositivos USB no Linux (#158).
- **Comandos do Telegram**: Tratamento estruturado de comandos com serviço de comando dedicado e integração `telegohandler` (#164).
- **IA Local**: Adicionada integração com Ollama para inferência local (#226).
- **Validação de Skill**: Adicionada validação para informações de skill e casos de teste (#231).

### Melhorias

- **Segurança**: Bloqueado escape crítico de workspace via symlink (#188); permissões de arquivo mais rígidas e enforcement de checagens de ACL do Slack (#186).
- **Docker**: Adicionado curl à imagem Docker; triggers do workflow de build do Docker aprimorados.
- **Suporte 32-bit**: Adicionadas build constraints para Feishu suportar arquiteturas de 32 bits.
- **Loong64**: Adicionado suporte a build Linux/loong64 (#272).
- **GoReleaser**: Migrado para GoReleaser para gerenciamento de releases (#180).

### Bug Fixes

- Corrigido envio duplicado de mensagens do Telegram (#105).
- Corrigido bug de extração de índice de code block (#130).
- Corrigido tratamento de conexão do OneBot.
- Prevenido panic em publish do MessageBus após close (#223).
- Removida extensão de arquivo duplicada em DownloadFile (#230).
- Corrigidos URL e parâmetros de OAuth authorize do OpenAI (#151).

---

## v0.1.1

*Lançado: 2026-02-13*

### Novas Features

- **Compressão Dinâmica de Contexto**: Compressão inteligente de contexto de conversa (#3).
- **Novos Canais**: Feishu (#6), QQ (#5), DingTalk Stream Mode (#12), Slack Socket Mode (#34).
- **Sistema de Memória do Agent**: Melhorias na memória do agent e na execução de ferramentas (#14).
- **Ferramenta Cron**: Suporte a tarefas agendadas com execução direta de comandos shell (#23, #74).
- **Login OAuth**: Autenticação OAuth de provider de assinatura baseada em SDK (#32).
- **Ferramenta de Migração**: Comando `picoclaw migrate` para migração de workspace do OpenClaw (#33).
- **Upgrade do Telegram**: Migrado para a biblioteca Telego para melhor integração com o Telegram (#40).
- **Provider de CLI**: Provider de LLM baseado em CLI para integração com subprocess (#73, #80).
- **Seleção de Provider**: Suporte a campo explícito de provider na configuração de modelo (#48).
- **Suporte a macOS**: Adicionado target de build Darwin ARM64 (#76).

### Melhorias

- Tratamento de mídia consolidado e cleanup de recursos aprimorado (#49).
- Informações de versão melhores, com hash de commit do git (#45).
- Enforcement de boundary do diretório de workspace para ferramentas de sistema (#26).

### Bug Fixes

- Corrigido bug de startup do serviço de heartbeat (#64).
- Corrigido erro do LLM causado pelo cleanup CONSCIOUSLY do histórico de mensagens (#55).
- Corrigido intervalo da string do device-code flow do OpenAI (#56).
- Corrigida checagem de permissão do canal Telegram (#51).
- Corrigida segurança atômica para o estado running do AgentLoop (#30).

---

## v0.0.1

*Lançado: 2026-02-09*

Release inicial do PicoClaw. Por favor, consulte o [README](https://github.com/sipeed/picoclaw) para instruções básicas de uso.

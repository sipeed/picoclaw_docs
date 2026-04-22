---
id: changelog
title: Changelog
---

# Changelog

Todas as mudanças notáveis do PicoClaw são documentadas aqui.

---

## v0.2.7

*Lançado: 2026-04-22*

### Destaques

- **Upgrade no fluxo de autenticação do Launcher**: Fluxo unificado de `/login` / `/setup` / `/logout` no dashboard, novo login OAuth com `--no-browser`, e migração da autenticação do launcher para modo senha (#2339, #2549, #2608)
- **Refatoração em duas fases do Agent Loop**: Divisão e reorganização do pipeline central de loop para reduzir complexidade de manutenção e preparar suporte a execução paralela (#2564, #2585)
- **Provider Gemini nativo**: Novo provider Gemini nativo com separação entre mensagens de thought e mensagens de output (#2475)
- **Melhorias de estabilidade em ferramentas e sessões**: Novo comando `/context` com indicador de uso de contexto; `/clear` agora limpa Seahorse DB; tarefas agendadas passam a rodar em sessões isoladas (#2537, #2495, #2474)
- **Melhorias de UX na Web UI**: Página de ferramentas refeita em abas Biblioteca/Configurações, melhorias no highlight de Markdown e mensagens de motivo para estados desabilitados (#2539, #2529, #2523, #2430, #2526)
- **Mais robustez em busca e rede**: Backend de busca Sogou configurável, com melhorias em proxy, classificação de erros e tratamento de fallback (#2524, #2542, #2547, #2517)

### Funcionalidades

#### Core & Agent
- **Refatoração de Loop**: Conclusão das fases 1/2 com divisão de arquivos e reorganização do pipeline de execução (#2564, #2585)
- **LLM-as-Judge**: Novo modo de avaliação (#2484)
- **Evolução de execução paralela**: Avanço no suporte a cenários paralelos dentro do agent loop (#2503)

#### Providers e Autenticação
- **Suporte ao protocolo Gemini nativo**: Provider nativo com separação thought/output (#2475)
- **UX de login OAuth**: Nova opção `--no-browser` para ambientes sem GUI (#2549)
- **Melhorias de compatibilidade de autenticação**: Sem fallback para token em plataformas sem suporte; correção de normalização e consistência de credenciais no provider Google Antigravity (#2466, #2599)

#### Canais, Ferramentas e Interação
- **Evolução para configuração multi-instância de canais**: Ajustes no modelo de configuração multi-instância, correção de persistência de patch aninhado em `channel_list` e melhorias na edição de listas (#2481, #2530, #2595)
- **Consistência nas chamadas de ferramenta**: Correção de reutilização de tool-call ID entre turnos e sincronização entre resumo de chamadas e saída do assistant (#2528, #2449)
- **Mensagens de estado desabilitado**: Mais explicações de bloqueio no composer/tooltip e correção de regressão relacionada (#2523, #2430, #2526)

### Correções de Bugs

- **Recuperação em runtime**: Correção da recuperação de MCP/discovery tools após reload e após erro `image-input-unsupported` (#2489, #2525)
- **Segurança na busca Seahorse**: Correção da sanitização de entrada em consultas FTS5 MATCH (#2436)
- **Estabilidade no fluxo de release/update**: Correção de retentativas em falhas transitórias na leitura de informações de release; melhorias de log antes da inicialização (#2511, #2414)
- **Bordas de configuração e rede**: Correção de `allowFrom` contendo string vazia; melhoria da classificação de erros de rede e fallback (#2507, #2547)
- **Estabilidade de frontend**: Correção de reset de rascunho de busca após refresh de config; limpeza de transcrições de sessão recuperadas e melhorias no chat UI (#2536, #2605)
- **Qualidade de engenharia**: Correção de alertas de shadow no `govet` e ajuste de testes de isolamento em OS sem suporte (#2613, #2434)

### Build e Ops

- **Pipeline de release Android**: Novo cross-compile Android arm64 e publicação de bundle Android no GoReleaser (#2486, #2497)
- **Atualização do fluxo de CI**: Migração para `pnpm/action-setup` e alinhamento dos passos de instalação no README (#2512, #2552)
- **Manutenção de dependências**: Upgrade de várias dependências de frontend e backend (React, TanStack, shadcn, sqlite, MCP SDK, router/lint e outras)
- **Paridade de comportamento em container**: Imagens self-built passam a rodar como root para alinhar com imagens de release (#2435)

### Documentação

- **Reorganização da estrutura de docs**: Reorganização por tipo com novos docs de layout e session/routing (#2567, #2571)
- **Atualização de docs de protocolo**: Atualização dos docs de protocolo Gemini nativo e de escaping JSON cross-provider (#2601, #2420)
- **Localização e ajustes diversos**: Novo README em coreano e correção do link de Conventional Commits no CONTRIBUTING (#2418, #2494)

### Changelog completo
- [GitHub v0.2.6...v0.2.7](https://github.com/sipeed/picoclaw/compare/v0.2.6...v0.2.7)
---

## v0.2.6

*Lançado: 2026-04-08*

### Destaques

- **Isolamento de Subprocessos**: Novo runtime `pkg/isolation` coloca processos filhos (ferramenta exec, providers CLI, hooks de processo, servidores MCP stdio) em sandbox usando `bwrap` no Linux e token restrito + Job Object no Windows (#2423)
- **Memória de Curto Prazo Seahorse (LCM)**: Novo engine de memória persistente em SQLite por agente, com recuperação full-text FTS5, sumarização hierárquica e ferramentas `short_grep` / `short_expand` (#2285)
- **Sistema de Hooks Aprimorado**: Nova ação `respond` permite que hooks `before_tool` retornem resultados de ferramentas diretamente, habilitando injeção de ferramentas plugin, cache de resultados e mock de ferramentas. Specs upstream completas adicionadas (#2215)
- **Canal Microsoft Teams**: Novo canal `teams_webhook` somente saída posta Adaptive Cards no Teams via webhooks de fluxo do Power Automate, com roteamento multi-destino e conversão automática de tabelas markdown (#2244)
- **Cabeçalhos HTTP Customizados em Providers**: Providers LLM baseados em HTTP agora aceitam um campo `custom_headers` por entrada de modelo para injetar cabeçalhos arbitrários em toda requisição (#2402)
- **Armazenamento de Artefatos MCP**: Resultados de texto grandes vindos de ferramentas MCP agora são persistidos como artefatos em vez de inflar o contexto (#2308)

### Funcionalidades

#### Canais
- **Teams Webhook**: Novo canal somente saída via webhooks de fluxo do Power Automate; suporta múltiplos destinos nomeados selecionáveis por mensagem; renderiza mensagens como Adaptive Cards com suporte nativo a tabelas Markdown (#2244)
- **Feishu**: Enriquecimento de contexto em respostas agora cobre também respostas a cards e arquivos, com cache de mensagens de 30s e limite de 600 caracteres (#2144)

#### Núcleo & Agente
- **Isolamento de Subprocessos**: Novo runtime `pkg/isolation` com config `enabled` e `expose_paths` num bloco de topo `isolation`. Linux usa `bwrap` para isolamento de filesystem e namespace IPC; Windows usa token restrito + integridade baixa + Job Object. macOS ainda não implementado (#2423)
- **Engine de Memória de Curto Prazo Seahorse**: Store SQLite por agente em `<workspace>/sessions/seahorse.db` com indexação FTS5 sobre resumos e mensagens; sumarização hierárquica em duas camadas (folha + condensada); registra automaticamente as ferramentas `short_grep` e `short_expand` quando ativo (#2285)
- **Ação `respond` em Hook**: Nova `HookActionRespond` permite que um hook `before_tool` retorne um `HookResult` diretamente, pulando a execução da ferramenta; specs upstream completas `hook-json-protocol.md` e `plugin-tool-injection.md` adicionadas; **ignora as verificações de `approve_tool`**, então confie no hook adequadamente (#2215)
- **Provider por Candidato em Fallbacks**: `model_fallbacks` agora suporta config independente de provider por candidato (#2143)

#### Providers
- **Cabeçalhos HTTP Customizados**: Novo campo `custom_headers` em `ModelConfig` para providers HTTP — injetado em toda requisição, útil para proxies de auth, cabeçalhos de observabilidade, roteamento específico de fornecedor (#2402)

#### MCP
- **Armazenamento de Artefatos**: Resultados de texto grandes de ferramentas MCP são persistidos no armazenamento de artefatos e referenciados por handle, evitando inflar o contexto (#2308)
- **Transporte de Comando Isolado**: Servidores MCP `stdio` agora passam pelo caminho unificado de inicialização com isolamento

#### Ferramentas & Memória
- **Ferramenta LOCOMO Membench**: Novo utilitário de benchmark sob `pkg/membench` para avaliar engines de memória de conversa longa (#2353)
- **`write_file`**: Esclarecida a semântica de escape de JSON aninhado e adicionados testes (#2320)

#### Web UI
- **URL do WebSocket**: Agora é derivada de `window.location` no browser em vez de ser hardcoded pelo backend, corrigindo cenários de proxy reverso e acesso remoto (#2405)
- **Fluxo HTTP do Launcher**: Endpoints HTTP padrão `/login` / `/setup` / `/logout` para o dashboard, corrigido o lock de PID do Windows para WebSocket (#2339)

### Correções de Bugs

- **WebUI**: Corrigida a falha do WebUI em conectar ao gateway iniciado pelo próprio WebUI (#2267)
- **Gateway**: Endurecidos detecção de PID vivo, validação de propriedade e estado do proxy WebSocket (#2403, #2422)
- **Ferramentas**: A ferramenta `message` não suprime mais a resposta ao chat de origem (#2180)
- **Docker**: Adicionada a flag `-console` e acesso de rede aberto para o launcher (#2314); imagens self-built agora rodam como root para paridade com as imagens de release (#2435)
- **CLI**: Corrigido `v` duplicado na linha de versão do banner de help (#2316)
- **Seahorse**: Desabilitado o context manager em FreeBSD/ARM e outras plataformas não suportadas (#2417, #2384); semântica de rank BM25 corrigida nos comentários (#2360)
- **Testes**: Pula `TestPrepareCommand_AppliesUserEnv` em sistemas operacionais não suportados (#2434)

### Build & Ops

- **Dependências**: `modernc.org/sqlite` 1.47.0 → 1.48.0 (#2289); `github.com/pion/rtp` 1.8.7 → 1.10.1 (#2290)
- **Assets**: Imagem do QR code do WeChat atualizada (#2385)
- **Docs**: Tradução do README para coreano adicionada

### Documentação

Esta release vem acompanhada das seguintes atualizações no site de docs:
- Novos: [Canal Microsoft Teams (Webhook)](./channels/teams-webhook.md), [Isolamento de Subprocessos](./configuration/isolation.md)
- Atualizados: [Sistema de Hooks](./hooks.md), [Compactação de Contexto](./context-compression.md), [Login com Token](./configuration/token_authentication.md), [Canal Feishu](./channels/feishu.md), [Referência de Configuração](./configuration/config-reference.md)

### Changelog completo
- [GitHub v0.2.5...v0.2.6](https://github.com/sipeed/picoclaw/compare/v0.2.5...v0.2.6)
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

## v0.2.3

*Lançado: 2026-03-17*

### Destaques

- **UI da System Tray**: Suporte a tray de desktop em todas as plataformas (macOS, Linux, FreeBSD)
- **Controles do Exec**: Configurações de exec configuráveis com gating de comandos cron
- **Web Gateway**: Hot reload e sincronização de estado por polling para gerenciamento do gateway
- **SpawnStatusTool**: Nova ferramenta para reportar status de subagentes

### Funcionalidades

- Configurações de execução de comandos cron expostas na web UI
- WebSocket roteado pela porta do servidor web para ingresso unificado
- Helpers do gateway refatorados com health check via `server.pid`

### Correções de Bugs

- **GLM**: Corrigido tratamento de input `nil` em blocos `tool_use` para o provider GLM
- **Gateway**: Não inicia mais automaticamente quando o servidor não está rodando
- **Workspace**: Normalizadas as verificações de path da whitelist para roots permitidos com symlink

### Changelog completo
- [GitHub v0.2.2...v0.2.3](https://github.com/sipeed/picoclaw/compare/v0.2.2...v0.2.3)
---

## v0.2.2

*Lançado: 2026-03-11*

### Destaques

- **Transcrição de Voz**: Transcrição de áudio Echo voice para Discord, Slack e Telegram
- **UI de Gerenciamento de Agentes**: Nova web UI para gerenciamento de agentes e integração com o launcher
- **Endurecimento de Segurança**: Caminhos de exec não autenticados foram endurecidos

### Funcionalidades

- Suporte à config de exec `allow_remote` na página de settings web
- Sanitização de caracteres de barra em chaves de sessão de tópicos de fórum
- Refatorada a análise de metadados markdown do loader de skills

### Correções de Bugs

- **Gateway**: Corrigida a resolução do path do binário do gateway e a passagem da flag `--config`
- **Migração**: Pula arquivos meta JSON durante a migração de sessões
- **Slack**: Corrigidas mensagens duplicadas em threads

### Changelog completo
- [GitHub v0.2.1...v0.2.2](https://github.com/sipeed/picoclaw/compare/v0.2.1...v0.2.2)
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

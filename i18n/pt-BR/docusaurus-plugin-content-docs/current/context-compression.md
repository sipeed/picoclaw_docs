---
id: context-compression
title: Compressão de Contexto
---

# Compressão de Contexto

Quando uma conversa cresce além da janela de contexto do LLM, o PicoClaw comprime automaticamente turns mais antigos em resumos, para que o agent possa continuar trabalhando sem perder estado importante.

O compactador fica em `pkg/seahorse` e roda como um pipeline de **sumarização hierárquica em dois níveis**. O tier 1 roda a cada turn; o tier 2 roda em background apenas quando o contexto está realmente sob pressão.

## Como Funciona

### Tier 1 — Compactação de folhas (síncrona, a cada turn)

Após cada turn de conversa, o engine procura pelo trecho contíguo mais antigo de mensagens que está **fora da cauda fresca protegida** (os 32 itens mais recentes por padrão) e que atende a um dos critérios:

- ao menos 8 mensagens, **ou**
- ao menos 20.000 tokens de conteúdo de mensagem

Se ambos os limites estiverem abaixo do mínimo, a compactação de folha não faz nada.

Quando um trecho se qualifica, o engine pede ao LLM configurado para resumi-lo até cerca de 1.200 tokens. O resumo é escrito de volta na conversa no lugar das mensagens originais, e as mensagens de origem permanecem ligadas a ele, para que o agent possa posteriormente "expandir" o resumo se necessário.

### Tier 2 — Compactação condensada (assíncrona, quando acima do limite)

Se o total de tokens do contexto ultrapassar **75% da janela de contexto** (`ContextThreshold` em `pkg/seahorse/short_constants.go`), o engine dispara uma goroutine em background que condensa **múltiplos resumos de folha existentes em um único resumo de nível superior**.

O seletor percorre os resumos por profundidade, escolhe a profundidade mais rasa que tem pelo menos 4 resumos consecutivos, pede ao LLM para fundi-los até cerca de 2.000 tokens e os substitui no contexto. O loop se repete até que uma das condições ocorra:

- o contexto caia de volta abaixo do limite, ou
- não haja mais candidatos a condensar, ou
- uma passada não produza progresso.

Como o Tier 2 é assíncrono, turns normais nunca ficam bloqueados esperando pela sumarização.

### Recuperação agressiva

Se um budget rígido for definido (por exemplo, porque o próximo turn sozinho excederia a janela de contexto), o engine recorre ao `CompactUntilUnder`, que intercala passadas de folha e condensadas e ignora a proteção da cauda fresca até que o contexto caiba. Ele é limitado a 20 iterações para prevenir loops infinitos.

### Escalonamento em três níveis por chamada

Cada chamada ao LLM usa até três níveis de escalonamento:

1. **Prompt normal** — preserva decisões, justificativas, operações de arquivo e tarefas ativas.
2. **Prompt agressivo** — mantém apenas fatos duráveis, TODOs e o estado da tarefa atual.
3. **Truncamento determinístico** — fallback puramente local, sem LLM, usado quando ambos os prompts falham em reduzir a entrada.

Isso significa que a compactação sempre progride, mesmo que o modelo de sumarização esteja sobrecarregado ou retorne conteúdo vazio.

## Configuração

Os knobs voltados ao usuário ficam em `agents.defaults`:

| Campo | Padrão | Descrição |
| --- | --- | --- |
| `context_window` | (específico por modelo) | Tamanho total da janela de contexto em tokens. Deve ser alto o suficiente para que o limite de disparo seja alcançável. |
| `summarize_token_percent` | `75` | Dispara a compactação quando o contexto em execução atinge essa porcentagem de `context_window`. |
| `summarize_message_threshold` | `20` | Número mínimo de mensagens antes que a compactação possa ser disparada apenas por pressão de tokens. |

```json
{
  "agents": {
    "defaults": {
      "context_window": 131072,
      "summarize_token_percent": 75,
      "summarize_message_threshold": 20
    }
  }
}
```

O próprio engine seahorse também expõe algumas constantes internas em `pkg/seahorse/short_constants.go` (`FreshTailCount`, `LeafMinFanout`, `LeafChunkTokens`, `CondensedMinFanout`, `LeafTargetTokens`, `CondensedTargetTokens`). Elas são defaults ajustados e não devem ser alteradas via `config.json`.

## Design agnóstico ao LLM

O engine de compactação não é acoplado a um provider específico. Ele recebe um callback `complete(ctx, prompt, opts)`, que é ligado ao modelo configurado para o agent. Qualquer modelo compatível com OpenAI, Anthropic, Gemini ou local pode ser usado como sumarizador — normalmente o mesmo modelo que o agent já está executando.

## Store persistente e recuperação

O engine seahorse é apoiado por um **store SQLite por agent** em `<workspace>/sessions/seahorse.db`. Toda mensagem — original ou resumida — e todo resumo são persistidos lá, com indexação full-text FTS5 sobre os corpos de resumos e mensagens. É isso que permite ao agent pesquisar o histórico mesmo depois que a compactação encolheu a visão dentro do contexto.

Duas ferramentas seahorse são registradas automaticamente no registro de ferramentas do agent sempre que o context manager seahorse está ativo:

### `short_grep`

Pesquisa resumos e mensagens por conteúdo no store persistente.

```text
short_grep(pattern, scope?, role?, last?, since?, before?, all_conversations?, limit?)
```

- `pattern` — suporta correspondência por palavra, operadores `AND` / `OR` / `NOT`, e wildcards `%fuzzy%`
- `scope` — `summary`, `message`, ou `both` (padrão)
- `role` — filtra mensagens por `user` / `assistant`
- `last` — janela relativa de tempo (`6h`, `7d`, `2w`, `1m`)
- `since` / `before` — limites absolutos em ISO 8601
- `all_conversations` — pesquisa além da conversa atual

Os resultados incluem ranks BM25 do FTS5 (mais negativo = melhor correspondência) e um campo `depth` em resumos: depth 0 significa nível folha (mais próximo das mensagens brutas), depths maiores são resumos condensados cobrindo períodos mais longos.

### `short_expand`

Recupera o conteúdo completo da mensagem por ID. O agent normalmente chama `short_expand` depois que `short_grep` retorna apenas um snippet.

```text
short_expand(message_ids: ["10", "25", ...])
```

Retorna o texto completo mais partes estruturadas (text, argumentos de tool_use, URIs de mídia). Os payloads de `tool_result` são intencionalmente omitidos porque podem ser grandes — re-execute a ferramenta original se você realmente precisar do resultado.

### Por que um store separado

A compactação encolhe o que o LLM **vê**, mas nunca descarta informação. O store SQLite + ferramentas de recuperação transformam o histórico da conversa em um arquivo pesquisável: o agent pode dar `short_grep` em decisões passadas, `short_expand` para recuperar o turno original, e só pagar tokens de contexto pelo recorte que realmente precisa.

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

## Expandindo um resumo

Cada resumo está ligado às mensagens originais que ele substituiu. A ferramenta `short_expand` do PicoClaw permite que o agent navegue de um resumo de volta para sua faixa de origem quando mais detalhes são necessários. É isso que torna o compactador lossy-mas-recuperável: a conversa fica mais curta no contexto, mas o histórico completo continua no store.

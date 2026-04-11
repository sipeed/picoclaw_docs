---
id: contributing
title: Contribuindo
---

# Contribuindo com o PicoClaw

Obrigado pelo seu interesse em contribuir com o PicoClaw! Este projeto é um esforço comunitário para construir um assistente pessoal de IA leve e versátil. Aceitamos contribuições de todos os tipos: correções de bugs, funcionalidades, documentação, traduções e testes.

O próprio PicoClaw foi substancialmente desenvolvido com assistência de IA — abraçamos essa abordagem e construímos nosso processo de contribuição em torno dela.

## Índice

- [Código de Conduta](#código-de-conduta)
- [Formas de Contribuir](#formas-de-contribuir)
- [Primeiros Passos](#primeiros-passos)
- [Configuração de Desenvolvimento](#configuração-de-desenvolvimento)
- [Fazendo Alterações](#fazendo-alterações)
- [Contribuições Assistidas por IA](#contribuições-assistidas-por-ia)
- [Processo de Pull Request](#processo-de-pull-request)
- [Estratégia de Branches](#estratégia-de-branches)
- [Revisão de Código](#revisão-de-código)
- [Comunicação](#comunicação)

---

## Código de Conduta

Estamos comprometidos em manter uma comunidade acolhedora e respeitosa. Seja gentil, construtivo e presuma boa-fé. Assédio ou discriminação de qualquer tipo não será tolerado.

---

## Formas de Contribuir

- **Relatórios de bugs** — Abra uma issue usando o template de relatório de bug.
- **Solicitações de funcionalidades** — Abra uma issue usando o template de solicitação de funcionalidade; discuta antes de implementar.
- **Código** — Corrija bugs ou implemente funcionalidades. Veja o fluxo de trabalho abaixo.
- **Documentação** — Melhore READMEs, documentação, comentários no código ou traduções.
- **Testes** — Execute o PicoClaw em novos hardwares, canais ou provedores de LLM e reporte seus resultados.

Para novas funcionalidades substanciais, abra uma issue primeiro para discutir o design antes de escrever código. Isso evita esforço desperdiçado e garante alinhamento com a direção do projeto.

---

## Primeiros Passos

1. **Faça o fork** do repositório no GitHub.
2. **Clone** seu fork localmente:
   ```bash
   git clone https://github.com/<your-username>/picoclaw.git
   cd picoclaw
   ```
3. Adicione o remote upstream:
   ```bash
   git remote add upstream https://github.com/sipeed/picoclaw.git
   ```

---

## Configuração de Desenvolvimento

### Pré-requisitos

- Go 1.25 ou superior
- `make`

### Build

```bash
make build       # Build binary (runs go generate first)
make generate    # Run go generate only
make check       # Full pre-commit check: deps + fmt + vet + test
```

### Executando Testes

```bash
make test                                    # Run all tests
go test -run TestName -v ./pkg/session/      # Run a single test
go test -bench=. -benchmem -run='^$' ./...  # Run benchmarks
```

### Estilo de Código

```bash
make fmt   # Format code
make vet   # Static analysis
make lint  # Full linter run
```

Todas as verificações de CI devem passar antes que um PR possa ser mesclado. Execute `make check` localmente antes de fazer push para detectar problemas antecipadamente.

---

## Fazendo Alterações

### Branching

Sempre crie sua branch a partir da `main` e direcione a `main` no seu PR. Nunca faça push diretamente na `main` ou em qualquer branch `release/*`:

```bash
git checkout main
git pull upstream main
git checkout -b your-feature-branch
```

Use nomes de branch descritivos, ex.: `fix/telegram-timeout`, `feat/ollama-provider`, `docs/contributing-guide`.

### Commits

- Escreva mensagens de commit claras e concisas em inglês.
- Use o modo imperativo: "Add retry logic" e não "Added retry logic".
- Referencie a issue relacionada quando relevante: `Fix session leak (#123)`.
- Mantenha os commits focados. Uma alteração lógica por commit é preferível.
- Para limpezas menores ou correções de typo, faça squash em um único commit antes de abrir o PR.
- Consulte https://www.conventionalcommits.org/zh-hans/v1.0.0/

### Mantendo-se Atualizado

Faça rebase da sua branch sobre a `main` upstream antes de abrir um PR:

```bash
git fetch upstream
git rebase upstream/main
```

---

## Contribuições Assistidas por IA

O PicoClaw foi construído com assistência substancial de IA, e abraçamos totalmente o desenvolvimento assistido por IA. No entanto, os contribuidores devem entender suas responsabilidades ao usar ferramentas de IA.

### Divulgação é Obrigatória

Todo PR deve divulgar o envolvimento de IA usando a seção **🤖 AI Code Generation** do template de PR. Existem três níveis:

| Nível | Descrição |
|---|---|
| 🤖 Totalmente gerado por IA | A IA escreveu o código; o contribuidor revisou e validou |
| 🛠️ Majoritariamente gerado por IA | A IA produziu o rascunho; o contribuidor fez modificações significativas |
| 👨‍💻 Majoritariamente escrito por humano | O contribuidor liderou; a IA forneceu sugestões ou nenhuma |

Divulgação honesta é esperada. Não há estigma associado a nenhum nível — o que importa é a qualidade da contribuição.

### Você é Responsável pelo que Envia

Usar IA para gerar código não reduz sua responsabilidade como contribuidor. Antes de abrir um PR com código gerado por IA, você deve:

- **Ler e entender** cada linha do código gerado.
- **Testar** em um ambiente real (veja a seção Test Environment do template de PR).
- **Verificar problemas de segurança** — modelos de IA podem gerar código sutilmente inseguro (ex.: travessia de diretório, injeção, exposição de credenciais). Revise com cuidado.
- **Validar a corretude** — lógica gerada por IA pode parecer plausível mas estar errada. Valide o comportamento, não apenas a sintaxe.

PRs onde é evidente que o contribuidor não leu ou testou o código gerado por IA serão fechados sem revisão.

### Padrões de Qualidade para Código Gerado por IA

Contribuições geradas por IA são mantidas no **mesmo padrão de qualidade** que código escrito por humanos:

- Deve passar em todas as verificações de CI (`make check`).
- Deve ser Go idiomático e consistente com o estilo do codebase existente.
- Não deve introduzir abstrações desnecessárias, código morto ou over-engineering.
- Deve incluir ou atualizar testes quando apropriado.

### Revisão de Segurança

Código gerado por IA requer escrutínio extra de segurança. Preste atenção especial a:

- Manipulação de caminhos de arquivo e escapes de sandbox (veja o commit `244eb0b` para um exemplo real)
- Validação de entrada externa em handlers de canal e implementações de ferramentas
- Manipulação de credenciais ou segredos
- Execução de comandos (`exec.Command`, invocações de shell)

Se você não tem certeza se um trecho de código gerado por IA é seguro, diga no PR — os revisores ajudarão.

---

## Processo de Pull Request

### Antes de Abrir um PR

- [ ] Execute `make check` e certifique-se de que passa localmente.
- [ ] Preencha o template de PR completamente, incluindo a seção de divulgação de IA.
- [ ] Vincule as issues relacionadas na descrição do PR.
- [ ] Mantenha o PR focado. Evite agrupar alterações não relacionadas.

### Seções do Template de PR

O template de PR solicita:

- **Descrição** — O que essa alteração faz e por quê?
- **Tipo de Alteração** — Correção de bug, funcionalidade, documentação ou refatoração.
- **Geração de Código por IA** — Divulgação do envolvimento de IA (obrigatório).
- **Issue Relacionada** — Link para a issue que isso endereça.
- **Contexto Técnico** — URLs de referência e raciocínio (pule para PRs puramente de documentação).
- **Ambiente de Teste** — Hardware, SO, modelo/provedor e canais usados para teste.
- **Evidência** — Logs ou screenshots opcionais demonstrando que a alteração funciona.
- **Checklist** — Confirmação de auto-revisão.

### Tamanho do PR

Prefira PRs pequenos e revisáveis. Um PR que altera 200 linhas em 5 arquivos é muito mais fácil de revisar do que um que altera 2000 linhas em 30 arquivos. Se sua funcionalidade é grande, considere dividi-la em uma série de PRs menores e logicamente completos.

---

## Estratégia de Branches

### Branches de Longa Duração

- **`main`** — a branch de desenvolvimento ativa. Todos os PRs de funcionalidades têm como alvo a `main`. A branch é protegida: pushes diretos não são permitidos, e pelo menos uma aprovação de mantenedor é necessária antes do merge.
- **`release/x.y`** — branches de release estáveis, criadas a partir da `main` quando uma versão está pronta para ser lançada. Essas branches são mais rigorosamente protegidas que a `main`.

### Requisitos para Merge na `main`

Um PR só pode ser mesclado quando todos os seguintes requisitos forem atendidos:

1. **CI passa** — Todos os workflows do GitHub Actions (lint, test, build) devem estar verdes.
2. **Aprovação do revisor** — Pelo menos um mantenedor deve ter aprovado o PR.
3. **Sem comentários de revisão não resolvidos** — Todas as threads de revisão devem estar resolvidas.
4. **Template de PR completo** — Incluindo divulgação de IA e ambiente de teste.

### Quem Pode Fazer Merge

Apenas mantenedores podem fazer merge de PRs. Contribuidores não podem fazer merge de seus próprios PRs, mesmo que tenham acesso de escrita.

### Estratégia de Merge

Usamos **squash merge** para a maioria dos PRs para manter o histórico da `main` limpo e legível. Cada PR mesclado se torna um único commit referenciando o número do PR, ex.:

```
feat: Add Ollama provider support (#491)
```

Se um PR consiste em múltiplos commits independentes e bem separados que contam uma história clara, um merge regular pode ser usado a critério do mantenedor.

### Branches de Release

Quando uma versão está pronta, os mantenedores criam uma branch `release/x.y` a partir da `main`. A partir desse ponto:

- **Novas funcionalidades não são portadas de volta.** A branch de release não recebe novas funcionalidades após ser criada.
- **Correções de segurança e bugs críticos são cherry-picked.** Se uma correção na `main` se qualifica (vulnerabilidade de segurança, perda de dados, crash), os mantenedores farão cherry-pick dos commits relevantes para a branch `release/x.y` afetada e emitirão uma release de patch.

Se você acredita que uma correção na `main` deveria ser portada para uma branch de release, anote na descrição do PR ou abra uma issue separada. A decisão cabe aos mantenedores.

Branches de release têm proteções mais rigorosas que a `main` e nunca recebem push direto sob nenhuma circunstância.

---

## Revisão de Código

### Para Contribuidores

- Responda aos comentários de revisão em tempo razoável. Se precisar de mais tempo, avise.
- Quando atualizar um PR em resposta a feedback, anote brevemente o que mudou (ex.: "Atualizado para usar `sync.RWMutex` conforme sugerido").
- Se discordar de um feedback, engaje respeitosamente. Explique seu raciocínio; revisores também podem estar errados.
- Não faça force-push após uma revisão ter começado — isso dificulta que revisores vejam o que mudou. Use commits adicionais; o mantenedor fará squash no merge.

### Para Revisores

Revise por:

1. **Corretude** — O código faz o que afirma? Existem casos extremos?
2. **Segurança** — Especialmente para código gerado por IA, implementações de ferramentas e handlers de canal.
3. **Arquitetura** — A abordagem é consistente com o design existente?
4. **Simplicidade** — Existe uma solução mais simples? Isso adiciona complexidade desnecessária?
5. **Testes** — As alterações são cobertas por testes? Os testes existentes ainda são significativos?

Seja construtivo e específico. "Isso pode ter uma race condition se duas goroutines chamarem isso concorrentemente — considere usar um mutex aqui" é melhor que "isso parece errado".


### Lista de Revisores
Após seu PR ser enviado, você pode entrar em contato com os revisores designados listados na tabela a seguir.

|Função| Revisor|
|---     |---      |
|Provider|@yinwm   |
|Channel |@yinwm   |
|Agent   |@lxowalle|
|Tools   |@lxowalle|
|SKill   ||
|MCP     ||
|Optimization|@lxowalle|
|Security||
|AI CI   |@imguoguo|
|UX      ||
|Document||

---

## Comunicação

- **GitHub Issues** — Relatórios de bugs, solicitações de funcionalidades, discussões de design.
- **GitHub Discussions** — Perguntas gerais, ideias, conversa com a comunidade.
- **Comentários em Pull Requests** — Feedback específico sobre código.
- **WeChat e Discord** — Convidaremos você quando tiver pelo menos um PR mesclado.

Na dúvida, abra uma issue antes de escrever código. Custa pouco e evita esforço desperdiçado.

---

## Uma Nota sobre a Origem do Projeto Impulsionada por IA

A arquitetura do PicoClaw foi substancialmente projetada e implementada com assistência de IA, guiada por supervisão humana. Se você encontrar algo que pareça estranho ou over-engineered, pode ser um artefato desse processo — abrir uma issue para discutir é sempre bem-vindo.

Acreditamos que o desenvolvimento assistido por IA feito de forma responsável produz ótimos resultados. Também acreditamos que humanos devem permanecer responsáveis pelo que entregam. Essas duas crenças não estão em conflito.

Obrigado por contribuir!

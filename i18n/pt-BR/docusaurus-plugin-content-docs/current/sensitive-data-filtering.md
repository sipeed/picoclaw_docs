---
id: sensitive-data-filtering
title: Filtragem de Dados Sensíveis
---

# Filtragem de Dados Sensíveis

O PicoClaw filtra automaticamente valores sensíveis — como chaves de API, tokens e segredos — dos resultados de ferramentas antes de enviá-los ao LLM. Isso evita que credenciais vazem para o contexto do modelo e sejam repetidas para os usuários ou registradas em logs.

## Como os Valores São Coletados

Os valores sensíveis são coletados do seu arquivo `.security.yml` durante a inicialização. Todo valor de string definido nesse arquivo é tratado como um segredo em potencial.

## Configuração

A filtragem é configurada na seção `tools`:

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `filter_sensitive_data` | bool | `true` | Habilita ou desabilita a filtragem de dados sensíveis. |
| `filter_min_length` | int | `8` | Comprimento mínimo de um valor para ser considerado na filtragem. Valores mais curtos que isso são ignorados para evitar falsos positivos. |

Você também pode alternar a filtragem via variável de ambiente:

```bash
export PICOCLAW_TOOLS_FILTER_SENSITIVE_DATA=false
```

## Como Funciona

1. **Na inicialização**, o PicoClaw lê `.security.yml` e coleta todos os valores de string que atendem ao requisito de comprimento mínimo.
2. Esses valores são combinados em um `strings.Replacer`.
3. **Para cada resultado de ferramenta**, o replacer faz a varredura da saída e substitui qualquer valor correspondente por `[FILTERED]`.

### Exemplo

Dado um `.security.yml` contendo:

```yaml
openai:
  api_key: "sk-abc123xxxxxxxxxxxxxxxxxx"
database:
  password: "super-secret-db-pass"
```

E uma ferramenta que retorna:

```
Connected to database with password super-secret-db-pass
API response from sk-abc123xxxxxxxxxxxxxxxxxx: {"status": "ok"}
```

O LLM verá:

```
Connected to database with password [FILTERED]
API response from [FILTERED]: {"status": "ok"}
```

## Desempenho

- **Caminho rápido para conteúdo curto** — resultados de ferramenta mais curtos que o comprimento mínimo de filtragem são retornados imediatamente, sem varredura.
- **Substituição O(n+m)** — o `strings.Replacer` subjacente usa um algoritmo eficiente no estilo Aho-Corasick, onde `n` é o comprimento do conteúdo e `m` é o comprimento total de todos os padrões.
- **Inicialização tardia** — o replacer é construído uma única vez na inicialização e reutilizado em todas as chamadas de ferramentas subsequentes.

## Considerações de Segurança

- **A filtragem é best-effort.** Se um segredo não estiver listado em `.security.yml`, ele não será filtrado. Mantenha sempre o seu arquivo de segurança atualizado.
- **Correspondências parciais não são filtradas.** O valor precisa aparecer exatamente como definido. Substrings ou variantes codificadas (por exemplo, base64) não serão detectadas.
- **O padrão `filter_min_length` de 8** foi escolhido para evitar a filtragem de strings curtas e comuns que gerariam falsos positivos em excesso. Ajuste esse valor conforme seus requisitos de segurança.
- **As entradas das ferramentas não são filtradas** — apenas os resultados (saídas) das ferramentas são analisados. Se dados sensíveis aparecerem nos argumentos enviados a uma ferramenta, eles não serão ocultados.
- **Logging e armazenamento** — a filtragem ocorre antes de o resultado ser enviado ao LLM, mas a saída bruta da ferramenta ainda pode aparecer em logs locais, dependendo da sua configuração de logging.

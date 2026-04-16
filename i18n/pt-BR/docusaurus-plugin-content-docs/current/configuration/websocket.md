---
id: websocket
title: Conectar WebSocket
---
## Guia de Integracao do WebSocket do PicoClaw

> Escopo: comportamento atual do repositorio em 2026-04-13.
> Este documento e voltado para desenvolvedores terceiros que integrem com o WebSocket do PicoClaw via Launcher, incluindo extensoes de navegador, paginas frontend executadas na mesma origem do Launcher, clientes desktop e clientes server-side.

Desde a v0.2.5, as conexoes WebSocket do PicoClaw exigem duas camadas de validacao. Clientes externos devem se conectar ao Launcher na porta `18800`, e nao diretamente ao Gateway na porta `18790`.

## Tres Pontos Para Lembrar Primeiro

1. O ponto de entrada publico e `ws(s)://<launcher-host>/pico/ws`.
2. O handshake precisa passar pela autenticacao do Launcher e tambem fornecer um token Pico.
3. O navegador e a forma mais facil de testar porque envia automaticamente o cookie de sessao do login.

## Estrategia de Versao

- Desenvolva e teste integracoes de terceiros com base em release tags.
- Nao use `main` para integracoes de producao; ela muda com frequencia e a compatibilidade nao e garantida.
- Ao atualizar o PicoClaw, fixe tanto a versao do PicoClaw quanto a versao da documentacao em que voce se apoia.

Recomendamos registrar explicitamente no seu projeto:

1. A tag ou versao de release do PicoClaw
2. A versao deste documento de integracao
3. As versoes minima e maxima do PicoClaw que voce suporta

## Arquitetura E Modelo De Autenticacao

No modo Launcher, o caminho da conexao e:

- Cliente -> `ws(s)://<launcher-host>/pico/ws`
- Launcher -> proxy reverso para o canal Pico do Gateway

Atualmente existem duas camadas de autenticacao:

1. Camada de autenticacao do Launcher
   Usa uma sessao autenticada ou `Authorization: Bearer <dashboard_token>` em requisicoes server-side.
2. Camada de autenticacao do Pico WebSocket
   Usa `Sec-WebSocket-Protocol: token.<pico_token>`.

Pontos importantes:

- `/pico/ws` nao e um endpoint WebSocket anonimo; ele e protegido pelo Launcher.
- Depois de um login bem-sucedido no Launcher, o Launcher grava o cookie `picoclaw_launcher_auth`.
- `picoclaw_launcher_auth` prova que esse navegador ja fez login no Launcher, satisfazendo a primeira camada de autenticacao.
- Esse cookie e uma credencial de sessao. Voce nao precisa injeta-lo manualmente no codigo do navegador; o navegador o envia automaticamente em requisicoes same-origin.
- O Launcher converte `token.<raw_pico_token>` para o formato interno antes de encaminhar ao Gateway, entao o cliente nao precisa se preocupar com a composicao do PID token.

### Arquitetura De Autenticacao

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Launcher (18800)                         │
├─────────────────────────────────────────────────────────────────┤
│  Primeira camada: estado de login do Launcher                   │
│  - Cookie de sessao do navegador: picoclaw_launcher_auth       │
│  - Ou Authorization: Bearer <dashboard_token>                  │
├─────────────────────────────────────────────────────────────────┤
│  Segunda camada: autenticacao do Pico WebSocket                │
│  - Sec-WebSocket-Protocol: token.<pico_token>                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Gateway (18790)                            │
│  O Launcher cuida da conversao interna do token e do proxy      │
└─────────────────────────────────────────────────────────────────┘
```

## Fluxo Padrao De Integracao

### Passo 1: Faca Login No Launcher Primeiro

Para usuarios de navegador, a forma mais simples e abrir:

```text
http://your-host:18800?token=<dashboard_token>
```

Voce tambem pode chamar explicitamente o endpoint de login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "token": "<dashboard_token>"
}
```

Depois que o login funcionar, o Launcher define o cookie de sessao `picoclaw_launcher_auth`. A partir dai, esse navegador enviara automaticamente o estado de login ao acessar `/api/pico/token` e `/pico/ws`.

> Voce pode obter `dashboard_token` destas formas:
> - Verificando os logs de inicializacao do Launcher
> - Definindo `PICOCLAW_LAUNCHER_TOKEN`
> - Configurando em `~/.picoclaw/launcher.json`

### Passo 2: Obter O Token Pico E O `ws_url`

Esta e a parte que costuma confundir usuarios nao tecnicos. O que voce realmente faz e: primeiro faz login no Launcher no navegador, depois executa um pequeno snippet `fetch` nesse mesmo contexto do navegador para obter `token` e `ws_url`.

Ha um pre-requisito importante aqui: os exemplos de navegador abaixo assumem que seu codigo esta rodando na mesma origem do Launcher, por exemplo diretamente na pagina do Launcher. Se o seu frontend estiver hospedado em outro dominio, o caminho relativo `/api/pico/token` vai apontar para o seu proprio site, e nao para o Launcher.

#### Metodo A: Verificar Na Barra De Endereco Do Navegador

Abra isto no navegador:

```text
http://127.0.0.1:18800/api/pico/token
```

Voce pode ver um destes resultados:

- Uma resposta JSON diretamente, o que significa que voce ja esta logado e pode continuar.
- Um redirecionamento para a pagina de login, o que significa que o Launcher ainda nao esta logado ou a sessao expirou.
- Um `401`, o que significa que o estado atual de login e invalido.

Resposta esperada:

```json
{
  "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "ws_url": "ws://127.0.0.1:18800/pico/ws",
  "enabled": true
}
```

#### Metodo B: Executar No Console Do DevTools

Se voce estiver seguindo os exemplos de codigo, eles normalmente devem ser executados no console do navegador, e nao no terminal do sistema.

Observe tambem que o `fetch()` do navegador normalmente segue redirecionamentos automaticamente. Portanto, se o estado de login estiver invalido, voce pode nao ver o `302` bruto no JavaScript. O caso mais comum e a requisicao acabar na pagina de login e depois falhar em `response.json()` porque recebeu HTML em vez de JSON.

Passos:

1. Abra a pagina do Launcher, por exemplo `http://127.0.0.1:18800/`.
2. Pressione `F12` para abrir o DevTools.
3. Va para a aba `Console`.
4. Se o Chrome bloquear a primeira colagem, digite `allow pasting` manualmente e pressione Enter.
5. Depois cole e execute o codigo abaixo.

```javascript
const response = await fetch('/api/pico/token');

if (response.redirected) {
  throw new Error(`A requisicao foi redirecionada para ${response.url}. Faca login no Launcher / Dashboard primeiro.`);
}

if (response.status === 401) {
  throw new Error('Voce precisa fazer login no Launcher / Dashboard primeiro');
}

if (!response.ok) {
  throw new Error(`Falha ao obter o token Pico: ${response.status}`);
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`/api/pico/token deveria retornar JSON, mas retornou ${contentType || 'tipo de conteudo desconhecido'}`);
}

const data = await response.json();
console.log(data);
```

Se o console mostrar algo como isto, o passo funcionou:

```json
{
  "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "ws_url": "ws://127.0.0.1:18800/pico/ws",
  "enabled": true
}
```

Se `enabled` for `false`, o canal Pico WebSocket ainda nao foi habilitado.

### Passo 3: Abrir A Conexao WebSocket

URL de conexao:

```text
<ws_url>?session_id=<your_session_id>
```

Subprotocolo:

```text
token.<pico_token>
```

Recomendamos gerar seu proprio `session_id` estavel e rastreavel, como `browser-demo` ou `node-test-001`.

## Exemplos De Integracao No Navegador

O `WebSocket` nativo do navegador normalmente nao permite customizar o header `Authorization`, entao clientes de navegador devem primeiro fazer login no Launcher e depois depender do cookie same-origin durante o handshake.

Esse requisito de same-origin importa. Os exemplos de navegador desta secao sao validos quando o codigo roda na mesma origem da pagina do Launcher. Eles nao sao exemplos prontos para copiar e colar em uma aplicacao web third-party hospedada em outra origem.

### Extensoes Do Chrome Exigem Cuidado Extra

Se voce estiver desenvolvendo uma extensao do Chrome, diferencie estes dois contextos de execucao:

- Um script injetado na pagina do Launcher
- O `popup`, `side panel` ou `service worker` da propria extensao

O primeiro caso se comporta muito mais como um script normal de pagina e e a forma mais simples de reutilizar o estado de login da pagina do Launcher.

O segundo caso vem de `chrome-extension://...`, que nao e a mesma origem do Launcher. Isso significa que, mesmo que voce ja tenha feito login no Launcher no navegador, nao deve presumir que `fetch('/api/pico/token')` dentro do popup da extensao funcionara da mesma forma que em uma pagina normal.

Se seu objetivo for depurar protocolo ou fazer um teste rapido, prefira uma destas abordagens:

1. Abra o DevTools diretamente na pagina do Launcher e execute o codigo de exemplo ali.
2. Faca a extensao injetar um script de teste na pagina do Launcher em vez de tentar se conectar diretamente do popup da extensao.

### Exemplo Minimo De Conexao

```javascript
const response = await fetch('/api/pico/token');

if (response.redirected) {
  throw new Error(`A requisicao foi redirecionada para ${response.url}. Faca login no Launcher primeiro.`);
}

if (response.status === 401) {
  throw new Error('O estado de login do Launcher e invalido');
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`/api/pico/token deveria retornar JSON, mas retornou ${contentType || 'tipo de conteudo desconhecido'}`);
}

const { token, ws_url, enabled } = await response.json();

if (!enabled) {
  throw new Error('O canal Pico WebSocket nao esta habilitado');
}

const sessionId = 'browser-demo';
const ws = new WebSocket(
  `${ws_url}?session_id=${encodeURIComponent(sessionId)}`,
  [`token.${token}`],
);

ws.onopen = () => {
  console.log('WebSocket conectado');
};

ws.onmessage = (event) => {
  console.log('Mensagem recebida:', JSON.parse(event.data));
};

ws.onerror = (error) => {
  console.error('Erro do WebSocket:', error);
};

ws.onclose = () => {
  console.log('WebSocket fechado');
};
```

### O Que Fazer Depois De Conectar

Explicar apenas como conectar nao basta. Depois que o handshake funcionar, voce deve pelo menos saber como enviar uma mensagem e onde olhar a resposta.

Este e um fluxo interativo minimo:

```javascript
const response = await fetch('/api/pico/token');

if (response.redirected) {
  throw new Error(`A requisicao foi redirecionada para ${response.url}. Faca login no Launcher primeiro.`);
}

if (response.status === 401) {
  throw new Error('O estado de login do Launcher e invalido');
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`/api/pico/token deveria retornar JSON, mas retornou ${contentType || 'tipo de conteudo desconhecido'}`);
}

const { token, ws_url, enabled } = await response.json();

if (!enabled) {
  throw new Error('O canal Pico WebSocket nao esta habilitado');
}

const sessionId = 'browser-demo';
const ws = new WebSocket(
  `${ws_url}?session_id=${encodeURIComponent(sessionId)}`,
  [`token.${token}`],
);

ws.onopen = () => {
  console.log('connected');

  ws.send(JSON.stringify({
    type: 'message.send',
    id: `req-${Date.now()}`,
    session_id: sessionId,
    timestamp: Date.now(),
    payload: {
      content: 'Hello PicoClaw!',
    },
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('server -> client', message);
};
```

Observe duas coisas:

1. Se `connected` aparece primeiro no Console.
2. Se o servidor responde com mensagens como `typing.start`, `message.create`, `message.update`, `error` ou `pong`.

Para testar heartbeat, voce tambem pode enviar:

```javascript
ws.send(JSON.stringify({
  type: 'ping',
  id: `ping-${Date.now()}`,
  timestamp: Date.now(),
  payload: {},
}));
```

Normalmente voce deve receber `pong`.

### Exemplo Mais Completo No Navegador

```javascript
class PicoClawClient {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.ws = null;
  }

  async connect() {
    const response = await fetch('/api/pico/token');

    if (response.redirected) {
      throw new Error(`A requisicao foi redirecionada para ${response.url}. Faca login no Launcher / Dashboard primeiro.`);
    }

    if (response.status === 401) {
      throw new Error('Voce precisa fazer login no Launcher / Dashboard primeiro');
    }

    if (!response.ok) {
      throw new Error(`Falha ao obter o token: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`/api/pico/token deveria retornar JSON, mas retornou ${contentType || 'tipo de conteudo desconhecido'}`);
    }

    const { token, ws_url, enabled } = await response.json();

    if (!enabled) {
      throw new Error('O canal Pico WebSocket nao esta habilitado');
    }

    this.ws = new WebSocket(
      `${ws_url}?session_id=${encodeURIComponent(this.sessionId)}`,
      [`token.${token}`],
    );

    this.ws.onmessage = (event) => {
      console.log('Mensagem recebida:', JSON.parse(event.data));
    };

    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error('Falha na conexao WebSocket'));
    });
  }

  sendText(content) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('O WebSocket nao esta conectado');
    }

    this.ws.send(JSON.stringify({
      type: 'message.send',
      id: `req-${Date.now()}`,
      session_id: this.sessionId,
      timestamp: Date.now(),
      payload: { content },
    }));
  }

  ping() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('O WebSocket nao esta conectado');
    }

    this.ws.send(JSON.stringify({
      type: 'ping',
      id: `ping-${Date.now()}`,
      timestamp: Date.now(),
      payload: {},
    }));
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

const client = new PicoClawClient('browser-demo');
await client.connect();
client.sendText('Hello PicoClaw!');
client.ping();
```

## Notas Sobre Clientes Nao Navegador

Para Node.js, Python, apps desktop ou ferramentas como Postman, que nao carregam automaticamente cookies do navegador, a experiencia atual de integracao ainda e bem mais dificil e precisa ser explicada de forma explicita.

### Comportamento Observado Atualmente

- Se voce requisitar `/api/pico/token` sem um estado de login valido do Launcher, normalmente recebera um `302` redirecionando para a pagina de login.
- No caso de "login por senha no startup", o fluxo mais antigo da documentacao que usava `dashboardToken` diretamente nao e uma boa solucao geral.
- Nos testes atuais, o handshake usa `session_id`; nao e um modelo simples de "pegue dashboardToken e conecte cegamente".
- Em outras palavras, clientes nao navegador ainda nao sao um caminho standalone suave na versao atual. Isso ainda precisa de mais design e limpeza.

### O Que Fazer Se Voce Receber 302

`302` normalmente significa que o Launcher acha que voce nao esta logado, ou que esse cliente nao possui de fato uma sessao de login utilizavel.

Nao apenas repita a tentativa do WebSocket imediatamente. Verifique estas tres coisas antes:

1. Voce esta usando `18800`, e nao `18790`.
2. Voce ja fez login no Launcher no navegador.
3. Seu cliente nao navegador esta realmente enviando o estado de login.

Na implementacao atual, a coisa mais facil de esquecer e o cookie de sessao. O navegador pode ja ter `picoclaw_launcher_auth`, mas o processo Node.js nao herda esse cookie automaticamente.

### Um Exemplo Node.js Mais Proximo Da Realidade Atual

Este exemplo demonstra a ideia de "reutilizar o cookie de sessao do navegador" em vez de fingir que `dashboardToken` sozinho cobre todos os casos.

Isto e intencionalmente nao apresentado como um fluxo oficial, completo e suportado de ponta a ponta. A documentacao atual nao define uma maneira limpa e oficial de exportar e reutilizar a sessao do navegador em um processo Node.js separado. Portanto, o snippet abaixo deve ser tratado como um esboco de depuracao para explicar por que a requisicao continua recebendo `302`, e nao como uma receita madura de integracao.

```javascript
const fetch = require('node-fetch');
const WebSocket = require('ws');

async function connectPico() {
  const launcherBaseUrl = 'http://127.0.0.1:18800';
  const sessionId = 'node-demo';

  // Substitua isto apenas se voce ja tiver um cookie de sessao valido do Launcher
  // obtido pelo seu proprio setup de depuracao.
  // A documentacao atual nao define um fluxo oficial de exportacao de cookie.
  const launcherCookie = 'picoclaw_launcher_auth=replace-with-real-cookie';

  const tokenResponse = await fetch(`${launcherBaseUrl}/api/pico/token`, {
    headers: {
      Cookie: launcherCookie,
    },
    redirect: 'manual',
  });

  if (tokenResponse.status === 302 || tokenResponse.status === 401) {
    throw new Error('Falha na autenticacao do Launcher: este cliente nao possui uma sessao de login valida');
  }

  if (!tokenResponse.ok) {
    throw new Error(`Falha ao obter o token Pico: ${tokenResponse.status}`);
  }

  const { token, ws_url, enabled } = await tokenResponse.json();

  if (!enabled) {
    throw new Error('O canal Pico WebSocket nao esta habilitado');
  }

  const ws = new WebSocket(
    `${ws_url}?session_id=${encodeURIComponent(sessionId)}`,
    [`token.${token}`],
    {
      headers: {
        Cookie: launcherCookie,
      },
    },
  );

  ws.on('open', () => {
    console.log('connected');
    ws.send(JSON.stringify({
      type: 'message.send',
      id: `req-${Date.now()}`,
      session_id: sessionId,
      timestamp: Date.now(),
      payload: {
        content: 'Hello from Node.js',
      },
    }));
  });

  ws.on('message', (data) => {
    console.log('server -> client', JSON.parse(data.toString()));
  });

  ws.on('error', (err) => {
    console.error('Erro do WebSocket:', err);
  });
}

connectPico().catch(console.error);
```

### Por Que Esta Secao E Intencionalmente Conservadora

Porque, na versao atual, o caminho para clientes nao navegador ainda tem varios problemas reais:

- O estado de login e muito mais natural dentro do navegador do que fora dele.
- A relacao entre `session_id` e o estado de login do Launcher nao esta exposta com clareza suficiente.
- Quando usuarios encontram `302`, eles podem entender que precisam fazer login no Dashboard, mas sem uma explicacao seguinte de como carregar esse estado de login no Node.js, eles continuam travados.

Por isso, esta documentacao descreve intencionalmente a limitacao atual e a forma como a falha acontece, enquanto deixa claro que o fluxo para clientes nao navegador ainda precisa de trabalho de design posterior.

## Recomendacoes De Desenvolvimento E Depuracao

Se voce estiver construindo uma integracao, nao comecar diretamente com Node.js ou um app desktop. Depure nesta ordem:

1. Faca login no Launcher no navegador.
2. Confirme que `GET /api/pico/token` retorna JSON no navegador.
3. Complete uma conexao WebSocket no `Console` do DevTools do navegador.
4. Envie um `message.send` e confirme que recebe resposta.
5. Somente depois que o fluxo do navegador funcionar, avance para a reutilizacao de sessao fora do navegador.

O motivo e simples: o navegador ja carrega `picoclaw_launcher_auth`, o que facilita separar problemas de autenticacao de problemas do protocolo de mensagem.

## Protocolo De Mensagens

Tipos comuns de mensagens de entrada (cliente -> servidor):

- `message.send`
- `media.send`
- `ping`

Tipos comuns de mensagens de saida (servidor -> cliente):

- `message.create`
- `message.update`
- `typing.start`
- `typing.stop`
- `error`
- `pong`

Estrutura geral da mensagem:

```json
{
  "type": "message.send",
  "id": "optional-id",
  "session_id": "optional-session-id",
  "timestamp": 0,
  "payload": {}
}
```

Exemplo minimo de envio:

```json
{
  "type": "message.send",
  "id": "req-1",
  "payload": {
    "content": "hello"
  }
}
```

## Erros Comuns E Solucao De Problemas

| Problema | Causa Comum | O Que Fazer |
|------|----------|----------|
| Redirecionamento `302` para a pagina de login ou `/launcher-login` | Falha na autenticacao do Launcher; sem login ou sem transportar o estado de login | Primeiro confirme que o navegador esta logado, depois confirme que o cliente atual realmente envia o estado de login |
| `401 Unauthorized` | Porta errada, ou o metodo atual de autenticacao nao e aceito | Use `18800`; nao conecte diretamente a `18790` |
| `403 Invalid Pico token` | `token.<...>` em `Sec-WebSocket-Protocol` esta incorreto | Chame `GET /api/pico/token` novamente e use o token mais recente |
| `503 Gateway not available` | Gateway nao esta rodando ou Launcher nao se anexou com sucesso | Verifique o estado do Gateway e tente novamente |
| A conexao funciona mas nada acontece | So o handshake foi concluido; nenhum `message.send` ou `ping` foi enviado | Siga os exemplos de interacao e envie uma mensagem explicitamente |
| Validacao de origin falhou | `channels.pico.allow_origins` nao corresponde a origin da requisicao | Configure origins permitidas explicitamente e evite `*` |

## Portas E Tokens

### Portas

| Porta | Finalidade | Permite Acesso Externo Direto |
|------|------|------------------|
| `18800` | Launcher (Web UI + API + proxy WebSocket) | Sim, recomendado |
| `18790` | Gateway (servico interno) | Nao, nao suportado |

### Tokens / Sessao

| Nome | Finalidade | Observacoes |
|------|------|------|
| Dashboard Token | Fazer login no Launcher e acessar APIs protegidas | Util para entrada de login no Launcher, mas nao deve mais ser tratado como a unica credencial para todos os cenarios de cliente |
| `picoclaw_launcher_auth` | Cookie de sessao do Launcher no navegador | Definido pelo Launcher apos o login; o navegador o envia automaticamente em requisicoes same-origin |
| Pico Token | Autenticacao do subprotocolo WebSocket | Obtido por `GET /api/pico/token` |
| `session_id` | Identificador de sessao da conexao atual | Passado na query da URL, por exemplo `?session_id=browser-demo` |

## Recomendacoes De Seguranca

1. Use HTTPS/WSS em producao.
2. Nao exponha a porta `18790` do Gateway.
3. Nao habilite `allow_token_query` por padrao.
4. Mantenha `allow_origins` o mais restrito possivel; nao use `*`.
5. Rotacione tokens Pico regularmente; voce pode regenera-los com `POST /api/pico/token`.
6. Sempre que possivel, mantenha o Launcher ligado localmente. Se precisar expor em LAN ou internet, combine com `allowed_cidrs`.
7. Nao grave tokens ou cookies de sessao em armazenamento persistente frontend, logs do navegador ou logs plaintext do servidor.

## Exemplo De Configuracao

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "replace-with-strong-random-token",
      "allow_token_query": false,
      "allow_origins": ["https://your-app.example.com"],
      "max_connections": 100
    }
  }
}
```

## Recomendacoes Para Desenvolvedores Terceiros

No minimo, cubra este fluxo em testes automatizados:

1. Fazer login no Launcher
2. Obter um token Pico
3. Abrir uma conexao WebSocket usando `token.<token>`
4. Enviar `message.send`
5. Verificar que voce recebe uma resposta ou uma mensagem de erro

Depois que esse fluxo estiver estavel, avance para UI, gerenciamento de sessao, reconexao e estrategias de recuperacao.

## Recomendacoes De Manutencao Da Documentacao

- Mantenha esta orientacao de integracao WebSocket como um documento principal unico, para que o fluxo geral e os avisos voltados para desenvolvedores nao se desalinhem.
- Se houver mudancas futuras sobre discussao de design de autenticacao, exemplos especificos de Node.js ou melhorias de tutorial, divida em PRs separados em vez de misturar tudo.

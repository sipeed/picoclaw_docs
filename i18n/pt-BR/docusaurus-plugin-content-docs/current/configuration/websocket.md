---
id: websocket
title: Conectando WebSocket
---
## Guia de Conexão de Cliente Externo WebSocket do PicoClaw

A partir da v0.2.5, as conexões WebSocket do PicoClaw exigem **autenticação dupla**. Conectar diretamente à porta Gateway (18790) ou fornecer apenas o token pico não será autenticado com sucesso.

---

### Arquitetura de Autenticação

```
┌─────────────────────────────────────────────────────────────────┐
│                        Launcher (18800)                         │
├─────────────────────────────────────────────────────────────────┤
│  Primeira Camada de Autenticação: Autenticação do Dashboard      │
│  - Cookie de Sessão (picoclaw_launcher_auth)                    │
│  - Ou Authorization: Bearer <dashboard_token>                   │
├─────────────────────────────────────────────────────────────────┤
│  Segunda Camada de Autenticação: Autenticação WebSocket Pico     │
│  - Sec-WebSocket-Protocol: token.<picoToken>                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Gateway (18790)                            │
│  Uso interno do token combinado: pico-{pidToken}{picoToken}      │
│  (Convertido automaticamente pelo Launcher, clientes não precisam se preocupar) │
└─────────────────────────────────────────────────────────────────┘
```

---

### Método de Conexão Plugin/Frontend do Navegador

#### Passo 1: Usuário Faz Login no Dashboard

Os usuários precisam acessar o Dashboard do PicoClaw no navegador e fazer login primeiro:

```
http://your-host:18800?token=<dashboard_token>
```

Após o login bem-sucedido, o navegador obterá um cookie de sessão (`picoclaw_launcher_auth`).

> **Métodos de Aquisição do Token do Dashboard**:
> - Verifique a saída do console quando o Launcher iniciar
> - Ou defina a variável de ambiente `PICOCLAW_LAUNCHER_TOKEN`
> - Ou configure em `~/.picoclaw/launcher.json`

#### Passo 2: Obter Token Pico

```javascript
const response = await fetch('/api/pico/token');
const { token, ws_url, enabled } = await response.json();

console.log('Token Pico:', token);
console.log('URL WebSocket:', ws_url);
```

#### Passo 3: Conectar WebSocket

```javascript
const ws = new WebSocket(ws_url, [`token.${token}`]);

ws.onopen = () => {
    console.log('Conexão WebSocket bem-sucedida');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Mensagem recebida:', message);
};

ws.onerror = (error) => {
    console.error('Erro WebSocket:', error);
};

ws.onclose = () => {
    console.log('Conexão WebSocket fechada');
};
```

#### Exemplo Completo

```javascript
class PicoClawClient {
    constructor() {
        this.ws = null;
        this.picoToken = null;
        this.wsUrl = null;
    }

    async connect() {
        // Obter token pico
        const response = await fetch('/api/pico/token');
        if (!response.ok) {
            throw new Error('Falha ao obter token, faça login no Dashboard primeiro');
        }
        
        const data = await response.json();
        this.picoToken = data.token;
        this.wsUrl = data.ws_url;

        // Conectar WebSocket
        // Cookie de sessão é carregado automaticamente, não é necessário definir manualmente
        this.ws = new WebSocket(this.wsUrl, [`token.${this.picoToken}`]);

        return new Promise((resolve, reject) => {
            this.ws.onopen = () => resolve();
            this.ws.onerror = (e) => reject(new Error('Falha na conexão'));
        });
    }

    send(content) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket não conectado');
        }
        
        this.ws.send(JSON.stringify({
            type: 'message.send',
            session_id: this.sessionId,
            timestamp: Date.now(),
            payload: { content }
        }));
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Exemplo de Uso
const client = new PicoClawClient();
await client.connect();
client.send('Olá PicoClaw!');
```

---

### Método de Conexão de Cliente Não-Navegador

Para clientes que não podem usar cookies (como Node.js, Python, Postman), você precisa:

#### Método A: Usar Cabeçalho Authorization

```javascript
// Exemplo Node.js (requer biblioteca WebSocket)
const WebSocket = require('ws');

const dashboardToken = 'your-dashboard-token';
const picoToken = 'your-pico-token';

const ws = new WebSocket('ws://your-host:18800/pico/ws', [`token.${picoToken}`], {
    headers: {
        'Authorization': `Bearer ${dashboardToken}`
    }
});
```

#### Método B: Usar Token de Consulta

```
ws://your-host:18800/pico/ws?token=<dashboard_token>
```

Forneça `Sec-WebSocket-Protocol: token.<picoToken>` ao mesmo tempo.

---

### Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| **302 Redirecionamento para /launcher-login** | Autenticação do Dashboard não passou | Faça login no Dashboard primeiro para obter cookie de sessão |
| **403 Proibido "Token Pico inválido"** | Token pico incorreto ou não fornecido | Chame `/api/pico/token` para obter o token correto |
| **401 Não Autorizado** | Conectado diretamente à porta Gateway | Mude para conectar à porta Launcher (18800) |
| **503 Serviço Indisponível** | Gateway não está rodando | Inicie o serviço Gateway |

---

### Descrição da Porta

| Porta | Propósito | Clientes externos podem conectar diretamente |
|-------|-----------|---------------------------------------------|
| **18800** | Launcher (UI Web + Proxy) | ✅ Recomendado |
| **18790** | Gateway (Serviço Interno) | ❌ Conexão direta não suportada |

---

### Descrição do Tipo de Token

| Tipo de Token | Propósito | Método de Aquisição |
|---------------|-----------|---------------------|
| **Token do Dashboard** | Acessar UI Web e API | Gerado na inicialização ou configure `PICOCLAW_LAUNCHER_TOKEN` |
| **Token Pico** | Autenticação de conexão WebSocket | Chame `GET /api/pico/token` |
| **Token PID** | Uso interno do Gateway | Gerado automaticamente, clientes não precisam se preocupar |

---

### Recomendações de Segurança

1. **Não exponha a porta Gateway**: Exponha apenas a porta Launcher (18800)
2. **Use HTTPS**: Configure proxy reverso (como Nginx) para habilitar HTTPS em produção
3. **Mude tokens regularmente**: Regenere token pico via `POST /api/pico/token`
4. **Restrinja IPs de acesso**: Configure `allowed_cidrs` em `launcher.json`

---

Para outros problemas, forneça feedback nos Issues do GitHub.
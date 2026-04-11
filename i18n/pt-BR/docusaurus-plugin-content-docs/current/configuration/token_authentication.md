---
id: token_authentication
title: Login com Token
---

# Login com Token

## Visão Geral

O PicoClaw suporta vários métodos de autenticação por token para proteger o acesso à API do Gateway e o login no console Web. Este documento explica como configurar e usar os recursos de autenticação por token.

---

## Token Authentication do Pico Channel

O Pico Channel é o canal nativo de protocolo WebSocket do PicoClaw, que suporta autenticação baseada em token.

### Métodos de Configuração

#### Método 1: Arquivo de Configuração

Configure em `~/.picoclaw/config.json`:

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "your-secure-token-here"
    }
  }
}
```

#### Método 2: Variável de Ambiente

```bash
export PICOCLAW_CHANNELS_PICO_TOKEN="your-secure-token-here"
```

#### Método 3: Arquivo de Configuração de Segurança (Recomendado)

Configure informações sensíveis em `~/.picoclaw/.security.yml`:

```yaml
channels:
  pico:
    token: "your-secure-token-here"
```

> **Dica de segurança**: Recomendamos usar `.security.yml` para armazenar tokens sensíveis. Adicione esse arquivo ao `.gitignore`.

### Métodos de Autenticação

O Pico Channel suporta três métodos de autenticação por token:

| Método | Descrição | Caso de Uso |
|--------|-----------|-------------|
| **Authorization Header** | `Authorization: Bearer <token>` | Chamadas server-side, clientes API |
| **WebSocket Subprotocol** | `Sec-WebSocket-Protocol: token.<value>` | Conexões WebSocket de browser |
| **URL Query Parameter** | `?token=<token>` | Cenários simples (precisa ser habilitado explicitamente) |

#### 1. Authorization Header

Inclua o token no header HTTP:

```bash
curl -H "Authorization: Bearer your-secure-token-here" \
  http://localhost:18790/api/endpoint
```

#### 2. WebSocket Subprotocol

Especifique o subprotocolo ao abrir a conexão WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:18790/pico', ['token.your-secure-token-here']);
```

#### 3. URL Query Parameter

> **Nota**: Esse método é desabilitado por padrão e precisa ser habilitado explicitamente.

Habilitar URL query token:

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "your-secure-token-here",
      "allow_token_query": true
    }
  }
}
```

Uso:

```javascript
const ws = new WebSocket('ws://localhost:18790/pico?token=your-secure-token-here');
```

> **Aviso de segurança**: O método de URL query parameter pode expor o token em logs e no histórico do navegador. Use com cuidado.

### Opções de Configuração Completas

```json
{
  "channels": {
    "pico": {
      "enabled": true,
      "token": "your-secure-token-here",
      "allow_token_query": false,
      "allow_origins": ["https://your-app.com"],
      "ping_interval": 30,
      "read_timeout": 60,
      "write_timeout": 60,
      "max_connections": 100
    }
  }
}
```

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `enabled` | bool | `false` | Habilita o Pico Channel |
| `token` | string | - | Token de autenticação (obrigatório) |
| `allow_token_query` | bool | `false` | Permitir token via URL query |
| `allow_origins` | []string | `[]` | Lista de origens permitidas; vazio permite todas |
| `ping_interval` | int | `30` | Intervalo de ping do WebSocket (segundos) |
| `read_timeout` | int | `60` | Timeout de leitura (segundos) |
| `write_timeout` | int | `60` | Timeout de escrita (segundos) |
| `max_connections` | int | - | Número máximo de conexões |

---

## Token do Web Launcher Dashboard

O Web Launcher Dashboard expõe um fluxo padrão HTTP de login / setup / logout, protegido por um único token. O mesmo token também assina os cookies de sessão do dashboard.

![set token](/img/configuration/login.png)

### Ordem de Resolução do Token

Na inicialização, o launcher resolve o token do dashboard a partir destas fontes, em ordem de prioridade:

1. **Variável de ambiente `PICOCLAW_LAUNCHER_TOKEN`** — prioridade máxima. Quando definida, esse valor é usado e **não** é exibido nos logs.
2. **Campo `launcher_token` em `launcher-config.json`** — persistido entre reinicializações. Esse é o caso padrão depois que você define um token customizado pelo dashboard ou editando o arquivo.
3. **Token aleatório (fallback)** — usado apenas se nenhuma das opções acima estiver presente. O PicoClaw gera um token aleatório de 256 bits, **persiste em `launcher-config.json`** e o reutiliza nas próximas inicializações.

A origem do token ativo é reportada como `env`, `config` ou `random` nos logs do launcher na inicialização — então o token persiste entre reinicializações a menos que você o gire explicitamente.

### Visualizando o Token

- **Modo console** (`-console`): o token (ou sua origem) é impresso na inicialização
- **Modo tray/GUI**: use "Copy Console Token" no menu da bandeja
- **Arquivo de log**: `$PICOCLAW_HOME/logs/launcher.log`
- **launcher-config.json**: leia o campo `launcher_token` diretamente

### Definindo um Token Fixo

Duas maneiras:

**Variável de ambiente** (sobrescreve tudo, não persiste):

```bash
export PICOCLAW_LAUNCHER_TOKEN="your-fixed-launcher-token"
```

**`launcher-config.json`** (persistido):

```json
{
  "port": 18800,
  "launcher_token": "your-fixed-launcher-token"
}
```

### Fluxo de Login

O dashboard expõe três endpoints HTTP:

| Endpoint | Método | Propósito |
| --- | --- | --- |
| `/login` | POST | Autenticar com o launcher token, obter um cookie de sessão |
| `/setup` | POST | Fluxo de primeira execução para registrar um token customizado antes do dashboard ficar disponível |
| `/logout` | POST | Invalidar a sessão atual |

Você pode entrar de duas formas:

1. **Entrada manual** — digite o token na página de login
2. **Parâmetro de URL** — visite `http://localhost:18800?token=your-token` para login automático

> **Notas de segurança**:
> - Os cookies de sessão são assinados via HMAC com uma chave fresca de 256 bits gerada **a cada inicialização do processo**, então todas as sessões existentes são invalidadas quando o launcher reinicia
> - Os cookies de sessão são válidos por aproximadamente 7 dias após o login
> - O endpoint de login tem proteção contra força bruta (rate limit por minuto)
> - Todas as respostas incluem `Referrer-Policy: no-referrer` para reduzir o vazamento de token via header Referer

---

## Token Customizado via WebUI

![set token](/img/configuration/settoken.png)

## Boas Práticas de Token Customizado

### Gerando Tokens Seguros

Métodos recomendados para gerar tokens aleatórios seguros:

```bash
# OpenSSL
openssl rand -hex 32

# Python
python3 -c "import secrets; print(secrets.token_hex(32))"

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Recomendações de Armazenamento de Token

| Método de Armazenamento | Segurança | Caso de Uso |
|-------------------------|-----------|-------------|
| `.security.yml` | ⭐⭐⭐ Alta | Produção (recomendado) |
| Variável de ambiente | ⭐⭐ Média | Deploy em container, CI/CD |
| `config.json` | ⭐ Baixa | Apenas desenvolvimento/testes |

### Exemplo de Configuração de Segurança

**`.security.yml`**:

```yaml
channels:
  pico:
    token: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  telegram:
    token: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
  discord:
    token: "your-discord-bot-token"
```

**`.gitignore`**:

```gitignore
.picoclaw/.security.yml
```

---

## Configuração do Pico Client

Para conectar como cliente a um Pico Server remoto, configure o Pico Client:

```json
{
  "channels": {
    "pico_client": {
      "enabled": true,
      "url": "ws://remote-server:18790/pico",
      "token": "your-secure-token-here"
    }
  }
}
```

Ou via variáveis de ambiente:

```bash
export PICOCLAW_CHANNELS_PICO_CLIENT_ENABLED=true
export PICOCLAW_CHANNELS_PICO_CLIENT_URL="ws://remote-server:18790/pico"
export PICOCLAW_CHANNELS_PICO_CLIENT_TOKEN="your-secure-token-here"
```

---

## FAQ

### P: O que fazer se a autenticação por token falhar?

1. Verifique se o token está configurado corretamente
2. Confira o formato do header da requisição: `Authorization: Bearer <token>` (atenção ao espaço depois de Bearer)
3. Se estiver usando o método de URL query, confirme se `allow_token_query` está habilitado

### P: Como girar tokens?

1. Atualize o token em `.security.yml` ou na variável de ambiente
2. Reinicie o PicoClaw Gateway
3. Atualize a configuração do cliente com o novo token

### P: Como múltiplos clientes podem usar tokens diferentes?

A versão atual do Pico Channel suporta apenas um único token. Para cenários multi-usuário, recomendamos:
- Usar outros canais que suportem multi-usuário (ex.: Telegram, Discord)
- Implementar validação multi-token via reverse proxy

---

## Documentação Relacionada

- [Guia de Configuração](./index.md)
- [Configuração de Segurança](./security-reference.md)
- [Configuração de Apps de Chat](../channels/index.md)

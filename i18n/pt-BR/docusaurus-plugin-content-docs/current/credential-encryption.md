---
id: credential-encryption
title: Criptografia de Credenciais
---

# Criptografia de Credenciais

O PicoClaw suporta criptografar os valores de `api_key`/`api_keys` nas entradas de configuração do `model_list`. Chaves criptografadas são armazenadas como strings `enc://<base64>` e descriptografadas automaticamente na inicialização.

## Início Rápido

1. Defina sua passphrase:

```bash
export PICOCLAW_KEY_PASSPHRASE="your-secure-passphrase"
```

2. Execute o comando onboard -- ele solicita sua passphrase e gera a chave SSH, depois re-criptografa automaticamente quaisquer entradas de `api_key` em texto puro da sua configuração no próximo save:

```bash
picoclaw onboard
```

3. O valor `enc://` resultante pode ser armazenado em `config.json` ou em `.security.yml`:

```json
{
  "model_list": [
    {
      "model_name": "gpt-4o",
      "model": "openai/gpt-4o",
      "api_base": "https://api.openai.com/v1"
    }
  ]
}
```

```yaml
# .security.yml
model_list:
  gpt-4o:
    api_keys:
      - "enc://AAAA...base64..."
```

## Formatos de Chave Suportados

Os mesmos formatos se aplicam tanto ao `api_key` (singular, legado) quanto a elementos individuais do campo `api_keys` (array):

| Formato          | Exemplo                                    | Descrição                          |
|-----------------|--------------------------------------------|--------------------------------------|
| Texto puro       | `sk-abc123...`                             | Usada como está (não recomendado para produção). |
| Referência a arquivo   | `file://openai.key`                       | Conteúdo lido do mesmo diretório do arquivo de configuração. |
| Criptografada       | `enc://c2FsdC4uLm5vbmNlLi4uY2lwaGVydGV4dA==` | Descriptografada na inicialização usando passphrase + chave SSH. |
| Vazia           | `""`                                       | Repassada inalterada (usada com `auth_method: oauth`). |

## Design Criptográfico

O PicoClaw usa uma abordagem de **dois fatores**: tanto uma passphrase quanto sua chave SSH privada são necessárias para descriptografar credenciais.

### Derivação de Chave

```
sshHash   = SHA256(ssh_private_key)
ikm       = HMAC-SHA256(sshHash, passphrase)
aes_key   = HKDF-SHA256(ikm, salt, "picoclaw-credential-v1", 32 bytes)
```

1. A chave SSH privada é hasheada com SHA-256.
2. O hash é combinado com a passphrase via HMAC-SHA256 para produzir o material de chaveamento de entrada (IKM).
3. HKDF-SHA256 deriva a chave AES final de 32 bytes usando um salt aleatório e a string de info `picoclaw-credential-v1`.

### Criptografia

- **Algoritmo:** AES-256-GCM
- **Formato wire:** `enc://<base64(salt[16] + nonce[12] + ciphertext)>`

O salt (16 bytes) e o nonce (12 bytes) são anexados ao início do ciphertext e, em seguida, codificados em Base64.

### Desempenho

| Operação | Tempo (ARM Cortex-A) |
|-----------|---------------------|
| Derivação de chave (HKDF) | < 1 ms |
| Descriptografia AES-256-GCM | < 1 ms |
| **Overhead total de startup** | **< 2 ms por chave** |

## Segurança de Dois Fatores

A descriptografia requer **ambos** os fatores:

| Fator         | Origem                         | Propósito                              |
|----------------|--------------------------------|--------------------------------------|
| Passphrase     | env `PICOCLAW_KEY_PASSPHRASE`  | Algo que você sabe.                  |
| Chave SSH privada| `~/.ssh/picoclaw_ed25519.key`  | Algo que você tem.                  |

Se qualquer um dos fatores estiver faltando ou incorreto, a descriptografia falha e o PicoClaw não irá iniciar.

## Modelo de Ameaças

| Ameaça                          | Mitigado? | Observações                                                        |
|---------------------------------|------------|--------------------------------------------------------------|
| Arquivo de config vazou              | Sim        | Chaves criptografadas são inutilizáveis sem ambos os fatores.            |
| Chave SSH roubada (sem passphrase)  | Sim        | O atacante ainda precisa de `PICOCLAW_KEY_PASSPHRASE`.              |
| Passphrase vazou               | Sim        | O atacante ainda precisa da chave SSH privada.                    |
| Ambos os fatores comprometidos        | Não         | Comprometimento total — rotacione as chaves imediatamente.                   |
| Força bruta na passphrase       | Parcial    | HKDF desacelera a derivação; use uma passphrase forte.              |

## Variáveis de Ambiente

| Variável                   | Obrigatória | Padrão                            | Descrição                          |
|----------------------------|----------|------------------------------------|--------------------------------------|
| `PICOCLAW_KEY_PASSPHRASE`  | Sim      | —                                  | Passphrase para derivação de chave.       |
| `PICOCLAW_SSH_KEY_PATH`    | Não       | `~/.ssh/picoclaw_ed25519.key`      | Caminho para o arquivo da chave SSH privada.    |

### Detecção Automática da Chave SSH

Se `PICOCLAW_SSH_KEY_PATH` não estiver definido, o PicoClaw procura pela chave específica do picoclaw:

```
~/.ssh/picoclaw_ed25519.key
```

Esse arquivo dedicado evita conflitos com as chaves SSH existentes do usuário. Execute `picoclaw onboard` para gerá-lo automaticamente.

:::note
Um arquivo de chave SSH é obrigatório para a criptografia de credenciais. Se nenhuma chave for encontrada e `PICOCLAW_SSH_KEY_PATH` não estiver definido, a criptografia/descriptografia irá falhar. Execute `picoclaw onboard` para gerar a chave automaticamente.
:::

## Migração

Para migrar uma configuração criptografada para uma nova máquina:

1. Copie seu `~/.picoclaw/config.json` (e `.security.yml`, se usado) para a nova máquina.
2. Defina a mesma variável de ambiente `PICOCLAW_KEY_PASSPHRASE`.
3. Copie a chave SSH privada (`~/.ssh/picoclaw_ed25519.key`) para a nova máquina (ou defina `PICOCLAW_SSH_KEY_PATH` para sua nova localização).

Não é necessário re-criptografar. Todas as três peças precisam coincidir para que a descriptografia seja bem-sucedida.

## Considerações de Segurança

- **Tanto a passphrase quanto a chave SSH são obrigatórias.** A chave SSH atua como um segundo fator -- sem ela, a criptografia/descriptografia irá falhar.
- **A chave SSH é apenas leitura em tempo de execução.** O PicoClaw nunca escreve ou modifica o arquivo da chave SSH.
- **Chaves em texto puro continuam suportadas.** Configurações existentes sem `enc://` não são afetadas.
- **O formato `enc://` é versionado** pelo campo `info` do HKDF (`picoclaw-credential-v1`), permitindo futuras atualizações de algoritmo sem quebrar valores criptografados existentes.

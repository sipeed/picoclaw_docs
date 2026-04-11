---
id: credential-encryption
title: Credential Encryption
---

# Credential Encryption

PicoClaw supports encrypting `api_key`/`api_keys` values in `model_list` configuration entries. Encrypted keys are stored as `enc://<base64>` strings and decrypted automatically at startup.

## Quick Start

1. Set your passphrase:

```bash
export PICOCLAW_KEY_PASSPHRASE="your-secure-passphrase"
```

2. Run the onboard command -- it prompts for your passphrase and generates the SSH key, then automatically re-encrypts any plaintext `api_key` entries in your config on the next save:

```bash
picoclaw onboard
```

3. The resulting `enc://` value can be stored in `config.json` or `.security.yml`:

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

## Supported Key Formats

The same formats apply to both `api_key` (singular, legacy) and individual elements in the `api_keys` (array) field:

| Format          | Example                                    | Description                          |
|-----------------|--------------------------------------------|--------------------------------------|
| Plaintext       | `sk-abc123...`                             | Used as-is (not recommended for production). |
| File reference   | `file://openai.key`                       | Content read from the same directory as the config file. |
| Encrypted       | `enc://c2FsdC4uLm5vbmNlLi4uY2lwaGVydGV4dA==` | Decrypted at startup using passphrase + SSH key. |
| Empty           | `""`                                       | Passed through unchanged (used with `auth_method: oauth`). |

## Cryptographic Design

PicoClaw uses a **two-factor** approach: both a passphrase and your SSH private key are required to decrypt credentials.

### Key Derivation

```
sshHash   = SHA256(ssh_private_key)
ikm       = HMAC-SHA256(sshHash, passphrase)
aes_key   = HKDF-SHA256(ikm, salt, "picoclaw-credential-v1", 32 bytes)
```

1. The SSH private key is hashed with SHA-256.
2. The hash is combined with the passphrase via HMAC-SHA256 to produce input keying material (IKM).
3. HKDF-SHA256 derives the final 32-byte AES key using a random salt and the info string `picoclaw-credential-v1`.

### Encryption

- **Algorithm:** AES-256-GCM
- **Wire format:** `enc://<base64(salt[16] + nonce[12] + ciphertext)>`

The salt (16 bytes) and nonce (12 bytes) are prepended to the ciphertext and then Base64-encoded.

### Performance

| Operation | Time (ARM Cortex-A) |
|-----------|---------------------|
| Key derivation (HKDF) | < 1 ms |
| AES-256-GCM decrypt | < 1 ms |
| **Total startup overhead** | **< 2 ms per key** |

## Two-Factor Security

Decryption requires **both** factors:

| Factor         | Source                         | Purpose                              |
|----------------|--------------------------------|--------------------------------------|
| Passphrase     | `PICOCLAW_KEY_PASSPHRASE` env  | Something you know.                  |
| SSH private key| `~/.ssh/picoclaw_ed25519.key`  | Something you have.                  |

If either factor is missing or incorrect, decryption fails and PicoClaw will not start.

## Threat Model

| Threat                          | Mitigated? | Notes                                                        |
|---------------------------------|------------|--------------------------------------------------------------|
| Config file leaked              | Yes        | Encrypted keys are unusable without both factors.            |
| SSH key stolen (no passphrase)  | Yes        | Attacker still needs `PICOCLAW_KEY_PASSPHRASE`.              |
| Passphrase leaked               | Yes        | Attacker still needs the SSH private key.                    |
| Both factors compromised        | No         | Full compromise — rotate keys immediately.                   |
| Brute-force on passphrase       | Partial    | HKDF slows derivation; use a strong passphrase.              |

## Environment Variables

| Variable                   | Required | Default                            | Description                          |
|----------------------------|----------|------------------------------------|--------------------------------------|
| `PICOCLAW_KEY_PASSPHRASE`  | Yes      | —                                  | Passphrase for key derivation.       |
| `PICOCLAW_SSH_KEY_PATH`    | No       | `~/.ssh/picoclaw_ed25519.key`      | Path to the SSH private key file.    |

### SSH Key Auto-Detection

If `PICOCLAW_SSH_KEY_PATH` is not set, PicoClaw looks for the picoclaw-specific key:

```
~/.ssh/picoclaw_ed25519.key
```

This dedicated file avoids conflicts with the user's existing SSH keys. Run `picoclaw onboard` to generate it automatically.

:::note
An SSH key file is required for credential encryption. If no key is found and `PICOCLAW_SSH_KEY_PATH` is not set, encryption/decryption will fail. Run `picoclaw onboard` to generate the key automatically.
:::

## Migration

To migrate an encrypted configuration to a new machine:

1. Copy your `~/.picoclaw/config.json` (and `.security.yml` if used) to the new machine.
2. Set the same `PICOCLAW_KEY_PASSPHRASE` environment variable.
3. Copy the SSH private key (`~/.ssh/picoclaw_ed25519.key`) to the new machine (or set `PICOCLAW_SSH_KEY_PATH` to its new location).

No re-encryption is needed. All three pieces must match for decryption to succeed.

## Security Considerations

- **Both passphrase and SSH key are required.** The SSH key acts as a second factor -- without it, encryption/decryption will fail.
- **The SSH key is read-only at runtime.** PicoClaw never writes to or modifies the SSH key file.
- **Plaintext keys remain supported.** Existing configs without `enc://` are unaffected.
- **The `enc://` format is versioned** via the HKDF `info` field (`picoclaw-credential-v1`), allowing future algorithm upgrades without breaking existing encrypted values.

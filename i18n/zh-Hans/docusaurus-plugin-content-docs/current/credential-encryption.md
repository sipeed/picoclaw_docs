---
id: credential-encryption
title: 凭证加密
---

# 凭证加密

PicoClaw 支持加密 `model_list` 配置中的 `api_key`/`api_keys` 值。加密后的密钥以 `enc://<base64>` 字符串形式存储，在启动时自动解密。

## 快速开始

1. 设置密码短语：

```bash
export PICOCLAW_KEY_PASSPHRASE="your-secure-passphrase"
```

2. 运行 onboard 命令 -- 它会提示输入密码短语并生成 SSH 密钥，然后在下次保存时自动重新加密配置中的明文 `api_key` 条目：

```bash
picoclaw onboard
```

3. 生成的 `enc://` 值可存储在 `config.json` 或 `.security.yml` 中：

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

## 支持的密钥格式

同样的格式适用于 `api_key`（单数，旧版）和 `api_keys`（数组）中的各个元素：

| 格式           | 示例                                       | 说明                          |
|----------------|--------------------------------------------|-------------------------------|
| 明文           | `sk-abc123...`                             | 直接使用（生产环境不推荐）。    |
| 文件引用       | `file://openai.key`                        | 从配置文件同目录下读取内容。    |
| 加密           | `enc://c2FsdC4uLm5vbmNlLi4uY2lwaGVydGV4dA==` | 使用 `PICOCLAW_KEY_PASSPHRASE` 在启动时解密。 |
| 空值           | `""`                                       | 原样传递（用于 `auth_method: oauth`）。 |

## 加密设计

PicoClaw 采用**双因子**方案：解密凭证需要同时提供密码短语和 SSH 私钥。

### 密钥派生

```
sshHash   = SHA256(ssh_private_key)
ikm       = HMAC-SHA256(sshHash, passphrase)
aes_key   = HKDF-SHA256(ikm, salt, "picoclaw-credential-v1", 32 bytes)
```

1. 使用 SHA-256 对 SSH 私钥进行哈希。
2. 通过 HMAC-SHA256 将哈希与密码短语组合，生成输入密钥材料（IKM）。
3. 使用 HKDF-SHA256，结合随机盐和信息字符串 `picoclaw-credential-v1`，派生最终的 32 字节 AES 密钥。

### 加密算法

- **算法：** AES-256-GCM
- **传输格式：** `enc://<base64(salt[16] + nonce[12] + ciphertext)>`

盐（16 字节）和随机数（12 字节）前置于密文之前，然后进行 Base64 编码。

### 性能

| 操作 | 耗时 (ARM Cortex-A) |
|------|---------------------|
| 密钥派生 (HKDF) | < 1 ms |
| AES-256-GCM 解密 | < 1 ms |
| **启动总开销** | **每个密钥 < 2 ms** |

## 双因子安全

解密需要**两个**因子同时存在：

| 因子         | 来源                           | 用途               |
|--------------|--------------------------------|--------------------|
| 密码短语     | `PICOCLAW_KEY_PASSPHRASE` 环境变量 | 你所知道的东西。   |
| SSH 私钥     | `~/.ssh/picoclaw_ed25519.key`  | 你所拥有的东西。   |

如果任一因子缺失或不正确，解密将失败，PicoClaw 将无法启动。

## 威胁模型

| 威胁                         | 是否缓解？ | 备注                                                      |
|------------------------------|-----------|-----------------------------------------------------------|
| 配置文件泄露                  | 是        | 加密密钥在没有两个因子的情况下无法使用。                      |
| SSH 密钥被盗（无密码短语）     | 是        | 攻击者仍需要 `PICOCLAW_KEY_PASSPHRASE`。                   |
| 密码短语泄露                  | 是        | 攻击者仍需要 SSH 私钥。                                    |
| 两个因子均被泄露              | 否        | 完全妥协 — 请立即轮换密钥。                                 |
| 暴力破解密码短语              | 部分      | HKDF 减缓派生速度；请使用强密码短语。                        |

## 环境变量

| 变量                       | 必需 | 默认值                            | 说明                          |
|----------------------------|------|-----------------------------------|-------------------------------|
| `PICOCLAW_KEY_PASSPHRASE`  | 是   | —                                 | 用于密钥派生的密码短语。        |
| `PICOCLAW_SSH_KEY_PATH`    | 否   | `~/.ssh/picoclaw_ed25519.key`     | SSH 私钥文件路径。              |

### SSH 密钥自动检测

如果未设置 `PICOCLAW_SSH_KEY_PATH`，PicoClaw 会查找专用密钥：

```
~/.ssh/picoclaw_ed25519.key
```

此专用文件可避免与用户已有的 SSH 密钥冲突。运行 `picoclaw onboard` 可自动生成。

:::note
凭证加密需要 SSH 密钥文件。如果未找到密钥且未设置 `PICOCLAW_SSH_KEY_PATH`，加密/解密将失败。运行 `picoclaw onboard` 可自动生成密钥。
:::

## 迁移

将加密配置迁移到新机器：

1. 将 `~/.picoclaw/config.json`（如使用了 `.security.yml` 也一并复制）到新机器。
2. 设置相同的 `PICOCLAW_KEY_PASSPHRASE` 环境变量。
3. 将 SSH 私钥（`~/.ssh/picoclaw_ed25519.key`）复制到新机器（或设置 `PICOCLAW_SSH_KEY_PATH` 指向新位置）。

无需重新加密。三者必须完全匹配，解密才能成功。

## 安全注意事项

- **密码短语和 SSH 密钥都是必需的。** SSH 密钥作为第二因子 -- 没有它，加密/解密将失败。
- **SSH 密钥在运行时仅被读取。** PicoClaw 不会写入或修改 SSH 密钥文件。
- **明文密钥仍受支持。** 没有 `enc://` 的已有配置不受影响。
- **`enc://` 格式已版本化**，通过 HKDF `info` 字段（`picoclaw-credential-v1`）实现，允许未来算法升级而不破坏已有的加密值。

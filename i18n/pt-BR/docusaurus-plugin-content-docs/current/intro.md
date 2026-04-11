---
id: intro
title: Introdução
sidebar_label: Introdução
slug: /
---

# PicoClaw: Assistente de IA Ultra-Eficiente em Go

🦐 PicoClaw é um assistente pessoal de IA ultraleve inspirado no [nanobot](https://github.com/HKUDS/nanobot), refatorado do zero em Go por meio de um processo de auto-bootstrapping, onde o próprio agente de IA conduziu toda a migração arquitetural e otimização de código.

⚡️ Roda em hardware de $10 com menos de 10MB de RAM — isso é 99% menos memória que o OpenClaw e 98% mais barato que um Mac mini!

![Gráfico comparativo do PicoClaw](/img/compare.jpg)

## Principais Recursos

| Recurso | Descrição |
| --- | --- |
| 🪶 **Ultraleve** | Menos de 10MB de uso de memória — 99% menor que soluções comparáveis |
| 💰 **Custo Mínimo** | Roda em hardware de $10 — 98% mais barato que um Mac mini |
| ⚡️ **Velocidade Relâmpago** | Inicialização 400x mais rápida — liga em menos de 1 segundo mesmo em um núcleo único de 0.6GHz |
| 🌍 **Portabilidade Real** | Binário único e autocontido para RISC-V, ARM64 e x86_64 |
| 🤖 **Bootstrapped por IA** | 95% do núcleo gerado por agente com refinamento humano no loop |
| 💬 **Multicanal** | Telegram, Discord, Slack, DingTalk, Feishu, WeCom, LINE, QQ e mais |

## Comparação

|  | OpenClaw | NanoBot | **PicoClaw** |
| --- | --- | --- | --- |
| **Linguagem** | TypeScript | Python | **Go** |
| **RAM** | >1GB | >100MB | **< 10MB** |
| **Inicialização** (núcleo de 0.8GHz) | >500s | >30s | **< 1s** |
| **Custo** | Mac Mini $599 | ~$50 Linux SBC | **Qualquer placa Linux, a partir de $10** |

## Arquitetura

![Arquitetura do PicoClaw](/img/arch.png)

## Aviso de Segurança

> **DOMÍNIO OFICIAL**: O único site oficial é **[picoclaw.io](https://picoclaw.io)**, e o site da empresa é **[sipeed.com](https://sipeed.com)**.
>
> **SEM CRIPTO**: O PicoClaw **NÃO** possui token/moeda oficial. Todas as alegações em plataformas de negociação são **golpes**.
>
> O PicoClaw está em desenvolvimento inicial e pode ter problemas de segurança não resolvidos. Não faça deploy em ambientes de produção antes do lançamento da v1.0.

## Comunidade

- **Discord**: [discord.gg/V4sAZ9XWpN](https://discord.gg/V4sAZ9XWpN)
- **GitHub**: [github.com/sipeed/picoclaw](https://github.com/sipeed/picoclaw)
- **Twitter/X**: [@SipeedIO](https://x.com/SipeedIO)
- **Sipeed GitHub**: [github.com/sipeed](https://github.com/sipeed)
- **Website**: [picoclaw.io](https://picoclaw.io)

### Participe do Grupo de Desenvolvedores

Após enviar um PR para o PicoClaw, você é bem-vindo(a) a participar do grupo de desenvolvedores no WeChat ou no servidor do Discord.

Para participar, envie um e-mail para `support@sipeed.com` com o assunto:

```
[Join PicoClaw Dev Group] Your GitHub account
```

Enviaremos o link de convite do Discord para sua caixa de entrada. Para o grupo do WeChat, escaneie o QR code na página inicial e peça ao administrador do grupo, informando sua conta do GitHub e o número do PR.

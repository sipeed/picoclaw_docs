---
id: roadmap
title: Roadmap
---

# 🦐 Roadmap do PicoClaw

> **Visão**: Construir a infraestrutura definitiva de AI Agent leve, segura e totalmente autônoma. Automatize o mundano, liberte sua criatividade.

---

## 🚀 1. Otimização do Núcleo: Leveza Extrema

*Nossa característica definidora. Combatemos o inchaço de software para garantir que o PicoClaw rode suavemente nos menores dispositivos embarcados.*

* [**Redução do Consumo de Memória**](https://github.com/sipeed/picoclaw/issues/346)
  * **Objetivo**: Rodar suavemente em placas embarcadas com 64MB de RAM (ex.: SBCs RISC-V de baixo custo) com o processo principal consumindo < 20MB.
  * **Contexto**: RAM é cara e escassa em dispositivos de borda. A otimização de memória tem precedência sobre o tamanho de armazenamento.
  * **Ação**: Analisar o crescimento de memória entre releases, remover dependências redundantes e otimizar estruturas de dados.


## 🛡️ 2. Fortalecimento de Segurança: Defesa em Profundidade

*Pagando a dívida técnica inicial. Convidamos especialistas em segurança para ajudar a construir um agente "Seguro por Padrão".*

* **Defesa de Entrada e Controle de Permissões**
  * **Defesa contra Prompt Injection**: Fortalecer a lógica de extração JSON para prevenir manipulação de LLM.
  * **Prevenção de Abuso de Ferramentas**: Validação rigorosa de parâmetros para garantir que comandos gerados permaneçam dentro de limites seguros.
  * **Proteção contra SSRF**: Blocklists integradas para ferramentas de rede para prevenir acesso a IPs internos (LAN/serviços de metadados).


* **Sandboxing e Isolamento**
  * **Sandbox de Sistema de Arquivos**: Restringir operações de leitura/escrita de arquivos apenas a diretórios específicos.
  * **Isolamento de Contexto**: Prevenir vazamento de dados entre diferentes sessões de usuário ou canais.
  * **Redação de Privacidade**: Redação automática de informações sensíveis (chaves de API, dados pessoais) de logs e saídas padrão.


* **Autenticação e Segredos**
  * **Atualização Criptográfica**: Adotar algoritmos modernos como `ChaCha20-Poly1305` para armazenamento de segredos.
  * **Fluxo OAuth 2.0**: Descontinuar chaves de API hardcoded na CLI; migrar para fluxos OAuth seguros.



## 🔌 3. Conectividade: Arquitetura Orientada a Protocolos

*Conecte qualquer modelo, alcance qualquer plataforma.*

* **Provider**
  * [**Atualização de Arquitetura**](https://github.com/sipeed/picoclaw/issues/283): Refatorar de classificação "baseada em Vendor" para "baseada em Protocolo" (ex.: compatível com OpenAI, compatível com Ollama). *(Status: Em andamento por @Daming, ETA 5 dias)*
  * **Modelos Locais**: Integração profunda com **Ollama**, **vLLM**, **LM Studio** e **Mistral** (inferência local).
  * **Modelos Online**: Suporte contínuo para modelos fechados de ponta.


* **Channel**
  * **Matriz de IM**: QQ, WeChat (Work), DingTalk, Feishu (Lark), Telegram, Discord, WhatsApp, LINE, Slack, Email, KOOK, Signal, ...
  * **Padrões**: Suporte ao protocolo **OneBot**.
  * [**Anexos**](https://github.com/sipeed/picoclaw/issues/348): Manipulação nativa de anexos de imagens, áudio e vídeo.


* **Marketplace de Skills**
  * [**Descoberta de skills**](https://github.com/sipeed/picoclaw/issues/287): Implementar `find_skill` para descobrir e instalar automaticamente skills do [GitHub Skills Repo] ou outros registros.



## 🧠 4. Capacidades Avançadas: De Chatbot a IA Agentiva

*Além da conversa — foco em ação e colaboração.*

* **Operações**
  * [**Suporte a MCP**](https://github.com/sipeed/picoclaw/issues/290): Suporte nativo ao **Model Context Protocol (MCP)**.
  * [**Automação de Navegador**](https://github.com/sipeed/picoclaw/issues/293): Controle de navegador headless via CDP (Chrome DevTools Protocol) ou ActionBook.
  * [**Operação Mobile**](https://github.com/sipeed/picoclaw/issues/292): Controle de dispositivos Android (similar ao BotDrop).


* **Colaboração Multi-Agente**
  * [**Multi-Agente Básico**](https://github.com/sipeed/picoclaw/issues/294) implementação
  * [**Roteamento de Modelos**](https://github.com/sipeed/picoclaw/issues/295): "Roteamento Inteligente" — despachar tarefas simples para modelos pequenos/locais (rápido/barato) e tarefas complexas para modelos SOTA (inteligente).
  * [**Modo Swarm**](https://github.com/sipeed/picoclaw/issues/284): Colaboração entre múltiplas instâncias do PicoClaw na mesma rede.
  * [**AIEOS**](https://github.com/sipeed/picoclaw/issues/296): Explorando paradigmas de interação de Sistema Operacional nativo de IA.



## 📚 5. Experiência do Desenvolvedor (DevEx) e Documentação

*Reduzindo a barreira de entrada para que qualquer pessoa possa fazer deploy em minutos.*

* [**QuickGuide (Início sem Configuração)**](https://github.com/sipeed/picoclaw/issues/350)
  * Assistente CLI Interativo: Se iniciado sem configuração, detectar automaticamente o ambiente e guiar o usuário passo a passo pela configuração de Token/Rede.


* **Documentação Abrangente**
  * **Guias por Plataforma**: Guias dedicados para Windows, macOS, Linux e Android.
  * **Tutoriais Passo a Passo**: Guias detalhados e acessíveis para configurar Providers e Channels.
  * **Documentação Assistida por IA**: Usar IA para gerar automaticamente referências de API e comentários de código (com verificação humana para prevenir alucinações).



## 🤖 6. Engenharia: Open Source Potencializado por IA

*Nascido do Vibe Coding, continuamos a usar IA para acelerar o desenvolvimento.*

* **CI/CD Aprimorado por IA**
  * Integrar IA para Code Review, Linting e Rotulagem de PR automatizados.
  * **Redução de Ruído de Bot**: Otimizar interações de bot para manter as timelines de PR limpas.
  * **Triagem de Issues**: Agentes de IA para analisar issues recebidas e sugerir correções preliminares.



## 🎨 7. Marca e Comunidade

* [**Design do Logo**](https://github.com/sipeed/picoclaw/issues/297): Estamos procurando um design de logo de **Tamarutaca (Stomatopoda)**!
  * *Conceito*: Precisa refletir "Pequeno mas Poderoso" e "Ataques Rápidos como Raio."



---

### 🤝 Chamada para Contribuições

Aceitamos contribuições da comunidade para qualquer item deste roadmap! Por favor, comente na Issue relevante ou envie um PR. Vamos construir juntos o melhor AI Agent de borda!

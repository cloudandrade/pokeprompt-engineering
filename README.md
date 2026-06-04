# Prompt Engineering Challenge

Desafio colaborativo para **construir um projeto real em no máximo 3 prompts**, aplicando boas práticas de prompt-engineering e de código sênior — e provando o processo com commits, log linear e pre-check.

Compartilhe com amigos, compare abordagens e veja quem entrega o melhor resultado com o menor número de prompts.

---

## Objetivo

1. **Documentar** um conjunto de regras reutilizáveis para IA (Cursor, Windsurf, Claude, etc.).
2. **Praticar** prompt-engineering de verdade: planejamento, few-shot, chain of thought, árvore de decisão.
3. **Entregar** um projeto funcional em **exatamente 3 prompts de implementação** (após o setup).
4. **Registrar** cada prompt e cada entrega de forma **linear** e auditável.
5. **Validar** com pre-check (lint, typecheck, test, build) antes de fechar cada etapa.

Este repositório contém as **regras** (`.cursor/rules/` + `ia-rules.md`) e o **log do desafio** (`prompts/`).

---

## O desafio em 30 segundos

| Regra | Detalhe |
|-------|---------|
| **Prompts de implementação** | Mínimo **3**, máximo **3** |
| **1 prompt = 1 commit** | Cada prompt gera **um commit** com tudo que foi feito naquele passo |
| **Log linear** | Todo prompt do usuário + entrega da IA → `prompts/` |
| **Few-shot** | Usar exemplos de prompts bons (`docs/few-shots.md`) |
| **Boas práticas** | Seguir regras do repo (sênior + prompt-engineering + pre-check) |
| **Pre-check** | Lint → typecheck → test → build antes de concluir cada prompt |
| **Válido a partir de** | Prompt **001** (este README/setup é o **000**) |

---

## Projeto sugerido (meta-desafio)

Construir uma **API + persistência** que registre prompts e entregas de forma linear — o app **é** o desafio:

- `POST /prompts` — registrar prompt do usuário + resposta/resumo da IA
- `GET /prompts` — listar histórico linear (ordem cronológica)
- `GET /prompts/:id` — detalhe de uma entrada

Amigos podem trocar por outro escopo (todo app, CLI, etc.), desde que mantenham as **regras do desafio** (3 prompts, log, commits, pre-check).

---

## Estrutura do repositório

```
prompt-engineering/
├── README.md                 ← você está aqui
├── ia-rules.md               ← regras portáveis (outras IDEs/LLMs)
├── ia-rules-usage.md         ← como usar as regras
├── docs/
│   └── few-shots.md          ← exemplos de prompts por fase
├── prompts/
│   ├── linear-log.md         ← índice cronológico
│   ├── 000-setup.md          ← prompt 0 (estrutura do desafio)
│   ├── 001-foundation.md     ← (próximo) base do projeto
│   ├── 002-core.md           ← (depois) features + testes
│   └── 003-delivery.md       ← (depois) polish + pre-check final
└── .cursor/rules/            ← regras automáticas no Cursor
```

---

## Como participar (você ou um amigo)

### 1. Fork / clone

```bash
git clone <url-do-repo>
cd prompt-engineering
```

### 2. Cursor (recomendado)

Abra no Cursor — as regras em `.cursor/rules/` já entram automaticamente.

Fora do Cursor: inclua `@ia-rules.md` no chat (veja `ia-rules-usage.md`).

### 3. Leia os few-shots

Antes do prompt 001, leia [`docs/few-shots.md`](docs/few-shots.md) — modelos do que pedir em cada fase.

### 4. Execute os 3 prompts

| Prompt | Foco sugerido | Commit |
|--------|---------------|--------|
| **001** | Planejamento aceito + scaffold + modelos/domínio | `feat: prompt 001 — foundation` |
| **002** | Features core + testes (≥90%) | `feat: prompt 002 — core` |
| **003** | Integração, docs, pre-check verde, code-review | `feat: prompt 003 — delivery` |

Após **cada** prompt:

1. IA registra entrada em `prompts/00X-*.md` e atualiza `prompts/linear-log.md`
2. IA roda pre-check (comandos do projeto)
3. **Você** (ou a IA, se pedido) faz **1 commit** = 1 prompt
4. Só então passa ao próximo prompt

### 5. Compartilhe

- Envie o link do repo ou um PR com os 3 commits
- Compare: qualidade do código, clareza dos prompts, aderência ao log linear
- Debate: o few-shot ajudou? O plano com aceite evitou retrabalho?

---

## Fluxo de cada prompt (o que a IA deve fazer)

```
┌─────────────────────────────────────────────────────────┐
│ 1. Ler prompt do usuário                                 │
│ 2. Planejamento + aceite (se não trivial)                │
│ 3. Executar escopo daquele prompt (few-shot como guia)   │
│ 4. Registrar em prompts/00X-*.md + linear-log.md         │
│ 5. Pre-check: lint → typecheck → test → build            │
│ 6. Code-review final (sênior/arquiteto)                  │
│ 7. 1 commit = entrega do prompt                          │
└─────────────────────────────────────────────────────────┘
```

---

## Regras de prompt-engineering (resumo)

Detalhes completos: `.cursor/rules/prompt-engineering.mdc` e `ia-rules.md` §16.

- **Metaprompt / autoconsciência** — papel sênior, limites, não inventar requisitos
- **Planejamento com aceite** — plano antes de implementar; aguardar "pode executar"
- **Chain of Thought** — Entendi → Verifiquei → Decidi → Fiz → Validei
- **Árvore de decisão** — dúvida → opções A/B com prós/contras antes de codar
- **Few-shot** — espelhar estrutura dos exemplos em `docs/few-shots.md`
- **Pre-check** — nunca "concluído" sem pipeline verde

---

## Regras de código (resumo)

Detalhes: `.cursor/rules/` e `ia-rules.md`.

- Buscar no projeto antes de criar arquivo/lógica nova
- Nomes claros e contextuais; constantes em UPPER_CASE
- Sem libs novas sem permissão
- Testes ≥ 90% no código alterado; Faker/factories
- Segurança em camadas; sem secrets/PII expostos

---

## Prompt 000 (este setup)

O prompt que criou a estrutura do desafio está registrado em [`prompts/000-setup.md`](prompts/000-setup.md).

**A partir do próximo prompt (001)**, valem todas as regras acima.

---

## Licença e contribuição

Use livremente para estudar e desafiar amigos. Melhorias nas regras: PRs bem-vindos — lembre de sincronizar `.mdc` + `ia-rules.md` (veja `ia-rules-usage.md`).

---

**Boa sorte — e que vença quem promptar melhor, não quem promptar mais.** 🎯

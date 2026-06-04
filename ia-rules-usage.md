# Como usar as regras de prompt-engineering

Guia simples sobre **onde estão as regras**, **como funcionam no Cursor** e **como usar em outras IDEs/LLMs**.

---

## Visão geral

Este repositório mantém **dois formatos** do mesmo conteúdo, com papéis diferentes:

| Artefato | Para quem | Automático? |
|----------|-----------|-------------|
| `.cursor/rules/*.mdc` | **Cursor** | Sim — injetado em todo chat/agent |
| `ia-rules.md` | **Outras IDEs e LLMs** | Não — você inclui manualmente no chat |

```
┌─────────────────────────────────────────────────────────┐
│                    prompt-engineering                    │
├────────────────────────┬────────────────────────────────┤
│   CURSOR               │   OUTRAS FERRAMENTAS           │
│   .cursor/rules/*.mdc  │   ia-rules.md                  │
│   (fonte da verdade)   │   (documento único portável)   │
│   alwaysApply: true    │   @ia-rules.md no chat         │
└────────────────────────┴────────────────────────────────┘
```

---

## No Cursor

### O que acontece automaticamente

Os arquivos em `.cursor/rules/` com `alwaysApply: true` entram no contexto do agente **em toda conversa** neste workspace. Você **não precisa** pedir para ler regras a cada prompt.

### Arquivos de regra (fonte da verdade no Cursor)

| Arquivo | Tópico |
|---------|--------|
| `senior-dev-standards.mdc` | Princípios, reutilização, nomenclatura, arquitetura, código limpo, logs, API, DB, performance, lint, docs |
| `prompt-engineering.mdc` | Metaprompt, planejamento com aceite, CoT, árvore de decisão, conduta da IA |
| `complexity-sonar.mdc` | Complexidade, SonarQube, issues críticas/médias |
| `dependencies-policy.mdc` | Dependências — não adicionar libs sem permissão |
| `testing-standards.mdc` | Testes, cobertura 90%, Faker/factories |
| `security-defense-in-depth.mdc` | Segurança, dados sensíveis, SQLi, XSS, sessão, IDOR |
| `pre-check-pipeline.mdc` | Pre-check/pre-CI-CD: lint, typecheck, test, build, correções e code-review final |
| `pre-review-checklist.mdc` | Git, PR, gate de conclusão, checklist e anti-patterns |

Cada `.mdc` contém o **texto completo** do tópico — não referencia outros arquivos.

### Posso apagar o `ia-rules.md` no Cursor?

**Sim.** Se você usa só o Cursor neste repo, o `ia-rules.md` é opcional. As regras vivem nos `.mdc`.

Mantenha o `ia-rules.md` se quiser compartilhar o pacote com quem usa Windsurf, Copilot, Claude, etc.

### Como copiar para outro projeto no Cursor

Copie a pasta `.cursor/rules/` para a raiz do outro projeto. Pronto — as regras passam a valer lá também.

---

## Em outras IDEs ou LLMs (Windsurf, Copilot Chat, Claude, ChatGPT…)

### O que usar

Use **`ia-rules.md`** — um único documento consolidado com todas as seções.

As pastas `.cursor/rules/` **não são lidas** automaticamente fora do Cursor.

### Como incluir no chat

**Opção 1 — Mencionar o arquivo (recomendado)**

```
Siga integralmente as regras em @ia-rules.md ao implementar esta feature.
```

**Opção 2 — Colar seção relevante**

Para tarefas focadas, cole só a seção necessária (ex.: segurança, testes).

**Opção 3 — Rules/memories do editor**

Se o editor tiver sistema de regras persistentes (ex.: Windsurf rules, Copilot instructions), cole o conteúdo do `ia-rules.md` ou importe trechos por tópico.

### Prompt base sugerido

```
Você é um dev sênior. Antes de escrever código, leia e aplique @ia-rules.md.
Prioridades: segurança, testes (≥90% cobertura), baixa complexidade, sem libs novas sem perguntar.
Em tarefas não triviais: apresente plano e aguarde "pode executar" antes de implementar.
Antes de concluir: rode lint, typecheck, test e build (comandos do projeto) e faça code-review final.
```

---

## Manutenção — como atualizar regras

**Regra de ouro:** ao alterar qualquer regra, atualize **os dois lugares**:

1. O `.mdc` específico em `.cursor/rules/`
2. A seção correspondente em `ia-rules.md`

### Mapa de sincronização

| Seção no `ia-rules.md` | Arquivo `.mdc` |
|------------------------|----------------|
| § 1–4, 7, 9, 10, 12, 14, 15 | `senior-dev-standards.mdc` |
| § 16 | `prompt-engineering.mdc` |
| § 5 | `complexity-sonar.mdc` |
| § 6 | `dependencies-policy.mdc` |
| § 8 | `testing-standards.mdc` |
| § 11 | `security-defense-in-depth.mdc` |
| § 17 | `pre-check-pipeline.mdc` |
| § 13 + anti-patterns | `pre-review-checklist.mdc` |

### Fluxo recomendado

1. Identifique o tópico (ex.: nova regra de segurança).
2. Edite o `.mdc` correspondente.
3. Replique a mesma alteração na seção equivalente do `ia-rules.md`.
4. Commit dos dois arquivos juntos.

> Ao pedir ao agente Cursor para alterar uma regra, instrua: *"Atualize o `.mdc` X e a seção Y do `ia-rules.md`"*.

---

## Perguntas frequentes

### Preciso ler o `ia-rules-usage.md` a cada prompt?

Não. Este arquivo é documentação para humanos. No Cursor, as `.mdc` já cuidam disso.

### Cursor e Windsurf terão sempre as mesmas regras?

Só se você mantiver `.mdc` e `ia-rules.md` sincronizados ao editar. Não há sync automático entre os formatos.

### Posso usar só o `ia-rules.md` no Cursor também?

Pode, mencionando `@ia-rules.md` manualmente — mas perde a automação das `.mdc`. O desenho recomendado é: **Cursor → `.mdc` | resto → `ia-rules.md`**.

### Onde fica a checklist final?

Em `pre-review-checklist.mdc` (Cursor) e nas seções 13.3 + anti-patterns do `ia-rules.md` (outras ferramentas).

---

## Estrutura do repositório

```
prompt-engineering/
├── .cursor/
│   └── rules/                    ← Fonte da verdade no Cursor
│       ├── senior-dev-standards.mdc
│       ├── prompt-engineering.mdc
│       ├── complexity-sonar.mdc
│       ├── dependencies-policy.mdc
│       ├── testing-standards.mdc
│       ├── security-defense-in-depth.mdc
│       ├── pre-check-pipeline.mdc
│       └── pre-review-checklist.mdc
├── ia-rules.md                   ← Documento portável (outras IDEs/LLMs)
└── ia-rules-usage.md             ← Este guia
```

---

*Documento de referência — não é injetado automaticamente no agente.*

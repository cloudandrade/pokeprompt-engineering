# Few-shots — exemplos de prompts por fase

Use estes modelos como **referência de estrutura**, não copie literalmente. Adapte ao seu projeto.

---

## Prompt 001 — Foundation (exemplo)

```markdown
Prompt 001 — Foundation

Contexto: estou no desafio prompt-engineering (3 prompts, 1 commit cada).
Leia @README.md e siga todas as regras do projeto.

Objetivo deste prompt:
- Apresentar planejamento das 3 fases e aguardar meu "pode executar"
- Após aceite: scaffold do projeto (stack: Node + TypeScript + Fastify ou equivalente já no ecossistema)
- Modelo de domínio PromptEntry (id, userPrompt, aiSummary, promptIndex, createdAt)
- Estrutura de pastas, config lint/test/typecheck/build
- README técnico mínimo (como rodar)

Few-shot de entrega esperada:
- Arquivos criados listados
- Comandos descobertos documentados
- Registro em prompts/001-foundation.md + linear-log.md
- Pre-check executado
- 1 commit: feat: prompt 001 — foundation

Não implemente endpoints completos ainda — só base.
```

**Por que funciona:** escopo fechado, referência ao desafio, few-shot da entrega, fase clara.

---

## Prompt 002 — Core (exemplo)

```markdown
Prompt 002 — Core

Contexto: prompt 001 já commitado. Continue o desafio (regras em .cursor/rules/).

Objetivo deste prompt:
- POST /prompts — criar entrada (validação na borda, DTO)
- GET /prompts — listar ordem cronológica
- GET /prompts/:id — detalhe + anti-IDOR se aplicável
- Repositório (in-memory ou arquivo JSON — sem lib nova sem permissão)
- Testes unitários ≥90% em services; factories/Faker para dados

Few-shot de entrega:
- CoT: Entendi → Verifiquei (reutilizei X do prompt 001) → Decidi → Fiz → Validei
- prompts/002-core.md + linear-log.md
- Pre-check verde; correções documentadas se houve falha
- 1 commit: feat: prompt 002 — core

Não faça polish de docs nem deploy — isso é prompt 003.
```

**Por que funciona:** assume estado anterior, proíbe scope creep, exige testes e pre-check.

---

## Prompt 003 — Delivery (exemplo)

```markdown
Prompt 003 — Delivery (último)

Contexto: prompts 001 e 002 commitados. Este é o **último** prompt de implementação.

Objetivo:
- Tratamento de erros padronizado na API
- OpenAPI ou README de endpoints atualizado
- Ajustes de code-review final (blockers)
- Pre-check completo: lint, typecheck, test, build — tudo verde
- Code-review sênior/arquiteto documentado na resposta

Few-shot de entrega final:
## Entrega — Prompt 003
**Pre-check:** lint ✅ | typecheck ✅ | test ✅ | build ✅
**Correções:** ...
**Code-review:** ...
**CoT:** ...

- prompts/003-delivery.md + linear-log.md
- 1 commit: feat: prompt 003 — delivery

Projeto considerado concluído após este commit.
```

**Por que funciona:** fecha o desafio, força pre-check e review, deixa claro que acabou.

---

## Anti-patterns de prompt (evitar)

| Prompt ruim | Problema |
|-------------|----------|
| "Faz o projeto todo" | Estoura 3 prompts; sem rastreabilidade |
| "Adiciona feature X, Y, Z e refatora tudo" | Scope creep no meio do desafio |
| Sem mencionar registro em `prompts/` | Quebra log linear |
| "Depois a gente testa" | Viola pre-check |
| Prompt 002 refaz scaffold do zero | Não reutiliza prompt 001 |

---

## Dica para amigos

Cole no **início de cada prompt**:

```
Desafio: 3 prompts max | 1 commit/prompt | log em prompts/ | few-shots em docs/few-shots.md
Fase atual: 00X — [foundation|core|delivery]
```

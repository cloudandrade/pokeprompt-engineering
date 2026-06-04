# Prompt 000 — Setup do desafio

| Campo | Valor |
|-------|-------|
| **Índice** | 000 |
| **Data** | 2026-06-03 |
| **Tipo** | Setup (fora dos 3 prompts de implementação) |
| **Commit** | _(pendente — usuário pode commitar este setup)_ |

---

## Prompt do usuário (verbatim)

> vamos fazer um desafio, vamos descrever essas regras no prompt, vamos implementar o projeto utilizando boas práticas de prompt-engineering definidas aqui no projeto. temos que armazenar todos os prompts que eu digitar e o que foi feito de forma linear, temos que implementar o projeto num mínimo de 3 prompts no máximo, utilizando o few-shots, e cada commit vai ser equivalente ao que foi feito em cada prompt. essas regras vão valer a partir dos próximos prompts depois desse. quero que estruture um readme com o objetivo do projeto e com essas regras e com a ideia de compartilhar esse desafio com os amigos

---

## O que foi feito

### Entregáveis

1. **`README.md`** — objetivo do repo, regras do desafio, como participar, compartilhar com amigos
2. **`docs/few-shots.md`** — exemplos de prompts 001, 002, 003 (few-shot)
3. **`prompts/linear-log.md`** — índice cronológico de prompts
4. **`prompts/000-setup.md`** — este registro
5. **`.cursor/rules/challenge-workflow.mdc`** — regras do desafio para o Cursor (a partir do prompt 001)
6. **`ia-rules.md` §18** + **`ia-rules-usage.md`** — sincronização para outras IDEs

### Decisões

| Decisão | Motivo |
|---------|--------|
| Prompt 000 = setup, fora do limite 3 | Separar estrutura do desafio da implementação |
| Projeto sugerido = API de log de prompts | Meta-desafio alinhado ao objetivo do repo |
| Log em `prompts/` + `linear-log.md` | Rastreabilidade linear auditável |
| 1 prompt = 1 commit | Correlação Git ↔ prompt |
| Regras válidas a partir do 001 | Usuário pediu explicitamente |

### Fora de escopo (neste prompt)

- Código da API (prompts 001–003)
- Commits automáticos (aguardando usuário)
- Pre-check de app (ainda não há projeto)

---

## Chain of Thought

- **Entendi:** estruturar desafio compartilhável com log linear, 3 prompts max, few-shots, 1 commit/prompt.
- **Verifiquei:** repo tinha regras `.mdc` + `ia-rules.md`; faltava README, log e workflow do desafio.
- **Decidi:** setup = prompt 000; implementação = 001–003; few-shots em `docs/`.
- **Fiz:** README, few-shots, linear-log, 000-setup, rule challenge-workflow, sync ia-rules.
- **Validação:** documentação completa; regras sincronizadas; próximo passo = prompt 001.

---

## Próximo passo

**Prompt 001 — Foundation:** planejamento (com aceite) + scaffold do projeto sugerido.

Ver [`docs/few-shots.md`](../docs/few-shots.md) para modelo de prompt.

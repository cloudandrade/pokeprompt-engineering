# Prompt Engineering Challenge

Desafio para **praticar few-shot prompt-engineering** construindo um projeto real — sozinho ou com amigos.

> **Ainda não iniciado.** Este README define as regras. O desafio começa no **Prompt 001**.

---

## Objetivo

Criar um **projeto base** usando a estratégia de **few-shots** em prompt-engineering.

O projeto pode ser:

- **Backend** ou **frontend**
- **Adaptação** de uma API que você já tem
- **Consumo** de uma API pública da sua preferência (OpenWeather, PokéAPI, etc.)

---

## Regras do desafio

### 1. Sua estrutura, seu aprendizado

Use **sua própria** estrutura de ensino e preparação da IA (metaprompt, plano, exemplos, etc.).

**Não vale copiar** a do colega — o comparativo entre amigos fica justo e o aprendizado é individual.

### 2. Few-shot é o desafio

Escolha **quais estratégias de few-shot** achar melhor (exemplos no prompt, templates, chain-of-thought, decomposição por fase).

Documente **no log** o que funcionou e o que não funcionou.

### 3. Log linear em `prompts/`

Cada prompt seu + o que a IA fez → **um arquivo em sequência** na pasta `prompts/`:

```
prompts/
├── 001-....md
├── 002-....md
└── 003-....md
```

**Meta:** concluir em **3 prompts**.  
**Se não der:** tudo bem — serve de aprendizado. Continue registrando (`004`, `005`…) até terminar.

### 4. Escolha livre de stack

Backend, frontend, adaptar API existente ou consumir API externa — **você escolhe**.

### 5. Funcionalidades obrigatórias

O projeto **deve** ter:

| Feature | Descrição |
|---------|-----------|
| **Listar** | Todos os itens, com **paginação** |
| **Detalhar** | Um item por **ID** |
| **Buscar** | Com **algum filtro** (query param, campo, status, etc.) |

Válido para REST, GraphQL, tela React, etc. — adapte ao tipo de projeto.

### 6. Ao finalizar

1. **Verifique** o resultado (pre-check: lint, test, build — o que existir no projeto)
2. **Compartilhe** com amigos o resultado final e documente no readme (link do repo, demo, ou PR)

### 7. A regra mais importante

**Aprenda com o processo e se divirta.**

---

## Como participar

1. **Clone** o repo e abra no seu editor.
2. **Defina** seu projeto (backend/frontend/API) e sua estratégia de few-shot junto com seu primeiro prompt.
3. **Prompt 001** — comece; registre em `prompts/001-*.md`.
4. **Siga** até as 3 features obrigatórias estarem prontas.
5. **Compartilhe** e compare com amigos: prompts, estratégia few-shot, resultado.

Inspiração opcional (não copiar): [`docs/few-shots.md`](docs/few-shots.md)

---

## O que tem neste repo

| Pasta / arquivo | Para quê |
|-----------------|----------|
| `.cursor/rules/` | Regras automáticas no Cursor (código sênior + prompt-engineering) |
| `ia-rules.md` | Mesmas regras, portáveis para outras IDEs |
| `prompts/` | **Seu** log linear do desafio |
| `docs/few-shots.md` | Ideias de estrutura de prompt (referência, não obrigatório copiar) |
| `ia-rules-usage.md` | Como usar as regras de IA |



**Desafie um amigo. Compare prompts, não só código.**

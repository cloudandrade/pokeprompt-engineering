# Prompt 001 — Pokédex React Foundation

| Campo | Valor |
|-------|-------|
| **Índice** | 001 |
| **Data** | 2026-06-03 |
| **Fase** | Foundation + core (primeiro shot) |
| **Commit** | _(pendente — usuário)_ |

---

## Prompt do usuário (verbatim)

> vamos iniciar o primeiro shot do desafio, quero criar um frontend em react, utilizando uma estrutura de components segregados por pasta com seu próprio arquivo tsx e style, utilizando zod para os controle de schemas e zustand para controle de estados simples, e utilizando shadcn UI com tailwind para estilizar os components base. quero consumir uma api de pokedex (https://pokeapi.co/) (criar uma service para realizar as requests com axios) para obter os métodos de listagem com paginação, busca por id (para detalhar um item numa outra janela ou modal quando clicado através da listagem) e busca por nome (que pode ser realizado a busca na janela principal). comportamento: a página inicial deve listar os pokemons por ordem de ids, com lazy loading tendo um item de paginação e ao scrollar carregar mais pokemons mantendo os outros ainda na página, e no topo da página, abaixo do título pokedex, deve ter uma barra de pesquisa por nome com busca ao clicar na lupa ou apertando enter e atualizando os dados da página, e ao clicar num pokemon deve levar a uma página específica mostrando mais detalhes do pokemon, quero um layout parecido com essa imagem. Lembre-se de criar um arquivo em /prompts com esse prompt e a resposta ao finalizar essa primeira etapa, e utilizar o contexto fornecido (ia-rules.md ou .cursor/rules).

---

## Estratégia few-shot usada

| Técnica | Aplicação neste prompt |
|---------|------------------------|
| **Decomposição por camadas** | service → schema → store → components → pages |
| **Template de entrega** | Pre-check documentado + CoT no final |
| **Restrições explícitas** | Stack fixada pelo usuário (Zod, Zustand, Axios, shadcn pattern) |
| **Referência visual** | Layout mobile: cards coloridos por tipo, hero + bottom sheet com abas |

---

## O que foi feito

### Projeto criado: `pokedex-app/`

Scaffold Vite + React + TypeScript com:

| Área | Entregável |
|------|------------|
| **Service** | `pokeApiService.ts` — listagem paginada, `fetchPokemonById`, `fetchPokemonByName` via [PokéAPI](https://pokeapi.co/) |
| **Schemas** | `pokemon.schema.ts` — validação Zod das respostas |
| **Store** | `pokemonStore.ts` — Zustand (lista, infinite scroll, busca, erros) |
| **UI base** | Button, Input, Badge, Tabs (padrão shadcn + Tailwind) |
| **Components** | PokemonCard, SearchBar, StatBar, TypeBadge, PageHeader, PokeballWatermark — cada um com `.tsx` + `.styles.ts` |
| **Pages** | `HomePage` (grid + search + infinite scroll), `PokemonDetailPage` (hero + abas About/Stats) |
| **Routing** | React Router — `/` e `/pokemon/:id` |

### Features obrigatórias do desafio

| Feature | Implementação |
|---------|---------------|
| Listar com paginação | `fetchPokemonPage(offset, limit)` + IntersectionObserver |
| Detalhar por ID | Rota `/pokemon/:pokemonId` |
| Buscar com filtro | SearchBar → `fetchPokemonByName` |

### Layout

- Grid 2 colunas, cards com cor do tipo primário e watermark de pokébola
- Detalhe com header colorido, sprite central, sheet branco com abas (referência visual fornecida)

---

## Pre-check — execução

| Etapa | Comando | Resultado |
|-------|---------|-----------|
| Lint | `npm run lint` | ✅ |
| Typecheck | `npm run typecheck` | ✅ |
| Test | `npm run test` | ✅ (schema Zod) |
| Build | `npm run build` | ✅ |

### Correções aplicadas

| Etapa | Erro | Correção |
|-------|------|----------|
| Typecheck | `baseUrl` deprecated TS 6 | `ignoreDeprecations: "6.0"` |
| Lint | empty interface Input | trocado por `type` alias |
| Lint | setState sync in effect | early return render + cleanup async |

---

## Code-review final

**Blockers:** nenhum.

**Melhorias para Prompt 002 (opcional):**

- Testes de service/store com mocks Axios
- Skeleton loading nos cards
- Abas Evolution/Moves na detail page
- Tratamento de erro de rede mais amigável
- Favoritos (ícone heart) com persistência local

**Veredito:** ✅ Aprovado — pipeline verde, 3 features obrigatórias entregues.

---

## Chain of Thought

- **Entendi:** Prompt 001 — React Pokédex consumindo PokéAPI, few-shot challenge, log em `prompts/`.
- **Verifiquei:** repo sem app; regras em `.cursor/rules/`; libs solicitadas explicitamente (Zod, Zustand, Axios).
- **Decidi:** app em `pokedex-app/`; infinite scroll via offset; detail em rota (não modal) para UX mobile; componentes segregados com `.styles.ts`.
- **Fiz:** scaffold completo, service, store, pages, UI alinhada à imagem de referência.
- **Validação:** lint ✅ typecheck ✅ test ✅ build ✅.

---

## Como rodar

```bash
cd pokedex-app
npm install
npm run dev
```

---

## Entrega — Prompt 001

**Pre-check:** lint ✅ | typecheck ✅ | test ✅ | build ✅  
**Correções:** 3 (TS deprecations, lint Input, effect setState)  
**Code-review:** sem blockers; melhorias listadas para prompt 002  
**CoT:** Entendi → Verifiquei → Decidi → Fiz → Validei

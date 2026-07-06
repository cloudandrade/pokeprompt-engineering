# Pokédex App

Frontend React consumindo a [PokéAPI](https://pokeapi.co/) — Prompt 001 do Prompt Engineering Challenge.

## Stack

- React + TypeScript + Vite
- Tailwind CSS + componentes base estilo shadcn/ui
- Zod (schemas), Zustand (estado), Axios (HTTP), React Router

## Features (Prompt 001)

- Listagem paginada com **infinite scroll** (offset/limit)
- **Busca por nome** (Enter ou lupa)
- **Detalhe por ID** em rota dedicada (`/pokemon/:id`)
- Layout mobile inspirado no design de referência (cards por tipo, hero colorido, abas About/Stats)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run typecheck` | Verificação TypeScript |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |

## Estrutura

```
src/
├── components/     # pasta por componente (.tsx + .styles.ts)
├── pages/
├── services/       # pokeApiService (axios)
├── schemas/        # Zod
├── stores/         # Zustand
└── hooks/
```

## Pre-check (Prompt 001)

| Etapa | Comando | Resultado |
|-------|---------|-----------|
| Lint | `npm run lint` | ✅ |
| Typecheck | `npm run typecheck` | ✅ |
| Test | `npm run test` | ✅ |
| Build | `npm run build` | ✅ |

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

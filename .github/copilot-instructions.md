# Fitness App — Project Overview

## Stack

- **Runtime**: Node.js 20 LTS
- **Package manager**: pnpm 9.x (via Corepack)
- **Monorepo**: pnpm workspaces (`apps/*`, `packages/*`)
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.x — strict mode, ES2022 target, bundler module resolution
- **UI**: React 19, Tailwind CSS v4 (`@import "tailwindcss"`, `@tailwindcss/postcss`)
- **State**: Zustand 5 — hook-based, no providers
- **Validation**: Zod 4 — namespace import (`import * as z from "zod"`), top-level format functions
- **Database**: Prisma ORM 7 + SQLite via `@prisma/adapter-better-sqlite3` (driver adapter pattern)
- **Linting**: ESLint 9 flat config with `eslint-config-next`
- **Formatting**: Prettier — `semi: true`, `singleQuote: false`, `trailingComma: "all"`, `printWidth: 100`

## Conventions

- Default to **Server Components**. Only add `"use client"` when state, hooks, or browser APIs are needed.
- Use `app/` directory (App Router) for all routing. No `pages/` directory.
- Place shared utilities in `lib/`, reusable UI in `components/`, hooks in `hooks/`.
- Use TypeScript `strict` mode. Avoid `any`; prefer `unknown` + narrowing.
- Use pure ES modules (`type: "module"` in all `package.json` files).
- Validate external input with Zod schemas at system boundaries.
- Use Zustand stores as plain hook imports — no context providers.
- Prisma config (`prisma.config.ts`) lives at app root, not inside `prisma/`.
- Generated Prisma client output goes to `generated/prisma/` (gitignored).

## Commands

All commands run from the monorepo root and delegate to the `web` app via `pnpm --filter web`.

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `pnpm dev`         | Start dev server (Turbopack)       |
| `pnpm build`       | Production build                   |
| `pnpm start`       | Start production server            |
| `pnpm lint`        | Run ESLint                         |
| `pnpm format`      | Format with Prettier               |
| `pnpm format:check`| Check formatting                   |
| `pnpm db:generate` | Generate Prisma client             |
| `pnpm db:push`     | Push schema to database            |
| `pnpm db:studio`   | Open Prisma Studio                 |

## Key Gotchas

- **ESLint**: `eslint-config-next@16` exports a native flat config array. Import via `createRequire` and spread. Do NOT use `FlatCompat`.
- **Prisma**: `prisma.config.ts` goes at app root, NOT inside `prisma/`. The `url` property is no longer allowed in the schema `datasource` block — use `datasource.url` in `prisma.config.ts`. Import `PrismaClient` from `@/generated/prisma/client`. The adapter class is `PrismaBetterSqlite3` (lowercase `qlite`).
- **Zod 4**: Use `import * as z from "zod"` and top-level `z.email()`, not `z.string().email()`.
- **Zustand**: No `<Provider>` wrapper. Stores are plain hooks via `create()`.
- **Tailwind v4**: Use `@import "tailwindcss"` in CSS. Configure via `@tailwindcss/postcss` PostCSS plugin, not Vite plugin.

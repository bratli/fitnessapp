# Fitness App

A fitness tracking application built with a modern TypeScript stack.

## Tech Stack

- **Runtime**: Node.js 20 LTS
- **Package Manager**: pnpm 9.x (via Corepack)
- **Monorepo**: pnpm workspaces (`apps/*`, `packages/*`)
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.x (strict mode, ES2022)
- **UI**: React 19, Tailwind CSS v4
- **State Management**: Zustand 5
- **Validation**: Zod 4
- **Database**: Prisma ORM 7 + SQLite
- **Linting**: ESLint 9 (flat config)
- **Formatting**: Prettier

## Prerequisites

- [Node.js 20 LTS](https://nodejs.org/) (see `.nvmrc`)
- [Corepack](https://nodejs.org/api/corepack.html) enabled for pnpm

## Getting Started

```bash
# Enable Corepack (ships with Node.js 20+)
corepack enable

# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

All commands run from the monorepo root via `pnpm --filter web`.

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `pnpm dev`           | Start dev server (Turbopack)       |
| `pnpm build`         | Production build                   |
| `pnpm start`         | Start production server            |
| `pnpm lint`          | Run ESLint                         |
| `pnpm format`        | Format with Prettier               |
| `pnpm format:check`  | Check formatting                   |
| `pnpm db:generate`   | Generate Prisma client             |
| `pnpm db:push`       | Push schema to database            |
| `pnpm db:studio`     | Open Prisma Studio                 |

## Project Structure

```
fitnessapp/
├── apps/
│   └── web/                    # Next.js app
│       ├── app/                # App Router pages and layouts
│       │   ├── api/health/     # Health check endpoint
│       │   ├── globals.css     # Global styles (Tailwind)
│       │   ├── layout.tsx      # Root layout
│       │   └── page.tsx        # Home page
│       ├── lib/
│       │   ├── db.ts           # Prisma client instance
│       │   ├── schemas/        # Zod validation schemas
│       │   └── store/          # Zustand state stores
│       ├── prisma/
│       │   └── schema.prisma   # Database schema
│       ├── prisma.config.ts    # Prisma configuration
│       ├── eslint.config.mjs   # ESLint flat config
│       ├── next.config.ts      # Next.js configuration
│       ├── postcss.config.mjs  # PostCSS (Tailwind)
│       └── tsconfig.json       # TypeScript configuration
├── packages/                   # Shared packages (empty for now)
├── .github/                    # Copilot instructions and skills
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # Workspace definition
└── .prettierrc                 # Prettier configuration
```

## Environment Variables

Copy `.env.example` to `apps/web/.env`:

```bash
cp .env.example apps/web/.env
```

| Variable              | Description                  | Default                    |
| --------------------- | ---------------------------- | -------------------------- |
| `NEXT_PUBLIC_APP_URL`  | Public app URL              | `http://localhost:3000`    |
| `DATABASE_URL`         | SQLite database path        | `file:./prisma/dev.db`    |

## License

Private project.

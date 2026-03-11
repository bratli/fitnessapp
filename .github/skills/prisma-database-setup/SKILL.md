---
name: prisma-database-setup
description: "Database setup and schema management with Prisma ORM 7"
---

# Prisma Database Setup (Prisma ORM 7)

## Overview

Guide for setting up and managing databases with Prisma ORM 7, covering schema definition, migrations, and the SQLite driver adapter pattern.

## Project Structure

```
apps/web/
├── prisma.config.ts        ← Prisma config (at app root, NOT inside prisma/)
├── prisma/
│   └── schema.prisma       ← Database schema
├── generated/
│   └── prisma/             ← Generated client (gitignored)
├── lib/
│   └── db.ts               ← Prisma client instance
└── .env                    ← DATABASE_URL
```

## Configuration

### prisma.config.ts (App Root)

```typescript
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(import.meta.dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
```

**IMPORTANT**: This file goes at the app root (`apps/web/prisma.config.ts`), NOT inside the `prisma/` directory.

### Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
}
```

**NOTE**: In Prisma 7, the `url` property is no longer allowed in the schema `datasource` block. The connection URL must be specified in `prisma.config.ts` via `datasource.url`.

### Environment (.env)

```
DATABASE_URL="file:./prisma/dev.db"
```

## Commands

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `prisma generate`     | Generate Prisma client               |
| `prisma db push`      | Push schema changes to database      |
| `prisma studio`       | Open Prisma Studio GUI               |
| `prisma migrate dev`  | Create and apply a migration         |
| `prisma migrate deploy` | Apply pending migrations           |

## Generator Changes in v7

- Provider changed from `"prisma-client-js"` to `"prisma-client"`.
- Default output directory is now `../generated/prisma` (relative to schema).
- Import from the generated directory, not from `@prisma/client`.

## SQLite Notes

- SQLite stores the database as a single file.
- The `file:` prefix in DATABASE_URL is required.
- SQLite does not support all Prisma features (e.g., `@db.Uuid`).
- Use `cuid()` or `uuid()` for ID generation.

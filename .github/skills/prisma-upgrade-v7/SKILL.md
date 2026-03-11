---
name: prisma-upgrade-v7
description: "Breaking changes and migration guide for Prisma ORM 7"
---

# Prisma ORM 7 Upgrade Guide

## Overview

This skill covers all breaking changes when upgrading to Prisma ORM 7 from earlier versions.

## Breaking Changes

### 1. Generator Provider Renamed

```prisma
# Before (Prisma 6 and earlier)
generator client {
  provider = "prisma-client-js"
}

# After (Prisma 7)
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}
```

### 2. Client Import Path Changed

```typescript
// Before (Prisma 6)
import { PrismaClient } from "@prisma/client";

// After (Prisma 7)
import { PrismaClient } from "../generated/prisma";
```

The generated client is now output to a local directory rather than into `node_modules`.

### 3. Configuration File (prisma.config.ts)

Prisma 7 introduces `prisma.config.ts` using `defineConfig`:

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

**CRITICAL**: Place `prisma.config.ts` at the app root, NOT inside the `prisma/` directory.

**NOTE**: The `url` property is no longer allowed in the schema `datasource` block. Move it to `datasource.url` in `prisma.config.ts`.

### 4. Driver Adapter Pattern (Recommended)

Prisma 7 recommends the driver adapter pattern for all databases:

```typescript
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
```

Available adapters:
- `@prisma/adapter-better-sqlite3` — SQLite
- `@prisma/adapter-pg` — PostgreSQL
- `@prisma/adapter-mysql2` — MySQL
- `@prisma/adapter-planetscale` — PlanetScale
- `@prisma/adapter-neon` — Neon
- `@prisma/adapter-d1` — Cloudflare D1

### 5. ESM Support

Prisma 7 fully supports ES modules:
- Use `import.meta.dirname` instead of `__dirname` in `prisma.config.ts`.
- Set `"type": "module"` in `package.json`.

### 6. Generated Output Directory

- Default output is `../generated/prisma` relative to the schema file.
- Add `generated/` to `.gitignore`.
- Run `prisma generate` after `pnpm install` or schema changes.

## Migration Checklist

- [ ] Update `prisma` and `@prisma/client` packages to v7.
- [ ] Rename generator provider from `prisma-client-js` to `prisma-client`.
- [ ] Set `output` in generator to `../generated/prisma`.
- [ ] Create `prisma.config.ts` at app root with `defineConfig`.
- [ ] Update all imports from `@prisma/client` to `../generated/prisma`.
- [ ] Install and configure the appropriate driver adapter.
- [ ] Add `generated/` to `.gitignore`.
- [ ] Run `prisma generate` and verify.

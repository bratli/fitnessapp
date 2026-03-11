---
name: prisma-client-api
description: "Prisma Client API reference for Prisma ORM 7 with driver adapter pattern"
---

# Prisma Client API (Prisma ORM 7)

## Overview

This skill covers the Prisma Client API for Prisma ORM 7, including the driver adapter pattern, CRUD operations, and best practices for Next.js applications.

## Client Instantiation (Driver Adapter Pattern)

In Prisma 7, the driver adapter pattern is the recommended approach:

```typescript
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });
```

### Singleton Pattern for Next.js

Prevent multiple instances during hot-reload in development:

```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## CRUD Operations

### Create

```typescript
const user = await prisma.user.create({
  data: { email: "user@example.com", name: "Alice" },
});
```

### Read

```typescript
const user = await prisma.user.findUnique({ where: { id: "..." } });
const users = await prisma.user.findMany({ where: { name: { contains: "Ali" } } });
```

### Update

```typescript
const updated = await prisma.user.update({
  where: { id: "..." },
  data: { name: "Bob" },
});
```

### Delete

```typescript
await prisma.user.delete({ where: { id: "..." } });
```

## Relations

```typescript
const userWithPosts = await prisma.user.findUnique({
  where: { id: "..." },
  include: { posts: true },
});
```

## Transactions

```typescript
const result = await prisma.$transaction([
  prisma.user.create({ data: { email: "a@b.com" } }),
  prisma.user.create({ data: { email: "c@d.com" } }),
]);
```

## Key Notes

- Import `PrismaClient` from the generated output directory, NOT from `@prisma/client`.
- Always use the driver adapter pattern in Prisma 7.
- Use the singleton pattern in Next.js to prevent connection exhaustion.

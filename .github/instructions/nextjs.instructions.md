---
description: "Best practices for building Next.js (App Router) apps with modern caching, tooling, and server/client boundaries (aligned with Next.js 16)"
applyTo: "**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css"
---

# Next.js Best Practices

## 1. Project Structure & Organization

- Use the `app/` directory (App Router) for all new projects.
- Top-level folders: `app/`, `public/`, `lib/`, `components/`, `hooks/`, `types/`
- Colocation: Place files near where they are used, but avoid deeply nested structures.
- Route Groups: Use parentheses (e.g., `(admin)`) to group routes without affecting the URL path.
- Private Folders: Prefix with `_` to opt out of routing.

## 2. Server and Client Components

- **Server Components** are the default — use for data fetching, heavy logic, non-interactive UI.
- **Client Components** require `'use client'` at the top — use for interactivity, state, or browser APIs.
- Never use `next/dynamic` with `{ ssr: false }` inside a Server Component.
- Move client-only logic into dedicated Client Components and import them in Server Components.

## 3. Async Request APIs (Next.js 16)

- `cookies()`, `headers()`, and `draftMode()` are async in Server Components and Route Handlers.
- `params` and `searchParams` may be Promises — always `await` them.
- Accessing request data opts the route into dynamic rendering.

## 4. API Routes (Route Handlers)

- Place API routes in `app/api/` (e.g., `app/api/users/route.ts`).
- Export async functions named after HTTP verbs (`GET`, `POST`, etc.).
- Use Web `Request`/`Response` APIs. Use `NextRequest`/`NextResponse` for advanced features.
- Always validate and sanitize input (use Zod).
- Do NOT call your own Route Handlers from Server Components — extract shared logic into `lib/`.

## 5. Naming Conventions

- Folders: `kebab-case`
- Component files: `PascalCase`
- Utilities/hooks: `camelCase`
- Variables/Functions: `camelCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

## 6. General Best Practices

- Use TypeScript strict mode.
- Use ESLint CLI (not `next lint`) in Next.js 16.
- Store secrets in `.env.local`. Never commit secrets.
- Use built-in Image and Font optimization.
- Use Suspense and loading states for async data.
- Avoid large client bundles; keep most logic in Server Components.

## 7. Caching (Next.js 16)

- Prefer Cache Components (`use cache` directive) over legacy patterns.
- Use `cacheTag(...)` and `cacheLife(...)` for cache management.
- Prefer `revalidateTag(tag, 'max')` for stale-while-revalidate.
- Avoid `unstable_cache` for new code.

## 8. Tooling (Next.js 16)

- Turbopack is the default dev bundler.
- Typed routes are stable via `typedRoutes`.

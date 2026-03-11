---
description: "Tailwind CSS v4+ installation and configuration using @tailwindcss/postcss plugin"
applyTo: "**/*.css, **/*.tsx, **/*.ts, **/*.jsx, **/*.js"
---

# Tailwind CSS v4 Configuration

## Key Changes in v4

- **CSS-first configuration** using `@theme` directive — no `tailwind.config.js` needed.
- **Automatic content detection** — no need to specify content paths.
- Use `@import "tailwindcss"` instead of old `@tailwind` directives.
- This project uses `@tailwindcss/postcss` (NOT the Vite plugin).

## PostCSS Configuration

```javascript
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

## CSS Setup

```css
@import "tailwindcss";
```

## What NOT to Do

- Do NOT create `tailwind.config.js` — use CSS `@theme` for customization.
- Do NOT use old `@tailwind base; @tailwind components; @tailwind utilities;` directives.
- Do NOT use `@tailwindcss/vite` — this project uses `@tailwindcss/postcss`.

## Custom Theme Configuration

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

## Custom Utilities

```css
@utility content-auto {
  content-visibility: auto;
}
```

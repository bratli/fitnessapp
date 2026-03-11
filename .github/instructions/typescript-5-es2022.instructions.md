---
description: "Guidelines for TypeScript Development targeting TypeScript 5.x and ES2022 output"
applyTo: "**/*.ts"
---

# TypeScript Development

## Core Intent

- Respect the existing architecture and coding standards.
- Prefer readable, explicit solutions over clever shortcuts.
- Extend current abstractions before inventing new ones.
- Prioritize maintainability and clarity.

## General Guardrails

- Target TypeScript 5.x / ES2022 and prefer native features over polyfills.
- Use pure ES modules; never emit `require`, `module.exports`, or CommonJS helpers.
- Rely on the project's build, lint, and test scripts unless asked otherwise.

## Naming & Style

- PascalCase for classes, interfaces, enums, and type aliases; camelCase for everything else.
- Skip interface prefixes like `I`; rely on descriptive names.
- Name things for their behavior or domain meaning, not implementation.

## Formatting & Style

- Run the repository's lint/format scripts before submitting.
- Match the project's indentation, quote style, and trailing comma rules.
- Keep functions focused; extract helpers when logic branches grow.
- Favor immutable data and pure functions when practical.

## Type System

- Avoid `any` (implicit or explicit); prefer `unknown` plus narrowing.
- Use discriminated unions for state machines.
- Centralize shared contracts instead of duplicating shapes.
- Express intent with utility types (`Readonly`, `Partial`, `Record`).

## Async & Error Handling

- Use `async/await`; wrap awaits in try/catch with structured errors.
- Guard edge cases early to avoid deep nesting.
- Surface user-facing errors via the project's notification pattern.

## Security

- Validate and sanitize external input with schema validators or type guards.
- Avoid dynamic code execution and untrusted template rendering.
- Use parameterized queries to block injection.
- Keep secrets in secure storage and request least-privilege scopes.

## Testing

- Add or update unit tests with the project's framework and naming style.
- Avoid brittle timing assertions; prefer fake timers or injected clocks.

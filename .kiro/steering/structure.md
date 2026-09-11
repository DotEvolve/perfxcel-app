---
inclusion: always
---

# Project Structure

```
src/
├── __tests__/          # Vitest tests (unit, integration, property-based)
├── assets/             # Static assets (images, icons)
├── components/         # Reusable React components, grouped by domain
│   └── templates/      # Template-specific components
├── config/             # App-level configuration constants
├── hooks/              # Domain-scoped data-fetching hooks (e.g. useWorkflows, useDocuments)
├── lib/
│   ├── api.ts          # Axios instance — attaches Supabase JWT, used for all API calls
│   └── supabase.ts     # Supabase client singleton — never instantiate inline
├── pages/              # Route-level page components (one per route, kept thin)
├── services/           # Service helpers and business logic utilities
├── types/              # Shared TypeScript interfaces and types
├── utils/              # Pure utility functions (no side effects, no API calls)
├── App.tsx             # Root component — HashRouter, all route definitions, auth state, AuthGuard
├── App.css             # App-level styles
├── index.css           # Global styles (Tailwind base)
├── main.tsx            # Entry point
└── vitest.setup.ts     # Global Vitest setup
server.js               # Express proxy server (OCI deployment)
```

## Routing

- Uses `HashRouter` — all routes are hash-based.
- **All route definitions live exclusively in `App.tsx`.** Never define routes inside page or component files.
- Public routes (`/login`, `/signup`, `/reset-password`, `/privacy-policy`) sit **outside** `AuthGuard`.
- All protected routes are wrapped in `AuthGuard → Layout`. Never bypass `AuthGuard`.
- Auth state is managed in `App.tsx` via `supabase.auth.getSession()` and `onAuthStateChange`.
- On every auth state change, the app broadcasts a `GOVNIX_AUTH_SYNC` message via `window.postMessage` to sync with the `perfxcel-mca-extension`. **Do not remove this broadcast.**

## Pages and Components

- Pages map 1:1 to routes. Keep them thin — delegate data-fetching and business logic to hooks, and rendering to components.
- Components are grouped by domain under `src/components/` (e.g. `components/templates/`).
- Never put API calls or business logic directly in page or component files.

## API Calls

- **Never call `axios` directly** in components or hooks.
- All HTTP requests go through the `api` Axios instance from `src/lib/api.ts`.
  - Attaches `Authorization: Bearer <token>` from the active Supabase session via a request interceptor.
  - Extracts `x-correlation-id` from response headers and tags it in Sentry via a response interceptor.
  - Base URL: `VITE_GOVNIX_API_URL` (default: `https://api.perfxcel.net`).
- **Never instantiate Supabase inline** — use the singleton from `src/lib/supabase.ts`.

## Hooks

- All data-fetching and business logic belong in domain-scoped hooks in `src/hooks/`.
- Components call hooks — never call `api` directly from a component or page.

## Types

- Shared TypeScript types live in `src/types/`. Use `interface` for object shapes.
- Strict mode is enabled — no `any` without an explicit justification comment.

## Error Handling

- Use `@dotevolve/error-utils` for error handling. Never configure Sentry directly.
- Sentry user context is set/cleared on every auth state change in `App.tsx`.

## Styling

- Tailwind CSS v4 via `@tailwindcss/vite` — **no `tailwind.config.js`**.
- Apply utility classes directly in JSX. Never use inline `style` props for layout.

## Testing

- Tests live in `src/__tests__/`. Use Vitest with `@testing-library/react`.
- Property-based tests use `fast-check` and the `.property.test.tsx` suffix.
- Global setup is in `src/vitest.setup.ts`.

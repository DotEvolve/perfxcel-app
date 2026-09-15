---
inclusion: always
---

# Tech Stack

## Core Dependencies

| Concern | Library | Version |
|---|---|---|
| Language | TypeScript | ~5.9 (strict mode) |
| Framework | React | 19.x |
| Build Tool | Vite | 8.x |
| Styling | Tailwind CSS (via `@tailwindcss/vite`) | 4.x |
| Routing | React Router DOM (`HashRouter`) | 7.x |
| HTTP Client | Axios | — |
| Auth | @supabase/supabase-js | — |
| PDF Generation | @react-pdf/renderer | — |
| PDF Viewing | react-pdf | — |
| Image Processing | jimp | — |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable | — |
| Icons | Lucide React | — |
| Error Tracking | Sentry + @dotevolve/error-utils | — |
| UI Kit | @dotevolve/ui-kit | ^1.0.0 |

## Testing

| Concern | Library | Version |
|---|---|---|
| Runner | Vitest | 4.x |
| Component Testing | @testing-library/react | — |
| Property-Based | fast-check | — |

- Tests live in `src/__tests__/`. Global setup is in `src/vitest.setup.ts`.
- Property-based tests use the `.property.test.tsx` suffix and run a minimum of 100 iterations per property.

## Common Commands

```bash
npm run dev            # Start Vite dev server
npm run build          # TypeScript check + Vite production build
npm test               # Run tests (single pass)
npm run test:coverage  # Tests with coverage
npm run lint           # ESLint
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_API_GATEWAY_URL` | API Gateway base URL (default: `https://api.perfxcel.net`) |

## Key Coding Conventions

### TypeScript
- Strict mode is enabled. All code must type-check cleanly. No `any` without an explicit justification comment.
- Shared types live in `src/types/`. Use `interface` for object shapes.

### Styling
- Tailwind CSS v4 is loaded as a Vite plugin (`@tailwindcss/vite`). **There is no `tailwind.config.js`.**
- Apply utility classes directly in JSX. Never use inline `style` props for layout.

### UI Kit
- **Use `@dotevolve/ui-kit`** for all standard UI components (e.g. `Alert`, `Modal`, `Table`, `Badge`, `Toggle`).
- Do not create custom shells for these elements.
- The UI Kit styles are imported in `src/index.css`.

### API Calls
- **Never call `axios` directly** in components or hooks.
- All HTTP requests go through the `api` Axios instance from `src/lib/api.ts`.
  - Attaches `Authorization: Bearer <token>` from the active Supabase session via a request interceptor.
  - Extracts `x-correlation-id` from response headers and tags it in Sentry via a response interceptor.
  - Base URL: `VITE_API_GATEWAY_URL` (default: `https://api.perfxcel.net`).
- **Never instantiate Supabase inline** — use the singleton from `src/lib/supabase.ts`.

### Data Fetching
- All data-fetching and business logic belong in domain-scoped hooks in `src/hooks/` (e.g. `useWorkflows`, `useDocuments`).
- Components call hooks — never call `api` directly from a component or page.

### Auth & Routing
- Uses `HashRouter` — all routes are hash-based. All route definitions live exclusively in `App.tsx`.
- Public routes (`/login`, `/signup`, `/reset-password`, `/privacy-policy`) sit outside `AuthGuard`. All protected routes are wrapped in `AuthGuard → Layout`. Never bypass `AuthGuard`.
- Auth state is managed in `App.tsx` via `supabase.auth.getSession()` and `onAuthStateChange`.
- On every auth state change, the app broadcasts a `GOVNIX_AUTH_SYNC` message via `window.postMessage` to sync with the `perfxcel-mca-extension`. **Do not remove this broadcast.**

### Error Tracking
- Sentry is configured via `@dotevolve/error-utils`. Never configure Sentry directly.
- Sentry user context is set/cleared on every auth state change in `App.tsx`.

### Pages and Components
- Pages map 1:1 to routes and must stay thin — delegate data-fetching to hooks and rendering to components.
- Never put API calls or business logic directly in page or component files.
- Components are grouped by domain under `src/components/` (e.g. `components/templates/`).

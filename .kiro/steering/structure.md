---
inclusion: always
---

# Project Structure

```
src/
├── api.ts              # Axios instance + all API functions — single source of truth for HTTP calls
├── App.tsx             # Root component — BrowserRouter routes, Navbar, Footer, Sentry.ErrorBoundary
├── config/
│   └── sentry.ts       # Sentry initialisation — imported once in main.tsx before rendering
├── components/         # Shared UI components (Navbar, Footer, CourseCard, RegisterInterestModal)
├── data/               # Static mock data (e.g. mockCourses.ts) — development/fallback only
├── hooks/              # Domain-scoped data-fetching hooks (e.g. useCourses, useTaxonomies)
├── pages/              # Route-level page components — one file per route, kept thin
├── types/              # Shared TypeScript interfaces and types
│   ├── course.ts       # Course, CourseFilters, TaxonomyItem interfaces
│   └── index.ts        # Re-exports all types
├── index.css           # Global styles (Tailwind base)
├── main.tsx            # Entry point — imports config/sentry first, then renders the app
└── vitest.setup.ts     # Global Vitest setup — jest-dom matchers + Sentry mock
```

## Routing

- Uses `BrowserRouter` (via `react-router-dom` v7) — **not** HashRouter.
- **All route definitions live exclusively in `App.tsx`.** Never define routes inside page or component files.
- This is a public site — there is no authentication, no `AuthGuard`, and no protected routes.
- The persistent layout (Navbar + Footer) is rendered directly in `App.tsx`, wrapping the `<Routes>`.

## Pages and Components

- Pages map 1:1 to routes. Keep them thin — delegate data-fetching to hooks and rendering to components.
- Shared components live flat in `src/components/`. Group into subdirectories only when a domain warrants it.
- Never put API calls or business logic directly in page or component files.

## API Layer

- **All API functions live in `src/api.ts`** — not in hooks, pages, or components.
- The `api` Axios instance uses `VITE_API_URL` as its base URL (default: `https://api-dev.perfxcel.com/api/v1`).
- Exported functions: `getCourses`, `getCourse`, `getTaxonomies`, `submitCourseInterest`, `verifyCertificate`, `submitContact`.
- Hooks call these exported functions — they never construct Axios requests themselves.
- Turnstile tokens are passed as parameters to submission functions (`submitCourseInterest`, `submitContact`, `verifyCertificate`).
- The response interceptor reads `x-correlation-id` from successful responses and sets it as a Sentry tag.
- The error interceptor captures 5xx and network errors to Sentry with `api.url`, `api.method`, and `api.status_code` tags. 4xx errors are **not** captured — they are expected client-side failures.

## Hooks

- Domain-scoped hooks live in `src/hooks/`. They own loading/error state and call functions from `src/api.ts`.
- Components and pages call hooks — never import from `src/api.ts` directly inside a component.

## Types

- Shared TypeScript interfaces live in `src/types/`. Use `interface` for object shapes.
- Strict mode is enabled — no `any` without an explicit justification comment.
- Re-export types through `src/types/index.ts` for clean consumer imports.

## Error Handling and Observability

Sentry is integrated exclusively via `@dotevolve/error-utils`. **Never configure `@sentry/react` or any other Sentry SDK directly.**

### Initialisation

- `src/config/sentry.ts` calls `initializeReactSentry` from `@dotevolve/error-utils/react`.
- It is imported as the **very first import** in `src/main.tsx`, before React or any app module.
- Initialisation is guarded on `VITE_SENTRY_DSN` — it is a no-op when the DSN is absent (local dev).

### Features enabled

| Feature | Detail |
|---|---|
| Error tracking | All unhandled exceptions via `Sentry.ErrorBoundary` in `App.tsx` |
| Browser tracing | Page loads, navigation, HTTP requests (100% sample rate) |
| Browser profiling | JS execution profiles (100% sample rate) |
| Session replay | 10% of sessions; 100% of sessions containing an error |
| Console log capture | `log`, `warn`, `error` forwarded to Sentry Logs |
| API error capture | 5xx responses captured in `src/api.ts` interceptor with request tags |
| Correlation ID | `x-correlation-id` from API responses tagged on the Sentry scope |

### Error boundary

`App.tsx` wraps the entire route tree in `<Sentry.ErrorBoundary fallback={<ErrorFallback />}>`. The `ErrorFallback` component renders an inline error message with a page-reload button.

### Source map upload

`vite.config.ts` uses `sentryVitePlugin` with `build.sourcemap: true`. Source maps are uploaded to Sentry on production builds when `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` are set (CI only).

### Environment variables

| Variable | Where used | Purpose |
|---|---|---|
| `VITE_SENTRY_DSN` | `src/config/sentry.ts` | Runtime DSN — required for Sentry to activate |
| `VITE_SENTRY_ENVIRONMENT` | `src/config/sentry.ts` | Deployment environment tag (falls back to `import.meta.env.MODE`) |
| `VITE_APP_VERSION` | `src/config/sentry.ts` | Release identifier for source map association |
| `SENTRY_ORG` | `vite.config.ts` | Sentry org slug — build-time only |
| `SENTRY_PROJECT` | `vite.config.ts` | Sentry project slug — build-time only |
| `SENTRY_AUTH_TOKEN` | `vite.config.ts` | Source map upload token — build-time only (CI) |

## Styling

- Tailwind CSS v4 via `@tailwindcss/vite` — **no `tailwind.config.js`**.
- Apply utility classes directly in JSX. Do not use inline `style` props for layout or spacing.
- Design tokens use `secondary-*` and `primary-*` colour scales defined via CSS variables.

## Static / Mock Data

- `src/data/` holds static mock data for local development or UI stubs.
- Do not import mock data in production code paths — keep it isolated to development use.

## Testing

- Vitest with `@testing-library/react` and `jsdom`.
- Global setup is in `src/vitest.setup.ts` — provides jest-dom matchers and mocks `@dotevolve/error-utils/react` so Sentry does not initialise during tests.
- Property-based tests use `fast-check` and the `.property.test.tsx` suffix.
- Run with `npm test` (single pass) or `npm run test:coverage` for coverage.

## Key Libraries

| Concern | Library |
|---|---|
| Routing | react-router-dom v7 |
| HTTP | axios |
| Observability | @dotevolve/error-utils (Sentry) |
| Styling | Tailwind CSS v4 |
| Bot protection | @marsidev/react-turnstile |
| PDF | @react-pdf/renderer, react-pdf |
| Drag-and-drop | @dnd-kit/core, @dnd-kit/sortable |
| Icons | lucide-react |
| UI primitives | @dotevolve/ui-kit |

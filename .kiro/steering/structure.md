---
inclusion: always
---

# Project Structure

```
src/
├── api.ts              # Axios instance + all API functions — single source of truth for HTTP calls
├── App.tsx             # Root component — BrowserRouter routes, Navbar, Footer, all route definitions
├── components/         # Shared UI components (Navbar, Footer, CourseCard, RegisterInterestModal)
├── data/               # Static mock data (e.g. mockCourses.ts) used for development/fallback
├── hooks/              # Domain-scoped data-fetching hooks (e.g. useCourses, useTaxonomies)
├── pages/              # Route-level page components — one file per route, kept thin
├── types/              # Shared TypeScript interfaces and types
│   ├── course.ts       # Course, CourseFilters, TaxonomyItem interfaces
│   └── index.ts        # Re-exports all types
├── index.css           # Global styles (Tailwind base)
└── main.tsx            # Entry point
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

## Hooks

- Domain-scoped hooks live in `src/hooks/`. They own loading/error state and call functions from `src/api.ts`.
- Components and pages call hooks — never import from `src/api.ts` directly inside a component.

## Types

- Shared TypeScript interfaces live in `src/types/`. Use `interface` for object shapes.
- Strict mode is enabled — no `any` without an explicit justification comment.
- Re-export types through `src/types/index.ts` for clean consumer imports.

## Styling

- Tailwind CSS v4 via `@tailwindcss/vite` — **no `tailwind.config.js`**.
- Apply utility classes directly in JSX. Do not use inline `style` props for layout or spacing.
- Design tokens use `secondary-*` and `primary-*` colour scales defined via CSS variables.

## Static / Mock Data

- `src/data/` holds static mock data for local development or UI stubs.
- Do not import mock data in production code paths — keep it isolated to development use.

## Error Handling

- Use `@dotevolve/error-utils` for error handling. Do not configure Sentry directly.

## Testing

- Vitest with `@testing-library/react` and `jsdom`.
- Property-based tests use `fast-check` and the `.property.test.tsx` suffix.
- Run with `npm test` (single pass) or `npm run test:coverage` for coverage.

## Key Libraries

| Concern | Library |
|---|---|
| Routing | react-router-dom v7 |
| HTTP | axios |
| Styling | Tailwind CSS v4 |
| Bot protection | @marsidev/react-turnstile |
| PDF | @react-pdf/renderer, react-pdf |
| Drag-and-drop | @dnd-kit/core, @dnd-kit/sortable |
| Icons | lucide-react |
| UI primitives | @dotevolve/ui-kit |

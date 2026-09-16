---
inclusion: always
---

# Product: Perfxcel App

Public-facing marketing and course catalog SPA for PerfXcel (Performance Excellence). Prospective learners browse the course catalog, filter by taxonomy, view course details, register interest, verify certificates, and contact the team. There is no authentication — all routes are public.

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 5.9 (strict mode) |
| Routing | React Router v7 (`BrowserRouter` in `main.tsx`) |
| Styling | Tailwind CSS 4.x (no `tailwind.config.js`) |
| HTTP | Axios via `src/api.ts` |
| Bot protection | Cloudflare Turnstile (`@marsidev/react-turnstile`) |
| Error monitoring | Sentry (via `@sentry/vite-plugin` + `@dotevolve/error-utils`) |
| Icons | `lucide-react` |
| Testing | Vitest 4 + jsdom + `@testing-library/react` + `fast-check` |

## Project Structure

```
src/
├── App.tsx          # Root layout (Navbar + <Routes> + Footer) — all routes defined here
├── main.tsx         # Entry point; mounts <BrowserRouter>
├── api.ts           # Axios instance + all API call functions
├── index.css        # Global styles and Tailwind base
├── components/      # Shared UI components (Navbar, Footer, CourseCard, RegisterInterestModal)
├── hooks/           # Domain-scoped data hooks (useCourses, useTaxonomies)
├── pages/           # Full-page components (one per route)
├── types/           # TypeScript interfaces (course.ts, index.ts)
└── __tests__/       # Vitest tests
```

## Route Table

All routes are defined exclusively in `App.tsx`.

| Path | Page Component | Notes |
|---|---|---|
| `/` | `Home` | Landing / hero page |
| `/courses` | `Catalog` | Filterable course listing |
| `/courses/:id` | `CourseDetail` | Accepts `slug` or `id` |
| `/about` | `About` | |
| `/training-plan` | `TrainingPlan` | |
| `/verify` | `Verify` | Certificate verification |
| `/contact` | `Contact` | Contact form |
| `/privacy` | `Privacy` | |
| `/terms` | `Terms` | |
| `/cookies` | `Cookies` | |

## API Layer (`src/api.ts`)

- A single `axios` instance (`api`) is created with base URL from `VITE_API_URL` (default: `https://api-dev.perfxcel.com/api/v1`).
- All HTTP calls are exported functions from `src/api.ts` (`getCourses`, `getCourse`, `getTaxonomies`, `submitCourseInterest`, `verifyCertificate`, `submitContact`).
- Never call `axios` directly in components or hooks — always use the exported functions from `src/api.ts`.
- Forms that submit user data (`submitCourseInterest`, `submitContact`) require a Cloudflare Turnstile token passed as `turnstileToken`.

## Data & Hooks

- `useCourses(filters: CourseFilters)` — fetches and filters the course list; returns `{ courses, loading, error }`.
- `useTaxonomies()` — fetches taxonomy collections (categories, cities, associations, delivery modes); powers Navbar mega-menu and catalog filters.
- All data-fetching belongs in `src/hooks/`. Page and component files call hooks, not `api` functions directly.

## Key Conventions

- **Routes in `App.tsx` only.** Never define `<Route>` elements inside page or component files.
- **No auth layer.** There is no `AuthGuard`, no Supabase session, and no protected routes. Do not introduce authentication without explicit instruction.
- **Components stay thin.** Data-fetching and side-effects live in hooks; pages and components consume hook return values.
- **Tailwind 4 utility-first styling.** No `tailwind.config.js`. Apply utility classes directly in JSX. Never use inline `style` props for layout (exception: custom font-family declarations where no utility class exists).
- **TypeScript strict mode.** No `any` without an explicit justification comment. All shared domain types live in `src/types/`.
- **Course navigation** uses `course.slug` when present, falling back to `course.id` (`/courses/${course.slug || course.id}`).
- **`is_published && status === 'active'`** — only show courses matching both conditions (applied in `getCourses`).
- **Sentry** is configured via the Vite plugin; do not call `Sentry.*` directly in application code — use `@dotevolve/error-utils`.
- **Tests** live in `src/__tests__/`. Property-based tests use `fast-check` with a `.property.test.tsx` suffix.

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_APP_ENV` | Runtime environment (`prod` / `dev`) |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Sentry source-map upload (build-time only) |

## Deployment

- Hosted on **Cloudflare Pages**.
- `npm run build` → `tsc -b && vite build` (source maps enabled for Sentry).
- `server.js` is an Express proxy used in the OCI deployment context; it is not the Vite dev server.

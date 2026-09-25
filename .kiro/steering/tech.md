---
inclusion: always
---

# Tech Stack

## Core Dependencies

| Concern          | Library                                      | Version            |
| ---------------- | -------------------------------------------- | ------------------ |
| Language         | TypeScript                                   | ~5.9 (strict mode) |
| Framework        | React                                        | 19.x               |
| Build Tool       | Vite                                         | 8.x                |
| Styling          | Tailwind CSS (via `@tailwindcss/vite`)       | 4.x                |
| Routing          | React Router DOM (`BrowserRouter`)           | 7.x                |
| HTTP Client      | Axios                                        | 1.x                |
| Bot Protection   | @marsidev/react-turnstile                    | —                  |
| PDF Generation   | @react-pdf/renderer                          | —                  |
| PDF Viewing      | react-pdf                                    | —                  |
| Image Processing | jimp                                         | —                  |
| Drag & Drop      | @dnd-kit/core, @dnd-kit/sortable             | —                  |
| Icons            | Lucide React                                 | —                  |
| Error Tracking   | @dotevolve/error-utils + @sentry/vite-plugin | —                  |
| UI Kit           | @dotevolve/ui-kit                            | ^1.0.0             |

## Testing

| Concern           | Library                | Version |
| ----------------- | ---------------------- | ------- |
| Runner            | Vitest                 | 4.x     |
| Environment       | jsdom                  | —       |
| Component Testing | @testing-library/react | —       |
| Property-Based    | fast-check             | —       |

- Tests live in `src/__tests__/`. Global setup is in `src/vitest.setup.ts`.
- Property-based tests use the `.property.test.tsx` suffix and run a minimum of 100 iterations per property.

## Common Commands

```bash
npm run dev            # Start Vite dev server
npm run build          # TypeScript check + Vite production build
npm test               # Run tests (single pass, --passWithNoTests)
npm run test:coverage  # Tests with coverage
npm run lint           # ESLint
```

## Environment Variables

| Variable                 | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `VITE_API_URL`           | API base URL (default: `https://api-dev.perfxcel.com/api/v1`) |
| `VITE_SUPABASE_URL`      | Supabase project URL                                          |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key                                             |

## Project Structure

```
src/
├── api.ts              # Axios instance + all API functions
├── App.tsx             # Route definitions (BrowserRouter via main.tsx)
├── main.tsx            # Entry point; wraps app in BrowserRouter
├── index.css           # Global styles + UI Kit imports
├── components/         # Shared UI components (Navbar, Footer, CourseCard, etc.)
├── hooks/              # Domain-scoped data-fetching hooks (useCourses, useTaxonomies)
├── pages/              # One file per route (thin — delegate to hooks and components)
├── types/              # Shared TypeScript types (course.ts, index.ts)
└── __tests__/          # Vitest tests
```

## Key Coding Conventions

### TypeScript

- Strict mode is enabled. All code must type-check cleanly. No `any` without an explicit justification comment.
- Shared types live in `src/types/`. Use `interface` for object shapes and `type` for unions/aliases.

### Styling

- Tailwind CSS v4 is loaded as a Vite plugin (`@tailwindcss/vite`). **There is no `tailwind.config.js`.**
- Apply utility classes directly in JSX. Do not use inline `style` props for layout or spacing.

### UI Kit

- Use `@dotevolve/ui-kit` for all standard UI components (e.g. `Alert`, `Modal`, `Table`, `Badge`, `Toggle`).
- Do not re-implement components that already exist in the UI Kit.
- The UI Kit styles are imported in `src/index.css`.

### API Calls

- All HTTP functions live in `src/api.ts`. The `api` Axios instance is created there with `VITE_API_URL` as the base URL.
- **Never instantiate Axios directly in components or hooks.** Import named functions from `src/api.ts` instead (e.g. `getCourses`, `getCourse`, `getTaxonomies`).
- Forms that require bot protection must pass a Cloudflare Turnstile token as `turnstileToken` in the request body (see `submitCourseInterest`, `verifyCertificate`, `submitContact`).

### Data Fetching

- All data-fetching and async state logic belong in domain-scoped hooks in `src/hooks/` (e.g. `useCourses`, `useTaxonomies`).
- Hooks call functions from `src/api.ts` — never call `api` directly from a component or page.
- Components and pages call hooks to get data; they do not call API functions directly.

### Routing

- Uses `BrowserRouter` (standard history-based routing). All route definitions live exclusively in `App.tsx`.
- This is a public-facing app with no authentication guards. All routes are publicly accessible.
- `App.tsx` composes `<Navbar />`, `<Routes>`, and `<Footer />` — keep this shell thin.

### Pages and Components

- Pages map 1:1 to routes and must stay thin — delegate data-fetching to hooks and rendering to components.
- Components live in `src/components/`. Keep them focused and reusable.
- Never put API calls or business logic directly in page or component files.

### Error Tracking

- Sentry is configured via `@dotevolve/error-utils` and source maps are uploaded via `@sentry/vite-plugin` in `vite.config.ts`.
- Never configure Sentry directly — always go through `@dotevolve/error-utils`.

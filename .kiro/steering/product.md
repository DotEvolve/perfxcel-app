---
inclusion: always
---

# Product: Perfxcel LMS Frontend

Main tenant-facing SPA for the Perfxcel LMS compliance workflow platform. Tenants use it to run compliance workflows, generate documents from templates, and manage their company profile.

## Core Capabilities

- **Workflow Management**: Browse platform workflows and manage custom tenant workflows (`/workflows`, `/workflows/manage`, `/workflows/:id`)
- **Document Generation**: Generate PDF documents from templates; manage custom document templates (`/documents`, `/documents/:id`, `/documents/manage`)
- **Document Inbox**: Receive and review incoming documents (`/inbox`)
- **Vault**: Secure document storage (`/vault`)
- **Company Profile**: Manage tenant company details (`/profile`)
- **MCA Mocks**: MCA form mock pages for integration testing (`/mca-mocks/*`)
- **Dashboard**: Tenant-specific overview of activity and status (`/`)

## Users

- Tenant organizations (companies using the Perfxcel LMS platform)
- End users within those tenant organizations

## Route Table

All routes are defined exclusively in `App.tsx` using `HashRouter`.

| Path | Component | Auth |
|---|---|---|
| `/login` | `Login` | Public |
| `/signup` | `Signup` | Public |
| `/reset-password` | `ResetPasswordPage` | Public |
| `/privacy-policy` | `PrivacyPolicy` | Public |
| `/` | `Dashboard` | Protected |
| `/workflows` | `Workflows` | Protected |
| `/workflows/manage` | `CustomWorkflows` | Protected |
| `/workflows/:id` | `WorkflowDetail` | Protected |
| `/documents` | `Documents` | Protected |
| `/documents/manage` | `CustomDocumentTemplates` | Protected |
| `/documents/:id` | `DocumentGenerator` | Protected |
| `/inbox` | `DocumentInbox` | Protected |
| `/vault` | `Vault` | Protected |
| `/profile` | `CompanyProfile` | Protected |
| `/mca-mocks` | `McaMocksIndex` | Protected |
| `/mca-mocks/aoc-4` | `AOC4Mock` | Protected |
| `/mca-mocks/mgt-7` | `MGT7Mock` | Protected |
| `/mca-mocks/mgt-15` | `MGT15Mock` | Protected |

## Auth

- Auth state is managed in `App.tsx` via `supabase.auth.getSession()` and `onAuthStateChange`.
- `AuthGuard` wraps all protected routes inside a `<Layout />` outlet. Unauthenticated users are redirected to `/login`.
- The Supabase client singleton lives in `src/lib/supabase.ts`. Never instantiate a new client inline.
- On auth state changes, the app broadcasts a `GOVNIX_AUTH_SYNC` message via `window.postMessage` — this syncs the session with the `perfxcel-mca-extension` Chrome extension. Do not remove this broadcast.
- Sentry user context is set/cleared on every auth state change via `Sentry.setUser(...)`.

## API Calls

- All HTTP requests go through the `api` Axios instance from `src/lib/api.ts`. Never call `axios` directly in components or hooks.
- The `api` instance base URL is `VITE_GOVNIX_API_URL` (default: `https://api.perfxcel.net`).
- A request interceptor automatically attaches `Authorization: Bearer <token>` from the active Supabase session and adds a Sentry breadcrumb.
- A response interceptor extracts `x-correlation-id` from response headers and tags it in Sentry.
- Data-fetching and business logic belong in domain-scoped hooks in `src/hooks/`. Components call hooks — never call `api` directly from a component or page.

## Key Conventions for AI Assistants

- **All routes in `App.tsx` only.** Never define routes inside page or component files.
- **Public routes** (`/login`, `/signup`, `/reset-password`, `/privacy-policy`) sit outside `AuthGuard`. All other routes are wrapped in `AuthGuard → Layout`.
- **Never bypass `AuthGuard`** for protected routes.
- **Never call `axios` directly** — always use the `api` instance from `src/lib/api.ts`.
- **Never instantiate Supabase inline** — use the singleton from `src/lib/supabase.ts`.
- **Components stay thin** — delegate data-fetching and business logic to hooks in `src/hooks/`.
- **Error handling via `@dotevolve/error-utils`** — never configure Sentry directly.
- **Styling via Tailwind CSS 4.x** — no `tailwind.config.js`. Apply utility classes directly in JSX; never use inline `style` props for layout.
- **TypeScript strict mode** — no `any` without an explicit justification comment. Shared types live in `src/types/`.
- **Tests in `src/__tests__/`** — use Vitest with `@testing-library/react`. Property-based tests use `fast-check` and the `.property.test.tsx` suffix.

## Deployment

- Frontend: Cloudflare Pages
- Backend proxy: OCI (via `server.js` Express proxy)
- API Gateway: `VITE_GOVNIX_API_URL` → `https://api.perfxcel.net`

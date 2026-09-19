# Tasks — Perfxcel Public Website Redesign

## Phase 0 — Foundations

- [x] **Task 0.1** — Add Google Fonts CDN links for `Outfit` to `index.html`. Update `<title>` to "Perfxcel — Professional Excellence Training".

- [x] **Task 0.2** — Extend `src/index.css` `@theme` block with missing color tokens (`secondary-200`, `secondary-500`, `secondary-600`, `secondary-700`, `accent-400`, `accent-500`). Add `fade-in-up`, `mega-menu-enter` utility classes and `section-heading` reusable class.

- [x] **Task 0.3** — Create `src/types/course.ts` with the canonical `Course`, `TaxonomyItem`, `TaxonomyCollection`, and `CourseFilters` interfaces. Update `src/api.ts` to import and re-export `Course` and `TaxonomyItem` from `src/types/course.ts` to eliminate the duplication between `src/api.ts` and `src/types/index.ts`.

---

## Phase 1 — Hooks

- [x] **Task 1.1** — Create `src/hooks/useTaxonomies.ts` — fetches `getTaxonomies()` once on mount, returns `{ taxonomies, loading, error }`. Uses `TaxonomyCollection` from `src/types/course.ts`.

- [x] **Task 1.2** — Create `src/hooks/useCourses.ts` — accepts `CourseFilters`, fetches `getCourses(filters)` and re-runs when filter values change. Returns `{ courses, loading, error }`.

---

## Phase 2 — Shared Components

- [x] **Task 2.1** — Create `src/components/Footer.tsx`. 4-column footer (brand, quick links, delivery types, contact). Social icons (LinkedIn, Twitter, YouTube via `lucide-react`). Imported in `App.tsx`, replacing the old inline `<footer>`.

- [x] **Task 2.2** — Create `src/components/CourseCard.tsx`. Extracted from `App.tsx` and enhanced with: gradient top-accent bar, `Clock` duration placeholder, delivery type badge, `Register Interest` micro-CTA, and `group` hover arrow animation.

- [x] **Task 2.3** — Create `src/components/RegisterInterestModal.tsx`. Modal extracted from `CourseDetail`. Props: `course: Course`, `onClose: () => void`. Turnstile captcha intact.

- [x] **Task 2.4** — Create `src/components/Navbar.tsx`. Sticky glass-panel nav, mega menu (4 columns: Category, Location, Association, Delivery Type), skeleton loading states, hover-delay close logic, `Escape` key close, mobile hamburger drawer with category sub-links, "Browse All Courses →" CTA button. Imported in `App.tsx`, replacing the old inline `<nav>`.

---

## Phase 3 — Pages

- [x] **Task 3.1** — Create `src/pages/Home.tsx`. Hero (dark gradient, dot pattern, headline, stats row, dual CTAs), Featured Categories grid (`useTaxonomies`, icon mapping, links to `/courses?category=<id>`), "Our Promise" 3-card section, Testimonials dark section (6 static cards, 5-star display), Corporate CTA fuchsia gradient band.

- [x] **Task 3.2** — Create `src/pages/Catalog.tsx`. URL-synced filters via `useSearchParams`. All 4 filters: Category, Location, Association, Delivery Type. Active filter chips with `×` remove buttons. "Clear All Filters" link. Result count bar + sort placeholder. Uses `useTaxonomies`, `useCourses`, `CourseCard`. Route: `/courses`.

- [x] **Task 3.3** — Create `src/pages/CourseDetail.tsx`. Breadcrumb (`Home > Courses > Title`). 2/3 + 1/3 split layout. Left: badges, title, description, Objectives card, Target Audience card, Upcoming Schedules placeholder table. Right: sticky enrol card with price placeholder, duration, delivery, "Register Interest" button. Uses `RegisterInterestModal`. Route: `/courses/:id`.

- [x] **Task 3.4** — Create `src/pages/About.tsx`. Hero banner, Our Story (2-col with stats panel), Mission & Vision (2-card), Our Numbers (4-stat grid), Leadership Team (4-card avatar grid), Accreditations (6 partner badges), CTA Banner.

---

## Phase 4 — App.tsx Refactor

- [x] **Task 4.1** — Refactor `src/App.tsx`. Removed all inline components (`<nav>`, `<footer>`, `Catalog`, `CourseCard`, `CourseDetail`). Now imports `Navbar`, `Footer`, `Home`, `Catalog`, `CourseDetail`, `About`. Routes: `/` → Home, `/courses` → Catalog, `/courses/:id` → CourseDetail, `/about` → About.

---

## Phase 5 — Verification & Cleanup

- [x] **Task 5.1** — Run `npm run build` — zero TypeScript errors, zero build errors. Bundle: 346 kB JS / 41 kB CSS.

- [x] **Task 5.2** — Fixed `CourseDetail.tsx`: replaced inline `UsersIcon` SVG component with proper `Users` import from `lucide-react`. Confirmed clean build after fix.

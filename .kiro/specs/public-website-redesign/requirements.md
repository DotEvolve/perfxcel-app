# Requirements — Perfxcel Public Website Redesign

## Overview

Redesign the `perfxcel-app` public-facing frontend as a premium, Leoron-inspired corporate training website. The redesign elevates visual quality, adds a Mega Menu navigation bar, enriches the homepage with marketing-grade sections, adds an About page, and wires existing catalog functionality to navigate via deep-links from the Mega Menu.

The app remains fully public (no auth), built with React 19, Tailwind CSS v4, and React Router DOM v7 (`BrowserRouter`).

---

## Functional Requirements

### FR-1 — Navigation Bar with Mega Menu

**FR-1.1** The navbar must be extracted into `src/components/Navbar.tsx` and imported by `App.tsx`. The inline `<nav>` block inside `App()` must be removed.

**FR-1.2** The navbar must be sticky (`position: sticky; top: 0`) with a `z-50` stack level and a glass-morphism (`glass-panel`) background.

**FR-1.3** The left side of the navbar must display the Perfxcel logo (`/logo.png`) and the "Perfxcel**LMS**" wordmark.

**FR-1.4** The navbar must include the following top-level links:
- **Home** — navigates to `/`
- **Courses** — triggers the Mega Menu dropdown on hover/focus
- **About** — navigates to `/about`
- **Contact Us** — smooth-scrolls to the `#contact` section on the homepage, or navigates to `/contact` if user is on another page

**FR-1.5** The "Courses" link must open a full-width (or constrained-width) Mega Menu panel on hover. The Mega Menu must render below the navbar with a smooth opacity + translate-y CSS transition (`duration-200`).

**FR-1.6** The Mega Menu must have a 4-column grid layout:

| Column | Title | Data Source |
|--------|-------|-------------|
| 1 | By Category | `taxonomies.categories` (from `getTaxonomies()`) |
| 2 | By Location | `taxonomies.cities` (from `getTaxonomies()`) |
| 3 | By Association | `taxonomies.associations` (from `getTaxonomies()`) |
| 4 | By Delivery Type | Static list (see FR-1.7) |

**FR-1.7** The "By Delivery Type" column must contain these static items:
1. Online (virtual, self-paced)
2. In-Person Classroom
3. Corporate / In-House
4. Blended Learning

**FR-1.8** Each item in the Mega Menu (dynamic or static) must be a `<Link>` that navigates to the Catalog page (`/`) with the appropriate query parameter pre-applied:
- Category item → `/?category=<id>`
- Location item → `/?location=<id>`
- Association item → `/?association=<id>`
- Delivery type item → `/?delivery=<slug>` (e.g., `online`, `in-person`, `corporate`, `blended`)

**FR-1.9** `Navbar` must call `getTaxonomies()` on mount. While loading, Mega Menu columns 1–3 show skeleton placeholders (3 lines each). On error, those columns show a short error state.

**FR-1.10** The Mega Menu must close when the user:
- Moves the mouse out of both the nav link and the dropdown panel
- Presses the `Escape` key
- Clicks any link inside the menu

**FR-1.11** The navbar must include a prominent "Browse All Courses →" CTA button in the top-right corner that navigates to `/`.

---

### FR-2 — Catalog Page Query-Parameter Filtering

**FR-2.1** The `Catalog` component (currently inline in `App.tsx`, to be moved to `src/pages/Catalog.tsx`) must read URL query parameters on mount and use them to initialise filter state:
- `?category=<id>` → sets `categoryFilter`
- `?location=<id>` → sets `cityFilter`
- `?association=<id>` → sets `associationFilter`
- `?delivery=<slug>` → sets `deliveryFilter` (new filter, used for future API support)

**FR-2.2** The sidebar filters must reflect the active query-parameter values on initial render (i.e., if a user lands on `/?location=xyz`, the Location dropdown must default to `xyz`).

**FR-2.3** When the user changes a filter dropdown, the URL must be updated via `useNavigate` + `URLSearchParams` to keep the URL in sync with state (enables shareable filter links).

**FR-2.4** A "Clear All Filters" link must appear in the sidebar when any filter is active. Clicking it navigates to `/` with no query parameters.

**FR-2.5** The Catalog page must add an "Association" filter dropdown to the sidebar (currently only Category and Location exist), powered by `taxonomies.associations`.

---

### FR-3 — Homepage Sections

The homepage (`/`) renders the `Catalog` component below the fold. A new marketing hero and supporting sections must be added **above** the catalog grid on the same route, or the homepage should become a distinct `HomePage` component that includes marketing sections followed by a featured course section. 

**Decision:** The homepage (`/`) will be a new `Home` page component (`src/pages/Home.tsx`). The Catalog will move to `/courses`. The homepage will feature marketing sections, with a "Browse All Courses" CTA linking to `/courses`.

**FR-3.1 — Hero Section**  
- Full-width hero with a dark gradient overlay on a background image or abstract geometric SVG pattern.
- Large headline: *"Elevate Your Professional Excellence"*
- Subheading: *"Over 1,200+ accredited training programs across the MENA & EMEA region"*
- Two CTAs: "Browse Courses →" (primary gradient button → `/courses`) and "About Us" (outlined → `/about`)
- Animated stat counter row below CTAs: `1,200+` Programs | `50,000+` Professionals Trained | `30+` Countries | `200+` Expert Trainers

**FR-3.2 — Featured Categories Section**  
- Section heading: "Explore by Discipline"
- Horizontal scrollable or 4-column grid of category cards, dynamically populated from `getTaxonomies().categories` (max 8).
- Each card: icon (from a fixed icon map), category name, short description (placeholder text), and a link to `/courses?category=<id>`.

**FR-3.3 — Why Perfxcel Section ("Our Promise")**  
- 3-column card layout with icons:
  1. **Accredited Excellence** — Courses validated by globally recognised bodies
  2. **World-Class Instructors** — Faculty drawn from senior industry practitioners
  3. **Flexible Delivery** — Online, classroom, and corporate in-house options
- Premium glass-panel cards with subtle gradient accent on hover.

**FR-3.4 — Testimonials Section**  
- Section heading: "Trusted by Leading Organisations"
- Horizontal scrollable carousel (or static 3-column grid) of 6 placeholder testimonials.
- Each testimonial card: quote text, author name, company, and company logo placeholder (gradient initials badge).
- 5-star rating display on each card.

**FR-3.5 — Corporate Training CTA Band**  
- Full-width dark-background (secondary-900) band between sections.
- Headline: *"Transform Your Team's Performance"*
- Subheading: *"Bespoke corporate training programs designed for your organisation's unique challenges."*
- CTA button: "Request a Proposal →" (opens the interest modal or navigates to a future `/contact` page).

**FR-3.6 — Footer**  
The existing minimal footer must be expanded into a 4-column footer:
- Column 1: Logo + short brand description + social icons (LinkedIn, Twitter/X, YouTube)
- Column 2: Quick Links (Home, Courses, About, Contact)
- Column 3: Delivery Types (Online, In-Person, Corporate, Blended)
- Column 4: Contact info (placeholder address, email, phone)
- Bottom bar: copyright text + links to Privacy Policy, Terms

---

### FR-4 — About Page

**FR-4.1** A new `About` page (`src/pages/About.tsx`) must be created and registered at `/about` in `App.tsx`.

**FR-4.2** The About page must include the following sections, with high-quality placeholder content:

- **Hero Banner** — Full-width heading banner: *"About Perfxcel"*, subheading copy about the organisation.
- **Our Story** — Two-column layout: left is narrative copy (~3 paragraphs), right is a gradient accent visual / stats panel (Founded: 2008, Headquartered: Dubai, UAE, Training Days per Year: 3,000+).
- **Mission & Vision** — Two-card layout: Mission card + Vision card with distinct icon accents.
- **Our Numbers** — 4-stat counter grid (same style as hero stats).
- **Leadership Team** — 4-card grid with placeholder names, titles, and gradient avatar placeholders.
- **Accreditations & Partnerships** — Logo placeholder row (6 partner badges with initials).
- **CTA Banner** — "Ready to invest in your future?" with a "Browse Courses" button.

---

### FR-5 — Catalog Page Enhancements (moved to `/courses`)

**FR-5.1** The Catalog component must be moved to `src/pages/Catalog.tsx` and routed to `/courses`.

**FR-5.2** The catalog hero area (currently just an `<h1>`) must be upgraded to include:
- A full-width category banner / hero heading section
- Active filter chips below the heading showing current filters with `×` remove buttons

**FR-5.3** The course card must be upgraded to include:
- A gradient top-accent bar in the card's primary color
- Duration placeholder (e.g., "5 Days")
- Delivery type badge (Online / Classroom)
- A clearer "Register Interest" micro-CTA below the card footer

**FR-5.4** The sort/results count bar above the grid must show "X courses found" and a sort dropdown (placeholder, no backend integration required in this spec).

---

### FR-6 — Course Detail Page Enhancements

**FR-6.1** The `CourseDetail` component must be moved to `src/pages/CourseDetail.tsx`.

**FR-6.2** The breadcrumb at the top must be a proper breadcrumb: `Home > Courses > [Course Title]`.

**FR-6.3** A sidebar layout must be introduced for the detail page:
- **Left (2/3 width):** Title, badges, description, objectives, target audience, and a placeholder "Schedule" table.
- **Right (1/3 width):** A sticky "Enrol Now" card with price placeholder, delivery method, location, and the "Register Interest" button.

---

## Non-Functional Requirements

**NFR-1** All new components follow the existing file structure: pages in `src/pages/`, reusable components in `src/components/`, no inline business logic in pages.

**NFR-2** All API calls remain in `src/api.ts`. New hooks go in `src/hooks/` (to be created). The Catalog page must use a `useTaxonomies` hook and a `useCourses` hook rather than raw `useEffect` + direct API calls.

**NFR-3** TypeScript strict mode must be maintained. No `any` without justification. All new interfaces go in `src/types/`.

**NFR-4** Tailwind CSS v4 only — no `tailwind.config.js`. All new design tokens (if any) added to the `@theme` block in `src/index.css`.

**NFR-5** The app must use `BrowserRouter` (already set in `main.tsx`). Do not switch to `HashRouter`.

**NFR-6** All pages must be responsive (mobile, tablet, desktop). The Mega Menu must collapse into a hamburger drawer on mobile (`< md` breakpoint).

**NFR-7** Animations must use CSS transitions only (Tailwind `transition`, `duration-*`, `ease-*`). No additional animation libraries.

**NFR-8** The `Outfit` font must be loaded via Google Fonts CDN in `index.html`. Currently it is referenced in CSS but not loaded.

**NFR-9** `index.html` `<title>` must be updated to "Perfxcel — Professional Excellence Training".

**NFR-10** The Turnstile captcha in the Register Interest modal must remain functional.

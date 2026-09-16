# Design — Perfxcel Public Website Redesign

## Architecture Overview

The redesign restructures `perfxcel-app` from a single-file monolith into a proper component hierarchy, while preserving the existing API layer and design language. No new runtime dependencies are introduced.

```
src/
├── App.tsx                         # Root shell — routes only, imports Navbar/Footer
├── api.ts                          # Unchanged — existing API client + types
├── index.css                       # Tailwind base + extended @theme tokens + new utilities
├── main.tsx                        # Unchanged — BrowserRouter entry
│
├── types/
│   ├── index.ts                    # Existing Role/Permission (unchanged)
│   └── course.ts                   # NEW: Course, TaxonomyItem, TaxonomyCollection interfaces
│
├── hooks/
│   ├── useTaxonomies.ts            # NEW: fetches & caches getTaxonomies()
│   └── useCourses.ts               # NEW: fetches getCourses(filters)
│
├── components/
│   ├── Navbar.tsx                  # NEW: sticky navbar + mega menu
│   ├── Footer.tsx                  # NEW: 4-column premium footer
│   ├── CourseCard.tsx              # NEW: extracted + enhanced course card
│   └── RegisterInterestModal.tsx   # NEW: extracted interest form + Turnstile
│
└── pages/
    ├── Home.tsx                    # NEW: homepage with hero + marketing sections
    ├── Catalog.tsx                 # NEW: moved + enhanced catalog (/courses)
    ├── CourseDetail.tsx            # NEW: moved + enhanced course detail (/courses/:id)
    └── About.tsx                   # NEW: about page (/about)
```

---

## Design System

### Color Palette (extending existing `@theme` in `index.css`)

The existing fuchsia primary palette is retained. New tokens are added for richer supporting colors.

```css
@theme {
  /* Existing — unchanged */
  --color-primary-50:  #fdf4ff;
  --color-primary-100: #fae8ff;
  --color-primary-500: #d946ef;
  --color-primary-600: #c026d3;
  --color-primary-700: #a21caf;

  --color-secondary-50:  #f8fafc;
  --color-secondary-100: #f1f5f9;
  --color-secondary-800: #1e293b;
  --color-secondary-900: #0f172a;

  /* New — fill gaps used in App.tsx but not defined */
  --color-secondary-200: #e2e8f0;
  --color-secondary-500: #64748b;
  --color-secondary-600: #475569;
  --color-secondary-700: #334155;

  /* New — accent gold for premium feel */
  --color-accent-400: #fbbf24;
  --color-accent-500: #f59e0b;
}
```

### Typography

**Load in `index.html`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

**Scale:**
- Hero headline: `text-5xl md:text-7xl font-extrabold` (Outfit 900)
- Section heading: `text-3xl md:text-4xl font-bold` (Outfit 700)
- Card title: `text-xl font-bold` (Outfit 700)
- Body: `text-base` (Outfit 400)
- Caption/label: `text-sm font-medium` (Outfit 500)

### Motion

All animations are CSS transitions via Tailwind utilities. No JS animation libraries.

```css
/* New utility classes in index.css */
.fade-in-up {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

.mega-menu-enter {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.mega-menu-enter.open {
  opacity: 1;
  transform: translateY(0);
}
```

---

## Component Designs

### `Navbar.tsx`

**Structure:**
```
<nav> (glass-panel, sticky, z-50, h-20)
  <div> (max-w-7xl, mx-auto, flex, items-center, justify-between)
    <!-- Logo -->
    <Link to="/"> logo + wordmark </Link>

    <!-- Desktop Nav Links (hidden on mobile) -->
    <ul class="hidden md:flex items-center gap-8">
      <li><Link to="/">Home</Link></li>
      <li class="relative" onMouseEnter={open} onMouseLeave={close}>
        <button>Courses <ChevronDown /></button>
        <!-- Mega Menu Panel (conditionally rendered) -->
        <MegaMenu taxonomies={...} isOpen={isOpen} onClose={close} />
      </li>
      <li><Link to="/about">About</Link></li>
    </ul>

    <!-- CTA + Mobile hamburger -->
    <div class="flex items-center gap-4">
      <Link to="/courses"> Browse All Courses → </Link> <!-- desktop only -->
      <button class="md:hidden"> <Menu /> </button>      <!-- mobile only -->
    </div>
  </div>

  <!-- Mobile Drawer (full-height slide-in, md:hidden) -->
  <MobileDrawer isOpen={mobileOpen} onClose={...} />
</nav>
```

**MegaMenu Panel:**
- Positioned `absolute`, `top-full`, left-aligned to navbar container
- Width: `max-w-5xl` or full container width, `shadow-2xl`, `rounded-2xl`, `glass-panel` background
- 4-column CSS Grid (`grid-cols-4 gap-8`)
- Each column:
  - Column header: bold label + colored underline accent (primary-600)
  - Items: list of `<Link>` elements with hover state (fuchsia text, slight left-pad transition)
  - Loading state: 3 skeleton lines per column (`animate-pulse bg-secondary-100 rounded`)
- "View All Courses →" footer link spanning full width at bottom of panel

**State management:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [taxonomies, setTaxonomies] = useState<TaxonomyCollection | null>(null);
const [taxonomiesLoading, setTaxonomiesLoading] = useState(true);
const closeTimer = useRef<ReturnType<typeof setTimeout>>(null);

// Hover delay: open immediately, close with 150ms delay to allow cursor movement
const handleMouseEnter = () => { clearTimeout(closeTimer.current); setIsOpen(true); };
const handleMouseLeave = () => { closeTimer.current = setTimeout(() => setIsOpen(false), 150); };
```

---

### `Home.tsx` — Section-by-Section Design

#### Hero Section

```
<section class="relative min-h-[85vh] flex items-center overflow-hidden bg-secondary-900">
  <!-- Gradient background (no external image dependency) -->
  <div class="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 opacity-95" />
  <!-- Abstract geometric decoration -->
  <div class="absolute inset-0 [background-image:radial-gradient(...)]" /> <!-- subtle dot pattern -->
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 text-white">
    <span class="badge"> ✦ 25+ Years of Professional Excellence </span>
    <h1 class="text-5xl md:text-7xl font-extrabold ...">
      Elevate Your<br/>
      <span class="text-primary-400">Professional</span> Excellence
    </h1>
    <p class="text-xl text-secondary-300 max-w-2xl mt-6">
      Over 1,200+ accredited training programs across the MENA & EMEA region, 
      delivered by world-class practitioners.
    </p>
    
    <!-- CTAs -->
    <div class="flex gap-4 mt-10">
      <Link to="/courses" class="btn-primary-lg"> Browse Courses → </Link>
      <Link to="/about"   class="btn-outline-lg"> About Us </Link>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-8 border-t border-white/10">
      <Stat value="1,200+" label="Training Programs" />
      <Stat value="50,000+" label="Professionals Trained" />
      <Stat value="30+" label="Countries Reached" />
      <Stat value="200+" label="Expert Trainers" />
    </div>
  </div>
</section>
```

#### Featured Categories Section

```
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4">
    <SectionHeading eyebrow="Explore by Discipline" title="Find Your Next Certification" />
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
      {categories.slice(0, 8).map(cat => <CategoryCard key={cat.id} category={cat} />)}
    </div>
  </div>
</section>
```

**CategoryCard:**
- Square-ish card (`aspect-square md:aspect-auto p-8`)
- Top: large colored icon (from a `CATEGORY_ICONS` map with `lucide-react` icons)
- Category name (`text-lg font-bold`)
- Short placeholder description (`text-sm text-secondary-500`)
- On hover: card lifts, icon color transitions to primary-600
- Link wraps entire card → `/courses?category=<id>`

#### Why Perfxcel ("Our Promise") Section

```
<section class="py-20 bg-secondary-50">
  <div class="max-w-7xl mx-auto px-4">
    <SectionHeading eyebrow="Why Choose Us" title="Our Promise to You" />
    
    <div class="grid md:grid-cols-3 gap-8 mt-12">
      <PromiseCard icon={Award} title="Accredited Excellence" ... />
      <PromiseCard icon={Users} title="World-Class Instructors" ... />
      <PromiseCard icon={Globe} title="Flexible Delivery" ... />
    </div>
  </div>
</section>
```

**PromiseCard:** `glass-panel rounded-2xl p-8`. Icon in a 56×56 fuchsia gradient circle. Title bold. Description text-secondary-600. Bottom: a thin primary-100 to primary-50 gradient border-top accent.

#### Testimonials Section

```
<section class="py-20 bg-secondary-900 text-white overflow-hidden">
  <div class="max-w-7xl mx-auto px-4">
    <SectionHeading eyebrow="Client Stories" title="Trusted by Leading Organisations" light />
    
    <!-- 3-col grid or scroll carousel -->
    <div class="grid md:grid-cols-3 gap-6 mt-12">
      {TESTIMONIALS.map(t => <TestimonialCard key={t.id} testimonial={t} />)}
    </div>
  </div>
</section>
```

**TestimonialCard:** Dark glass-panel (`bg-white/5 border border-white/10`). 5 star icons. Quote text in `text-secondary-200`. Author name bold white, company name in `text-primary-400`.

**Static testimonials data** (6 items, placeholder copy with realistic MENA company names).

#### Corporate Training CTA Band

```
<section class="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
  <div class="max-w-4xl mx-auto px-4 text-center">
    <h2 class="text-4xl font-extrabold"> Transform Your Team's Performance </h2>
    <p class="text-xl text-primary-100 mt-4 max-w-2xl mx-auto"> ... </p>
    <button class="mt-8 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl shadow-xl">
      Request a Proposal →
    </button>
  </div>
</section>
```

---

### `Footer.tsx`

```
<footer class="bg-secondary-900 text-secondary-300">
  <div class="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
    <!-- Col 1: Brand -->
    <div>
      <img src="/logo.png" ... />
      <p> Empowering professionals across the EMEA region... </p>
      <div class="flex gap-4 mt-6"> <!-- social icons --> </div>
    </div>

    <!-- Col 2: Quick Links -->
    <div>
      <h4>Quick Links</h4>
      <ul> Home, All Courses, About Us, Contact Us </ul>
    </div>

    <!-- Col 3: Training Delivery -->
    <div>
      <h4>Training Delivery</h4>
      <ul> Online, In-Person Classroom, Corporate / In-House, Blended Learning </ul>
    </div>

    <!-- Col 4: Contact -->
    <div>
      <h4>Get in Touch</h4>
      <address> Dubai, United Arab Emirates<br/>info@perfxcel.com<br/>+971 4 123 4567 </address>
    </div>
  </div>

  <div class="border-t border-white/10 py-6 max-w-7xl mx-auto px-4 flex justify-between">
    <p> © 2026 Perfxcel LMS by DotEvolve. All rights reserved. </p>
    <div class="flex gap-6"> Privacy Policy | Terms of Service </div>
  </div>
</footer>
```

---

### `Catalog.tsx` (moved from `App.tsx`, route: `/courses`)

**URL-synced filter state:**
```typescript
const [searchParams, setSearchParams] = useSearchParams();
const categoryFilter    = searchParams.get("category")    ?? "";
const cityFilter        = searchParams.get("location")    ?? "";
const associationFilter = searchParams.get("association") ?? "";
const deliveryFilter    = searchParams.get("delivery")    ?? "";

const updateFilter = (key: string, value: string) => {
  const next = new URLSearchParams(searchParams);
  if (value) next.set(key, value); else next.delete(key);
  setSearchParams(next, { replace: true });
};
```

**Layout:**
- Catalog-specific hero band: dark bg, "All Training Courses" heading, breadcrumb `Home > Courses`
- Active filter chips: horizontal row with `×` buttons to remove individual filters
- Sidebar (300px) + main grid (flex-1)
- Sidebar: Category, Location, Association dropdowns + "Clear Filters" link
- Main: "X courses found" result count + sort dropdown (UI only) + 2-col course card grid

---

### `CourseCard.tsx` (extracted + enhanced)

```typescript
interface CourseCardProps {
  course: Course;
}
```

**Visual design:**
```
<div class="glass-panel rounded-2xl overflow-hidden hover-lift cursor-pointer flex flex-col">
  <!-- Gradient accent bar -->
  <div class="h-1.5 bg-gradient-to-r from-primary-500 to-primary-700" />
  
  <div class="p-6 flex flex-col flex-1">
    <!-- Badges row -->
    <div class="flex flex-wrap gap-2 mb-3">
      {category badge} {association badge} {delivery badge}
    </div>
    
    <!-- Title -->
    <h3 class="text-xl font-bold text-secondary-900 mb-2 leading-tight"> {title} </h3>
    
    <!-- Description -->
    <p class="text-secondary-600 line-clamp-2 text-sm flex-1"> {description} </p>
    
    <!-- Footer: location + duration + CTA -->
    <div class="mt-6 pt-4 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 text-sm text-secondary-500">
          <span><MapPin /> {city || "Online"}</span>
          <span><Clock /> 5 Days</span>  <!-- placeholder duration -->
        </div>
        <div class="text-primary-600 font-semibold text-sm flex items-center gap-1">
          View Details <ArrowRight class="group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  </div>
</div>
```

---

### `CourseDetail.tsx` (moved + redesigned)

**Layout:** 2-column sidebar layout (`grid grid-cols-1 lg:grid-cols-3 gap-8`)

**Left column (`lg:col-span-2`):**
- Breadcrumb: `Home > Courses > [Title]`
- Badges row (category, city, association)
- Large title (`text-4xl font-extrabold`)
- Description prose block
- "Course Objectives" card
- "Target Audience" card
- Placeholder "Upcoming Schedules" table (3 rows of placeholder data)

**Right column (`lg:col-span-1`):**
- Sticky "Enrol Now" card (`position: sticky; top: 6rem`)
  - Price placeholder: "Contact for pricing"
  - Delivery method badge
  - Location
  - Duration placeholder
  - "Register Interest" CTA button (opens modal)
  - "Have questions?" contact link

**Breadcrumb component:** `Home > Courses > Course Title` with `>` separators.

---

### `RegisterInterestModal.tsx` (extracted)

Extracted verbatim from current `App.tsx`. Props:
```typescript
interface RegisterInterestModalProps {
  course: Course;
  onClose: () => void;
}
```

Internals remain identical to the existing inline modal — no API or Turnstile changes.

---

### `About.tsx`

**Sections:**
1. **Hero Banner** — `bg-gradient-to-br from-secondary-900 to-primary-900`, white text, "About Perfxcel" h1, 2-line subheading.
2. **Our Story** — `grid md:grid-cols-2 gap-16`, left: 3 paragraphs, right: stats panel (Founded, HQ, Annual Programs).
3. **Mission & Vision** — `grid md:grid-cols-2 gap-8`, two `glass-panel` cards: each with a large icon, title (`Mission` / `Vision`), and 2-sentence description.
4. **Our Numbers** — `grid grid-cols-2 md:grid-cols-4 gap-8` stat blocks with large bold number + label.
5. **Leadership Team** — `grid grid-cols-2 md:grid-cols-4 gap-6`, each card: gradient circle avatar (initials), name, title.
6. **Accreditations** — horizontal `flex flex-wrap gap-6` of 6 partner badges (colored gradient pill with initials + name).
7. **CTA Banner** — fuchsia gradient, white text, "Browse Courses →" button.

---

## Route Table (final)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` | Marketing homepage |
| `/courses` | `Catalog` | Course catalog with filters |
| `/courses/:id` | `CourseDetail` | Individual course page |
| `/about` | `About` | About page |

**`App.tsx` after refactor:**
```tsx
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/courses"    element={<Catalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/about"      element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
```

---

## Data Flow

```
getTaxonomies()
  ↓ useTaxonomies hook (caches in component state, fetched once)
  ↓ shared by: Navbar (mega menu), Catalog (filter dropdowns), Home (categories section)

getCourses(filters)
  ↓ useCourses hook (re-runs when filters change)
  ↓ used by: Catalog page

getCourse(id)
  ↓ inline useEffect in CourseDetail (single call per mount)
  ↓ used by: CourseDetail page
```

**`useTaxonomies` hook:**
```typescript
export function useTaxonomies() {
  const [taxonomies, setTaxonomies] = useState<TaxonomyCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTaxonomies()
      .then(setTaxonomies)
      .catch(() => setError("Failed to load taxonomy data"))
      .finally(() => setLoading(false));
  }, []);

  return { taxonomies, loading, error };
}
```

**`useCourses` hook:**
```typescript
export function useCourses(filters: CourseFilters) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getCourses(filters)
      .then(setCourses)
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false));
  }, [filters.category_id, filters.city_id, filters.association_id]);

  return { courses, loading, error };
}
```

---

## Leoron Design Inspirations & Improvements

| Leoron Pattern | Perfxcel Implementation | Improvement |
|----------------|------------------------|-------------|
| Sticky top nav with courses mega-menu | Same pattern — 4-column mega menu | Better glassmorphism, smoother animations |
| Hero with stat counters | Full-screen dark hero with stats row | More modern gradient + geometric pattern |
| Category browsing grid | Dynamic `getTaxonomies()` powered cards | Icons from lucide-react mapped per category |
| Testimonials carousel | Static 6-card grid (no JS carousel needed) | Dark section with 5-star UI — premium look |
| Corporate CTA band | Fuchsia gradient band | Brand-consistent color vs Leoron's blue |
| Footer 4-column | Same 4-column pattern | Logo + social icons, brand description |
| Course detail sidebar | Sticky enrol card in right column | Replaces Leoron's hidden sidebar CTA |
| Arabic language toggle | Not in scope (Perfxcel is English-only for now) | Future: i18n support |
| Leoron's partner logo strip | Gradient-pill "accreditations" on About page | No external image dependency |

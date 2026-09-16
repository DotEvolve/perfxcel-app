# Requirements: Enrollment & Certificate Verification Workflow

## Overview

End-to-end enrollment tracking and certificate verification system for Perfxcel. Admin staff can convert accepted course interests into enrollments, advance those enrollments to "Achieved", and automatically trigger PDF certificate generation, Supabase Storage upload, and email delivery. Candidates can then visit a public `/verify` page to confirm their certificate is genuine using a Turnstile-protected lookup.

## In-Scope Repositories

| Repo | Role |
|------|------|
| `perfxcel-api` | Backend — enrollment/certificate CRUD, PDF generation, QR, email, public verification |
| `perfxcel-admin` | Admin SPA — convert interests to enrollments, manage enrollment status |
| `perfxcel-app` | Public SPA — `/verify` page |

---

## Requirements

### REQ-1 — Database Migration (`dot-portal-api` / Supabase)

**REQ-1.1** A new migration file `20260915000000_create_enrollments_certificates.sql` must create the following tables in the `perfxcel` schema:

- `perfxcel.enrollments`:
  - `id` UUID primary key (default `gen_random_uuid()`)
  - `interest_id` UUID references `perfxcel.course_interests(id)` — unique
  - `status` text not null, constraint values: `'pending'`, `'in_progress'`, `'achieved'`, `'dropped'`, default `'pending'`
  - `created_at` timestamptz default `now()`
  - `updated_at` timestamptz default `now()`

- `perfxcel.certificates`:
  - `id` UUID primary key (default `gen_random_uuid()`)
  - `credential_id` text unique not null — 8 alphanumeric uppercase characters
  - `enrollment_id` UUID references `perfxcel.enrollments(id)` — unique
  - `issued_at` timestamptz not null, default `now()`
  - `pdf_url` text not null — public URL to the stored PDF

**REQ-1.2** RLS policies must be applied:
- `enrollments`: admin-only insert/update/select (i.e., authenticated service-role access; no public reads)
- `certificates`: admin-only insert; **public select** (for verification endpoint)

**REQ-1.3** A Supabase Storage bucket named `certificates` must be created with public read access so PDF URLs are directly linkable.

---

### REQ-2 — Certificate Template Asset (`perfxcel-api`)

**REQ-2.1** A high-quality blank certificate PNG template (`assets/certificate_template.png`) must be stored in the `perfxcel-api` repository. The template must have clearly defined visual zones for the dynamic text fields and QR code.

---

### REQ-3 — Enrollment API Endpoints (`perfxcel-api`)

**REQ-3.1** A new route file `src/routes/enrollments.ts` and controller file `src/controllers/enrollmentController.ts` must be created.

**REQ-3.2** `POST /api/v1/enrollments` — Create an enrollment from an accepted interest.
- Request body: `{ interest_id: string }`
- Validates that the referenced `course_interest` exists
- Validates that an enrollment for this interest does not already exist (409 conflict if duplicate)
- Inserts a row into `perfxcel.enrollments` with `status: 'pending'`
- Response: `{ status: "success", data: Enrollment }`

**REQ-3.3** `GET /api/v1/enrollments` — List all enrollments, joined with the related interest and course.
- Response: `{ status: "success", results: number, data: Enrollment[] }`
- Each item includes: `id`, `status`, `created_at`, `interest` (name, email, course title)

**REQ-3.4** `PATCH /api/v1/enrollments/:id` — Update enrollment status.
- Request body: `{ status: 'pending' | 'in_progress' | 'achieved' | 'dropped' }`
- If `status` is set to `'achieved'` and no certificate exists yet for this enrollment, the following must happen **synchronously** in the same request:
  1. Generate a unique 8-character alphanumeric uppercase `credential_id` (retry on collision)
  2. Generate a QR code PNG image (data buffer) pointing to `https://perfxcel.com/verify?id={credential_id}`
  3. Generate a PDF by loading `assets/certificate_template.png`, embedding the QR code, and overlaying the following text: candidate name, course title, issue date (formatted `DD MMMM YYYY`), and credential ID
  4. Upload the PDF to Supabase Storage bucket `certificates` as `{credential_id}.pdf`
  5. Insert a row into `perfxcel.certificates` with the `pdf_url` from step 4
  6. Send an email to the candidate's address (from the linked interest) with the certificate PDF attached, using `nodemailer` with SMTP credentials from environment variables
- Response: `{ status: "success", data: Enrollment }` (with the `certificates` record included if achieved)

**REQ-3.5** All route handlers must be wrapped with `asyncHandler` from `@dotevolve/error-utils`.

**REQ-3.6** Routes must be mounted in `src/app.ts` as `app.use("/api/v1/enrollments", enrollmentRoutes)`.

---

### REQ-4 — Public Certificate Verification Endpoint (`perfxcel-api`)

**REQ-4.1** A new route file `src/routes/verify.ts` and controller file `src/controllers/verifyController.ts` must be created.

**REQ-4.2** `POST /api/v1/verify` — Public endpoint, no auth required.
- Request body: `{ credential_id: string, turnstileToken: string }`
- If `turnstileToken` is missing or empty, throw a `ValidationError` (400)
- Validate the Turnstile token against Cloudflare's `siteverify` API using `VITE_PERFXCEL_TURNSTILE_SECRET_KEY` (same pattern as `registerInterest` in `courseController.ts`)
- If Turnstile validation fails, throw a `403` `AppError`
- Query `perfxcel.certificates` joined with the related enrollment and interest for a row where `credential_id = :credential_id`
- If no certificate found, return `{ status: "success", data: { valid: false } }`
- If found, return:
  ```json
  {
    "status": "success",
    "data": {
      "valid": true,
      "candidate_name": "...",
      "course_title": "...",
      "issued_at": "...",
      "credential_id": "...",
      "pdf_url": "..."
    }
  }
  ```

**REQ-4.3** Route must be mounted in `src/app.ts` as `app.use("/api/v1/verify", verifyRoutes)`.

---

### REQ-5 — New Dependencies (`perfxcel-api`)

**REQ-5.1** The following packages must be added to `perfxcel-api/package.json` and installed:
- `pdf-lib` — PDF generation
- `qrcode` — QR code generation
- `nodemailer` — SMTP email sending

**REQ-5.2** Type definition packages `@types/qrcode` and `@types/nodemailer` must be added to `devDependencies`.

**REQ-5.3** New environment variables needed:
- `SMTP_HOST` — SMTP server hostname
- `SMTP_PORT` — SMTP server port (default `587`)
- `SMTP_USER` — SMTP username
- `SMTP_PASS` — SMTP password
- `SMTP_FROM` — Sender email address (e.g. `"Perfxcel <no-reply@perfxcel.com>"`)

---

### REQ-6 — Admin Portal: "Convert to Enrollment" Action (`perfxcel-admin`)

**REQ-6.1** In `src/pages/Interests.tsx`, add a "Convert to Enrollment" action button in the interests table row.

**REQ-6.2** The button must only be visible and enabled when the interest's status is `'enrolled'`.

**REQ-6.3** Clicking the button must call `POST /api/v1/enrollments` with `{ interest_id: id }` via the existing `api` Axios instance from `src/api.ts`.

**REQ-6.4** On success, show a brief inline confirmation. On failure (e.g., 409 conflict — already enrolled), display the error message from the API response.

**REQ-6.5** Add the API helper function for creating an enrollment in `src/api.ts` (following the existing `updateInterestStatus` pattern).

---

### REQ-7 — Admin Portal: Enrollments Page (`perfxcel-admin`)

**REQ-7.1** Create a new page `src/pages/Enrollments.tsx` that fetches and displays all enrollments from `GET /api/v1/enrollments`.

**REQ-7.2** The table must display the following columns: Candidate Name, Email, Course Title, Status, Created Date, Actions.

**REQ-7.3** The status must be displayed as a colour-coded badge consistent with the style in `Interests.tsx`:
- `pending` → blue
- `in_progress` → yellow
- `achieved` → green
- `dropped` → red

**REQ-7.4** Each row must have a status dropdown/action allowing the admin to transition status. The "Achieved" transition must show a loading indicator while the backend generates and sends the certificate.

**REQ-7.5** Add the following to `src/App.tsx`:
- Import `Enrollments` from `./pages/Enrollments`
- Add `<Route path="/enrollments" element={<Enrollments />} />` inside the protected `AuthGuard` layout
- Add a sidebar `<Link to="/enrollments">` between Interests and the end of the nav list

**REQ-7.6** Add the API helper functions for enrollment in `src/api.ts`:
- `getEnrollments()` — calls `GET /api/v1/enrollments`
- `createEnrollment(interestId: string)` — calls `POST /api/v1/enrollments`
- `updateEnrollmentStatus(id: string, status: string)` — calls `PATCH /api/v1/enrollments/:id`

---

### REQ-8 — Public Website: Certificate Verification Page (`perfxcel-app`)

**REQ-8.1** Create a new page `src/pages/Verify.tsx`.

**REQ-8.2** The page must contain:
- A heading (e.g. "Verify Certificate")
- A text input for the `credential_id` — pre-populated from the `id` URL query parameter if present
- A `<Turnstile>` widget from `@marsidev/react-turnstile` using the site key from `VITE_TURNSTILE_SITE_KEY`
- A "Verify" submit button that is disabled until both the credential ID input and a Turnstile token are present
- A results section below the form showing the verification outcome

**REQ-8.3** On successful verification (`valid: true`), display:
- A green "✓ Valid Certificate" banner
- Candidate Name, Course Title, Issue Date
- A "Download Certificate" link pointing to `pdf_url`
- The Credential ID

**REQ-8.4** On failed verification (`valid: false`) or API error, display a red "✗ Invalid or Not Found" banner.

**REQ-8.5** The verification API call must go to `POST /api/v1/verify` using the existing `api` Axios instance from `src/api.ts`. Add a `verifyCertificate(credentialId: string, turnstileToken: string)` helper to `src/api.ts`.

**REQ-8.6** Add the `/verify` route to `src/App.tsx`:
- Import `Verify` from `./pages/Verify`
- Add `<Route path="/verify" element={<Verify />} />` inside the existing routes (no auth guard — this is public)

**REQ-8.7** Add a "Verify Certificate" link to the footer in `src/components/Footer.tsx` under the "Quick Links" column, pointing to `/verify`.

---

## Constraints & Conventions

- **Controller pattern**: All handlers are thin — throw typed `AppError` subclasses, never `res.status(4xx).json()` directly. Wrap with `asyncHandler` at the router level.
- **Supabase client**: Use the existing `supabase` export from `src/db/supabase.ts` (service role key, `perfxcel` schema). Never instantiate a new client.
- **Turnstile verification**: Follow the exact pattern established in `courseController.ts` `registerInterest` — use `fetch`, check both `result.success` and `result.hostname` against the `VITE_PERFXCEL_TURNSTILE_HOSTNAMES` allowlist.
- **Admin API calls**: Use the `api` Axios instance from `src/api.ts` in perfxcel-admin (attaches `Authorization: Bearer` automatically). Never call `axios` directly.
- **App API calls**: Use the `api` Axios instance from `src/api.ts` in perfxcel-app. Never call `axios` directly.
- **Styling**: Tailwind CSS v4 utility classes in JSX. No inline `style` props for layout. Match the visual style of `Interests.tsx` in the admin.
- **TypeScript**: Strict mode. No `any` without a justification comment. Define interfaces for new data shapes in the relevant files.
- **All new tables**: Must be in the `perfxcel` schema (not `public`).
- **PDF generation**: Server-side in `perfxcel-api` using `pdf-lib` + `qrcode`. The frontend does not generate PDFs.

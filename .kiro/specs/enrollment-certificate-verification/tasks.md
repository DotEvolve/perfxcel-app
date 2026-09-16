# Tasks: Enrollment & Certificate Verification Workflow

## Phase 1 — Database & Infrastructure

- [ ] **Task 1**: Create Supabase migration file
  - File: `dot-portal-api/supabase/migrations/20260915000000_create_enrollments_certificates.sql`
  - Create `perfxcel.enrollments` table with `id`, `interest_id` (unique FK), `status` (check constraint), `created_at`, `updated_at`
  - Create `perfxcel.certificates` table with `id`, `credential_id` (unique), `enrollment_id` (unique FK), `issued_at`, `pdf_url`
  - Add `updated_at` trigger on `enrollments` to auto-update on PATCH
  - Enable RLS on both tables; deny anon on `enrollments`; allow public SELECT on `certificates`
  - Create `certificates` Supabase Storage bucket with public access
  - **Acceptance**: Migration runs cleanly via `supabase db push`; both tables exist in `perfxcel` schema with correct constraints

---

## Phase 2 — Backend API (`perfxcel-api`)

- [ ] **Task 2**: Install new dependencies
  - Run: `npm install pdf-lib qrcode nodemailer`
  - Run: `npm install --save-dev @types/qrcode @types/nodemailer`
  - **Acceptance**: `package.json` updated; `node_modules` contains all three packages; `npm run build` still passes

- [ ] **Task 3**: Add certificate template asset
  - Design and save a professionally styled blank certificate as `perfxcel-api/assets/certificate_template.png`
  - Template must include visual placeholder zones for: candidate name (centred, large), course title, issue date, credential ID, and QR code (lower-right quadrant)
  - **Acceptance**: PNG file exists at `assets/certificate_template.png`; it is at least 1200×850px at landscape A4 aspect ratio

- [ ] **Task 4**: Create `src/controllers/enrollmentController.ts`
  - Implement `getEnrollments`: query with joined `course_interests(name, email, courses(title))`
  - Implement `createEnrollment`: validate `interest_id`, check no duplicate (409), insert enrollment
  - Implement `updateEnrollmentStatus`: validate status value, update row, trigger `generateAndIssueCertificate` if `status === 'achieved'` and no cert exists
  - Implement private `generateAndIssueCertificate(enrollment, interest)`:
    - `generateUniqueCredentialId()` — 8-char uppercase alphanumeric, retry on collision
    - QR code generation via `qrcode.toBuffer("https://perfxcel.com/verify?id=<credentialId>")`
    - PDF generation via `pdf-lib`: load `assets/certificate_template.png`, embed template as PNG, embed QR, overlay text (name, course, date, credential ID)
    - Upload PDF bytes to Supabase Storage bucket `certificates` as `<credentialId>.pdf`
    - Get public URL via `supabase.storage.from("certificates").getPublicUrl(...)`
    - Insert into `perfxcel.certificates`
    - Call `sendCertificateEmail`
  - Implement private `sendCertificateEmail(to, name, pdfUrl, pdfBuffer, credentialId)`:
    - Create `nodemailer` transporter from `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
    - Send HTML email with `SMTP_FROM` sender, PDF attachment named `certificate.pdf`
  - **Acceptance**: TypeScript compiles; all handlers throw typed `AppError` subclasses; no `res.status(4xx).json()` calls

- [ ] **Task 5**: Create `src/routes/enrollments.ts`
  - `GET /` → `asyncHandler(getEnrollments)`
  - `POST /` → `asyncHandler(createEnrollment)`
  - `PATCH /:id` → `asyncHandler(updateEnrollmentStatus)`
  - **Acceptance**: File exports a `Router`; all handlers wrapped in `asyncHandler`

- [ ] **Task 6**: Create `src/controllers/verifyController.ts`
  - Implement `verifyCertificate`: validate `turnstileToken`, call Cloudflare siteverify (same `fetch` pattern from `courseController.registerInterest`), query `perfxcel.certificates` joined with enrollment + interest, return `{ valid: false }` or full details
  - **Acceptance**: Returns 400 with `ValidationError` when `turnstileToken` is missing; returns 403 when Turnstile fails; returns `{ valid: false }` for unknown `credential_id`; returns full details for known `credential_id`

- [ ] **Task 7**: Create `src/routes/verify.ts`
  - `POST /` → `asyncHandler(verifyCertificate)`
  - **Acceptance**: File exports a `Router`

- [ ] **Task 8**: Update `src/app.ts` to mount new routes
  - Import `enrollmentRoutes` from `"./routes/enrollments"`
  - Import `verifyRoutes` from `"./routes/verify"`
  - Add `app.use("/api/v1/enrollments", enrollmentRoutes)` after the interests route
  - Add `app.use("/api/v1/verify", verifyRoutes)` after the enrollments route
  - **Acceptance**: `npm run build` passes; `GET /api/v1/enrollments` returns 200; `POST /api/v1/verify` exists

---

## Phase 3 — Admin Portal (`perfxcel-admin`)

- [ ] **Task 9**: Update `src/api.ts` with enrollment helper functions
  - Add `getEnrollments()` → `api.get("/enrollments").then(r => r.data.data)`
  - Add `createEnrollment(interestId: string)` → `api.post("/enrollments", { interest_id: interestId }).then(r => r.data.data)`
  - Add `updateEnrollmentStatus(id: string, status: string)` → `api.patch(\`/enrollments/${id}\`, { status }).then(r => r.data.data)`
  - **Acceptance**: TypeScript compiles; functions exported from `src/api.ts`

- [ ] **Task 10**: Update `src/pages/Interests.tsx` with "Convert to Enrollment" action
  - Import `createEnrollment` from `"../api"`
  - Add state: `const [converting, setConverting] = useState<string | null>(null)` and `const [convertError, setConvertError] = useState<Record<string, string>>({})` 
  - Add a `handleConvertToEnrollment(id: string)` function:
    - Sets `converting` to the interest ID, clears error
    - Calls `createEnrollment(id)`
    - On success: reload interests (call `loadInterests()`)
    - On failure: store error message in `convertError[id]`
    - Resets `converting` in finally
  - In the table row actions: add a "Convert to Enrollment" button, visible only when `interest.status === 'enrolled'`
    - Show loading spinner when `converting === interest.id`
    - Show error text below button when `convertError[interest.id]` is set
  - **Acceptance**: Button only appears for `status === 'enrolled'` rows; spinner shown during API call; 409 errors shown inline

- [ ] **Task 11**: Create `src/pages/Enrollments.tsx`
  - Define a local `Enrollment` interface: `{ id, status, created_at, course_interests: { name, email, courses: { title } } }`
  - Fetch all enrollments with `getEnrollments()` on mount
  - Render a table with columns: Candidate Name, Email, Course, Status (badge), Created, Status Action
  - Status badge colours: `pending` = blue, `in_progress` = yellow, `achieved` = green, `dropped` = red (same pattern as `Interests.tsx` `getStatusColor`)
  - Status action: a `<select>` dropdown pre-selected to current status, on change calls `updateEnrollmentStatus(id, newStatus)`; show a per-row loading indicator while the request is in flight (important for `achieved` since it triggers PDF gen + email)
  - Show a loading spinner while initial data is loading
  - **Acceptance**: Page renders the enrollment table; changing status to `'achieved'` shows loading state; page matches the visual style of `Interests.tsx`

- [ ] **Task 12**: Update `src/App.tsx` in perfxcel-admin
  - Import `Enrollments` from `"./pages/Enrollments"`
  - Add `<Route path="/enrollments" element={<Enrollments />} />` inside the protected `AuthGuard` layout block, after the `/interests` route
  - Add `<Link to="/enrollments" ...>Enrollments</Link>` to the sidebar nav (after the Interests link)
  - **Acceptance**: Navigating to `/#/enrollments` renders the Enrollments page; the sidebar shows the Enrollments link

---

## Phase 4 — Public Website (`perfxcel-app`)

- [ ] **Task 13**: Update `src/api.ts` in perfxcel-app
  - Add `verifyCertificate(credentialId: string, turnstileToken: string)`:
    ```typescript
    export const verifyCertificate = (credentialId: string, turnstileToken: string) =>
      api.post("/verify", { credential_id: credentialId, turnstileToken })
         .then(r => r.data.data);
    ```
  - **Acceptance**: TypeScript compiles; function exported

- [ ] **Task 14**: Create `src/pages/Verify.tsx`
  - Import `useSearchParams` from `react-router-dom`; read `?id=` into initial state
  - Import `Turnstile` from `@marsidev/react-turnstile`
  - Import `verifyCertificate` from `"../api"`
  - State: `credentialId` (string), `turnstileToken` (string | null), `loading` (boolean), `result` (VerifyResult | null), `error` (string | null)
  - Define local interface `VerifyResult`:
    ```typescript
    interface VerifyResult {
      valid: boolean;
      candidate_name?: string;
      course_title?: string;
      issued_at?: string;
      credential_id?: string;
      pdf_url?: string;
    }
    ```
  - Render form:
    - Heading: "Verify Certificate"
    - Description text explaining what this page does
    - Text input labeled "Credential ID" bound to `credentialId`
    - `<Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />`
    - Submit button disabled when `!credentialId.trim() || !turnstileToken || loading`
  - On submit: call `verifyCertificate`, set `result` or `error`
  - Render result section:
    - `valid: true` → green success banner, details table (Name, Course, Issued, Credential ID), "Download Certificate" `<a href={pdf_url}>` link
    - `valid: false` or error → red "Invalid or not found" banner
  - Use Tailwind utility classes; match the visual style of the existing pages
  - **Acceptance**: Page renders at `/verify`; pre-fills credential ID from URL `?id=` param; Turnstile must be solved before submitting; shows valid/invalid result correctly

- [ ] **Task 15**: Update `src/App.tsx` in perfxcel-app
  - Import `Verify` from `"./pages/Verify"`
  - Add `<Route path="/verify" element={<Verify />} />` inside the existing `<Routes>`
  - **Acceptance**: Navigating to `/verify` renders the Verify page without auth gate

- [ ] **Task 16**: Update `src/components/Footer.tsx` in perfxcel-app
  - Add a `<Link to="/verify">Verify Certificate</Link>` entry in the Quick Links column
  - Style it consistently with the existing footer links
  - **Acceptance**: Footer shows "Verify Certificate" link; clicking it navigates to `/verify`

---

## Phase 5 — Verification

- [ ] **Task 17**: Manual end-to-end verification
  1. Submit a test interest via the public site
  2. In the admin portal Interests tab: change status to `'enrolled'`, then click "Convert to Enrollment"
  3. Open the Enrollments tab; confirm the new enrollment appears with `status: 'pending'`
  4. Change status to `'achieved'`; confirm the loading indicator appears during the API call
  5. Check Supabase Storage (`certificates` bucket) — the PDF should be present as `<credentialId>.pdf`
  6. Check the test email inbox — the candidate email should have arrived with PDF attached
  7. Open the PDF — confirm candidate name, course, date, credential ID, and QR code are correctly rendered
  8. Scan the QR code — it should open `https://perfxcel.com/verify?id=<credentialId>`
  9. Navigate to `/verify?id=<credentialId>` on perfxcel-app
  10. Complete the Turnstile widget and click Verify
  11. Confirm the green "Valid Certificate" result shows with correct details and a working PDF download link
  12. Try an invalid credential ID — confirm the red "Invalid or not found" result appears
  13. Try submitting without Turnstile token (direct API call) — confirm 400 ValidationError is returned

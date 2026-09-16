# Design: Enrollment & Certificate Verification Workflow

## Architecture Overview

The feature spans three repositories. The backend API owns all state mutations, PDF generation, and business logic. The admin portal is the operator interface. The public website exposes the verification page to candidates.

```
candidate ──► perfxcel-app /verify ──► POST /api/v1/verify ──► Supabase certificates table
admin ──────► perfxcel-admin /enrollments ──► PATCH /api/v1/enrollments/:id
                                                     │
                               ┌─────────────────────▼──────────────────────────┐
                               │  1. Generate credential_id (8-char unique)      │
                               │  2. Generate QR code PNG (qrcode)               │
                               │  3. Generate PDF (pdf-lib + certificate_template)│
                               │  4. Upload PDF → Supabase Storage               │
                               │  5. Insert perfxcel.certificates row            │
                               │  6. Send email (nodemailer SMTP)                │
                               └────────────────────────────────────────────────┘
```

---

## Database Schema

### `perfxcel.enrollments`

```sql
CREATE TABLE perfxcel.enrollments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  interest_id UUID        NOT NULL UNIQUE REFERENCES perfxcel.course_interests(id),
  status      TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','in_progress','achieved','dropped')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `perfxcel.certificates`

```sql
CREATE TABLE perfxcel.certificates (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id TEXT        NOT NULL UNIQUE,
  enrollment_id UUID        NOT NULL UNIQUE REFERENCES perfxcel.enrollments(id),
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  pdf_url       TEXT        NOT NULL
);
```

### RLS

```sql
-- enrollments: service role only (API uses service role key, bypasses RLS)
ALTER TABLE perfxcel.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin only" ON perfxcel.enrollments USING (false); -- deny all anon

-- certificates: public read, service role write
ALTER TABLE perfxcel.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON perfxcel.certificates FOR SELECT USING (true);
CREATE POLICY "service write" ON perfxcel.certificates FOR INSERT USING (false);
```

> The API uses the **service role key** which bypasses RLS entirely. The `USING (false)` on INSERT blocks only anon/authenticated JWT callers.

---

## Backend API Design (`perfxcel-api`)

### New File Structure

```
perfxcel-api/
├── assets/
│   └── certificate_template.png          ← NEW: blank certificate PNG
├── src/
│   ├── controllers/
│   │   ├── enrollmentController.ts        ← NEW
│   │   └── verifyController.ts            ← NEW
│   └── routes/
│       ├── enrollments.ts                 ← NEW
│       └── verify.ts                      ← NEW
└── src/app.ts                             ← MODIFY: mount new routes
```

### `src/controllers/enrollmentController.ts`

#### `getEnrollments`
```
GET /api/v1/enrollments
→ supabase.from("enrollments")
    .select("*, course_interests(name, email, courses(title))")
    .order("created_at", { ascending: false })
→ 200 { status, results, data }
```

#### `createEnrollment`
```
POST /api/v1/enrollments
body: { interest_id }
→ validate interest_id present
→ check interest exists: supabase.from("course_interests").select("id").eq("id", interest_id)
→ check no duplicate: supabase.from("enrollments").select("id").eq("interest_id", interest_id)
  → if found: throw ConflictError("Enrollment already exists for this interest")
→ supabase.from("enrollments").insert({ interest_id }).select().single()
→ 201 { status, data }
```

#### `updateEnrollmentStatus`
```
PATCH /api/v1/enrollments/:id
body: { status }
→ validate status is one of the allowed values
→ supabase.from("enrollments").update({ status, updated_at: new Date() }).eq("id", id).select(…joined).single()
→ if status === "achieved":
    → check no existing certificate: supabase.from("certificates").select("id").eq("enrollment_id", id)
    → if none exists: generateAndIssueCertificate(enrollment, interest)
→ 200 { status, data: { ...enrollment, certificates } }
```

#### `generateAndIssueCertificate(enrollment, interest)` — private async helper

```typescript
async function generateAndIssueCertificate(enrollment: Enrollment, interest: Interest) {
  // 1. Generate unique credential_id
  const credentialId = await generateUniqueCredentialId();

  // 2. Generate QR code as PNG buffer
  const qrBuffer = await QRCode.toBuffer(`https://perfxcel.com/verify?id=${credentialId}`);

  // 3. Load certificate template + overlay dynamic content with pdf-lib
  const templateBytes = fs.readFileSync(path.join(__dirname, "../../assets/certificate_template.png"));
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const pngImage = await pdfDoc.embedPng(templateBytes);
  page.drawImage(pngImage, { x: 0, y: 0, width: 842, height: 595 });

  // Embed QR code
  const qrImage = await pdfDoc.embedPng(qrBuffer);
  page.drawImage(qrImage, { x: 680, y: 60, width: 120, height: 120 });

  // Overlay text (using standard Helvetica font)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.drawText(interest.name, { x: 421, y: 320, size: 28, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(interest.courses.title, { x: 421, y: 270, size: 16, font, color: rgb(0.3, 0.3, 0.3) });
  page.drawText(format(new Date(), "dd MMMM yyyy"), { x: 421, y: 230, size: 13, font });
  page.drawText(`Credential ID: ${credentialId}`, { x: 421, y: 200, size: 11, font, color: rgb(0.4, 0.4, 0.4) });

  const pdfBytes = await pdfDoc.save();

  // 4. Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("certificates")
    .upload(`${credentialId}.pdf`, Buffer.from(pdfBytes), { contentType: "application/pdf", upsert: false });
  if (uploadError) throw new AppError(uploadError.message, 500, ErrorCategory.SYSTEM);

  const { data: { publicUrl } } = supabase.storage.from("certificates").getPublicUrl(`${credentialId}.pdf`);

  // 5. Insert certificate record
  const { error: certError } = await supabase.from("certificates").insert({
    credential_id: credentialId,
    enrollment_id: enrollment.id,
    pdf_url: publicUrl,
  });
  if (certError) throw new AppError(certError.message, 500, ErrorCategory.SYSTEM);

  // 6. Send email
  await sendCertificateEmail(interest.email, interest.name, publicUrl, Buffer.from(pdfBytes), credentialId);
}
```

#### `generateUniqueCredentialId()` — private helper
- Generates 8-char random alphanumeric (uppercase + digits) string
- Checks for collision in `perfxcel.certificates`; retries up to 5 times

#### `sendCertificateEmail()` — private helper
- Creates a `nodemailer` transporter using `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Sends to candidate with subject "Your Perfxcel Certificate is Ready"
- HTML body with link to `pdf_url` and download button
- Attaches the PDF buffer as `certificate.pdf`

---

### `src/controllers/verifyController.ts`

#### `verifyCertificate`
```
POST /api/v1/verify
body: { credential_id, turnstileToken }
→ validate turnstileToken present
→ call Cloudflare siteverify (same pattern as courseController.registerInterest)
→ supabase.from("certificates")
    .select("credential_id, issued_at, pdf_url, enrollments(id, course_interests(name, courses(title)))")
    .eq("credential_id", credential_id)
    .maybeSingle()
→ if not found: 200 { status: "success", data: { valid: false } }
→ if found: 200 { status: "success", data: { valid: true, candidate_name, course_title, issued_at, credential_id, pdf_url } }
```

---

### Route Files

**`src/routes/enrollments.ts`**
```typescript
router.get("/", asyncHandler(getEnrollments));
router.post("/", asyncHandler(createEnrollment));
router.patch("/:id", asyncHandler(updateEnrollmentStatus));
```

**`src/routes/verify.ts`**
```typescript
router.post("/", asyncHandler(verifyCertificate));
```

### `src/app.ts` additions
```typescript
import enrollmentRoutes from "./routes/enrollments";
import verifyRoutes from "./routes/verify";
// ...
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/verify", verifyRoutes);
```

---

## Admin Portal Design (`perfxcel-admin`)

### New File
**`src/pages/Enrollments.tsx`** — follows the `Interests.tsx` pattern exactly:
- `useState<Enrollment[]>([])` (define an `Enrollment` interface locally)
- `useEffect` → `getEnrollments()` on mount
- Table columns: Candidate, Email, Course, Status, Created, Actions
- Status badge colours matching `Interests.tsx`'s `getStatusColor` pattern
- Status dropdown per row calls `updateEnrollmentStatus(id, newStatus)`
- Loading spinner while `status === 'achieved'` transition is in-flight

### Modified Files

**`src/api.ts`** — new functions:
```typescript
export const getEnrollments = () => api.get("/enrollments").then(r => r.data.data);
export const createEnrollment = (interestId: string) =>
  api.post("/enrollments", { interest_id: interestId }).then(r => r.data.data);
export const updateEnrollmentStatus = (id: string, status: string) =>
  api.patch(`/enrollments/${id}`, { status }).then(r => r.data.data);
```

**`src/pages/Interests.tsx`** — add "Convert to Enrollment" column:
- New button in each row, only rendered when `interest.status === 'enrolled'`
- On click: calls `createEnrollment(interest.id)`, shows success/error inline

**`src/App.tsx`** changes:
- Import `Enrollments` from `"./pages/Enrollments"`
- Add sidebar link: `<Link to="/enrollments">Enrollments</Link>`
- Add route: `<Route path="/enrollments" element={<Enrollments />} />`

---

## Public Website Design (`perfxcel-app`)

### New File
**`src/pages/Verify.tsx`**

State:
```typescript
const [credentialId, setCredentialId] = useState(searchParams.get("id") ?? "");
const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [result, setResult] = useState<VerifyResult | null>(null);
const [error, setError] = useState<string | null>(null);
```

UI structure:
```
<section> verification form
  <input> credential ID (value from URL ?id= if present)
  <Turnstile siteKey={VITE_TURNSTILE_SITE_KEY} onSuccess={setTurnstileToken} />
  <button disabled={!credentialId || !turnstileToken || loading}>Verify</button>
</section>
<section> result (shown after submission)
  if valid: green banner + details table + download link
  if invalid: red banner
  if error: red banner with message
</section>
```

### Modified Files

**`src/api.ts`** — new function:
```typescript
export const verifyCertificate = (credentialId: string, turnstileToken: string) =>
  api.post("/verify", { credential_id: credentialId, turnstileToken }).then(r => r.data.data);
```

**`src/App.tsx`**:
```typescript
import Verify from "./pages/Verify";
// ...
<Route path="/verify" element={<Verify />} />
```

**`src/components/Footer.tsx`** — add under Quick Links:
```tsx
<Link to="/verify" className="...">Verify Certificate</Link>
```

---

## Environment Variables

### `perfxcel-api` additions
```
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=Perfxcel <no-reply@perfxcel.com>
```

### `perfxcel-app` additions (if not already present)
```
VITE_TURNSTILE_SITE_KEY=  (the public site key for the verify page widget)
```

---

## Data Flow: End-to-End

```
1. Candidate fills "Register Interest" form on perfxcel-app
   → POST /api/v1/courses/:id/interest
   → row inserted into perfxcel.course_interests (status: "new")

2. Admin opens Interests tab in perfxcel-admin
   → updates status to "enrolled" via PATCH /api/v1/interests/:id
   → clicks "Convert to Enrollment" button
   → POST /api/v1/enrollments { interest_id }
   → row inserted into perfxcel.enrollments (status: "pending")

3. Admin opens Enrollments tab in perfxcel-admin
   → advances status to "in_progress", then "achieved"
   → PATCH /api/v1/enrollments/:id { status: "achieved" }
   → API generates QR + PDF, uploads to Supabase Storage, inserts certificate, sends email

4. Candidate receives email → PDF attachment + "Verify at perfxcel.com/verify"

5. Anyone navigates to perfxcel.com/verify?id=ABCD1234
   → enters credential ID (pre-filled from URL)
   → completes Turnstile challenge
   → POST /api/v1/verify
   → Cloudflare siteverify + Supabase lookup
   → green "Valid Certificate" result shown
```

---

## Error Handling

| Scenario | HTTP Status | Error Class |
|---|---|---|
| Missing `interest_id` on create | 400 | `ValidationError` |
| Interest not found | 404 | `NotFoundError` |
| Duplicate enrollment | 409 | `ConflictError` |
| Invalid enrollment status value | 400 | `ValidationError` |
| Missing `turnstileToken` on verify | 400 | `ValidationError` |
| Turnstile verification failed | 403 | `AppError` |
| PDF generation failure | 500 | `AppError(ErrorCategory.SYSTEM)` |
| Storage upload failure | 500 | `AppError(ErrorCategory.SYSTEM)` |
| Email send failure | 500 | `AppError(ErrorCategory.SYSTEM)` |

All errors are handled by the existing `errorHandlerMiddleware` — no manual `res.status().json()` calls.

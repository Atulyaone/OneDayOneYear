# One Day, One Historical Moment — Evaluation 2 Audit & Action Plan

**Repository:** `Atulyaone/OneDayOneYear` · **Branch audited:** `main` · **HEAD:** `531287c` “Fixed minor bugs (1D 1Y v1.6)”
**Audit date:** 28 October 2026 · **Stack:** React 19.2 · Vite 8.2 · TypeScript 6 · React Router 7 (data mode) · GSAP + ScrollTrigger · Framer Motion · Vanilla CSS
**Contributors seen in history:** `Atulyaone`, `Harshitrao024`, `bhavya20sharma07-hub`

---

## Implementation log — 28 October 2026

The P1 and P2 gaps below have since been closed in the working copy. The scorecard further down records the state **before** this work.

| Item | Status | Where |
|---|---|---|
| 5. Contribute page + navbar link | Done | `/contribute`; `/submit` redirects; nav link added |
| 6. Form validation, file input, submission states | Done | `src/components/contribute/*`, `src/hooks/useContributionForm.ts`, `src/data/validation.ts` |
| 7. Submission endpoint + JSON file | Done | `server/index.mjs`, `server/store.mjs`, `server/data/submissions.json` |
| 8. Success/error UI + receipt | Done | `SubmissionReceipt.tsx` with accession ID |
| 9. Hardening | Done | server validation, MIME allow-list, 20 MB cap, atomic writes, 10 requests / 10 min rate limit |
| 10. Accessibility | Done | cursor scoped to fine pointers, text selection restored, reduced motion renders a single still frame |
| 11. Documentation | Done | root `README.md` with setup, routes, API contract, and folder map |
| 12. Performance | Done | batched frame loading (8 at a time), mobile stride 2/3, single frame under reduced motion |
| 13. Cross-links | Done | About closing section and record footer both link to the submission flow |
| 14. Admin view | Done | `/admin/submissions` reads `GET /api/submissions` |

Verified: build + type-check pass, API returns `400` for invalid fields, `201` with sequential accession IDs, writes the record and evidence metadata to JSON, rate limits after ten attempts, and the browser form shows inline errors, focuses the first invalid field, and renders a receipt. `/submit` redirects, `?date=` prefills, mobile navigation fits 390 px without horizontal overflow, and reduced motion makes exactly one frame request.

Still open: the search ranking regression from v1.5 (prefix/date/month only), and the duplicate `src/frames` directory.

---

## 0. Legend

| Mark | Meaning |
|---|---|
| ✅ | Implemented and working in the repository |
| ⚠️ | Partially implemented, fragile, or implemented with a significant caveat |
| ❌ | Not implemented (or not present in the repository at all) |

---

## 1. What this project is right now

An immersive, read-only digital archive. A visitor lands on a cinematic opening, scroll-scrubs through a 242-frame newspaper sequence, enters a month/day date index, searches 20 historical records, and opens an editorial long-form record for a single date.

### 1.1 Route tree (current)

```text
/                        ArchiveOpeningPage      “THE ARCHIVE OPENS” + scroll-scrubbed newspaper
/calendar                CalendarPage             month selector + 7-column month/day grid + preview slip
/event/:date             HistoricalMomentPage     dynamic record: hero, story, timeline, film, quote, impact, gallery
/about                   AboutPage                concept, methodology, closing statement
*                        NotFoundPage             archival “record not found” state
```

All routes render inside `ArchiveShell`, which owns the fixed navbar, custom cursor, film grain, route transitions, page progress, ambient audio toggle, and the search overlay.

### 1.2 Architecture

```text
index.html
 └── src/main.tsx
      └── App.tsx  (createBrowserRouter)
           └── ArchiveShell.tsx
                ├── ArchiveNavbar        (Calendar / Search / About)
                ├── CustomCursor         (data-cursor modes: view, open, plate, close)
                ├── SearchOverlay        (live search, keyboard nav, typewriter SFX)
                ├── PageProgress         (event routes only)
                └── Outlet ──► pages/*

src/data/events.ts        20 records, typed by src/types.ts
src/data/selectors.ts     UTC-safe formatting, month/day grid, adjacency, ranked search
src/hooks/*               5 hooks: audio, search, focus trap, pointer capability, reduced motion
src/components/*          12 reusable components
src/styles.css            design tokens + all component styles (Broadsheet Chamber)
src/styles.refinement.css refinement layer + responsive overrides
public/frames/*.jpg       242-image scroll sequence (19 MB)
src/frames/*.jpg          duplicate copy of the same 242 frames (19 MB, unreferenced)
```

### 1.3 Content model

`HistoricalEvent` carries `date`, `title`, `year`, `category`, `keywords[]`, `shortDescription`, `fullStory`, `heroImage`, `galleryImages[]`, `video | null`, `timeline[]`, plus optional `quote`, `quoteAttribution`, and `impact`. There are **20 seed records** spanning 1776 → 2001.

### 1.4 Design language

“Broadsheet Chamber”: near-black ground (`--void #100d09`), ivory paper / newsprint text, antique gold and brass accents, Bodoni Moda display serif, Source Serif body, IBM Plex Mono for archival metadata, film grain, vignette, rule lines, and zero rounded SaaS cards.

---

## 2. What the commits actually changed (and what that teaches us)

| Version | Commit | Change | What it means for us |
|---|---|---|---|
| v1.1 | `707dd59` | Updated custom cursor and navbar | Cursor modes and a 3-link nav were introduced. Nav still has **no Contribute entry**. |
| v1.1 | `60d3b36` | Block text highlighting and copying | Implemented with global CSS `user-select: none` (not JS). Works, but blocks citation copying and is an accessibility/UX caveat. |
| v1.2 | `b373994` | Removed the static newspaper, added scroll animation | The DOM newspaper was replaced by a 242-frame canvas scrub. This is the single biggest architectural change. |
| v1.4 | `a9bd55f` | Fixed the scroll newspaper animation | Progress math + sticky stage corrected. |
| v1.4.1 | `425c741`, `868a592` | Landing page scroll animation fixes | Two parallel fix commits; the animation had repeated regressions. |
| — | `030e4af` | Added Figma design link for Vintage Graphics | `archive-app/Figma Design Temp-1` holds a Figma URL. **Nothing from that file is integrated in code yet.** |
| — | `ea1258c` | Merge `main` of the GitHub remote | Teammates were working in parallel; merge conflicts are part of the history. |
| v1.5 | `f4dea20` | “Fixing the search bar option” | Replaced the ranked selector search with a new `useArchiveSearch` hook. **This narrowed search** (see 2.2). |
| v1.6 | `acbc8c4` | Typewriter sound in search bar | Web Audio synthesised key clicks + carriage return, gated by the global Sound toggle. |
| v1.6 | `531287c` | “Fixed minor bugs” | Current HEAD. **Build is red** (see 2.1). |

### 2.1 Blocking defect: production build is broken

`npm run build` (`tsc -b && vite build`) currently fails with two `TS6133` unused-import errors:

```text
src/components/ArchiveShell.tsx(1,8): error TS6133: 'React' is declared but its value is never read.
src/pages/ArchiveOpeningPage.tsx(4,26): error TS6133: 'formatAccession' is declared but its value is never read.
```

The dev server still runs because Vite does not type-check, which is why nobody noticed. **Any deploy will fail until these are removed.** This is our first task.

### 2.2 Functional regression: search no longer matches keywords or categories

`src/data/selectors.ts › searchEvents()` used to score matches across date, title, category, keywords, description, and full story. The new `src/hooks/useArchiveSearch.ts` only:

1. matches titles that **start with** the query,
2. matches digits against year/day/ISO date,
3. matches month names of 3+ letters.

Consequences: `moon`, `space`, `nasa`, `civil rights`, `nuclear`, `berlin` return **0 records**, even though those words exist in titles, categories, or keywords. This directly violates the original requirement “search by title, date, keywords, category.”

Additional issues in that hook:

- `allRecords` is derived with `Object.values(eventData).find(Array.isArray)` and `any` casts — fragile and bypasses the typed `sortedEvents`.
- `types.ts` still declares `SearchStatus = 'idle' | 'searching' | 'results' | 'empty'`, but the hook never emits `'searching'`; the two definitions have drifted.
- Typing a **single** character performs a full scan and can still match on numeric day (`"2"`).

**Recommendation:** delete the duplicate search implementation, keep one typed `searchEvents()` in `data/selectors.ts` with the scoring model, and have the hook call it (with `useDeferredValue` for responsiveness).

### 2.3 Performance and repository weight

| Finding | Detail |
|---|---|
| Duplicate frame sets | `public/frames` **19 MB** and `src/frames` **19 MB** contain the same 242 JPEGs. Code only requests `/frames/frame_XXXX.jpg`, which resolves to `public/frames`. `src/frames` is dead weight in the repo and in git history. |
| Eager frame loading | `ArchiveOpeningPage` creates **242 `new Image()` requests immediately** on mount, with no batching, no `decode()`, no mobile stride, and no reduced-motion bypass. On a phone this is a heavy first load. |
| Unused media | `src/assets/Newspaper_Floating.mp4` (2 MB) is not referenced anywhere. It is currently staged as a rename and uncommitted. |
| Dead starter CSS | `src/index.css` and `src/App.css` are not imported by `main.tsx`; `App.css` is referenced nowhere. |
| README | Empty on `origin/main`. No setup, architecture, or API documentation for evaluators/teammates. |

### 2.4 Accessibility caveats introduced

- `html, body, * { cursor: none !important; }` removes the system cursor for everyone. If the custom cursor script fails, desktop users have no pointer. Should be scoped to `@media (pointer: fine)` and disabled for reduced-motion.
- `user-select: none` is applied to the calendar, event record, about page, and search sheet — readers cannot copy a quote, date, or citation.
- Reduced motion only gates GSAP entrances; the 242-frame scroll scrub **still runs** for users with `prefers-reduced-motion: reduce`.

---

## 3. Checkpoint scorecard (2nd Evaluation Parameters)

### Parameter 1 — Additional pages implemented, and pages linked together

| Requirement | Status | Evidence |
|---|---|---|
| Multiple additional pages exist | ✅ | 5 routes: `/`, `/calendar`, `/event/:date`, `/about`, `*` |
| Pages are linked together | ✅ | Navbar (`Calendar`, `Search`, `About`), calendar → about, event → previous/next → calendar |
| Dynamic page routing | ✅ | `/event/:date` with per-record data and adjacent navigation |
| 404 / not-found handling | ✅ | `NotFoundPage` on `*` |
| **Contribute / submission page** | ❌ | **Not in the repository.** The screen exists only as the supplied design. No route, no component, no nav link. |
| Contribute entry point in navigation | ❌ | Navbar has only Calendar / Search / About |
| Cross-links into the submission flow | ❌ | No “submit a record / add evidence / report a correction” link from About or event pages |

**Verdict: PARTIAL — 4 of 7 checks.** The multi-page requirement is largely satisfied, but the one page the evaluation is really about (forms) is missing.

### Parameter 2 — JavaScript interactions (forms with validation, event handling, UX)

| Interaction | Status | Notes |
|---|---|---|
| Calendar selection, hover preview, month switching | ✅ | Fully interactive, keyboard-reachable day buttons |
| Search: live filtering, ↑/↓, Enter, Esc, focus trap, focus restore | ✅ | Works; matching logic regressed (2.2) |
| Custom cursor with contextual labels | ✅ | `data-cursor` → VIEW / OPEN / VIEW PLATE |
| Page transitions | ✅ | Framer Motion `AnimatePresence mode="wait"` |
| Scroll-driven opening animation | ✅ | Canvas frame scrub + sticky stage |
| Scroll reveals, image clip/scale, timeline | ✅ | GSAP ScrollTrigger |
| Gallery lightbox with keyboard + focus restore | ✅ | `ArchiveGallery.tsx` |
| Ambient audio toggle + typewriter SFX | ✅ | Web Audio synthesis, no audio files |
| Reduced motion / coarse pointer handling | ⚠️ | Present, but the frame scrub and `cursor: none` ignore it |
| **Form field interactions** | ❌ | No form exists |
| **Client-side validation + inline errors** | ❌ | None |
| **File upload, preview, remove** | ❌ | None |
| **Submit loading / success / failure states** | ❌ | None |
| **Double-submit and duplicate guards** | ❌ | None |

**Verdict: PARTIAL — strong on browsing/scroll UX, zero on forms.** The evaluation sheet explicitly names “forms with validation,” so this is the main gap.

### Parameter 3 — Form submission

| Requirement | Status |
|---|---|
| Submission form rendered | ❌ |
| Submit handler wired | ❌ |
| Required-field prompt (name, date, description) | ❌ |
| Optional image/video evidence | ❌ |
| Submission result shown to the user | ❌ |

**Verdict: NOT STARTED in code.** The design (dark olive page, “Contribute to the Archive”, four fields, dashed upload zone, “SUBMIT AND SAVE JSON”) is the only artifact. The button is literally labelled “SAVE JSON”, which confirms current thinking is a client-side file download.

### Parameter 4 — Saving submitted form data to local JSON files

| Requirement | Status | Notes |
|---|---|---|
| Any persistence implemented | ❌ | No server, no API route, no `fs` write |
| Local JSON file store | ❌ | Not present |
| Client-side JSON **download** (friend’s approach) | ❌ | Not even committed — and it is the wrong behaviour: it hands the file to the *visitor’s* Downloads folder, not the project |
| Admin/read-back of submissions | ❌ | None |

**Verdict: NOT STARTED.** Downloading a JSON blob is not “saving submitted data to local JSON files” — the data must land on the project’s own filesystem. This needs a small server (see §5).

### Overall score

```text
Parameter 1  Pages + linking        4 of 7 checks    ██████░░░░  57%   (contribute page missing)
Parameter 2  JS interactions        8 of 14 checks   ██████░░░░  57%   (browsing strong, all form checks missing)
Parameter 3  Form submission        0 of 5 checks    ░░░░░░░░░░   0%
Parameter 4  JSON persistence       0 of 4 checks    ░░░░░░░░░░   0%
Build health                        tsc fails        ░░░░░░░░░░   0%
```

---

## 4. Prioritised gap list

### P0 — Must fix before anything else

1. Repair `npm run build` (remove the two unused imports).
2. Decide and remove the duplicate frame directory (`src/frames`), verify the opening still works from `public/frames`.
3. Commit or delete the staged `Newspaper_Floating.mp4` rename; it is unreferenced.
4. Replace the prefix-only search with the typed ranked search (restores keyword/category matching).

### P1 — Required by the evaluation sheet

5. Build `/contribute` page + navbar link.
6. Build the form with validation, file input, and submission states.
7. Add a real submission endpoint that appends to a JSON file on the server.
8. Add success/error UI and a submission receipt (accession ID).

### P2 — Quality, safety, and demo polish

9. Form hardening: server-side validation, file type/size limits, atomic writes, rate limiting.
10. Accessibility: scope `cursor: none` to fine pointers, restore text selection on reading pages, honour reduced motion for the frame scrub.
11. Documentation: write `README.md` (setup, scripts, API contract, folder map).
12. Performance: batch/decode frame preloading, mobile frame stride, AVIF/WebP consideration.
13. Cross-links from About and event records into the submission flow.
14. Optional admin view listing submitted records (`GET /api/submissions`).

---

## 5. Changing “save JSON file” into real persistence

### 5.1 Current vs target

```text
CURRENT (friend's approach, not in repo)
  form ──► JSON.stringify ──► Blob ──► <a download> ──► visitor's Downloads folder
  ✗ data never reaches the project
  ✗ no validation, no record of receipt
  ✗ no way to review submissions

TARGET
  form ──► POST /api/submissions (multipart) ──► server validation
                                            ──► uploads/evidence file
                                            ──► append to server/data/submissions.json
                                            ──► 201 { id, receivedAt }
  visitor sees a receipt; maintainer can open one JSON file
```

### 5.2 Options considered

| Option | How it works | Pros | Cons | Recommendation |
|---|---|---|---|---|
| **A. Express server + `fs`** | `server/index.mjs` exposes `POST /api/submissions`, writes JSON + uploads | Real server-side persistence, works for evaluation, easy to explain, reusable API | Needs a second process; serverless hosts have ephemeral disks | ✅ **Recommended** |
| B. Vite plugin middleware | Custom Vite plugin handles `/api` in dev | One command, no Express | Dev-only; disappears in production build | Acceptable fallback |
| C. Vite `configureServer` + `fs` | Same as B, inline | Minimal files | Not a real submission path | ❌ |
| D. Cloud DB (Supabase/Firebase) | Direct client writes | Production-grade | Requires accounts/keys; heavier for evaluation; no local JSON | Later migration |
| E. Browser download (current idea) | Blob + anchor | Zero backend | Data is not saved to the project | ❌ Reject |

### 5.3 Proposed API contract

```http
POST /api/submissions
Content-Type: multipart/form-data

name         string   required, 2–120 chars
date         string   required, YYYY-MM-DD, must be a real date, not in the future
description  string   required, 20–4000 chars
evidence     file     optional, image/jpeg|png|webp or video/mp4|webm, ≤ 20 MB

201 Created
{
  "id": "SUB-20261028-0001",
  "receivedAt": "2026-10-28T20:11:45.000Z",
  "status": "pending"
}
```

```http
400 Bad Request   { "errors": { "date": "Enter a valid historical date." } }
413 Payload Too Large
429 Too Many Requests
500 Internal Server Error
```

### 5.4 Stored record shape (`server/data/submissions.json`)

```json
[
  {
    "id": "SUB-20261028-0001",
    "receivedAt": "2026-10-28T20:11:45.000Z",
    "status": "pending",
    "name": "Dr. E. Vance",
    "date": "1969-07-20",
    "description": "Photograph of the mission control room, 20 July 1969…",
    "evidence": {
      "originalName": "mission-control.jpg",
      "storedName": "SUB-20261028-0001-mission-control.jpg",
      "mimeType": "image/jpeg",
      "size": 1843200,
      "path": "uploads/SUB-20261028-0001-mission-control.jpg"
    }
  }
]
```

Rules: pretty-print with 2 spaces, write to a temp file then `rename()` (atomic), serialise writes through an in-process queue, never commit `server/uploads/*`, keep `server/uploads/.gitkeep`.

### 5.5 Server-side validation (never trust the browser)

- Trim and normalise all strings; reject control characters.
- `date`: `/^\d{4}-\d{2}-\d{2}$/`, valid calendar date, `<= today`, year ≥ 1.
- `description`: min 20, max 4000 characters.
- `evidence`: MIME **and** extension check; magic-byte sniff if possible; reject `.svg` (XSS) and executables; cap 20 MB.
- Strip path components from upload filenames; generate server-side names.
- Optional: honeypot field + per-IP rate limit (e.g. 5 submissions / 10 min).
- Escape nothing on write (JSON is data, not HTML); escape at render time if an admin view is added.

### 5.5a Honest limitation to state in the viva

A JSON file is correct **for this evaluation** (“saving to local JSON” is an explicit requirement) but it is not production storage: it is single-writer, has no concurrency control across processes, no querying, and is wiped on serverless/container redeploys. The API boundary means we can later swap the store for SQLite/Postgres without touching the UI.

### 5.6 Frontend submission module

`src/api/submissions.ts`

```ts
export interface SubmissionResult { id: string; receivedAt: string; status: 'pending' }
export class SubmissionError extends Error { constructor(message: string, readonly fields?: Record<string, string>) { super(message) } }

export async function submitRecord(input: {
  name: string; date: string; description: string; evidence?: File | null
}): Promise<SubmissionReceipt> { /* fetch('/api/submissions', { method:'POST', body: FormData }) */ }
```

Keep the fetch wrapper free of React so it can be reused and unit-tested.

---

## 6. Plan of action

### Phase 0 — Stabilise the baseline (half day)

| # | Task | Files |
|---|---|---|
| 0.1 | Remove unused `React` default import and `formatAccession` import; confirm `npm run build` is green | `components/ArchiveShell.tsx`, `pages/ArchiveOpeningPage.tsx` |
| 0.2 | Delete duplicate `src/frames/` (19 MB); confirm `/frames/*.jpg` still resolves from `public/frames` | `src/frames/` |
| 0.3 | Commit or delete the unreferenced `Newspaper_Floating.mp4`; delete dead `App.css` / `index.css` if unused | `src/assets/`, `src/` |
| 0.4 | Write a real `README.md` (setup, scripts, structure, routes, data model) | `README.md` |
| 0.5 | Replace prefix-only search with typed ranked search; keep keyboard UX | `hooks/useArchiveSearch.ts`, `data/selectors.ts`, `types.ts` |

**Exit criteria:** `npm run build` succeeds; `npm run dev` shows all five routes; search returns Apollo 11 for `moon`, `nasa`, and `space`; repository is ~19 MB lighter.

### Phase 1 — Contribute page shell and route (1 day)

| # | Task | Files |
|---|---|---|
| 1.1 | Create `ContributePage` and register `/contribute` inside `ArchiveShell` | `src/pages/ContributePage.tsx`, `src/App.tsx` |
| 1.2 | Add `Contribute` to the navbar (after About); ensure active state | `components/ArchiveShell.tsx` |
| 1.3 | Build the page layout to match the supplied design (return link, eyebrow, headline, lede, form column) | `styles.contribute.css`, `main.tsx` |
| 1.4 | Add cross-links: About → Contribute; event record footer → “Submit evidence or a correction” | `pages/AboutPage.tsx`, `pages/HistoricalMomentPage.tsx` |

**Design contract (from the reference screen)**

| Element | Spec |
|---|---|
| Page surface | Muted dark olive, approx. `#2f2b23`, full viewport, subtle paper grain |
| Return link | Top-left, uppercase mono 11px, letter-spacing 0.12em, underline, `← RETURN TO CALENDAR` → `/calendar` |
| Eyebrow | `ARCHIVE PORTAL / RECORD SUBMISSION`, gold, 10–11px, uppercase |
| Headline | `Contribute to the / Archive`, Bodoni-style display serif, ~64px desktop / ~40px mobile, cream |
| Lede | 15–16px serif, muted cream, max ~52ch |
| Labels | Bold condensed uppercase, 11–12px, cream, required `*` in gold |
| Inputs | Transparent, 1px muted brass border, 44px min height, cream text, no radius |
| Textarea | ~6 rows, same treatment, subtle resize affordance |
| Evidence zone | Dashed 1px border, label, custom “Choose file” button + chosen filename text |
| Submit | Full width, near-black `#141210`, cream uppercase label, 48px height |
| Layout | Centred content column ~470–520px; generous vertical rhythm; single column on mobile |

> Change the button copy from **“SUBMIT AND SAVE JSON”** to **“SUBMIT RECORD”** once the API exists. The old label advertises the wrong behaviour.

### Phase 2 — Validation and form UX (1 day)

| # | Task | Files |
|---|---|---|
| 2.1 | Pure validators: required, length, ISO date, not-future, file type/size | `src/data/validation.ts` |
| 2.2 | Form state hook: values, touched, errors, dirty, submitting | `src/hooks/useContributionForm.ts` |
| 2.3 | Accessible fields: `<label for>`, `aria-invalid`, `aria-describedby`, error text | `components/contribute/*` |
| 2.4 | Character counter for description; inline date hint | same |
| 2.5 | File input: hidden native input, styled trigger, filename, image thumbnail, remove button | `components/contribute/EvidenceField.tsx` |
| 2.6 | Submit states: idle → validating → submitting (disabled + spinner/label) → success receipt / error panel | `ContributeForm.tsx` |
| 2.7 | Success receipt shows accession ID, date filed, “pending review”, link back to calendar | `components/contribute/SubmissionReceipt.tsx` |
| 2.8 | Guard double submit; preserve values on network failure; reset only after success | hook |

Validation rules (client, mirrored on server):

| Field | Rule | Message |
|---|---|---|
| name | required, 2–120 | “Enter the name to credit on this record.” |
| date | required, valid, not future | “Enter a valid historical date, not a future date.” |
| description | required, 20–4000 | “Add at least 20 characters of historical context.” |
| evidence | optional; JPEG/PNG/WebP/MP4/WebM ≤ 20 MB | “Attach an image or video under 20 MB.” |

### Phase 3 — Submission endpoint and JSON persistence (1–1.5 days)

| # | Task | Files |
|---|---|---|
| 3.1 | Express server with `POST /api/submissions`, `GET /api/submissions`, `GET /api/health` | `server/index.mjs` |
| 3.2 | Atomic JSON store with write queue and ID generation | `server/store.mjs` |
| 3.3 | Multipart upload handling + disk storage under `server/uploads/` | `server/index.mjs` |
| 3.4 | Server-side validation module shared in spirit with the client rules | `server/validation.mjs` |
| 3.5 | Vite dev proxy `/api` → `http://localhost:8787` | `vite.config.ts` |
| 3.6 | Scripts: `dev:api`, `dev:full` (`concurrently`), keep `dev` and `build` semantics | `package.json` |
| 3.7 | Frontend API wrapper with typed errors and field mapping | `src/api/submissions.ts` |
| 3.8 | Ignore `server/uploads/*` but keep the directory | `.gitignore`, `server/uploads/.gitkeep` |
| 3.9 | Seed the store with `[]` and document the schema | `server/data/submissions.json` |

**Exit criteria:** submitting the form appends exactly one object to `server/data/submissions.json`, the file is valid JSON, the uploaded file lives in `server/uploads/`, and the UI shows the returned accession ID. Reloading `/api/submissions` returns the new record.

### Phase 4 — Hardening and accessibility (half day)

| # | Task |
|---|---|
| 4.1 | Rate limit submissions; honeypot field |
| 4.2 | Reject disallowed MIME types and oversized payloads with clean 400/413 responses |
| 4.3 | Scope `cursor: none` to fine pointers; restore text selection on reading pages |
| 4.4 | Honour reduced motion in the frame scrub (static representative frame) |
| 4.5 | Focus the success receipt after submit; announce status with `aria-live="polite"` |
| 4.6 | Confirm mobile layout of the form at 320 / 390 / 768 px |

### Phase 5 — Documentation, demo, and sign-off (half day)

| # | Task |
|---|---|
| 5.1 | README: what it is, stack, install, scripts, routes, data model, API contract, JSON location |
| 5.2 | Add a short “How to submit a record” section with a screenshot |
| 5.3 | Prepare the evaluation demo script (below) |
| 5.4 | Optional: Vitest tests for validators and search ranking |
| 5.5 | Deploy preview (note: serverless = ephemeral JSON) |

---

## 7. File change map

```text
archive-app/
├── server/                              ← NEW
│   ├── index.mjs                        Express app + routes
│   ├── store.mjs                        atomic JSON read/append + IDs
│   ├── validation.mjs                   server-side rules
│   ├── data/submissions.json            [] → appended submissions
│   └── uploads/.gitkeep                 evidence files (git-ignored)
├── src/
│   ├── api/submissions.ts               ← NEW  typed fetch wrapper
│   ├── data/validation.ts               ← NEW  shared pure validators
│   ├── hooks/useContributionForm.ts     ← NEW  form state machine
│   ├── components/contribute/
│   │   ├── ContributeForm.tsx           ← NEW
│   │   ├── FormField.tsx                ← NEW
│   │   ├── EvidenceField.tsx            ← NEW
│   │   └── SubmissionReceipt.tsx        ← NEW
│   ├── pages/ContributePage.tsx         ← NEW
│   ├── styles.contribute.css            ← NEW
│   ├── App.tsx                          add /contribute route
│   ├── components/ArchiveShell.tsx      nav link; fix unused React import
│   ├── pages/ArchiveOpeningPage.tsx     fix unused import
│   ├── hooks/useArchiveSearch.ts        delegate to ranked search
│   ├── pages/AboutPage.tsx              link to Contribute
│   ├── pages/HistoricalMomentPage.tsx   link to Contribute
│   └── main.tsx                         import styles.contribute.css
├── vite.config.ts                       /api proxy
├── package.json                         dev:api / dev:full scripts
├── README.md                            rewrite
└── docs/EVALUATION-2-AUDIT-AND-PLAN.md  this document
```

---

## 8. Evaluation demo script

Run `npm run dev:full`, then demonstrate in this order:

**Parameter 1 — pages and linking**
1. Open `/` → scroll the newspaper sequence → “Browse date index”.
2. `/calendar` → select 20 July → open the record → use Previous/Next.
3. Navbar → About → Contribute → Return to Calendar (prove they are linked).

**Parameter 2 — interactions**
4. Hover calendar days (preview slip, cursor label); switch months; keyboard-tab to a day and press Enter.
5. Open Search, type `moon` (shows Apollo 11 via keyword match), navigate with ↑/↓, press Enter.
6. Open an event gallery plate → lightbox → arrow keys → Esc (focus returns).
7. Toggle Sound and type in search (typewriter clicks).

**Parameters 3 & 4 — submission and storage**
8. On `/contribute`, submit empty → three inline errors, focus moves to the first invalid field.
9. Enter a future date → date error.
10. Attach a 30 MB file → size error; attach a PDF → type error.
11. Fill valid data + a JPG → submit → button shows submitting → receipt with `SUB-…` ID.
12. Open `server/data/submissions.json` → the record is there; open `server/uploads/` → the file is there.
13. Show the same record via `GET /api/submissions`.

---

## 9. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Build is red at HEAD | No deploy, failed evaluation | Phase 0.1, add `npm run build` to a pre-push routine |
| Filesystem writes on serverless hosts (Vercel/Netlify) are ephemeral | Submissions vanish after redeploy | Document clearly; deploy the API on Render/Railway/Fly with a volume, or migrate to SQLite/Postgres |
| Large uploads bloat the repo | Slow clones, accidental PII in git | `server/uploads/*` ignored; 20 MB cap; never commit evidence |
| Unmoderated user content | Abuse, defamation, PII | `status: "pending"`, maintainer review before publishing, honeypot + rate limit |
| Duplicate 38 MB of frames | Repo weight, slow CI | Delete `src/frames`, keep `public/frames`; consider AVIF + mobile stride |
| Search regression | Evaluation asks for keyword/category search | Restore ranked `searchEvents()` in this phase |
| Accessibility regressions (`cursor:none`, `user-select:none`) | Usability/accessibility review | Scope both, honour reduced motion |
| Teammates working on `main` concurrently | Merge conflicts (already happened: `ea1258c`) | Feature branches + PRs; run build before merge |

---

## 10. Decisions needed before Phase 3

1. **Backend shape** — Express (recommended), Vite middleware, or a cloud database?
2. **Evidence storage** — server disk (recommended for the evaluation), base64 inside JSON, or cloud object storage?
3. **Moderation** — auto-append as `pending` (recommended) or publish immediately?
4. **Deployment target** — must support a persistent disk if we keep JSON files.
5. **Copy protection** — keep `user-select: none` everywhere, or restore selection on reading pages?
6. **Search** — restore the earlier ranked search (recommended) or keep prefix-only?
7. **Repository naming** — the GitHub repo is `OneDayOneYear` while the product is “One Day, One Historical Moment”; should they be aligned before submission?

---

## 11. Definition of done for Evaluation 2

- [ ] `npm run build` passes with zero TypeScript errors.
- [ ] `/contribute` exists, is reachable from the navbar, and matches the supplied design.
- [ ] All form fields have labels, required markers, and accessible inline errors.
- [ ] Invalid date, short description, wrong file type, and oversized file are all blocked client- and server-side.
- [ ] Submit button has idle / submitting / success / error states and cannot double-submit.
- [ ] A successful submission appends one validated record to `server/data/submissions.json`.
- [ ] Uploaded evidence is stored server-side (or explicitly documented as link-only).
- [ ] Success receipt shows an accession ID and a link back to the archive.
- [ ] Search returns records for `moon`, `space`, `nasa`, and `civil rights`.
- [ ] `src/frames` duplication is removed; repository no longer carries 38 MB of frames.
- [ ] README documents setup, scripts, routes, data model, and the API contract.
- [ ] Mobile (320/390/768) and keyboard-only walkthroughs pass.
- [ ] Demo script in §8 runs end-to-end without console errors.

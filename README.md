# One Day, One Historical Moment

An interactive historical archive. A visitor enters through a cinematic opening, scrubs through a newspaper sequence, browses a month/day index, searches twenty historical records, and opens an editorial long-form record for a single date. Visitors can also submit a record with optional evidence for review.

Built with React 19, Vite 8, TypeScript, React Router 7, GSAP, Framer Motion, and Vanilla CSS. Fonts are self-hosted so the site works offline.

---

## Quick start

```bash
cd OneDayOneYear-main
npm install
npm run dev:full
```

`dev:full` starts both processes:

| Process | URL | Purpose |
|---|---|---|
| Vite | http://127.0.0.1:5173 | The website |
| API | http://127.0.0.1:8787 | Submission endpoint and JSON store |

Open http://127.0.0.1:5173.

If you only need to browse the archive, `npm run dev` is enough. Submissions will show an API-offline message until the server is running.

### Individual commands

```bash
npm run dev        # website only
npm run dev:api    # API only
npm run dev:full   # both, with clean shutdown
npm run build      # type-check + production build
npm run preview    # serve dist
npm run preview:full  # built site + API
npm run lint       # oxlint
```

---

## Routes

| Route | Page | Notes |
|---|---|---|
| `/` | Archive opening | Scroll-scrubbed 242-frame sequence |
| `/calendar` | Date index | Month selector, month/day grid, preview slip, month record list |
| `/event/:date` | Historical record | Hero, story, timeline, film, quote, impact, gallery |
| `/contribute` | Submission form | Validation, optional evidence, receipt |
| `/submit` | Redirect | Permanently redirects to `/contribute` |
| `/admin/submissions` | Archive office | Read-only list of submitted records |
| `/about` | About the archive | Linked to the calendar and submission form |
| `*` | Not found | Archive-styled 404 |

---

## Project structure

```
OneDayOneYear-main/
├── server/                     Express API (Node)
│   ├── index.mjs               Routes, rate limit, file handling
│   ├── validation.mjs          Server-side validation rules (see below)
│   ├── data/submissions.json   The record store
│   └── uploads/                Evidence files (git-ignored)
├── src/
│   ├── components/
│   │   ├── contribute/         ContributeForm, TextField, TextAreaField, EvidenceField, Receipt
│   │   └── …                   Calendar, record, gallery and shared UI
│   ├── pages/                  ContributePage, AdminSubmissionsPage, Archive, Calendar, Record, About
│   ├── data/
│   │   ├── events.ts           Archive content (20 records)
│   │   ├── selectors.ts        Date formatting, indexing, search
│   │   └── validation.ts       Client-side form validation
│   ├── hooks/
│   │   ├── useContributionForm.ts
│   │   ├── useFrameSequence.ts
│   │   └── ...
│   ├── api/submissions.ts      Typed fetch wrapper
│   ├── assets/fonts/           Self-hosted WOFF2 + licences
│   └── styles*.css             Design tokens, refinement layer, submission styles
├── public/frames/              242-frame sequence (19 MB)
└── docs/EVALUATION-2-AUDIT-AND-PLAN.md
```

---

## Submission flow

```text
/contribute
  ↓ client validation (src/data/validation.ts)
POST /api/submissions  (multipart/form-data)
  ↓ server validation (server/validation.mjs)
  ↓ evidence → server/uploads/<accession>-evidence.<ext>
  ↓ atomic append → server/data/submissions.json
201 { id, receivedAt, status }
  ↓
Receipt with accession number (e.g. SUB-20261028-0003)
```

### API contract

```http
POST /api/submissions
Content-Type: multipart/form-data

name         string   required, 2–120 characters
date         string   required, YYYY-MM-DD, valid, not in the future
description  string   required, 20–4000 characters
evidence     file     optional, JPEG/PNG/WebP/MP4/WebM, ≤ 20 MB
```

```json
201 Created
{
  "id": "SUB-20261028-0003",
  "receivedAt": "2026-10-28T20:49:00.000Z",
  "status": "pending",
  "name": "Harshita Rao",
  "date": "1969-07-20"
}
```

```json
400 Bad Request
{
  "message": "Some fields need attention.",
  "errors": { "date": "The date cannot be in the future." }
}
```

Other responses: `413` oversized evidence, `429` rate limited, `500` store failure.

```http
GET /api/submissions   → { count, submissions: [...] }
GET /api/health        → { ok: true, records: 3 }
```

### Stored record

```json
{
  "id": "SUB-20261028-0002",
  "receivedAt": "2026-10-28T20:48:41.064Z",
  "status": "pending",
  "name": "A. Shrivastava",
  "date": "1989-11-09",
  "description": "Press photograph of the Bornholmer Strasse crossing…",
  "evidence": {
    "originalName": "evidence.png",
    "storedName": "SUB-20261028-0002-evidence.png",
    "mimeType": "image/png",
    "size": 70,
    "path": "uploads/SUB-20261028-0002-evidence.png"
  }
}
```

### Validation rules

| Field | Rule |
|---|---|
| `name` | 2–120 characters after trimming; control characters stripped |
| `date` | `YYYY-MM-DD`, real calendar date, year ≥ 1, not in the future |
| `description` | 20–4,000 characters |
| `evidence` | MIME allow-list, 20 MB cap, non-empty; stored under a server-generated name |

### Safety

- Writes are serialised through a promise queue and land via temp file + `rename()`.
- Evidence filenames are generated server-side; the original name is display-only.
- Rate limit: 10 submissions per IP per 10 minutes (`SUBMISSION_RATE_LIMIT` to override).
- Uploads are written to `server/uploads/` and excluded from Git.

> The JSON store satisfies the local-file requirement and is easy to inspect. It is single-writer and will not survive redeploys on serverless hosts. The API boundary means it can be swapped for SQLite/Postgres without changing the UI.

---

## Archive data model

`src/types.ts` defines `HistoricalEvent`:

```ts
{
  date, title, year, category, keywords[],
  shortDescription, fullStory,
  heroImage, galleryImages[], video | null,
  timeline[], quote?, quoteAttribution?, impact?
}
```

Twenty records live in `src/data/events.ts`. The calendar indexes by **month and day across years**; it does not pretend the archive has a single calendar year.

---

## Fonts and offline use

All four families are self-hosted in `src/assets/fonts/` and declared in `src/fonts.css`:

- Bodoni Moda (variable, display)
- Source Serif 4 (variable, reading)
- IBM Plex Mono (400/500, metadata)
- IBM Plex Sans Condensed (400/500/600, UI)

There are no requests to `fonts.googleapis.com` or `fonts.gstatic.com`. Provenance and licences are in `src/assets/fonts/FONT-SOURCES.md` and `src/assets/fonts/licenses/`. Total payload is about 227 KB.

---

## Accessibility and motion

- Custom cursor is enabled only for fine pointers and only when reduced motion is not requested.
- Text selection is enabled on reading pages (record and about).
- Modals trap focus and restore it on close.
- Form fields have associated labels, `aria-invalid`, `aria-describedby`, inline errors, and a focus target after failed submission.
- `prefers-reduced-motion` renders a single still frame instead of the scroll sequence.

---

## Performance notes

- The opening sequence loads the first frame immediately, then the rest in batches of eight.
- Mobile uses a wider frame stride: every 2nd frame up to 1024 px, every 3rd frame up to 560 px.
- `public/frames` is the only frame set; `src/frames` duplication should stay removed.
- Images elsewhere are lazy-loaded with resilient fallbacks.

Converting the sequence to AVIF/WebM would reduce the payload further; that is not implemented yet because the canvas scrub depends on discrete images.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| “Could not reach the archive API” | API not running | `npm run dev:api` or `npm run dev:full` |
| Submission returns 429 | Rate limit reached | Wait 10 minutes or restart the API |
| TypeScript build fails | Unused imports or type drift | `npm run build` and fix the reported file |
| Fonts look like Times New Roman | Local font files missing | Confirm `src/assets/fonts/*.woff2` exists |

---

## Known limitations

- No authentication on `/admin/submissions`; it is a local review view, not a production admin panel.
- Submissions are `pending` forever until a moderation workflow exists.
- No automated tests yet; validation was verified through API requests and browser runs.
- Search still uses the v1.5 prefix/date/month matcher. Restoring keyword and category scoring remains the next Phase 0 item.

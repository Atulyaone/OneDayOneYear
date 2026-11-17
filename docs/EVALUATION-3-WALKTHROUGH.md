# Evaluation 3 — full backend walkthrough (Express + Node)

Everything to click, type and say. Two Chrome windows, one terminal pair.

Verified outputs below were captured against the running API on 2026-11-17.

---

## 0. Pre-flight (T-10 min)

```bash
cd "/Users/atulya/College Stuff/OneDayOneYear-main"
lsof -ti:5173 -ti:8787 | xargs kill
npm run dev            # terminal 1 → Vite :5173
npm run dev:debug      # terminal 2 → "Debugger listening on ws://127.0.0.1:9229/…"
```

Checks before you start talking:

```bash
curl -s http://127.0.0.1:8787/api/health      # {"ok":true,"records":2}
curl -s http://127.0.0.1:8787/api/submissions # {"count":2,...}
```

- Store currently holds **2 records**; the admin register will show 2 rows.
- Rate limit is in-memory, 10 POSTs / 10 min, per process. **Restart the API** to reset it.
  For rehearsals: `SUBMISSION_RATE_LIMIT=100 npm run dev:debug`
- Do **not** run `dev:full` while using `dev:debug` — it holds 8787 and the debugger never opens.

Windows to have ready:

| Window | What | URL |
| --- | --- | --- |
| W1 | page DevTools | http://localhost:5173/contribute |
| W2 | Node DevTools | `chrome://inspect` → inspect `server/index.mjs` |

---

## 1. Opening (say this first, 30 s)

> "Two processes: Vite on 5173 serving the React app, Express on 8787 serving the API.
> The browser calls `/api/...` on its own origin and Vite proxies it to Express —
> `vite.config.ts:7-14` — which is why there is no CORS configuration. The API is plain
> Node ESM, no build step: three routes, a multer upload parser, server-side validation,
> and a JSON file store with atomic writes."

| Method | Path | Handler |
| --- | --- | --- |
| POST | `/api/submissions` | `server/index.mjs:83` |
| GET | `/api/submissions` | `:74` |
| GET | `/api/health` | `:65` |
| any | `/api/*` | `:147` JSON 404 |

---

## 2. Evidence 1 — the browser's request (W1)

1. `http://localhost:5173/contribute`
2. Cmd+Opt+I → **Network** → filter **Fetch/XHR** → tick **Preserve log** → **Disable cache**
3. Fill: name (any), a past date, 20+ characters. Submit.
4. Click the `submissions` row:
   - **Headers**: `Request Method POST`, `Content-Type: multipart/form-data; boundary=----WebKitFormBoundary…`
   - **Payload**: `name`, `date`, `description`, `evidence`
   - **Response**: `201` + `{ "id": "SUB-…", "receivedAt": "…", "status": "pending", "name": "…", "date": "…" }`

> Say: "Multipart, not JSON, because the evidence is a File. The browser generates the
> boundary; the code never sets Content-Type."

---

## 3. Evidence 2 — the client code path (W1 Sources)

Breakpoints: Sources → **Cmd+P** → `submissions.ts` → **41**, **50**, **66**.

Submit again.

| Stop | What to do in the console (Esc opens the drawer) |
| --- | --- |
| `:41` | `values` → the form state; `values.evidence?.name` |
| `:42-46` | step; `[...body.entries()]` → four parts, evidence is a `File` |
| `:50` | F10 over `fetch` → `response.status` → `201` |
| `:57` | F10 → `payload` → the receipt object |
| `:66` | F10 → returns to `useContributionForm.ts:68` |
| `useContributionForm.ts:69-70` | F10 twice → `setReceipt(result)`, `setStatus('success')` |

Then F8: the form is replaced by the receipt card (`ContributeForm.tsx:33-35`).

> Say: "The API layer builds FormData, posts it, turns a non-2xx into a SubmissionError
> carrying field messages, and returns the receipt the hook stores."

Related lines if asked: `ContributeForm.tsx:20` (`preventDefault`), `:40` (`noValidate`),
client rules `validation.ts:58-88`.

---

## 4. Attach the server debugger (W2)

1. New tab: **`chrome://inspect`**
2. Under **Remote Target** click **inspect** on `server/index.mjs`
   - Target missing → **Configure…** → add `localhost:9229`
   - Still missing → `dev:debug` isn't running (you're on `dev:full`)
3. In W2: **Sources → Filesystem → Add folder to workspace** → project root
4. Open `server/index.mjs`; breakpoints: **98**, **100**, **104**, **133**
5. Open `server/store.mjs`; breakpoints: **60**, **66**, **69**

W2 is Node's runtime: `req` exists, `document` does not. W1 has the opposite.

---

## 5. Evidence 3 — the server, line by line

Submit again from W1. Then walk it exactly like this.

### 5.1 `index.mjs:98` — validation

```js
req.method                     // 'POST'
req.body                       // { name, date, description }
req.file                       // undefined, or { mimetype, size, buffer, originalname }
req.headers['content-type']    // 'multipart/form-data; boundary=…'
```

**F11** into `validateSubmission` (`validation.mjs:46`):
- `:48-50` `clean()` strips control characters and trims each field
- `:52-64` name/date/description rules
- `:66-74` file rules against `ALLOWED_EVIDENCE` (`:9-15`)

Return with `errors` empty and `values` cleaned.

> Say: "The server repeats every client rule because fetch can be called without the UI.
> It also cleans control characters, which the browser never would."

### 5.2 `index.mjs:100` — the rejection branch (skip on the happy path)

Only taken when `Object.keys(errors).length > 0`. Demonstrated separately in §8.

### 5.3 `index.mjs:104` → `store.mjs` — the write

**F11** into `store.mjs:60` (the queued callback):

| Stop | Inspect | Meaning |
| --- | --- | --- |
| `store.mjs:61` | `existing.length` | fresh read **inside** the queue |
| `:38` (from `buildAccession`, F11) | `prefix`, `maxSeq` | `SUB-20261117-` + max + 1 |
| `:64` | `existing.length` after push | record appended in memory |
| `:66` | `temporary` | `…submissions.json.<pid>.<ts>.tmp` |
| `:67` | — | serialize with 2-space indent |
| `:69` | — | `rename` = atomic replace |
| `:75` | `record` | what the route receives back |

Then back in `index.mjs`:

| Stop | Inspect |
| --- | --- |
| `:106` | `id` — the accession just allocated |
| `:112` (only if evidence) | `req.file.buffer.length`, `storedName` |
| `:122` | the full record object, `status: 'pending'` |

> Say: "Read-modify-write runs inside a promise queue, and the file is replaced via temp
> file + rename, so two submissions cannot interleave and a crash cannot truncate the JSON."

### 5.4 `index.mjs:133` — the response

```js
res.statusCode          // 201
```

F10 → `res.status(201).json({...})` executes. Only five fields leave the server
(`:133-139`): `id, receivedAt, status, name, date`.

---

## 6. Evidence 4 — the response lands in the UI

1. W1 Network: the request shows **201**; Response tab has the same five fields.
2. The receipt card appears with the accession number.
3. React DevTools → `ContributeForm` hooks → `receipt` is now an object, `status` is `success`.
4. Persistence proof **with no terminal** — W1 console:

```js
await (await fetch('/api/submissions')).json()   // count + both records, new one last
await (await fetch('/api/health')).json()        // { ok: true, records: 3 }
```

---

## 7. Evidence 5 — the read path (admin register)

1. `http://localhost:5173/admin/submissions`
2. Network: `GET /api/submissions` → `200`, `{ count, submissions[] }`
3. Sources → `src/api/submissions.ts:72` (fetch), `:83` (return)
4. `src/pages/AdminSubmissionsPage.tsx:28-46` — the `useEffect` with the `active` flag
   (guards "state updated after unmount")
5. Table at `:89-125`; note descriptions are stored but deliberately not displayed (`:127-129`)

> Say: "Same endpoint, GET, no rate limit. The page renders three states: loading, error, ready."

---

## 8. Error branches — verified outputs

Run these in a terminal during the demo, or quote them. Each maps to a breakpoint.

### 400 — validation

```bash
curl -s -X POST http://127.0.0.1:8787/api/submissions \
  -F "name=A" -F "date=2999-01-01" -F "description=short"
```

```json
{"message":"Some fields need attention.","errors":{"name":"Enter the name to credit on this record (2–120 characters).","date":"The date cannot be in the future.","description":"Add at least 20 characters of historical context (maximum 4,000)."}}
```

Stops at `index.mjs:100`. UI equivalent: submit a one-character name → banner + inline messages.

### 413 — payload too large

```bash
mkfile -n 21m /tmp/big.jpg
curl -s -X POST http://127.0.0.1:8787/api/submissions \
  -F "name=Test" -F "date=1969-07-20" -F "description=0123456789012345678901" \
  -F "evidence=@/tmp/big.jpg"
rm /tmp/big.jpg
```

```json
{"message":"Evidence must be 20 MB or smaller.","errors":{"evidence":"Evidence must be 20 MB or smaller."}}
```

Stops at `index.mjs:86` (`LIMIT_FILE_SIZE`), i.e. before validation — multer rejects mid-stream.
Client blocks this first (`validation.ts:80`), so 413 is proven by curl, not the UI.

### 404 — unknown API route

```bash
curl -s http://127.0.0.1:8787/api/nope
```

```json
{"message":"Unknown API route."}
```

`index.mjs:147-149`. No handler breakpoint; it's the catch-all.

### 429 — rate limit

```bash
for i in $(seq 1 10); do curl -s -o /dev/null -w "%{http_code} " -X POST \
  http://127.0.0.1:8787/api/submissions \
  -F "name=A" -F "date=bad" -F "description=x"; done; echo
```

Observed, with two attempts already spent: `400 400 400 400 400 400 400 429 429 429`

```
HTTP/1.1 429 Too Many Requests
Retry-After: 205
Content-Type: application/json; charset=utf-8
```

`index.mjs:47-63`. Attempts are counted **before** validation, so the first N return 400
and the rest 429. Restart the API to reset the window.

### 500 — write failure (optional, needs care)

```bash
chmod 444 server/data/submissions.json   # then submit
chmod 644 server/data/submissions.json   # restore immediately
```

`index.mjs:140-143` logs `Submission write failed:` and returns
`{"message":"The record could not be stored. Try again."}`. Skip if short on time.

---

## 9. Speedrun version (3 minutes, if they cut you short)

1. W1 Network → submit → show `POST`, multipart payload, `201`.
2. `submissions.ts:41` → `values`, `[...body.entries()]`.
3. W2 → `index.mjs:98` → `req.body`, `req.file`.
4. F11 to `store.mjs` → `existing`, temp path, `rename`.
5. `index.mjs:133` → `201` → receipt on screen.
6. Console: `await (await fetch('/api/health')).json()`.

---

## 10. Questions and answers

| Question | Answer |
| --- | --- |
| Why two servers? | Vite serves the SPA with HMR; Express owns data. Proxy keeps one origin, so no CORS. |
| Why not a database? | Requirement was a local JSON file; the store's queue + atomic rename makes it safe enough at this size. |
| How do you know a write succeeded? | `201` is sent only after `appendSubmission` resolves, i.e. after `rename` returns. |
| What stops duplicate records on double click? | `status === 'submitting'` guard (`useContributionForm.ts:53`) + disabled button (`ContributeForm.tsx:94`). |
| What stops two simultaneous submissions colliding? | Both queue on `writeQueue`; accession is allocated inside the queued callback. |
| Why is evidence not served back? | No `express.static`; the path is stored as metadata only. |
| Where is the rate limit state? | In a `Map` in memory, per process — resets on restart, not a security boundary. |
| Why does the receipt lack description/evidence? | The response deliberately returns five fields; the full record is in the JSON. |
| What happens if the API is down? | `fetch` rejects → `SubmissionError` with the "Could not reach the archive API" message (`submissions.ts:51-55`). |
| Is the API typed? | No — plain ESM `.mjs` so Node runs it without a build step; the client contract is typed in `api/submissions.ts`. |

---

## 11. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `chrome://inspect` has no target | `dev:full` running instead of `dev:debug` | kill 8787, run `npm run dev:debug` |
| Breakpoints in `index.mjs` never hit | wrong window, or API started without `--inspect` | check W2 shows `file:///…/server/index.mjs` |
| `req is not defined` | typing in W1's console | use W2 for server values |
| `document is not defined` | typing in W2 | use W1 for the page |
| `EADDRINUSE` | stale process | `lsof -ti:8787 \| xargs kill` |
| 429 during rehearsal | limiter exhausted | restart API or `SUBMISSION_RATE_LIMIT=100` |
| Breakpoints vanish | Node restarted | re-arm, or use "API: launch (breaks on first line)" |

Keys: **F8** resume · **F10** over · **F11** into · **Shift+F11** out · **Cmd+P** file · **Esc** console.

---

## 12. Cleanup

- W2: **Cmd+F8** (deactivate) or Breakpoints → *Remove all*
- Close W2, keep W1 if you want to show the receipt again
- `Ctrl+C` both terminals
- If you ran the 500 demo: confirm `chmod 644 server/data/submissions.json`

---

## 13. Limits to state before they are found

No auth on either route · MIME is client-declared (no magic-byte sniffing) · whole-file
rewrite per append · uploads written but not served · rate limit in memory · no automated
tests · `server/data/submissions.json` is tracked in git while uploads are ignored.

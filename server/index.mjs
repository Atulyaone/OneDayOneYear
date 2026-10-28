/**
 * Archive submission API.
 *
 *   POST /api/submissions   multipart form: name, date, description, evidence?
 *   GET  /api/submissions   list stored records
 *   GET  /api/health        liveness + record count
 *
 * Records are appended to server/data/submissions.json; evidence is written to
 * server/uploads and never committed.
 */

import express from 'express'
import multer from 'multer'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'

import {
  ALLOWED_EVIDENCE,
  MAX_EVIDENCE_BYTES,
  safeOriginalName,
  validateSubmission,
} from './validation.mjs'
import {
  UPLOAD_DIR,
  appendSubmission,
  buildAccession,
  ensureStore,
  readSubmissions,
} from './store.mjs'

const PORT = Number(process.env.PORT ?? 8787)
const RATE_LIMIT = Number(process.env.SUBMISSION_RATE_LIMIT ?? 10)
const RATE_WINDOW_MS = 10 * 60 * 1000

await ensureStore()

const app = express()
app.disable('x-powered-by')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_EVIDENCE_BYTES, files: 1 },
})

const attempts = new Map()

function rateLimit(req, res, next) {
  const key = req.ip ?? 'unknown'
  const now = Date.now()
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < RATE_WINDOW_MS)

  if (recent.length >= RATE_LIMIT) {
    const retryAfter = Math.ceil((RATE_WINDOW_MS - (now - recent[0])) / 1000)
    res.setHeader('Retry-After', String(retryAfter))
    return res.status(429).json({
      message: 'Too many submissions from this address. Try again in a few minutes.',
    })
  }

  recent.push(now)
  attempts.set(key, recent)
  next()
}

app.get('/api/health', async (_req, res) => {
  try {
    const submissions = await readSubmissions()
    res.json({ ok: true, records: submissions.length })
  } catch {
    res.status(500).json({ ok: false, message: 'Submission store is unavailable.' })
  }
})

app.get('/api/submissions', async (_req, res) => {
  try {
    const submissions = await readSubmissions()
    res.json({ count: submissions.length, submissions })
  } catch {
    res.status(500).json({ message: 'Could not read the submission store.' })
  }
})

app.post('/api/submissions', rateLimit, (req, res) => {
  upload.single('evidence')(req, res, async (uploadError) => {
    if (uploadError) {
      if (uploadError.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          message: 'Evidence must be 20 MB or smaller.',
          errors: { evidence: 'Evidence must be 20 MB or smaller.' },
        })
      }
      return res.status(400).json({
        message: 'The upload could not be processed.',
        errors: { evidence: 'The upload could not be processed.' },
      })
    }

    const { errors, values } = validateSubmission(req.body ?? {}, req.file)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Some fields need attention.', errors })
    }

    try {
      const record = await appendSubmission(async (existing) => {
        const receivedAt = new Date().toISOString()
        const id = buildAccession(existing, receivedAt)

        let evidence = null
        if (req.file) {
          const extension = ALLOWED_EVIDENCE[req.file.mimetype]
          const storedName = `${id}-evidence${extension}`
          await writeFile(path.join(UPLOAD_DIR, storedName), req.file.buffer)
          evidence = {
            originalName: safeOriginalName(req.file.originalname),
            storedName,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: `uploads/${storedName}`,
          }
        }

        return {
          id,
          receivedAt,
          status: 'pending',
          name: values.name,
          date: values.date,
          description: values.description,
          evidence,
        }
      })

      res.status(201).json({
        id: record.id,
        receivedAt: record.receivedAt,
        status: record.status,
        name: record.name,
        date: record.date,
      })
    } catch (error) {
      console.error('Submission write failed:', error)
      res.status(500).json({ message: 'The record could not be stored. Try again.' })
    }
  })
})

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Unknown API route.' })
})

app.listen(PORT, () => {
  console.log(`Archive submission API listening on http://127.0.0.1:${PORT}`)
  console.log(`Store: server/data/submissions.json  ·  Rate limit: ${RATE_LIMIT} / 10 min`)
})

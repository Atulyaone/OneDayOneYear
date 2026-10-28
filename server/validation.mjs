/**
 * Submission validation shared by the API.
 * The browser runs the same rules in src/data/validation.ts; this copy is the
 * authority because a client can be bypassed.
 */

export const MAX_EVIDENCE_BYTES = 20 * 1024 * 1024

export const ALLOWED_EVIDENCE = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
}

// Stripping control characters is deliberate: they are never valid in a name or note.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g

export function clean(value) {
  return typeof value === 'string' ? value.replace(CONTROL_CHARACTERS, '').trim() : ''
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return false
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export function safeOriginalName(name) {
  const base = clean(name).split(/[\\/]/).pop() ?? 'evidence'
  return base.slice(0, 120) || 'evidence'
}

export function validateSubmission(input, file) {
  const errors = {}
  const name = clean(input?.name)
  const date = clean(input?.date)
  const description = clean(input?.description)

  if (name.length < 2 || name.length > 120) {
    errors.name = 'Enter the name to credit on this record (2–120 characters).'
  }

  if (!isValidISODate(date)) {
    errors.date = 'Enter a valid historical date.'
  } else if (date > todayISO()) {
    errors.date = 'The date cannot be in the future.'
  }

  if (description.length < 20 || description.length > 4000) {
    errors.description = 'Add at least 20 characters of historical context (maximum 4,000).'
  }

  if (file) {
    if (!ALLOWED_EVIDENCE[file.mimetype]) {
      errors.evidence = 'Attach a JPEG, PNG, WebP, MP4, or WebM file.'
    } else if (file.size > MAX_EVIDENCE_BYTES) {
      errors.evidence = 'Evidence must be 20 MB or smaller.'
    } else if (file.size === 0) {
      errors.evidence = 'The selected file is empty.'
    }
  }

  return { errors, values: { name, date, description } }
}

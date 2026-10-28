/**
 * Client-side submission rules. The API repeats these checks in
 * server/validation.mjs because browser validation can be bypassed.
 */

export const MAX_EVIDENCE_BYTES = 20 * 1024 * 1024
export const MAX_DESCRIPTION_LENGTH = 4000
export const MIN_DESCRIPTION_LENGTH = 20

export const ACCEPTED_EVIDENCE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
]

export const EVIDENCE_ACCEPT = ACCEPTED_EVIDENCE_TYPES.join(',')

export interface ContributionValues {
  name: string
  date: string
  description: string
  evidence: File | null
}

export type ContributionField = 'name' | 'date' | 'description' | 'evidence'
export type ContributionErrors = Partial<Record<ContributionField, string>>

export const emptyContribution: ContributionValues = {
  name: '',
  date: '',
  description: '',
  evidence: null,
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function isValidISODate(value: string) {
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

function looksLikeAcceptedFile(file: File) {
  if (ACCEPTED_EVIDENCE_TYPES.includes(file.type)) return true
  return /\.(jpe?g|png|webp|mp4|webm)$/i.test(file.name)
}

export function validateContribution(values: ContributionValues): ContributionErrors {
  const errors: ContributionErrors = {}
  const name = values.name.trim()
  const description = values.description.trim()

  if (name.length < 2 || name.length > 120) {
    errors.name = 'Enter the name to credit on this record (2–120 characters).'
  }

  if (!isValidISODate(values.date)) {
    errors.date = 'Enter a valid historical date.'
  } else if (values.date > todayISO()) {
    errors.date = 'The date cannot be in the future.'
  }

  if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Add at least ${MIN_DESCRIPTION_LENGTH} characters of historical context (maximum ${MAX_DESCRIPTION_LENGTH.toLocaleString('en-GB')}).`
  }

  if (values.evidence) {
    if (!looksLikeAcceptedFile(values.evidence)) {
      errors.evidence = 'Attach a JPEG, PNG, WebP, MP4, or WebM file.'
    } else if (values.evidence.size > MAX_EVIDENCE_BYTES) {
      errors.evidence = 'Evidence must be 20 MB or smaller.'
    } else if (values.evidence.size === 0) {
      errors.evidence = 'The selected file is empty.'
    }
  }

  return errors
}

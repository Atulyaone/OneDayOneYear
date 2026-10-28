import type { ContributionValues } from '../data/validation'

export interface SubmissionReceipt {
  id: string
  receivedAt: string
  status: 'pending'
  name: string
  date: string
}

export interface StoredEvidence {
  originalName: string
  storedName: string
  mimeType: string
  size: number
  path: string
}

export interface StoredSubmission {
  id: string
  receivedAt: string
  status: 'pending'
  name: string
  date: string
  description: string
  evidence: StoredEvidence | null
}

export class SubmissionError extends Error {
  readonly fields?: Record<string, string>

  constructor(message: string, fields?: Record<string, string>) {
    super(message)
    this.name = 'SubmissionError'
    this.fields = fields
  }
}

const ENDPOINT = '/api/submissions'

export async function submitContribution(values: ContributionValues): Promise<SubmissionReceipt> {
  const body = new FormData()
  body.append('name', values.name.trim())
  body.append('date', values.date)
  body.append('description', values.description.trim())
  if (values.evidence) body.append('evidence', values.evidence)

  let response: Response
  try {
    response = await fetch(ENDPOINT, { method: 'POST', body })
  } catch {
    throw new SubmissionError(
      'Could not reach the archive API. Start it with “npm run dev:api”, or run “npm run dev:full”.',
    )
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new SubmissionError(
      payload?.message ?? 'The record could not be filed.',
      payload?.errors,
    )
  }

  return payload as SubmissionReceipt
}

export async function listSubmissions(): Promise<{ count: number; submissions: StoredSubmission[] }> {
  let response: Response
  try {
    response = await fetch(ENDPOINT)
  } catch {
    throw new SubmissionError(
      'Could not reach the archive API. Start it with “npm run dev:api”, or run “npm run dev:full”.',
    )
  }

  if (!response.ok) {
    throw new SubmissionError('The submission store could not be read.')
  }

  return (await response.json()) as { count: number; submissions: StoredSubmission[] }
}

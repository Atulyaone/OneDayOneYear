/**
 * File-backed submission store.
 *
 * Reads and writes server/data/submissions.json. Writes are serialised through
 * a promise queue and land via a temp file + rename, so a crash mid-write
 * cannot leave truncated JSON behind.
 */

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url))

export const DATA_DIR = path.join(SERVER_DIR, 'data')
export const DATA_FILE = path.join(DATA_DIR, 'submissions.json')
export const UPLOAD_DIR = path.join(SERVER_DIR, 'uploads')

let writeQueue = Promise.resolve()

export async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true })
  await mkdir(UPLOAD_DIR, { recursive: true })

  try {
    await readFile(DATA_FILE, 'utf8')
  } catch {
    await writeFile(DATA_FILE, '[]\n', 'utf8')
  }
}

export async function readSubmissions() {
  const raw = await readFile(DATA_FILE, 'utf8')
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? parsed : []
}

export function buildAccession(existing, receivedAt) {
  const stamp = receivedAt.slice(0, 10).replaceAll('-', '')
  const prefix = `SUB-${stamp}-`
  const count = existing.filter((record) => typeof record?.id === 'string' && record.id.startsWith(prefix)).length
  return `${prefix}${String(count + 1).padStart(4, '0')}`
}

/**
 * Append a record atomically.
 *
 * `createRecord` receives the current list and must return the finished record.
 * It runs inside the write queue, so accession numbers cannot collide.
 */
export function appendSubmission(createRecord) {
  writeQueue = writeQueue.then(async () => {
    const existing = await readSubmissions()
    const record = await createRecord(existing)

    existing.push(record)

    const temporary = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`
    await writeFile(temporary, `${JSON.stringify(existing, null, 2)}\n`, 'utf8')
    await rename(temporary, DATA_FILE)

    return record
  })

  return writeQueue
}

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { listSubmissions, type StoredSubmission } from '../api/submissions'
import { formatShortDate } from '../data/selectors'

type LoadState = 'loading' | 'ready' | 'error'

const receivedFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})

const formatBytes = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    listSubmissions()
      .then((result) => {
        if (!active) return
        setSubmissions(result.submissions)
        setState('ready')
      })
      .catch((error: Error) => {
        if (!active) return
        setMessage(error.message)
        setState('error')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="contribute-page submissions-admin">
      <div className="submissions-shell">
        <Link className="contribute-return" to="/contribute" data-cursor="view">
          <ArrowLeft size={15} strokeWidth={1.2} aria-hidden="true" />
          Submit a record
        </Link>

        <header className="contribute-header">
          <span className="eyebrow">ARCHIVE OFFICE / SUBMISSION REGISTER</span>
          <h1 className="contribute-title">Filed records</h1>
          <p className="contribute-lede">
            Read-only view of records appended to <code>server/data/submissions.json</code>.
          </p>
        </header>

        {state === 'loading' && <p className="submissions-status">Reading the submission register…</p>}

        {state === 'error' && (
          <div className="contribute-summary" role="alert">
            <strong>The register could not be read.</strong>
            <p>{message}</p>
          </div>
        )}

        {state === 'ready' && submissions.length === 0 && (
          <div className="submissions-empty">
            <strong>No records filed yet.</strong>
            <p>Submit the first record and it will appear here with an accession number.</p>
            <Link className="text-action" to="/contribute">
              Open the submission form <ArrowRight size={14} strokeWidth={1.2} />
            </Link>
          </div>
        )}

        {state === 'ready' && submissions.length > 0 && (
          <>
            <p className="submissions-count">
              {String(submissions.length).padStart(2, '0')} RECORD{submissions.length === 1 ? '' : 'S'} / PENDING REVIEW
            </p>

            <div className="submissions-table-wrap">
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th scope="col">Accession</th>
                    <th scope="col">Received</th>
                    <th scope="col">Contributor</th>
                    <th scope="col">Historical date</th>
                    <th scope="col">Evidence</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((record) => (
                    <tr key={record.id}>
                      <th scope="row">{record.id}</th>
                      <td>{receivedFormatter.format(new Date(record.receivedAt))} UTC</td>
                      <td>{record.name}</td>
                      <td>{formatShortDate(record.date)}</td>
                      <td>
                        {record.evidence ? (
                          <span title={record.evidence.originalName}>
                            {record.evidence.originalName}{' '}
                            <small>{formatBytes(record.evidence.size)}</small>
                          </span>
                        ) : (
                          <span className="submissions-none">None</span>
                        )}
                      </td>
                      <td>
                        <span className="submissions-status-pill">{record.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="submissions-note">
              Descriptions are stored but not shown in this register. Open the JSON file for the full record text.
            </p>
          </>
        )}
      </div>
    </main>
  )
}

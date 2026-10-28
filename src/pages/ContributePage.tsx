import { ArrowLeft } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { ContributeForm } from '../components/contribute/ContributeForm'
import { isValidISODate } from '../data/validation'

export function ContributePage() {
  const [searchParams] = useSearchParams()
  const requestedDate = searchParams.get('date') ?? ''
  const initialDate = isValidISODate(requestedDate) ? requestedDate : ''

  return (
    <main className="contribute-page">
      <div className="contribute-shell">
        <Link className="contribute-return" to="/calendar" data-cursor="view">
          <ArrowLeft size={15} strokeWidth={1.2} aria-hidden="true" />
          Return to calendar
        </Link>

        <header className="contribute-header">
          <span className="eyebrow">ARCHIVE PORTAL / RECORD SUBMISSION</span>
          <h1 className="contribute-title">
            Contribute to the
            <br />
            Archive
          </h1>
          <p className="contribute-lede">
            Submit a historical record, note, or optional photographic or video evidence to be
            catalogued into the archive.
          </p>
        </header>

        <ContributeForm initialDate={initialDate} />

        <footer className="contribute-footer">
          <span>ONE DAY / ONE HISTORICAL MOMENT</span>
          <Link to="/admin/submissions" data-cursor="view">
            Review submissions
          </Link>
        </footer>
      </div>
    </main>
  )
}

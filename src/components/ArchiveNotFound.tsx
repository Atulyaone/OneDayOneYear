import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ArchiveNotFound({ detail = 'This record could not be opened.' }: { detail?: string }) {
  return (
    <main className="not-found-page page-shell">
      <span className="eyebrow">ARCHIVE SHELF / UNFILED</span>
      <div className="not-found-label">
        <span>OD / OHM</span>
        <strong>RECORD NOT LOCATED</strong>
        <small>{detail}</small>
      </div>
      <Link className="text-action" to="/calendar" data-cursor="view">
        Return to calendar <ArrowLeft size={15} strokeWidth={1.2} />
      </Link>
    </main>
  )
}

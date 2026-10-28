import { Link } from 'react-router-dom'
import type { SubmissionReceipt as Receipt } from '../../api/submissions'
import { formatLongDate } from '../../data/selectors'

interface SubmissionReceiptProps {
  receipt: Receipt
  onReset: () => void
}

const filedFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})

export function SubmissionReceipt({ receipt, onReset }: SubmissionReceiptProps) {
  return (
    <section className="contribute-receipt" aria-live="polite">
      <span className="eyebrow">RECORD RECEIVED / PENDING REVIEW</span>
      <h2>The record is in the queue.</h2>
      <p className="contribute-receipt-id">{receipt.id}</p>

      <dl className="contribute-receipt-meta">
        <div>
          <dt>Contributor</dt>
          <dd>{receipt.name}</dd>
        </div>
        <div>
          <dt>Historical date</dt>
          <dd>{formatLongDate(receipt.date)}</dd>
        </div>
        <div>
          <dt>Received</dt>
          <dd>{filedFormatter.format(new Date(receipt.receivedAt))} UTC</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>Pending review</dd>
        </div>
      </dl>

      <p className="contribute-receipt-note">
        Keep the accession number above. A curator reviews submitted records before they enter the public index.
      </p>

      <div className="contribute-receipt-actions">
        <Link className="text-action text-action-light" to="/calendar" data-cursor="view">
          Return to the calendar
        </Link>
        <button type="button" className="contribute-link-button" onClick={onReset}>
          Submit another record
        </button>
      </div>
    </section>
  )
}

import { formatShortDate } from '../data/selectors.ts'
import type { HistoricalEvent } from '../types.ts'

interface MonthRecordListProps {
  events: HistoricalEvent[]
  selectedDate: string | null
  onSelect: (event: HistoricalEvent) => void
}

export function MonthRecordList({ events, selectedDate, onSelect }: MonthRecordListProps) {
  return (
    <section className="month-record-list" aria-labelledby="month-records-heading">
      <div className="month-record-list-heading">
        <span className="eyebrow" id="month-records-heading">FILED THIS MONTH</span>
        <span>{String(events.length).padStart(2, '0')} records</span>
      </div>
      {events.length ? (
        <ol>
          {events.map((event, index) => (
            <li key={event.date}>
              <button
                type="button"
                className={selectedDate === event.date ? 'is-active' : ''}
                onClick={() => onSelect(event)}
                aria-current={selectedDate === event.date ? 'date' : undefined}
                data-cursor="view"
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{formatShortDate(event.date)}</span>
                <strong>{event.title}</strong>
                <small>{event.category}</small>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="month-record-list-empty">No records are filed in this month. The date grid remains open for the complete index.</p>
      )}
    </section>
  )
}

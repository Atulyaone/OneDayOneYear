import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArchiveNotFound } from '../components/ArchiveNotFound.tsx'
import {
  formatAccession,
  formatMonthDayLabel,
  getAdjacentMonthDays,
  getRecordsForMonthDay,
} from '../data/selectors.ts'
import type { HistoricalEvent } from '../types.ts'

const primaryCategory = (event: HistoricalEvent) => event.category.split(' / ')[0]

const eventTime = (event: HistoricalEvent) => {
  const entry = event.timeline.find((item) => item.date === event.date && item.time)
  return entry?.time ? `${entry.time} UTC` : null
}

export function DayIndexPage() {
  const { monthDay = '' } = useParams()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const records = useMemo(() => getRecordsForMonthDay(monthDay), [monthDay])

  const categories = useMemo(() => {
    const names = records.map(primaryCategory)
    return Array.from(new Set(names))
  }, [records])

  const activeFilter = categories.includes(filter) ? filter : 'all'
  const visible = activeFilter === 'all' ? records : records.filter((record) => primaryCategory(record) === activeFilter)
  const years = visible.map((record) => record.year)
  const { previous, next } = getAdjacentMonthDays(monthDay)

  if (!records.length) {
    return <ArchiveNotFound detail="No records are filed on this date in the current edition." />
  }

  const [dayNumber, monthName] = formatMonthDayLabel(monthDay).split(' ')

  return (
    <main className="d-page">
      <header className="d-header">
        <div className="d-date">
          <h1>{dayNumber}</h1>
          <div>
            <span className="d-month">{monthName}</span>
            <span className="d-sub">Month-day index / all years</span>
          </div>
        </div>

        <dl className="d-stats">
          <div>
            <dt>Records</dt>
            <dd>{String(visible.length).padStart(2, '0')}</dd>
          </div>
          <div>
            <dt>Years</dt>
            <dd>
              {years.length === 0
                ? '—'
                : years.length === 1
                  ? String(years[0])
                  : `${Math.min(...years)} — ${Math.max(...years)}`}
            </dd>
          </div>
          <button type="button" className="d-return" onClick={() => navigate('/calendar')} data-cursor="view">
            Return to calendar <ArrowRight size={12} strokeWidth={1.4} aria-hidden="true" />
          </button>
        </dl>
      </header>

      <div className="d-filters" role="group" aria-label="Filter records by category">
        <button type="button" data-cursor="view" aria-pressed={activeFilter === 'all'} onClick={() => setFilter('all')}>
          All categories <span>{String(records.length).padStart(2, '0')}</span>
        </button>
        {categories.map((category) => {
          const count = records.filter((record) => primaryCategory(record) === category).length
          return (
            <button
              key={category}
              type="button"
              data-cursor="view"
              aria-pressed={activeFilter === category}
              onClick={() => setFilter(category)}
            >
              {category} <span>{String(count).padStart(2, '0')}</span>
            </button>
          )
        })}
        <p className="d-filter-note" aria-live="polite">
          {visible.length
            ? `${String(visible.length).padStart(2, '0')} record${visible.length === 1 ? '' : 's'} filed on ${dayNumber} ${monthName}`
            : 'No records in this category'}
        </p>
      </div>

      <div className="d-spine">
        {visible.map((record, index) => (
          <article
            key={record.date}
            className={`d-entry ${index % 2 === 0 ? 'is-left' : 'is-right'}`}
          >
            <span className="d-dot" aria-hidden="true" />
            <div className="d-entry-copy">
              <p className="d-entry-category">{record.category}</p>
              <p className="d-entry-year">{record.year}</p>
              <h2>{record.title}</h2>
              {eventTime(record) && <p className="d-entry-time">{formatMonthDayLabel(monthDay)} · {eventTime(record)}</p>}
              <p className="d-entry-body">{record.shortDescription}</p>
              <Link className="d-link" to={`/event/${record.date}`} data-cursor="open">
                Read record <ArrowRight size={12} strokeWidth={1.4} aria-hidden="true" />
              </Link>
            </div>
            <p className="d-entry-accession">
              Filed {formatMonthDayLabel(monthDay)}
              <br />
              {formatAccession(record.date)}
            </p>
          </article>
        ))}
      </div>

      <nav className="d-footer-nav" aria-label="Day navigation">
        {previous ? (
          <Link className="d-link" to={`/day/${previous.monthDay}`} data-cursor="view">
            <ArrowLeft size={12} strokeWidth={1.4} aria-hidden="true" /> Previous day · {formatMonthDayLabel(previous.monthDay)}
          </Link>
        ) : (
          <span className="d-nav-disabled">First indexed day</span>
        )}
        <button type="button" className="d-all-dates" onClick={() => navigate('/calendar')} data-cursor="view">
          All dates
        </button>
        {next ? (
          <Link className="d-link" to={`/day/${next.monthDay}`} data-cursor="view">
            Next day · {formatMonthDayLabel(next.monthDay)} <ArrowRight size={12} strokeWidth={1.4} aria-hidden="true" />
          </Link>
        ) : (
          <span className="d-nav-disabled">Last indexed day</span>
        )}
      </nav>
    </main>
  )
}

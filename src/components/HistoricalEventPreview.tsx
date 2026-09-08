import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatLongDate, formatMonthDay } from '../data/selectors.ts'
import type { HistoricalEvent } from '../types.ts'
import { ResilientImage } from './ResilientImage.tsx'

interface HistoricalEventPreviewProps {
  event: HistoricalEvent | null
  selectedMonthDay: string | null
}

const getMonthDayLabel = (monthDay: string) => {
  const [month, day] = monthDay.split('-').map(Number)
  return formatMonthDay(month - 1, day)
}

export function HistoricalEventPreview({ event, selectedMonthDay }: HistoricalEventPreviewProps) {
  const navigate = useNavigate()

  if (!selectedMonthDay) {
    return (
      <div className="event-preview event-preview-empty">
        <span className="eyebrow">ARCHIVE NOTE</span>
        <strong>Choose a marked date</strong>
        <p>Each brass point opens a full historical record. Empty dates remain part of the index.</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="event-preview event-preview-empty">
        <span className="eyebrow">{getMonthDayLabel(selectedMonthDay)}</span>
        <strong>No record filed for this date.</strong>
        <p>This day remains in the index without a corresponding historical record.</p>
      </div>
    )
  }

  return (
    <div className="event-preview">
      <div className="event-preview-image">
        <ResilientImage src={event.heroImage.src} alt={event.heroImage.alt} loading="lazy" fallbackLabel="Image evidence unavailable" />
      </div>
      <div className="event-preview-copy">
        <span className="eyebrow">{formatLongDate(event.date)} / {event.category}</span>
        <h2>{event.title}</h2>
        <p>{event.shortDescription}</p>
        <button type="button" className="text-action text-action-dark" onClick={() => navigate(`/event/${event.date}`)} data-cursor="open">
          Open record <ArrowRight size={15} strokeWidth={1.2} />
        </button>
      </div>
    </div>
  )
}

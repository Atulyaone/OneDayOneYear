import type { CalendarCell } from '../types.ts'
import { formatLongDate, formatMonthDay } from '../data/selectors.ts'

interface CalendarDayProps {
  cell: CalendarCell
  selectedMonthDay: string | null
  onSelect: (cell: CalendarCell) => void
}

export function CalendarDay({ cell, selectedMonthDay, onSelect }: CalendarDayProps) {
  const isSelected = cell.isCurrentMonth && selectedMonthDay === cell.monthDay
  const className = [
    'calendar-day',
    cell.isCurrentMonth ? '' : 'is-outside',
    cell.event ? 'has-event' : '',
    isSelected ? 'is-selected' : '',
  ].filter(Boolean).join(' ')
  const accessibleDate = cell.event ? formatLongDate(cell.event.date) : formatMonthDay(cell.monthIndex, cell.day)

  return (
    <button
      type="button"
      className={className}
      onClick={() => onSelect(cell)}
      disabled={!cell.isCurrentMonth}
      data-cursor={cell.event ? 'view' : undefined}
      aria-current={isSelected ? 'date' : undefined}
      aria-label={`${accessibleDate}${cell.event ? ` — ${cell.event.title}` : ' — no indexed record'}`}
    >
      <span className="calendar-day-number">{String(cell.day).padStart(2, '0')}</span>
      {cell.event && <span className="calendar-day-mark" aria-hidden="true" />}
      {cell.event && <span className="calendar-day-caption">{cell.event.title}</span>}
    </button>
  )
}

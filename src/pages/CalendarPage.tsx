import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArchiveShell } from '../components/ArchiveShell.tsx'
import { CalendarDay } from '../components/CalendarDay.tsx'
import { HistoricalEventPreview } from '../components/HistoricalEventPreview.tsx'
import { MonthRecordList } from '../components/MonthRecordList.tsx'
import { MonthSelector } from '../components/MonthSelector.tsx'
import { formatMonth, getArchiveMonthGrid, getEventForMonthDay, getEventsForMonthIndex, sortedEvents } from '../data/selectors.ts'
import type { CalendarCell, HistoricalEvent } from '../types.ts'

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const featuredMonthIndex = 6
const featuredMonthDay = '07-20'

export function CalendarPage() {
  const { openSearch } = useArchiveShell()
  const navigate = useNavigate()
  const [monthIndex, setMonthIndex] = useState(featuredMonthIndex)
  const [selectedMonthDay, setSelectedMonthDay] = useState<string | null>(featuredMonthDay)
  const monthGrid = useMemo(() => getArchiveMonthGrid(monthIndex), [monthIndex])
  const monthEvents = useMemo(() => getEventsForMonthIndex(monthIndex), [monthIndex])
  const selectedEvent = selectedMonthDay ? getEventForMonthDay(monthIndex, selectedMonthDay) : null

  const handleSelectDay = (cell: CalendarCell) => {
    if (!cell.isCurrentMonth) return
    setSelectedMonthDay(cell.monthDay)
  }

  const selectMonth = (nextMonthIndex: number) => {
    setMonthIndex(nextMonthIndex)
    setSelectedMonthDay(null)
  }

  const moveMonth = (direction: number) => {
    setMonthIndex((current) => (current + direction + 12) % 12)
    setSelectedMonthDay(null)
  }

  const selectMonthEvent = (event: HistoricalEvent) => {
    setSelectedMonthDay(event.date.slice(5))
  }

  return (
    <main className="calendar-page page-shell paper-surface">
      <aside className="calendar-spine" aria-label="Archive volume">
        <span>ONE DAY / ONE MOMENT</span>
        <strong>VOL. I</strong>
        <span>{sortedEvents.length} RECORDS</span>
      </aside>
      <div className="calendar-main">
        <header className="calendar-header">
          <div>
            <span className="eyebrow">DATE INDEX / BROWSE BY DATE</span>
            <h1>{formatMonth(monthIndex)}</h1>
            <p>{monthEvents.length ? `${monthEvents.length} indexed moment${monthEvents.length === 1 ? '' : 's'} filed in this month across all years` : 'No indexed moments in this month'}</p>
          </div>
          <div className="calendar-header-actions">
            <span className="calendar-count">{String(sortedEvents.length).padStart(2, '0')} RECORDS / 12 MONTHS</span>
            <button type="button" className="line-control" onClick={() => openSearch()} data-cursor="view"><Search size={15} strokeWidth={1.3} /> Search archive</button>
          </div>
        </header>
        <div className="calendar-content">
          <div className="calendar-index-rail">
            <MonthSelector monthIndex={monthIndex} onSelect={selectMonth} />
            <div className="calendar-rail-note"><span>INDEXED FIELD</span><strong>PUBLIC<br />MEMORY</strong><small>Events are filed by the month and day they entered the historical record.</small></div>
          </div>
          <section className="calendar-grid-panel" aria-labelledby="calendar-heading">
            <div className="calendar-grid-topline">
              <span id="calendar-heading">{String(monthIndex + 1).padStart(2, '0')} / {formatMonth(monthIndex)} / MONTH-DAY INDEX</span>
              <div className="month-controls">
                <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" data-cursor="view"><ArrowLeft size={16} strokeWidth={1.2} /></button>
                <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" data-cursor="view"><ArrowRight size={16} strokeWidth={1.2} /></button>
              </div>
            </div>
            <div className="calendar-weekdays" aria-hidden="true">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
            <div className="calendar-grid">
              {monthGrid.flat().map((cell) => <CalendarDay key={cell.cellKey} cell={cell} selectedMonthDay={selectedMonthDay} onSelect={handleSelectDay} />)}
            </div>
            <div className="calendar-search-strip"><span>&gt; SEARCH THE ARCHIVE_</span><button type="button" onClick={() => openSearch()} data-cursor="view">Open search <ArrowRight size={14} strokeWidth={1.2} /></button></div>
            <MonthRecordList events={monthEvents} selectedDate={selectedEvent?.date ?? null} onSelect={selectMonthEvent} />
          </section>
          <HistoricalEventPreview event={selectedEvent} selectedMonthDay={selectedMonthDay} />
        </div>
        <footer className="calendar-footer"><span>DATE INDEX / {sortedEvents.length} HISTORICAL RECORDS / EDITION 01</span><button type="button" className="text-action text-action-dark" onClick={() => navigate('/about')} data-cursor="view">About the archive <ArrowRight size={14} strokeWidth={1.2} /></button></footer>
      </div>
    </main>
  )
}

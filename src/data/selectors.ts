import type { CalendarCell } from '../types.ts'
import { events } from './events.ts'

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  timeZone: 'UTC',
})

const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const monthDayFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'long',
  timeZone: 'UTC',
})

const toUTCDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const toISODate = (date: Date) => date.toISOString().slice(0, 10)

const toMonthDayKey = (date: Date) =>
  `${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`

export const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date))

export const formatLongDate = (isoDate: string) =>
  longDateFormatter.format(toUTCDate(isoDate)).toUpperCase()

export const formatShortDate = (isoDate: string) =>
  shortDateFormatter.format(toUTCDate(isoDate)).toUpperCase()

export const formatMonth = (monthIndex: number) =>
  monthFormatter.format(new Date(Date.UTC(2000, monthIndex, 1))).toUpperCase()

export const formatMonthYear = (year: number, monthIndex: number) =>
  `${formatMonth(monthIndex)} ${year}`

export const formatAccession = (isoDate: string) => `OD-${isoDate.slice(0, 4)}-${isoDate.slice(5).replace('-', '')}`

export const getEventByDate = (date: string | undefined) =>
  sortedEvents.find((event) => event.date === date) ?? null

export const getEventsForMonth = (year: number, monthIndex: number) =>
  sortedEvents.filter((event) => {
    const date = toUTCDate(event.date)
    return date.getUTCFullYear() === year && date.getUTCMonth() === monthIndex
  })

export const getEventsForMonthIndex = (monthIndex: number) =>
  sortedEvents.filter((event) => Number(event.date.slice(5, 7)) - 1 === monthIndex)

export const getEventForMonthDay = (monthIndex: number, monthDay: string) =>
  getEventsForMonthIndex(monthIndex).find((event) => event.date.slice(5) === monthDay) ?? null

export const getAdjacentEvents = (date: string) => {
  const index = sortedEvents.findIndex((event) => event.date === date)
  return {
    previous: index > 0 ? sortedEvents[index - 1] : null,
    next: index >= 0 && index < sortedEvents.length - 1 ? sortedEvents[index + 1] : null,
  }
}

export const getMonthGrid = (year: number, monthIndex: number): CalendarCell[][] => {
  const firstDay = new Date(Date.UTC(year, monthIndex, 1))
  const startOffset = firstDay.getUTCDay()
  const eventMap = new Map(getEventsForMonth(year, monthIndex).map((event) => [event.date, event]))
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(Date.UTC(year, monthIndex, index - startOffset + 1))
    const isoDate = toISODate(date)
    return {
      cellKey: `calendar-${isoDate}`,
      monthIndex: date.getUTCMonth(),
      monthDay: toMonthDayKey(date),
      isoDate,
      day: date.getUTCDate(),
      isCurrentMonth: date.getUTCMonth() === monthIndex,
      event: eventMap.get(isoDate) ?? null,
    }
  })

  return Array.from({ length: 6 }, (_, rowIndex) => cells.slice(rowIndex * 7, rowIndex * 7 + 7))
}

/**
 * Builds the shared month/day layout without pretending that the archive has
 * a single calendar year. 2024 is used only because it starts on Sunday and
 * gives February a complete leap-year shape; it is never exposed or queried.
 */
export const getArchiveMonthGrid = (monthIndex: number): CalendarCell[][] => {
  const layoutYear = 2024
  const firstDay = new Date(Date.UTC(layoutYear, monthIndex, 1))
  const startOffset = firstDay.getUTCDay()
  const eventMap = new Map(getEventsForMonthIndex(monthIndex).map((event) => [event.date.slice(5), event]))
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(Date.UTC(layoutYear, monthIndex, index - startOffset + 1))
    const isoDate = toISODate(date)
    const monthDay = toMonthDayKey(date)
    const isCurrentMonth = date.getUTCMonth() === monthIndex

    return {
      cellKey: `calendar-${isoDate}`,
      monthIndex: date.getUTCMonth(),
      monthDay,
      isoDate,
      day: date.getUTCDate(),
      isCurrentMonth,
      event: isCurrentMonth ? eventMap.get(monthDay) ?? null : null,
    }
  })

  return Array.from({ length: 6 }, (_, rowIndex) => cells.slice(rowIndex * 7, rowIndex * 7 + 7))
}

export const formatMonthDay = (monthIndex: number, day: number) =>
  monthDayFormatter
    .format(new Date(Date.UTC(2024, monthIndex, day)))
    .toUpperCase()

export const formatMonthDayKey = (monthIndex: number, day: number) =>
  `${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

const normalize = (value: string) => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const searchEvents = (query: string) => {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return []

  return sortedEvents
    .map((event) => {
      const haystack = normalize([
        event.date,
        formatLongDate(event.date),
        event.title,
        event.category,
        event.keywords.join(' '),
        event.shortDescription,
        event.fullStory,
      ].join(' '))
      const titleText = normalize(event.title)
      const score = terms.reduce((total, term) => {
        if (titleText.includes(term)) return total + 4
        if (haystack.includes(term)) return total + 1
        return total
      }, 0)
      return { event, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.event.date.localeCompare(b.event.date))
    .map(({ event }) => event)
}

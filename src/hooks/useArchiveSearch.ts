import { useState, useMemo, useEffect } from 'react'
import * as eventData from '../data/events'

export type SearchStatus = 'idle' | 'results' | 'empty'

export interface ArchiveRecord {
  date: string
  title: string
  category: string
  description?: string
  [key: string]: any
}

export const allRecords: ArchiveRecord[] = Array.isArray((eventData as any).default)
  ? (eventData as any).default
  : (Object.values(eventData).find(Array.isArray) as ArchiveRecord[]) || []

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]
const MONTH_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export function useArchiveSearch(query: string) {
  const [activeIndex, setActiveIndex] = useState(0)
  const clean = query.trim().toLowerCase()

  const results = useMemo(() => {
    // 1. Search bar empty -> return zero results so the idle screen stays visible
    if (!clean) return []

    return allRecords.filter((item) => {
      const title = (item.title || '').trim().toLowerCase()
      const rawDate = (item.date || '').trim().toLowerCase() // e.g. "1969-07-20"
      const [year = '', month = '', day = ''] = rawDate.split('-')
      const numDay = String(parseInt(day, 10))

      const monthIndex = parseInt(month, 10) - 1
      const shortM = MONTH_SHORT[monthIndex] || ''
      const fullM = MONTH_NAMES[monthIndex] || ''

      const dateDisplay = `${day} ${shortM} ${year}`.toLowerCase() // "20 jul 1969"
      const dateDisplayAlt = `${numDay} ${shortM} ${year}`.toLowerCase() // "4 jul 1776"

      // RULE 1: The title MUST start directly with what you typed
      if (title.startsWith(clean)) {
        return true
      }

      // RULE 2: Date Number Search (only active when you type digits: "1969", "19", "20", "1776")
      if (/\d/.test(clean)) {
        if (clean.length >= 2 && year.startsWith(clean)) return true
        if (day === clean || numDay === clean) return true
        if (dateDisplay.startsWith(clean) || dateDisplayAlt.startsWith(clean)) return true
        if (rawDate.startsWith(clean)) return true
        return false
      }

      // RULE 3: Month Name Search (requires at least 3 letters: "jul", "july", "aug", "dec")
      // Prevents 1 or 2 letter queries like "A" or "DE" from triggering month matches
      if (clean.length >= 3) {
        if (shortM === clean || fullM.startsWith(clean)) {
          return true
        }
      }

      return false
    })
  }, [clean])

  useEffect(() => {
    setActiveIndex(0)
  }, [clean, results.length])

  const status: SearchStatus = useMemo(() => {
    if (!clean) return 'idle'
    return results.length === 0 ? 'empty' : 'results'
  }, [clean, results.length])

  return {
    status,
    results,
    totalCount: allRecords.length || 20,
    activeIndex,
    setActiveIndex,
  }
}
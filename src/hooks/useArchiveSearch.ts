import { useState, useMemo } from 'react'
import { searchEvents, sortedEvents } from '../data/selectors.ts'
import type { HistoricalEvent, SearchStatus } from '../types.ts'

export type { SearchStatus }

export interface ArchiveRecord {
  date: string
  title: string
  category: string
  description?: string
  [key: string]: any
}

export const allRecords: ArchiveRecord[] = sortedEvents

export function useArchiveSearch(query: string) {
  const [activeIndex, setActiveIndex] = useState(0)
  const clean = query.trim()

  const [prevClean, setPrevClean] = useState(clean)
  if (prevClean !== clean) {
    setPrevClean(clean)
    setActiveIndex(0)
  }

  const results: HistoricalEvent[] = useMemo(() => {
    if (!clean) return []
    return searchEvents(clean)
  }, [clean])

  const safeActiveIndex = results.length > 0 ? Math.min(activeIndex, results.length - 1) : 0

  const status: SearchStatus = useMemo(() => {
    if (!clean) return 'idle'
    return results.length === 0 ? 'empty' : 'results'
  }, [clean, results.length])

  return {
    status,
    results,
    totalCount: sortedEvents.length,
    activeIndex: safeActiveIndex,
    setActiveIndex,
  }
}

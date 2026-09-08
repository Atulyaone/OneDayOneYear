import { useEffect, useState } from 'react'
import { searchEvents } from '../data/selectors.ts'
import type { HistoricalEvent, SearchStatus } from '../types.ts'

export function useArchiveSearch(query: string) {
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [results, setResults] = useState<HistoricalEvent[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      setStatus('idle')
      setResults([])
      setActiveIndex(0)
      return
    }

    setStatus('searching')
    const timer = window.setTimeout(() => {
      const matches = searchEvents(trimmedQuery)
      setResults(matches)
      setActiveIndex(0)
      setStatus(matches.length ? 'results' : 'empty')
    }, 160)

    return () => window.clearTimeout(timer)
  }, [query])

  return {
    status,
    results,
    activeIndex,
    setActiveIndex,
  }
}

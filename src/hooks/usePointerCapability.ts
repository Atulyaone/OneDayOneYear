import { useEffect, useState } from 'react'

const QUERY = '(pointer: coarse)'

const isCoarsePointer = () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches

export function usePointerCapability() {
  const [coarsePointer, setCoarsePointer] = useState(isCoarsePointer)

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY)
    const update = () => setCoarsePointer(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return { coarsePointer, finePointer: !coarsePointer }
}

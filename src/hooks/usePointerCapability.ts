import { useEffect, useState } from 'react'

export function usePointerCapability() {
  const [coarsePointer, setCoarsePointer] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)')
    const update = () => setCoarsePointer(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return { coarsePointer, finePointer: !coarsePointer }
}

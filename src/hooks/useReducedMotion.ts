import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(QUERY).matches

export function useReducedMotion() {
  // Read the preference during the first render so the opening sequence never
  // starts preloading frames before discovering that motion is reduced.
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY)
    const update = () => setReducedMotion(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return reducedMotion
}

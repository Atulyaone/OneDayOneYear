import { useEffect, useRef } from 'react'

export function PageProgress({ enabled = true }: { enabled?: boolean }) {
  const progressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!enabled) return

    let frame = 0
    const update = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
        progressRef.current?.style.setProperty('--progress', String(progress))
      })
    }

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(document.documentElement)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    window.addEventListener('load', update)
    update()

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('load', update)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="page-progress" aria-hidden="true">
      <span ref={progressRef} />
    </div>
  )
}

import { ArrowDown } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEventByDate, formatAccession } from '../data/selectors.ts'
import { animateOpening } from '../animations'
import { useReducedMotion } from '../hooks/useReducedMotion'

const featuredEvent = getEventByDate('1969-07-20')

export function ArchiveOpeningPage() {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // FIX: Properly reference the actual 400vh scrolling track zone container box
  const containerRef = useRef<HTMLDivElement | null>(null)

  const totalFrames = 242
  const currentFrame = (index: number) => `/frames/frame_${index.toString().padStart(4, '0')}.jpg`

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = 1920
    canvas.height = 1080

    const images: HTMLImageElement[] = []
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image()
      img.src = currentFrame(i)
      img.onload = () => { if (i === 1) renderFrame(1); }
      images.push(img)
    }

    function renderFrame(index: number) {
      if (!context || !canvas || !images[index - 1]) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(images[index - 1], 0, 0)
    }

    const handleScroll = () => {
      // FIX: Calculate bounding pixels against the 400vh tracking container instead of the 100vh section element
      const trackContainer = containerRef.current
      if (!trackContainer) return

      const rect = trackContainer.getBoundingClientRect()
      const totalScrollableHeight = rect.height - window.innerHeight

      // If the scroll track area hasn't scrolled up to the screen view yet, lock to frame 1
      if (rect.top > 0) {
        renderFrame(1)
        return
      }

      // Boundary clamp tracking: If track area has scrolled past view window entirely, lock to frame 242
      if (Math.abs(rect.top) >= totalScrollableHeight) {
        renderFrame(totalFrames)
        return
      }

      // Calculate how far through the 400vh box container the user has dragged their trackpad
      const currentProgress = Math.abs(rect.top)
      const scrollFraction = Math.min(1, Math.max(0, currentProgress / totalScrollableHeight))

      const frameIndex = Math.min(
        totalFrames,
        Math.max(1, Math.ceil(scrollFraction * totalFrames))
      )

      requestAnimationFrame(() => renderFrame(frameIndex))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })

    const layoutWrapper = document.querySelector('.opening-page')
    if (layoutWrapper) {
      layoutWrapper.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
      if (layoutWrapper) {
        layoutWrapper.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    if (!rootRef.current) return
    return animateOpening(rootRef.current, reducedMotion)
  }, [reducedMotion])

  if (!featuredEvent) return null

  return (
    <main className="opening-page" ref={rootRef}>
      <section className="opening-hero" aria-labelledby="opening-title">
        <div className="opening-index">CABINET 01 / PUBLIC RECORDS</div>
        <div className="opening-copy">
          <span className="opening-kicker">ONE DAY / ONE HISTORICAL MOMENT</span>
          <h1 id="opening-title" className="opening-title">
            <span>THE ARCHIVE</span><span>OPENS</span>
          </h1>
          <p className="opening-description">
            A date is never only a date. Enter a living index of the moments that changed what came after.
          </p>
        </div>
        <div className="opening-actions">
          <button type="button" className="text-action text-action-light" onClick={() => navigate(`/event/${featuredEvent.date}`)}>
            Explore Featured Event
          </button>
          <button type="button" className="skip-action" onClick={() => navigate('/calendar')} data-cursor="view">
            Browse date index
          </button>
        </div>
        <span className="opening-scroll" aria-hidden="true">
          <ArrowDown size={17} strokeWidth={1.2} /> Scroll to inspect
        </span>
      </section>

      {/* FIX: Wired up containerRef right here to lock tracking calculations directly to this 400vh height block */}
      <div ref={containerRef} style={{ height: '400vh', position: 'relative', width: '100%' }}>

        <section
          className="newspaper-stage"
          aria-label="Floating newspaper preview"
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            overflow: 'hidden'
          }}
        >
          <div className="stage-light" aria-hidden="true" />

          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#000',
              zIndex: 1
            }}
          />

          <div
            className="stage-caption"
            style={{
              position: 'absolute',
              bottom: '5vh',
              left: '5vw',
              right: '5vw',
              display: 'flex',
              justifyContent: 'space-between',
              color: '#fff',
              zIndex: 2
            }}
          >
            <span>THE FIRST LEAF / A PERIODICAL OF MEMORY</span>
            <span>Scroll to inspect</span>
          </div>
        </section>
      </div>
    </main>
  )
}

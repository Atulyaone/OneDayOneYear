import { ArrowDown } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { animateOpening } from '../animations'
import { getEventByDate } from '../data/selectors.ts'
import { useFrameSequence } from '../hooks/useFrameSequence'
import { useReducedMotion } from '../hooks/useReducedMotion'

const featuredEvent = getEventByDate('1969-07-20')

export function ArchiveOpeningPage() {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useFrameSequence({ canvasRef, containerRef, reducedMotion })

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
            <span>THE ARCHIVE</span>
            <span>OPENS</span>
          </h1>
          <p className="opening-description">
            A date is never only a date. Enter a living index of the moments that changed what came after.
          </p>
        </div>
        <div className="opening-actions">
          <button
            type="button"
            className="text-action text-action-light"
            onClick={() => navigate(`/event/${featuredEvent.date}`)}
          >
            Explore Featured Event
          </button>
          <button
            type="button"
            className="skip-action"
            onClick={() => navigate('/calendar')}
            data-cursor="view"
          >
            Browse date index
          </button>
        </div>
        <span className="opening-scroll" aria-hidden="true">
          <ArrowDown size={17} strokeWidth={1.2} /> Scroll to inspect
        </span>
      </section>

      <div
        className="opening-sequence"
        ref={containerRef}
        style={{ height: reducedMotion ? '100vh' : '400vh', position: 'relative', width: '100%' }}
      >
        <section
          className="newspaper-stage"
          aria-label="Floating newspaper preview"
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
          }}
        >
          <div className="stage-light" aria-hidden="true" />

          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#000',
              zIndex: 1,
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
              zIndex: 2,
            }}
          >
            <span>THE FIRST LEAF / A PERIODICAL OF MEMORY</span>
            <span>{reducedMotion ? 'STILL FRAME' : 'Scroll to inspect'}</span>
          </div>
        </section>
      </div>
    </main>
  )
}

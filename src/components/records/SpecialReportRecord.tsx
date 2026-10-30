import { gsap } from 'gsap'
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatLongDate, formatShortDate, getAdjacentEvents, getEventByDate } from '../../data/selectors.ts'
import { useFocusTrap } from '../../hooks/useFocusTrap.ts'
import { useReducedMotion } from '../../hooks/useReducedMotion.ts'
import type { HistoricalEvent } from '../../types.ts'
import { ResilientImage } from '../ResilientImage.tsx'

function LocatorMap() {
  return (
    <svg viewBox="0 0 560 188" className="bs-map-svg" role="img" aria-label="Schematic locator of the Moon with the Tranquility Base landing region marked">
      <rect width="560" height="188" fill="#ded2b9" />
      <g stroke="rgba(76,57,34,.18)" strokeWidth="1">
        <path d="M0 47h560M0 94h560M0 141h560M140 0v188M280 0v188M420 0v188" />
      </g>
      <circle cx="168" cy="94" r="78" fill="#e9dfc8" stroke="rgba(28,24,19,.55)" strokeWidth="1.2" />
      <g fill="#c8b997" opacity=".9">
        <ellipse cx="140" cy="62" rx="26" ry="18" />
        <ellipse cx="196" cy="82" rx="30" ry="21" />
        <ellipse cx="132" cy="110" rx="18" ry="14" />
        <ellipse cx="180" cy="128" rx="24" ry="15" />
        <ellipse cx="112" cy="82" rx="12" ry="9" />
      </g>
      <circle cx="208" cy="70" r="7.5" fill="none" stroke="#783b2f" strokeWidth="1.6" />
      <circle cx="208" cy="70" r="2.4" fill="#783b2f" />
      <path d="M208 70 L252 48" stroke="#783b2f" strokeWidth="1.1" />
      <text x="256" y="45" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#783b2f" letterSpacing="1.4">TRANQUILITY BASE</text>
      <text x="256" y="58" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" fill="rgba(76,57,34,.9)" letterSpacing="1.2">0.67° N / 23.47° E</text>
      <g fontFamily="IBM Plex Mono, monospace" fontSize="8.5" fill="rgba(76,57,34,.75)" letterSpacing="1.2">
        <text x="30" y="176">90° W</text>
        <text x="256" y="176">0°</text>
        <text x="494" y="176">90° E</text>
      </g>
      <g stroke="rgba(28,24,19,.5)" strokeWidth="1.1">
        <path d="M492 46 v-18 M492 28l-4 7M492 28l4 7" />
      </g>
      <text x="482" y="66" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" fill="rgba(28,24,19,.6)">N</text>
      <text x="470" y="166" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" fill="rgba(76,57,34,.6)">SCHEMATIC</text>
    </svg>
  )
}

export function SpecialReportRecord({ event }: { event: HistoricalEvent }) {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const paperRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [arriving, setArriving] = useState(false)
  const [expanded, setExpanded] = useState<'map' | 'plate' | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useFocusTrap({
    active: expanded !== null,
    containerRef: overlayRef,
    initialRef: closeRef,
    onEscape: () => setExpanded(null),
  })

  useEffect(() => {
    if (reducedMotion) return

    const key = `od-ohm-arrival:${event.date}`
    if (window.sessionStorage.getItem(key)) return

    const paper = paperRef.current
    if (!paper) return

    setArriving(true)

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        window.sessionStorage.setItem(key, 'seen')
        gsap.set(paper, { clearProps: 'transform' })
        setArriving(false)
      },
    })

    gsap.set(paper, { transformOrigin: '50% 0%' })
    timeline
      .fromTo(paper, { scale: 1.14, y: -10 }, { scale: 1.2, y: -96, duration: 0.8 })
      .to(paper, { y: -470, scale: 1.12, duration: 0.85 }, '+=0.12')
      .to(paper, { y: 0, scale: 1, duration: 0.85 }, '+=0.12')

    timelineRef.current = timeline

    return () => {
      timeline.kill()
      gsap.set(paper, { clearProps: 'transform' })
    }
  }, [event.date, reducedMotion])

  useEffect(() => {
    if (!arriving) return

    const finish = () => timelineRef.current?.progress(1)
    window.addEventListener('wheel', finish, { passive: true, once: true })
    window.addEventListener('touchstart', finish, { passive: true, once: true })
    window.addEventListener('keydown', finish, { once: true })

    return () => {
      window.removeEventListener('wheel', finish)
      window.removeEventListener('touchstart', finish)
      window.removeEventListener('keydown', finish)
    }
  }, [arriving])

  const paragraphs = event.fullStory.split('\n\n')
  const leadParagraph = paragraphs[0] ?? event.shortDescription
  const bodyParagraphs = paragraphs.slice(1)
  const related = (event.relatedDates ?? [])
    .map((date) => getEventByDate(date))
    .filter((item): item is HistoricalEvent => Boolean(item))
  const { previous, next } = getAdjacentEvents(event.date)

  return (
    <main className="bs-page">
      <div className="bs-stage">
        <article className="bs-paper" ref={paperRef} aria-labelledby="report-headline">
          <div className="bs-masthead">
            <span>One day / One historical moment</span>
            <span className="bs-masthead-title">Special Report</span>
            <span className="bs-masthead-date">
              {formatLongDate(event.date)}
              <br />
              {event.category}
            </span>
          </div>

          <div className="bs-maps">
            <figure className="bs-map">
              <div className="bs-map-frame">
                <LocatorMap />
                <button type="button" className="bs-map-expand" onClick={() => setExpanded('map')} data-cursor="view">
                  <Maximize2 size={11} strokeWidth={1.4} aria-hidden="true" /> Expand map
                </button>
              </div>
              <figcaption className="bs-caption">
                <span>Locator / Tranquility Base</span>
                <span>Archive diagram / NASA coordinates</span>
              </figcaption>
            </figure>

            <figure className="bs-map">
              <div className="bs-map-frame">
                <ResilientImage src={event.heroImage.src} alt={event.heroImage.alt} loading="lazy" fallbackLabel="Plate unavailable" />
                <svg className="bs-map-grid" viewBox="0 0 560 188" aria-hidden="true">
                  <g stroke="rgba(231,222,202,.32)" strokeWidth=".8">
                    <path d="M0 47h560M0 94h560M0 141h560M140 0v188M280 0v188M420 0v188" />
                  </g>
                  <circle cx="300" cy="96" r="9" fill="none" stroke="#e7deca" strokeWidth="1.3" />
                  <path d="M300 82v-9M300 119v9M286 96h-9M323 96h9" stroke="#e7deca" strokeWidth="1.1" />
                  <text x="300" y="140" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#f0e8d7" letterSpacing="1.6">TRANQUILITY BASE</text>
                </svg>
                <button type="button" className="bs-map-expand" onClick={() => setExpanded('plate')} data-cursor="view">
                  <Maximize2 size={11} strokeWidth={1.4} aria-hidden="true" /> Expand plate
                </button>
              </div>
              <figcaption className="bs-caption">
                <span>Surface plate / {event.title}</span>
                <span>{event.heroImage.credit}</span>
              </figcaption>
            </figure>
          </div>

          <div className="bs-lead">
            <div>
              <p className="bs-meta">{event.category} · {formatLongDate(event.date)}</p>
              <h1 id="report-headline" className="bs-headline">{event.title}</h1>
              <p className="bs-deck">{event.shortDescription}</p>
              <p className="bs-body">{leadParagraph}</p>
              <p className="bs-filed"><span>Filed under</span>{event.keywords.slice(0, 3).join(' · ')}</p>
            </div>

            <figure className="bs-photo">
              <div className="bs-photo-frame">
                <ResilientImage src={event.galleryImages[1]?.src ?? event.heroImage.src} alt={event.galleryImages[1]?.alt ?? event.heroImage.alt} loading="lazy" fallbackLabel="Image evidence unavailable" />
              </div>
              <figcaption>
                <span>{event.galleryImages[1]?.caption ?? event.heroImage.caption}</span>
                <span>{event.galleryImages[1]?.credit ?? event.heroImage.credit}</span>
              </figcaption>
            </figure>
          </div>

          <div className="bs-lower">
            <div>
              {bodyParagraphs.map((paragraph) => (
                <p className="bs-body" key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}

              <div className="bs-hours-quote">
                <div className="bs-hours">
                  <h2 className="bs-label">The hours</h2>
                  <ol>
                    {event.timeline.map((entry, index) => (
                      <li key={`${entry.date}-${entry.title}-${index}`}>
                        <span className="bs-hour-date">
                          {formatShortDate(entry.date)}
                          {entry.time ? ` · ${entry.time} UTC` : ''}
                        </span>
                        <span className="bs-hour-title">{entry.title}</span>
                        <span className="bs-hour-body">{entry.description}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {event.quote && (
                  <blockquote className="bs-quote">
                    <p>“{event.quote}”</p>
                    <cite>{event.quoteAttribution}</cite>
                  </blockquote>
                )}
              </div>
            </div>

            <aside className="bs-aside">
              {event.statistics && (
                <section>
                  <h2 className="bs-label">Mission figures</h2>
                  <table className="bs-table">
                    <tbody>
                      {event.statistics.map((row) => (
                        <tr key={row.label}>
                          <th scope="row">{row.label}</th>
                          <td>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="bs-source">Source / NASA</p>
                </section>
              )}

              {event.specifications && (
                <section>
                  <h2 className="bs-label">Technical specification</h2>
                  <table className="bs-table">
                    <tbody>
                      {event.specifications.map((row) => (
                        <tr key={row.label}>
                          <th scope="row">{row.label}</th>
                          <td>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="bs-source">Times UTC · Source NASA</p>
                </section>
              )}
            </aside>
          </div>

          {related.length > 0 && (
            <section className="bs-related" aria-labelledby="related-heading">
              <div className="bs-related-head">
                <h2 id="related-heading" className="bs-label">Cross-referenced index</h2>
                <button type="button" className="bs-link" onClick={() => navigate('/calendar')} data-cursor="view">
                  Full date index <ArrowRight size={12} strokeWidth={1.4} aria-hidden="true" />
                </button>
              </div>
              <div className="bs-related-grid">
                {related.map((item) => (
                  <Link className="bs-related-item" to={`/event/${item.date}`} key={item.date} data-cursor="open">
                    <img className="bs-thumb" src={item.heroImage.src} alt={item.heroImage.alt} loading="lazy" />
                    <span>
                      <span className="bs-related-date">{formatShortDate(item.date)}</span>
                      <span className="bs-related-title">{item.title}</span>
                      <span className="bs-related-category">{item.category}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <nav className="bs-footer-nav" aria-label="Special report navigation">
            {previous ? (
              <Link className="bs-link" to={`/event/${previous.date}`} data-cursor="view">
                <ArrowLeft size={12} strokeWidth={1.4} aria-hidden="true" /> Previous dispatch
              </Link>
            ) : (
              <span className="bs-nav-disabled">First dispatch</span>
            )}
            <button type="button" className="bs-footer-index" onClick={() => navigate('/calendar')} data-cursor="view">
              Return to date index
            </button>
            {next ? (
              <Link className="bs-link" to={`/event/${next.date}`} data-cursor="view">
                Next dispatch <ArrowRight size={12} strokeWidth={1.4} aria-hidden="true" />
              </Link>
            ) : (
              <span className="bs-nav-disabled">End of index</span>
            )}
          </nav>
        </article>
      </div>

      {arriving && (
        <div className="bs-skip" role="status">
          <span>Arrival sequence</span>
          <button type="button" onClick={() => timelineRef.current?.progress(1)}>Skip</button>
        </div>
      )}

      {expanded && (
        <div
          className="bs-lightbox"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={expanded === 'map' ? 'Expanded locator map' : 'Expanded surface plate'}
          onMouseDown={(clickEvent) => {
            if (clickEvent.target === clickEvent.currentTarget) setExpanded(null)
          }}
        >
          <button ref={closeRef} type="button" className="bs-lightbox-close" onClick={() => setExpanded(null)} data-cursor="view">
            <X size={18} strokeWidth={1.3} aria-hidden="true" /> Close
          </button>
          <div className="bs-lightbox-figure">
            {expanded === 'map' ? (
              <LocatorMap />
            ) : (
              <ResilientImage src={event.heroImage.src} alt={event.heroImage.alt} loading="eager" fallbackLabel="Plate unavailable" />
            )}
          </div>
          <p className="bs-lightbox-caption">
            {expanded === 'map' ? 'Locator / Tranquility Base · archive diagram' : `${event.heroImage.caption} · ${event.heroImage.credit}`}
          </p>
        </div>
      )}
    </main>
  )
}

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { formatAccession, formatLongDate, formatShortDate, getAdjacentEvents } from '../../data/selectors.ts'
import type { HistoricalEvent } from '../../types.ts'
import { FilmRecord } from '../FilmRecord.tsx'
import { ResilientImage } from '../ResilientImage.tsx'

type View = 'account' | 'chronology' | 'images'

const VIEWS: View[] = ['account', 'chronology', 'images']

const readInitialView = (): View => {
  if (typeof window === 'undefined') return 'account'
  const hash = window.location.hash.replace('#', '')
  return hash === 'chronology' || hash === 'images' ? hash : 'account'
}

export function ModernRecord({ event }: { event: HistoricalEvent }) {
  const [view, setView] = useState<View>(readInitialView)
  const paragraphs = event.fullStory.split('\n\n')
  const { previous, next } = getAdjacentEvents(event.date)

  const selectView = (nextView: View) => {
    setView(nextView)
    if (typeof window === 'undefined') return
    const base = window.location.pathname
    window.history.replaceState(null, '', nextView === 'account' ? base : `${base}#${nextView}`)
  }

  const handleTabKey = (keyEvent: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (keyEvent.key !== 'ArrowRight' && keyEvent.key !== 'ArrowLeft') return
    keyEvent.preventDefault()
    const nextIndex = keyEvent.key === 'ArrowRight' ? (index + 1) % VIEWS.length : (index - 1 + VIEWS.length) % VIEWS.length
    selectView(VIEWS[nextIndex])
    const siblings = keyEvent.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    siblings?.[nextIndex]?.focus()
  }

  return (
    <main className="m-page">
      <header className="m-header">
        <div className="m-heading">
          <h1>{event.title}</h1>
          <p className="m-lede">{event.shortDescription}</p>
        </div>
        <dl className="m-metadata">
          <div>
            <dt>Date</dt>
            <dd>{formatLongDate(event.date).toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{event.category}</dd>
          </div>
          <div>
            <dt>Accession</dt>
            <dd className="m-accession">{formatAccession(event.date)}</dd>
          </div>
        </dl>
      </header>

      <figure className="m-hero">
        <div className="m-hero-frame">
          <ResilientImage src={event.heroImage.src} alt={event.heroImage.alt} loading="eager" fallbackLabel="Image evidence unavailable" />
        </div>
        <figcaption>
          <span>{event.heroImage.caption}</span>
          <span>{event.heroImage.credit}</span>
        </figcaption>
      </figure>

      <div className="m-tabbar" role="tablist" aria-label="Record views">
        {VIEWS.map((tab, index) => (
          <button
            key={tab}
            id={`m-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={view === tab}
            aria-controls={`m-panel-${tab}`}
            tabIndex={view === tab ? 0 : -1}
            onClick={() => selectView(tab)}
            onKeyDown={(keyEvent) => handleTabKey(keyEvent, index)}
            data-cursor="view"
          >
            {tab === 'account' ? 'Account' : tab === 'chronology' ? 'Chronology' : 'Images'}
          </button>
        ))}
      </div>

      {view === 'account' && (
        <section className="m-panel" id="m-panel-account" role="tabpanel" aria-labelledby="m-tab-account">
          <div className="m-account">
            <div className="m-reading">
              <div id="m-account-body">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>

              {event.quote && (
                <figure className="m-quote" id="m-account-quote">
                  <blockquote>“{event.quote}”</blockquote>
                  <figcaption>{event.quoteAttribution}</figcaption>
                </figure>
              )}

              {event.impact && (
                <section className="m-impact" id="m-account-impact">
                  <h2>What changed</h2>
                  <p>{event.impact}</p>
                </section>
              )}
            </div>

            <aside className="m-rail">
              <div className="m-meta-label">In this record</div>
              <nav aria-label="Record sections">
                <a href="#m-account-body">Account</a>
                {event.quote && <a href="#m-account-quote">Quotation</a>}
                {event.impact && <a href="#m-account-impact">What changed</a>}
              </nav>

              <div className="m-meta-label">Filed under</div>
              <p className="m-keywords">{event.keywords.join(' · ')}</p>
            </aside>
          </div>
        </section>
      )}

      {view === 'chronology' && (
        <section className="m-panel" id="m-panel-chronology" role="tabpanel" aria-labelledby="m-tab-chronology">
          <ol className="m-chronology">
            {event.timeline.map((entry, index) => (
              <li key={`${entry.date}-${entry.title}-${index}`}>
                <span className="m-chronology-date">
                  {formatShortDate(entry.date)}
                  {entry.time ? <small>{entry.time} UTC</small> : null}
                </span>
                <div>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {view === 'images' && (
        <section className="m-panel" id="m-panel-images" role="tabpanel" aria-labelledby="m-tab-images">
          <div className="m-images">
            {event.galleryImages.map((image) => (
              <figure key={image.src}>
                <div className="m-image-frame">
                  <ResilientImage src={image.src} alt={image.alt} loading="lazy" fallbackLabel="Image evidence unavailable" />
                </div>
                <figcaption>
                  <span>{image.caption}</span>
                  <span>{image.credit}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          {event.video ? <FilmRecord video={event.video} /> : <p className="m-note">No film is catalogued for this record.</p>}
        </section>
      )}

      <nav className="m-footer-nav" aria-label="Record navigation">
        {previous ? (
          <Link to={`/event/${previous.date}`} data-cursor="view">
            <ArrowLeft size={13} strokeWidth={1.3} aria-hidden="true" /> {previous.title} · {formatShortDate(previous.date)}
          </Link>
        ) : (
          <span className="m-nav-disabled">First indexed record</span>
        )}
        <Link className="m-return" to="/calendar">Return to date index</Link>
        {next ? (
          <Link to={`/event/${next.date}`} data-cursor="view">
            {next.title} · {formatShortDate(next.date)} <ArrowRight size={13} strokeWidth={1.3} aria-hidden="true" />
          </Link>
        ) : (
          <span className="m-nav-disabled">Latest record in the index</span>
        )}
      </nav>
    </main>
  )
}



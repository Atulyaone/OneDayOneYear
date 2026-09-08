import { ArrowDown, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEventByDate, formatAccession, formatLongDate, sortedEvents } from '../data/selectors.ts'
import { animateOpening } from '../animations.ts'
import { ResilientImage } from '../components/ResilientImage.tsx'
import { useReducedMotion } from '../hooks/useReducedMotion.ts'

const newspaperImage = 'https://images.unsplash.com/photo-1631519952398-5b1d76b946e8?auto=format&fit=crop&w=1500&q=82'
const featuredEvent = getEventByDate('1969-07-20')

export function ArchiveOpeningPage() {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)

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
          <h1 id="opening-title" className="opening-title"><span>THE ARCHIVE</span><span>OPENS</span></h1>
          <p className="opening-description">A date is never only a date. Enter a living index of the moments that changed what came after.</p>
        </div>
        <div className="opening-actions">
          <button type="button" className="text-action text-action-light" onClick={() => navigate(`/event/${featuredEvent.date}`)} data-cursor="open">Open featured record <ArrowRight size={15} strokeWidth={1.2} aria-hidden="true" /></button>
          <button type="button" className="skip-action" onClick={() => navigate('/calendar')} data-cursor="view">Browse date index</button>
        </div>
        <span className="opening-scroll" aria-hidden="true"><ArrowDown size={17} strokeWidth={1.2} /> Scroll to inspect</span>
      </section>

      <section className="newspaper-stage" aria-label="Floating newspaper preview">
        <div className="stage-light" aria-hidden="true" />
        <article className="newspaper" style={{ backgroundImage: `url(${newspaperImage})` }}>
          <div className="newspaper-wash" />
          <div className="newspaper-header">
            <span>OD / OHM</span>
            <span>VOL. I / PUBLIC RECORDS</span>
            <span>NO. 001</span>
          </div>
          <div className="newspaper-rule" />
          <div className="newspaper-masthead">ONE DAY<br /><em>ONE HISTORICAL MOMENT</em></div>
          <div className="newspaper-subhead">A DAILY INDEX OF THE DAYS THAT CHANGED THE WORLD</div>
          <div className="newspaper-grid">
            <div className="newspaper-column newspaper-column-wide">
              <span className="newspaper-label">{formatLongDate(featuredEvent.date)} / SPECIAL EDITION</span>
              <h2>THE DAY<br />HUMANITY<br />LEFT EARTH</h2>
              <div className="newspaper-image newspaper-image-lunar">
                <ResilientImage src={featuredEvent.heroImage.src} alt={featuredEvent.heroImage.alt} loading="lazy" fallbackLabel="Image evidence unavailable" />
              </div>
              <p>{featuredEvent.shortDescription} {featuredEvent.heroImage.caption}</p>
            </div>
            <div className="newspaper-column">
              <span className="newspaper-label">ARCHIVE NOTES</span>
              <p>For every date, there is a before and an after. Browse the year, follow the source, and read the record behind the image.</p>
              <p className="newspaper-quote">“The important thing is that it was possible.”</p>
              <div className="newspaper-mini-rule" />
              <span className="newspaper-label">INDEXED FIELDS</span>
              <p className="newspaper-micro">SCIENCE / POLITICS / CULTURE / EXPLORATION / PUBLIC LIFE / WAR / IDEAS</p>
            </div>
            <div className="newspaper-calendar-column">
              <span className="newspaper-label">DATE INDEX / {featuredEvent.year}</span>
              <button type="button" className="printed-calendar" onClick={() => navigate('/calendar')} data-cursor="open" aria-label="Open the interactive date index">
                <span className="calendar-month">JULY</span>
                <span className="calendar-year">{featuredEvent.year} / {sortedEvents.length} INDEXED RECORDS</span>
                <span className="calendar-weekdays">SUN MON TUE WED THU FRI SAT</span>
                <span className="calendar-days"><i>01</i><i>02</i><i>03</i><i>04</i><i>05</i><i>06</i><i>07</i><i>08</i><i>09</i><i>10</i><i>11</i><i>12</i><i>13</i><i>14</i><i>15</i><i>16</i><i>17</i><i>18</i><i>19</i><i className="event-day">20</i><i>21</i><i>22</i><i>23</i><i>24</i><i>25</i><i>26</i><i>27</i><i>28</i></span>
                <span className="calendar-open">OPEN DATE INDEX <ArrowRight size={13} strokeWidth={1.4} /></span>
              </button>
            </div>
          </div>
          <div className="newspaper-footer"><span>ARCHIVE / SEARCH / ABOUT</span><span>PRINTED IN THE DARK</span><span>{formatAccession(featuredEvent.date)}</span></div>
        </article>
        <div className="stage-caption"><span>THE FIRST LEAF / A PERIODICAL OF MEMORY</span><span>Select the printed index to open</span></div>
      </section>
    </main>
  )
}

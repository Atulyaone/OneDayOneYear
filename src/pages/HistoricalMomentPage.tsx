import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { animateMoment } from '../animations.ts'
import { ArchiveGallery } from '../components/ArchiveGallery.tsx'
import { ArchiveNotFound } from '../components/ArchiveNotFound.tsx'
import { FilmRecord } from '../components/FilmRecord.tsx'
import { MomentHero } from '../components/MomentHero.tsx'
import { MomentTimeline } from '../components/MomentTimeline.tsx'
import { ResilientImage } from '../components/ResilientImage.tsx'
import { formatLongDate, getAdjacentEvents, getEventByDate } from '../data/selectors.ts'
import { useReducedMotion } from '../hooks/useReducedMotion.ts'

export function HistoricalMomentPage() {
  const { date } = useParams()
  const navigate = useNavigate()
  const event = getEventByDate(date)
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!rootRef.current || !event) return
    return animateMoment(rootRef.current, reducedMotion)
  }, [event, reducedMotion])

  if (!event) return <ArchiveNotFound detail="This historical moment is not filed in the current edition." />

  const { previous, next } = getAdjacentEvents(event.date)
  const storyParagraphs = event.fullStory.split('\n\n')
  const introduction = storyParagraphs[0] ?? event.shortDescription
  const context = storyParagraphs[1]
  const accountParagraphs = storyParagraphs.slice(2)

  return (
    <main className="moment-page page-shell" ref={rootRef}>
      <MomentHero event={event} />
      <section className="story-intro reveal-on-scroll"><span className="eyebrow">THE RECORD / INTRODUCTION</span><p className="story-lede">{introduction}</p>{context && <p>{context}</p>}</section>
      <figure className="evidence-image reveal-on-scroll"><ResilientImage src={event.galleryImages[1]?.src ?? event.heroImage.src} alt={event.galleryImages[1]?.alt ?? event.heroImage.alt} loading="lazy" fallbackLabel="Image evidence unavailable" /><figcaption><span>IMAGE EVIDENCE / {event.galleryImages[1]?.credit ?? event.heroImage.credit}</span><span>{event.galleryImages[1]?.caption ?? event.heroImage.caption}</span></figcaption></figure>
      <MomentTimeline entries={event.timeline} />
      {accountParagraphs.length > 0 && <section className="story-chapters"><div className="story-chapter-rail"><span>THE ACCOUNT</span><span>{formatLongDate(event.date)}</span></div><div className="story-chapter-copy">{accountParagraphs.map((paragraph, index) => <div className="story-chapter reveal-on-scroll" key={`${paragraph.slice(0, 20)}-${index}`}><span className="chapter-number">{String(index + 1).padStart(2, '0')}</span><p>{paragraph}</p></div>)}</div></section>}
      <section className="archive-plates reveal-on-scroll"><div className="section-heading"><span className="eyebrow">ARCHIVE PLATES / SOURCE SEQUENCE</span><h2>What the image cannot say alone</h2></div><div className="plate-grid">{event.galleryImages.slice(0, 3).map((image, index) => <figure key={image.src}><ResilientImage src={image.src} alt={image.alt} loading="lazy" fallbackLabel="Image evidence unavailable" /><figcaption><span>PLATE {String(index + 1).padStart(2, '0')}</span>{image.caption}</figcaption></figure>)}</div></section>
      <FilmRecord video={event.video} />
      {event.quote && <section className="quote-section reveal-on-scroll"><span className="eyebrow">WORDS IN THE RECORD</span><blockquote>“{event.quote}”</blockquote><cite>{event.quoteAttribution}</cite></section>}
      {event.impact && <section className="impact-section reveal-on-scroll"><div><span className="eyebrow">AFTER THIS DAY</span><h2>What changed after {formatLongDate(event.date).replace(String(event.year), '').trim()}</h2></div><p>{event.impact}</p></section>}
      <ArchiveGallery images={event.galleryImages} />
      <nav className="moment-navigation" aria-label="Historical moment navigation"><div>{previous ? <Link to={`/event/${previous.date}`} data-cursor="view"><span><ArrowLeft size={16} strokeWidth={1.2} /> Previous record</span><strong>{formatLongDate(previous.date)}</strong><small>{previous.title}</small></Link> : <span className="nav-disabled">First indexed record</span>}</div><button type="button" className="text-action text-action-light" onClick={() => navigate('/calendar')} data-cursor="view">Return to calendar <ArrowRight size={15} strokeWidth={1.2} /></button><div className="moment-next">{next ? <Link to={`/event/${next.date}`} data-cursor="view"><span>Next record <ArrowRight size={16} strokeWidth={1.2} /></span><strong>{formatLongDate(next.date)}</strong><small>{next.title}</small></Link> : <span className="nav-disabled">End of index</span>}</div></nav>
    </main>
  )
}

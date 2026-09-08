import { ArrowDown } from 'lucide-react'
import type { HistoricalEvent } from '../types.ts'
import { formatAccession, formatLongDate } from '../data/selectors.ts'
import { ResilientImage } from './ResilientImage.tsx'

export function MomentHero({ event }: { event: HistoricalEvent }) {
  const displayTitle = event.date === '1969-07-20' ? ['THE DAY', 'HUMANITY', 'LEFT EARTH'] : event.title.toUpperCase().split(' ').reduce<string[][]>((lines, word) => {
    const current = lines[lines.length - 1]
    if (!current || current.join(' ').length + word.length > 16) lines.push([word])
    else current.push(word)
    return lines
  }, []).map((line) => line.join(' '))

  return (
    <header className="moment-hero">
      <div className="moment-hero-metadata"><span className="eyebrow">HISTORICAL MOMENT / {event.category}</span><strong>{formatAccession(event.date)}</strong><span>YEAR / {event.year}</span><span>FILED UNDER / {event.category}</span></div>
      <div className="moment-hero-copy"><span className="moment-date">{formatLongDate(event.date)}</span><h1>{displayTitle.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</h1><p>{event.shortDescription}</p><span className="moment-scroll"><ArrowDown size={15} strokeWidth={1.2} /> Scroll to read the record</span></div>
      <figure className="moment-hero-media"><ResilientImage src={event.heroImage.src} alt={event.heroImage.alt} fetchPriority="high" fallbackLabel="Image evidence unavailable" /><figcaption>{event.heroImage.caption}<br /><span>{event.heroImage.credit}</span></figcaption></figure>
    </header>
  )
}

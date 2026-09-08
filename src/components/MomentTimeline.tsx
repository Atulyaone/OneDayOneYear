import { ArrowRight } from 'lucide-react'
import type { TimelineEntry } from '../types.ts'

export function MomentTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <section className="timeline-section reveal-on-scroll" aria-labelledby="timeline-heading">
      <div className="section-heading"><span className="eyebrow">SEQUENCE / CHRONOLOGY</span><h2 id="timeline-heading">The hours around the moment</h2><span>{String(entries.length).padStart(2, '0')} entries</span></div>
      <div className="timeline-track" tabIndex={0} aria-label="Chronological sequence. Use horizontal scrolling to read all entries.">
        {entries.map((entry, index) => <article className="timeline-entry" key={`${entry.date}-${entry.time ?? 'no-time'}-${entry.title}`}><span className="timeline-number">{String(index + 1).padStart(2, '0')}</span><span className="timeline-date">{entry.date}{entry.time ? ` / ${entry.time}` : ''}</span><h3>{entry.title}</h3><p>{entry.description}</p></article>)}
        <div className="timeline-end"><span className="eyebrow">READ THE FULL ACCOUNT</span><ArrowRight size={19} strokeWidth={1.2} /></div>
      </div>
      <p className="timeline-scroll-hint">Drag or shift-scroll to follow the sequence</p>
    </section>
  )
}

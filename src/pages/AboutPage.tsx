import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const archiveRoomImage = 'https://images.unsplash.com/photo-1777620817561-3865fc61bcf0?auto=format&fit=crop&w=1600&q=82'

export function AboutPage() {
  return (
    <main className="about-page page-shell">
      <div className="about-header"><span className="eyebrow">OD / OHM / COLLECTOR’S NOTE</span><Link className="line-control" to="/calendar" data-cursor="view"><ArrowLeft size={15} strokeWidth={1.2} /> Return to calendar</Link></div>
      <section className="about-intro">
        <span className="eyebrow">ABOUT THE ARCHIVE</span>
        <h1>One Day, One Historical Moment is an interactive archive exploring the moments that shaped history, one date at a time.</h1>
        <p className="about-lede">The archive is built around a simple question: what changes when history is entered through a date rather than a subject? Each record opens a small door into the decisions, people, images, and consequences gathered around one day.</p>
      </section>
      <section className="about-image-band"><img src={archiveRoomImage} alt="Archive shelves and documents in a quiet storage room" /><span>IMAGE PLATE / THE PLACE WHERE RECORDS REMAIN</span></section>
      <section className="about-methodology">
        <div><span className="eyebrow">01 / WHAT IS INDEXED</span><h2>Dates that entered public memory.</h2><p>Political decisions, scientific thresholds, cultural works, movements, and events whose consequences continue beyond the day they occurred.</p></div>
        <div><span className="eyebrow">02 / HOW RECORDS ARE ORGANIZED</span><h2>One date. One record. Many lines outward.</h2><p>Browse by month, search by subject or category, or follow the previous and next moments to move through the archive chronologically.</p></div>
        <div><span className="eyebrow">03 / A NOTE ON SOURCES</span><h2>Images are evidence, not decoration.</h2><p>Every image and film reference is paired with a credit. The written record is designed to remain readable when media is unavailable.</p></div>
      </section>
      <section className="about-closing"><p>“A date is never only a date.”</p><Link className="text-action" to="/calendar" data-cursor="open">Open the date index <ArrowRight size={15} strokeWidth={1.2} /></Link></section>
      <footer className="about-footer"><span>ONE DAY / ONE HISTORICAL MOMENT</span><span>ACCESSIBILITY / SOURCE NOTE / VOL. I</span></footer>
    </main>
  )
}

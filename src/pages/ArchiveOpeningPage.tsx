import { ArrowDown, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEventByDate, formatAccession, formatLongDate, sortedEvents } from '../data/selectors.ts'
import { animateOpening } from '../animations.ts'
import { ResilientImage } from '../components/ResilientImage.tsx'
import { useReducedMotion } from '../hooks/useReducedMotion.ts'

const featuredEvent = getEventByDate('1969-07-20')

export function ArchiveOpeningPage() {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const totalFrames = 242;
  const currentFrame = (index: number) => `/frames/frame_${index.toString().padStart(4, '0')}.jpg`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => { if (i === 1) renderFrame(1); };
      images.push(img);
    }

    function renderFrame(index: number) {
      if (!context || !canvas || !images[index - 1]) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[index - 1], 0, 0);
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScrollTop <= 0) return;

      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(totalFrames, Math.max(1, Math.ceil(scrollFraction * totalFrames)));

      requestAnimationFrame(() => renderFrame(frameIndex));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        <div className="stage-caption">
          <span>THE FIRST LEAF / A PERIODICAL OF MEMORY</span>
          <span>Scroll to inspect</span>
        </div>
      </section>

    </main>
  )
}

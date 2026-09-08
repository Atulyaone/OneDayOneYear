import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ArchiveImage } from '../types.ts'
import { useFocusTrap } from '../hooks/useFocusTrap.ts'
import { ResilientImage } from './ResilientImage.tsx'

export function ArchiveGallery({ images }: { images: ArchiveImage[] }) {
  const [availableImages, setAvailableImages] = useState(images)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const activeImage = availableImages[activeIndex]

  useEffect(() => {
    setAvailableImages(images)
    setActiveIndex(0)
  }, [images])

  useEffect(() => {
    if (activeIndex >= availableImages.length) setActiveIndex(Math.max(0, availableImages.length - 1))
    if (!availableImages.length) setLightboxOpen(false)
  }, [activeIndex, availableImages.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (!availableImages.length) return
      if (event.key === 'ArrowRight') setActiveIndex((current) => (current + 1) % availableImages.length)
      if (event.key === 'ArrowLeft') setActiveIndex((current) => (current - 1 + availableImages.length) % availableImages.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [availableImages.length, lightboxOpen])

  useFocusTrap({ active: lightboxOpen, containerRef: lightboxRef, initialRef: closeRef, onEscape: () => setLightboxOpen(false) })

  const handleImageError = (failedSrc: string) => {
    setAvailableImages((current) => current.filter((image) => image.src !== failedSrc))
  }

  if (!activeImage) {
    return <section className="archive-gallery reveal-on-scroll" aria-labelledby="gallery-heading"><div className="section-heading"><span className="eyebrow">PLATES / IMAGE INDEX</span><h2 id="gallery-heading">Archive images</h2></div><p className="gallery-unavailable">No image plates are currently available for this record.</p></section>
  }

  return (
    <section className="archive-gallery reveal-on-scroll" aria-labelledby="gallery-heading">
      <div className="section-heading"><span className="eyebrow">PLATES / IMAGE INDEX</span><h2 id="gallery-heading">Archive images</h2><span>{String(activeIndex + 1).padStart(2, '0')} / {String(availableImages.length).padStart(2, '0')}</span></div>
      <div className="gallery-layout">
        <button type="button" className="gallery-active" onClick={() => setLightboxOpen(true)} data-cursor="plate" aria-label={`View image ${activeIndex + 1}: ${activeImage.caption}`}>
          <ResilientImage src={activeImage.src} alt={activeImage.alt} loading="lazy" fallbackLabel="Image evidence unavailable" onError={() => handleImageError(activeImage.src)} />
          <span className="gallery-expand">EXPAND ↗</span>
        </button>
        <div className="gallery-list" role="list" aria-label="Archive images">
          {availableImages.map((image, index) => (
            <div role="listitem" key={image.src}>
              <button type="button" className={index === activeIndex ? 'is-active' : ''} onClick={() => setActiveIndex(index)} data-cursor="plate" aria-current={index === activeIndex ? 'true' : undefined}>
                <span>{String(index + 1).padStart(2, '0')}</span><span>{image.caption}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="gallery-caption"><span>{activeImage.caption}</span><span>{activeImage.credit}</span></div>
      {lightboxOpen && (
        <div ref={lightboxRef} className="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-heading" onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxOpen(false) }}>
          <h2 id="lightbox-heading" className="sr-only">Expanded archive image</h2>
          <button ref={closeRef} type="button" className="lightbox-close" onClick={() => setLightboxOpen(false)} data-cursor="close" aria-label="Close image"><X size={19} strokeWidth={1.2} /> Close</button>
          <ResilientImage src={activeImage.src} alt={activeImage.alt} loading="eager" fallbackLabel="Image evidence unavailable" onError={() => handleImageError(activeImage.src)} />
          <div className="lightbox-footer"><span>{activeImage.caption}</span><span>{String(activeIndex + 1).padStart(2, '0')} / {String(availableImages.length).padStart(2, '0')}</span></div>
          <div className="lightbox-controls"><button type="button" onClick={() => setActiveIndex((current) => (current - 1 + availableImages.length) % availableImages.length)} data-cursor="view" aria-label="Previous image"><ArrowLeft size={18} strokeWidth={1.2} /></button><button type="button" onClick={() => setActiveIndex((current) => (current + 1) % availableImages.length)} data-cursor="view" aria-label="Next image"><ArrowRight size={18} strokeWidth={1.2} /></button></div>
        </div>
      )}
    </section>
  )
}

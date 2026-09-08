import { Play, Volume2 } from 'lucide-react'
import { useState } from 'react'
import type { ArchiveVideo } from '../types.ts'
import { ResilientImage } from './ResilientImage.tsx'

export function FilmRecord({ video }: { video: ArchiveVideo | null }) {
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!video) {
    return <section className="film-record film-record-unavailable reveal-on-scroll"><div className="film-screen" role="status"><span className="eyebrow">FILM RECORD</span><strong>Written record only.</strong><p>No film is catalogued for this moment. Continue with the historical account below.</p></div></section>
  }

  return (
    <section className="film-record reveal-on-scroll">
      <div className="film-record-header"><div><span className="eyebrow">FILM RECORD / ARCHIVE PREVIEW</span><h2>Moving evidence</h2></div><span className="film-source">{video.source} / {video.duration}</span></div>
      <div className="film-screen">
        {playing && !failed ? (
          <video className="film-video" src={video.src} poster={video.poster} controls autoPlay playsInline preload="metadata" aria-label={`Archival film: ${video.source}`} onError={() => setFailed(true)} />
        ) : (
          <>
            <ResilientImage className="film-media-poster" src={video.poster} alt="Archival film preview" loading="lazy" fallbackLabel="Film poster unavailable" />
            <div className="film-screen-overlay" />
            {!failed && <button type="button" className="film-play" onClick={() => { setFailed(false); setPlaying(true) }} data-cursor="open" aria-label="Play archival film"><Play size={28} fill="currentColor" strokeWidth={1.1} /></button>}
          </>
        )}
        {failed && <div className="film-fallback" role="status"><strong>Film unavailable.</strong><span>Written record remains below.</span><button type="button" onClick={() => { setFailed(false); setPlaying(false) }} data-cursor="view">Return to poster</button></div>}
      </div>
      <div className="film-record-caption"><span>RECORDING / {video.source}</span><span><Volume2 size={14} strokeWidth={1.2} /> Written record available below</span></div>
    </section>
  )
}

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Volume2, VolumeX, X } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { formatShortDate } from '../data/selectors'
import { useArchiveSearch } from '../hooks/useArchiveSearch'
import { useAudioController } from '../hooks/useAudioController'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { usePointerCapability } from '../hooks/usePointerCapability'
import { useReducedMotion } from '../hooks/useReducedMotion'
import type { CursorMode } from '../types'
import { PageProgress } from './PageProgress'

interface ArchiveShellContextValue {
  openSearch: (trigger?: HTMLElement | null) => void
}

const ArchiveShellContext = createContext<ArchiveShellContextValue | null>(null)

export function useArchiveShell() {
  const context = useContext(ArchiveShellContext)
  if (!context) throw new Error('useArchiveShell must be used inside ArchiveShell')
  return context
}

function CustomCursor({ enabled }: { enabled: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [mode, setMode] = useState<CursorMode>('idle')

  useEffect(() => {
    if (!enabled || !cursorRef.current) return

    const cursor = cursorRef.current
    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power2.out' })
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power2.out' })

    const handleMove = (event: PointerEvent) => {
      moveX(event.clientX)
      moveY(event.clientY)
    }
    const handleOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      const interactive = target.closest<HTMLElement>('[data-cursor]')
      const nextMode = interactive?.dataset.cursor as CursorMode | undefined
      setMode(nextMode ?? 'idle')
      if (labelRef.current) {
        labelRef.current.textContent =
          nextMode === 'plate' ? 'VIEW PLATE' : nextMode?.toUpperCase() ?? ''
      }
    }
    const handleOut = (event: PointerEvent) => {
      const related = event.relatedTarget as HTMLElement | null
      if (!related?.closest('[data-cursor]')) setMode('idle')
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerover', handleOver, { passive: true })
    window.addEventListener('pointerout', handleOut, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerover', handleOver)
      window.removeEventListener('pointerout', handleOut)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className={`custom-cursor cursor-${mode}`} ref={cursorRef} aria-hidden="true">
      <span className="cursor-ring" />
      <span className="cursor-label" ref={labelRef} />
    </div>
  )
}

function ArchiveNavbar({
  onSearch,
  searchButtonRef,
  audioMode,
  onAudioToggle,
}: {
  onSearch: () => void
  searchButtonRef: RefObject<HTMLButtonElement | null>
  audioMode: string
  onAudioToggle: () => void
}) {
  return (
    <header className="archive-navbar">
      <NavLink to="/" className="archive-mark" data-cursor="open" aria-label="Return to archive opening">
        <span className="archive-mark-main">OD / OHM</span>
        <span className="archive-mark-sub">PUBLIC RECORDS / VOL. I</span>
      </NavLink>
      <nav className="archive-nav-links" aria-label="Primary navigation">
        <NavLink to="/calendar" data-cursor="view">Calendar</NavLink>
        <button ref={searchButtonRef} type="button" onClick={onSearch} data-cursor="view">Search</button>
        <NavLink to="/about" data-cursor="view">About</NavLink>
      </nav>
      <button
        type="button"
        className="audio-control"
        onClick={onAudioToggle}
        data-cursor="view"
        aria-label={audioMode === 'on' ? 'Turn sound off' : 'Turn sound on'}
      >
        {audioMode === 'on' ? (
          <Volume2 size={15} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <VolumeX size={15} strokeWidth={1.5} aria-hidden="true" />
        )}
        <span>{audioMode === 'unavailable' ? 'Sound unavailable' : audioMode === 'on' ? 'Sound on' : 'Sound off'}</span>
      </button>
    </header>
  )
}

// Physical Multi-Layer Typewriter Synthesizer
let typewriterCtx: AudioContext | null = null

function playTypewriterClick(isReturn = false) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return

    if (!typewriterCtx) typewriterCtx = new AudioContextClass()
    if (typewriterCtx.state === 'suspended') typewriterCtx.resume()

    const now = typewriterCtx.currentTime

    // Platen Body Thud
    const thudOsc = typewriterCtx.createOscillator()
    const thudGain = typewriterCtx.createGain()
    thudOsc.type = 'triangle'
    thudOsc.frequency.setValueAtTime(isReturn ? 120 : 210, now)
    thudOsc.frequency.exponentialRampToValueAtTime(40, now + 0.04)
    thudGain.gain.setValueAtTime(isReturn ? 0.45 : 0.28, now)
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    thudOsc.connect(thudGain)
    thudGain.connect(typewriterCtx.destination)
    thudOsc.start(now)
    thudOsc.stop(now + 0.05)

    // Metal Typebar Strike
    const snapLen = Math.floor(typewriterCtx.sampleRate * 0.02)
    const snapBuf = typewriterCtx.createBuffer(1, snapLen, typewriterCtx.sampleRate)
    const snapData = snapBuf.getChannelData(0)
    for (let i = 0; i < snapLen; i++) {
      snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (snapLen * 0.2))
    }
    const snapSource = typewriterCtx.createBufferSource()
    snapSource.buffer = snapBuf

    const snapFilter = typewriterCtx.createBiquadFilter()
    snapFilter.type = 'bandpass'
    snapFilter.frequency.setValueAtTime(
      isReturn ? 1500 : 3100 + (Math.random() * 400 - 200),
      now
    )
    snapFilter.Q.setValueAtTime(5.5, now)

    const snapGain = typewriterCtx.createGain()
    snapGain.gain.setValueAtTime(isReturn ? 0.5 : 0.38, now)
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)

    snapSource.connect(snapFilter)
    snapFilter.connect(snapGain)
    snapGain.connect(typewriterCtx.destination)
    snapSource.start(now)

    // Escapement Spring Clatter
    if (!isReturn) {
      const clatterLen = Math.floor(typewriterCtx.sampleRate * 0.018)
      const clatterBuf = typewriterCtx.createBuffer(1, clatterLen, typewriterCtx.sampleRate)
      const clatterData = clatterBuf.getChannelData(0)
      for (let i = 0; i < clatterLen; i++) {
        clatterData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clatterLen * 0.3))
      }
      const clatterSource = typewriterCtx.createBufferSource()
      clatterSource.buffer = clatterBuf

      const clatterFilter = typewriterCtx.createBiquadFilter()
      clatterFilter.type = 'highpass'
      clatterFilter.frequency.setValueAtTime(4200, now + 0.012)

      const clatterGain = typewriterCtx.createGain()
      clatterGain.gain.setValueAtTime(0.14, now + 0.012)
      clatterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

      clatterSource.connect(clatterFilter)
      clatterFilter.connect(clatterGain)
      clatterGain.connect(typewriterCtx.destination)
      clatterSource.start(now + 0.012)
    }
  } catch {
    // Audio fallback
  }
}

function SearchOverlay({
  open,
  onClose,
  soundEnabled,
}: {
  open: boolean
  onClose: () => void
  soundEnabled: boolean
}) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const { status, results, totalCount, activeIndex, setActiveIndex } = useArchiveSearch(query)
  useFocusTrap({ active: open, containerRef: sheetRef, initialRef: inputRef, onEscape: onClose })

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const openEvent = (date: string) => {
    onClose()
    navigate(`/event/${date}`)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (soundEnabled) {
      if (event.key.length === 1 || event.key === 'Backspace' || event.key === ' ') {
        playTypewriterClick(false)
      } else if (event.key === 'Enter') {
        playTypewriterClick(true)
      }
    }

    if (!results.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((activeIndex + 1) % results.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((activeIndex - 1 + results.length) % results.length)
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      if (results[activeIndex]) {
        openEvent(results[activeIndex].date)
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-sheet-heading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.div
            ref={sheetRef}
            className="search-sheet"
            initial={{ y: '-8%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-8%', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="search-sheet-header">
              <span className="eyebrow" id="search-sheet-heading">ARCHIVE INDEX / SEARCH</span>
              <button type="button" className="icon-button" onClick={onClose} aria-label="Close search" data-cursor="close">
                <X size={18} strokeWidth={1.4} />
              </button>
            </div>

            <label className="search-field">
              <span className="sr-only">Search dates, subjects, and fields</span>
              <Search size={18} strokeWidth={1.4} aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="> SEARCH THE ARCHIVE_"
                autoComplete="off"
                spellCheck="false"
                aria-controls={results.length ? 'search-results' : undefined}
                aria-activedescendant={results[activeIndex] ? `search-result-${results[activeIndex].date}` : undefined}
              />
            </label>

            <div className="search-status" aria-live="polite">
              {status === 'idle' && 'SEARCH DATES, SUBJECTS, AND FIELDS.'}
              {status === 'results' && `${String(results.length).padStart(2, '0')} RECORDS FOUND`}
              {status === 'empty' && '0 RECORDS FOUND'}
            </div>

            {status === 'idle' && (
              <div className="search-empty-index">
                <span>{totalCount ?? 20}</span>
                <p>Records catalogued across exploration, science, culture, politics, and public life.</p>
              </div>
            )}

            {status === 'empty' && (
              <div className="search-empty-index">
                <span>0</span>
                <p>Not found. No indexed records match “{query.trim()}”.</p>
              </div>
            )}

            {status === 'results' && (
              <ol className="search-results" id="search-results" role="listbox" aria-label="Archive search results">
                {results.map((result, index) => (
                  <li key={result.date} className={index === activeIndex ? 'is-active' : ''}>
                    <button
                      id={`search-result-${result.date}`}
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      onClick={() => openEvent(result.date)}
                      onMouseEnter={() => setActiveIndex(index)}
                      data-cursor="open"
                    >
                      <span className="result-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="result-date">{formatShortDate(result.date)}</span>
                      <span className="result-title">{result.title}</span>
                      <span className="result-category">{result.category}</span>
                    </button>
                  </li>
                ))}
              </ol>
            )}

            <p className="search-footnote">Press ↑ ↓ to move / Enter to open / Esc to close</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ArchiveShell() {
  const location = useLocation()
  const { coarsePointer } = usePointerCapability()
  const reducedMotion = useReducedMotion()
  const audio = useAudioController()
  const [searchOpen, setSearchOpen] = useState(false)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const openSearch = () => {
    setSearchOpen(true)
  }

  return (
    <ArchiveShellContext.Provider value={{ openSearch }}>
      <div className="archive-app" data-archive-variant="broadsheet" data-reduced-motion={reducedMotion ? 'true' : 'false'}>
        <ArchiveNavbar onSearch={openSearch} searchButtonRef={searchButtonRef} audioMode={audio.mode} onAudioToggle={audio.toggle} />
        <CustomCursor enabled={!coarsePointer && !reducedMotion} />
        <div className="film-grain" aria-hidden="true" />
        <PageProgress enabled={location.pathname.startsWith('/event/')} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="route-frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.18 : 0.42, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <SearchOverlay
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          soundEnabled={audio.mode === 'on'}
        />
      </div>
    </ArchiveShellContext.Provider>
  )
}
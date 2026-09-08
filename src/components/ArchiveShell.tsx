import { AnimatePresence, motion } from 'framer-motion'
import { Search, Volume2, VolumeX, X } from 'lucide-react'
import { createContext, useContext, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { formatShortDate } from '../data/selectors.ts'
import { useArchiveSearch } from '../hooks/useArchiveSearch.ts'
import { useAudioController } from '../hooks/useAudioController.ts'
import { useFocusTrap } from '../hooks/useFocusTrap.ts'
import { usePointerCapability } from '../hooks/usePointerCapability.ts'
import { useReducedMotion } from '../hooks/useReducedMotion.ts'
import type { CursorMode } from '../types.ts'
import { PageProgress } from './PageProgress.tsx'

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
    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.32, ease: 'power3.out' })
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.32, ease: 'power3.out' })
    const handleMove = (event: PointerEvent) => {
      moveX(event.clientX)
      moveY(event.clientY)
    }
    const handleOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      const interactive = target.closest<HTMLElement>('[data-cursor]')
      const nextMode = interactive?.dataset.cursor as CursorMode | undefined
      setMode(nextMode ?? 'idle')
      if (labelRef.current) labelRef.current.textContent = nextMode === 'plate' ? 'VIEW PLATE' : nextMode?.toUpperCase() ?? ''
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
      <button type="button" className="audio-control" onClick={onAudioToggle} data-cursor="view" aria-label={audioMode === 'on' ? 'Turn sound off' : 'Turn sound on'}>
        {audioMode === 'on' ? <Volume2 size={15} strokeWidth={1.5} aria-hidden="true" /> : <VolumeX size={15} strokeWidth={1.5} aria-hidden="true" />}
        <span>{audioMode === 'unavailable' ? 'Sound unavailable' : audioMode === 'on' ? 'Sound on' : 'Sound off'}</span>
      </button>
    </header>
  )
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const { status, results, activeIndex, setActiveIndex } = useArchiveSearch(query)
  useFocusTrap({ active: open, containerRef: sheetRef, initialRef: inputRef, onEscape: onClose })

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const openEvent = (date: string) => {
    onClose()
    navigate(`/event/${date}`)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
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
      openEvent(results[activeIndex].date)
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
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
        >
          <motion.div ref={sheetRef} className="search-sheet" initial={{ y: '-8%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-8%', opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <div className="search-sheet-header">
              <span className="eyebrow" id="search-sheet-heading">ARCHIVE INDEX / SEARCH</span>
              <button type="button" className="icon-button" onClick={onClose} aria-label="Close search" data-cursor="close"><X size={18} strokeWidth={1.4} /></button>
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
                aria-controls={results.length ? 'search-results' : undefined}
                aria-activedescendant={results.length ? `search-result-${results[activeIndex].date}` : undefined}
              />
            </label>
            <div className="search-status" aria-live="polite">
              {status === 'searching' && 'Searching archive…'}
              {status === 'results' && `${results.length} record${results.length === 1 ? '' : 's'} found`}
              {status === 'empty' && `No indexed records match “${query.trim()}”`}
              {status === 'idle' && 'Search dates, subjects, and fields.'}
            </div>
            {status === 'idle' && <div className="search-empty-index"><span>20</span><p>Records catalogued across exploration, science, culture, politics, and public life.</p></div>}
            {status === 'empty' && <button type="button" className="text-action" onClick={() => setQuery('')} data-cursor="view">Clear search <span>↗</span></button>}
            {results.length > 0 && (
              <ol className="search-results" id="search-results" role="listbox" aria-label="Archive search results">
                {results.map((result, index) => (
                  <li key={result.date} className={index === activeIndex ? 'is-active' : ''}>
                    <button id={`search-result-${result.date}`} type="button" role="option" aria-selected={index === activeIndex} onClick={() => openEvent(result.date)} onMouseEnter={() => setActiveIndex(index)} data-cursor="open">
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
          <motion.div key={location.pathname} className="route-frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0.18 : 0.42, ease: 'easeOut' }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </ArchiveShellContext.Provider>
  )
}

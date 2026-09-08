import { useEffect, useRef, type RefObject } from 'react'

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface UseFocusTrapOptions {
  active: boolean
  containerRef: RefObject<HTMLElement | null>
  initialRef?: RefObject<HTMLElement | null>
  onEscape?: () => void
}

export function useFocusTrap({ active, containerRef, initialRef, onEscape }: UseFocusTrapOptions) {
  const onEscapeRef = useRef(onEscape)
  onEscapeRef.current = onEscape

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusInitial = () => {
      const initial = initialRef?.current
      const first = container.querySelector<HTMLElement>(focusableSelector)
      ;(initial ?? first)?.focus({ preventScroll: true })
    }

    const frame = window.requestAnimationFrame(focusInitial)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onEscapeRef.current?.()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [active, containerRef, initialRef])
}

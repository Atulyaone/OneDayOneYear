import { useEffect, type RefObject } from 'react'

const TOTAL_FRAMES = 242
const BATCH_SIZE = 8

const frameSource = (index: number) => `/frames/frame_${String(index).padStart(4, '0')}.jpg`

interface FrameSequenceOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>
  containerRef: RefObject<HTMLDivElement | null>
  reducedMotion: boolean
}

/**
 * Draws the scroll-scrubbed newspaper sequence.
 *
 * - Loads the first frame immediately, then the rest in small batches so the
 *   opening does not fire 242 simultaneous requests.
 * - Uses a wider stride on small screens (121 or 81 frames instead of 242).
 * - Renders a single still and skips the scroll listener when the visitor has
 *   asked for reduced motion.
 */
export function useFrameSequence({ canvasRef, containerRef, reducedMotion }: FrameSequenceOptions) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = 1920
    canvas.height = 1080

    let disposed = false
    const cache = new Map<number, HTMLImageElement>()

    const draw = (image: HTMLImageElement) => {
      if (disposed) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
    }

    const load = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new Image()
        image.decoding = 'async'
        image.src = frameSource(index)
        image.onload = () => {
          if (!disposed) {
            cache.set(index, image)
          }
          resolve()
        }
        image.onerror = () => resolve()
      })

    if (reducedMotion) {
      void load(TOTAL_FRAMES).then(() => {
        const still = cache.get(TOTAL_FRAMES)
        if (still) draw(still)
      })
      return () => {
        disposed = true
      }
    }

    const viewport = window.innerWidth
    const stride = viewport <= 560 ? 3 : viewport <= 1024 ? 2 : 1

    const frames: number[] = []
    for (let index = 1; index <= TOTAL_FRAMES; index += stride) frames.push(index)
    if (frames[frames.length - 1] !== TOTAL_FRAMES) frames.push(TOTAL_FRAMES)

    const renderNearest = (target: number) => {
      let chosen: HTMLImageElement | undefined

      for (let index = frames.length - 1; index >= 0; index -= 1) {
        if (frames[index] <= target) {
          chosen = cache.get(frames[index])
          if (chosen) break
        }
      }

      const first = cache.get(frames[0])
      if (chosen) draw(chosen)
      else if (first) draw(first)
    }

    let queued = false

    const update = () => {
      queued = false
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight

      if (scrollable <= 0 || rect.top > 0) {
        renderNearest(frames[0])
        return
      }

      const progress = Math.min(1, Math.max(0, -rect.top / scrollable))
      const target = Math.round(progress * (TOTAL_FRAMES - 1)) + 1
      renderNearest(target)
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }

    void (async () => {
      await load(frames[0])
      const first = cache.get(frames[0])
      if (first) draw(first)

      const rest = frames.slice(1)
      for (let index = 0; index < rest.length; index += BATCH_SIZE) {
        if (disposed) return
        await Promise.all(rest.slice(index, index + BATCH_SIZE).map(load))
      }
    })()

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      disposed = true
      window.removeEventListener('scroll', onScroll)
    }
  }, [canvasRef, containerRef, reducedMotion])
}

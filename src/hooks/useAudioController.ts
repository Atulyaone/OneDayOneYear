import { useCallback, useEffect, useRef, useState } from 'react'
import type { AudioMode } from '../types.ts'

export function useAudioController() {
  const [mode, setMode] = useState<AudioMode>('off')
  const contextRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  const stop = useCallback(() => {
    oscillatorsRef.current.forEach((oscillator) => oscillator.stop())
    oscillatorsRef.current = []
    if (gainRef.current) gainRef.current.disconnect()
    gainRef.current = null
    if (contextRef.current) void contextRef.current.suspend()
    setMode('off')
  }, [])

  const start = useCallback(async () => {
    if (!window.AudioContext) {
      setMode('unavailable')
      return
    }

    try {
      const context = contextRef.current ?? new AudioContext()
      contextRef.current = context
      await context.resume()
      const gain = context.createGain()
      gain.gain.value = 0.012
      gain.connect(context.destination)
      const frequencies = [72, 108]
      oscillatorsRef.current = frequencies.map((frequency, index) => {
        const oscillator = context.createOscillator()
        oscillator.type = index === 0 ? 'sine' : 'triangle'
        oscillator.frequency.value = frequency
        oscillator.detune.value = index === 0 ? -4 : 5
        oscillator.connect(gain)
        oscillator.start()
        return oscillator
      })
      gainRef.current = gain
      setMode('on')
    } catch {
      setMode('unavailable')
    }
  }, [])

  const toggle = useCallback(() => {
    if (mode === 'on') {
      stop()
      return
    }
    if (mode === 'unavailable') return
    void start()
  }, [mode, start, stop])

  useEffect(() => () => {
    oscillatorsRef.current.forEach((oscillator) => oscillator.stop())
    if (contextRef.current) void contextRef.current.close()
  }, [])

  return { mode, toggle }
}

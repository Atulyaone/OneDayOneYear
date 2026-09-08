import type { ImgHTMLAttributes } from 'react'
import { useEffect, useState } from 'react'

interface ResilientImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackLabel?: string
  fallbackClassName?: string
}

export function ResilientImage({
  alt,
  src,
  className = '',
  fallbackLabel = 'Image evidence unavailable',
  fallbackClassName = '',
  onError,
  ...props
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (failed) {
    return (
      <div
        className={`resilient-image-fallback ${fallbackClassName || className}`.trim()}
        role="img"
        aria-label={`${fallbackLabel}: ${alt}`}
      >
        <span>{fallbackLabel}</span>
      </div>
    )
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailed(true)
        onError?.(event)
      }}
    />
  )
}

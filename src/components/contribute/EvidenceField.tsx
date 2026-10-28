import { useEffect, useMemo, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { EVIDENCE_ACCEPT } from '../../data/validation'

interface EvidenceFieldProps {
  file: File | null
  onChange: (file: File | null) => void
  error?: string
}

const formatSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function EvidenceField({ file, onChange, error }: EvidenceFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const labelRef = useRef<HTMLLabelElement>(null)

  const preview = useMemo(
    () => (file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null),
    [file],
  )

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview)
    },
    [preview],
  )

  const clear = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const errorId = error ? 'evidence-error' : undefined
  const hintId = error ? undefined : 'evidence-hint'

  return (
    <div className={`contribute-field contribute-evidence${error ? ' has-error' : ''}`}>
      <span className="contribute-label" id="evidence-label">
        Optional evidence (image or video file)
      </span>

      <div className="contribute-evidence-row">
        <label
          ref={labelRef}
          className="contribute-file-button"
          htmlFor="evidence"
          tabIndex={-1}
        >
          <Upload size={15} strokeWidth={1.6} aria-hidden="true" />
          Choose file
          <input
            ref={inputRef}
            id="evidence"
            name="evidence"
            type="file"
            accept={EVIDENCE_ACCEPT}
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            aria-describedby={errorId ?? hintId}
            aria-invalid={error ? true : undefined}
          />
        </label>

        {file ? (
          <span className="contribute-file-name">
            {file.name} <small>{formatSize(file.size)}</small>
          </span>
        ) : (
          <span className="contribute-file-empty">No file chosen (optional)</span>
        )}

        {file && (
          <button type="button" className="contribute-file-remove" onClick={clear}>
            <X size={13} strokeWidth={1.6} aria-hidden="true" /> Remove
          </button>
        )}
      </div>

      {preview && file && (
        <img className="contribute-evidence-preview" src={preview} alt={`Preview of ${file.name}`} />
      )}

      {error ? (
        <p className="contribute-error" id={errorId} role="alert">
          {error}
        </p>
      ) : (
        <p className="contribute-hint" id={hintId}>
          JPEG, PNG, WebP, MP4, or WebM. Up to 20 MB.
        </p>
      )}
    </div>
  )
}

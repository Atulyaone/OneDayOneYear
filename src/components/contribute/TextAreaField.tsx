import type { RefObject } from 'react'
import { MAX_DESCRIPTION_LENGTH } from '../../data/validation'

interface TextAreaFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  required?: boolean
  placeholder?: string
  rows?: number
  textareaRef?: RefObject<HTMLTextAreaElement | null>
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  placeholder,
  rows = 6,
  textareaRef,
}: TextAreaFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`contribute-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      <textarea
        ref={textareaRef}
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        maxLength={MAX_DESCRIPTION_LENGTH}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />

      <div className="contribute-field-meta">
        {error ? (
          <p className="contribute-error" id={errorId} role="alert">
            {error}
          </p>
        ) : (
          hint && (
            <p className="contribute-hint" id={hintId}>
              {hint}
            </p>
          )
        )}
        <span className="contribute-counter">
          {value.trim().length.toLocaleString('en-GB')} / {MAX_DESCRIPTION_LENGTH.toLocaleString('en-GB')}
        </span>
      </div>
    </div>
  )
}

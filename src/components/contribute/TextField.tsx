import type { RefObject } from 'react'

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  required?: boolean
  type?: 'text' | 'date'
  placeholder?: string
  autoComplete?: string
  max?: string
  inputRef?: RefObject<HTMLInputElement | null>
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  type = 'text',
  placeholder,
  autoComplete,
  max,
  inputRef,
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = errorId ?? hintId

  return (
    <div className={`contribute-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      <input
        ref={inputRef}
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        max={max}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />

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
    </div>
  )
}

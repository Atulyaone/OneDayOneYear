import { useRef, type FormEvent } from 'react'
import { FIELD_ORDER, useContributionForm } from '../../hooks/useContributionForm'
import { todayISO } from '../../data/validation'
import { EvidenceField } from './EvidenceField'
import { SubmissionReceipt } from './SubmissionReceipt'
import { TextAreaField } from './TextAreaField'
import { TextField } from './TextField'

interface ContributeFormProps {
  initialDate?: string
}

export function ContributeForm({ initialDate }: ContributeFormProps) {
  const form = useContributionForm(initialDate)
  const nameRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = await form.submit()
    const first = FIELD_ORDER.find((field) => nextErrors[field])

    if (first === 'name') nameRef.current?.focus()
    else if (first === 'date') dateRef.current?.focus()
    else if (first === 'description') descriptionRef.current?.focus()
    else if (first === 'evidence') {
      const evidenceButton = document.querySelector<HTMLElement>('.contribute-file-button')
      evidenceButton?.focus()
    }
  }

  if (form.receipt) {
    return <SubmissionReceipt receipt={form.receipt} onReset={form.reset} />
  }

  const submitting = form.status === 'submitting'

  return (
    <form className="contribute-form" onSubmit={handleSubmit} noValidate>
      {form.formError && (
        <div className="contribute-summary" role="alert">
          <strong>This record was not filed.</strong>
          <p>{form.formError}</p>
        </div>
      )}

      <TextField
        id="name"
        label="Your name / researcher"
        value={form.values.name}
        onChange={(value) => form.update('name', value)}
        onBlur={() => form.blur('name')}
        error={form.errors.name}
        placeholder="e.g. Dr. E. Vance"
        autoComplete="name"
        required
        inputRef={nameRef}
      />

      <TextField
        id="date"
        type="date"
        label="Historical date"
        value={form.values.date}
        onChange={(value) => form.update('date', value)}
        onBlur={() => form.blur('date')}
        error={form.errors.date}
        hint="Any date up to today."
        max={todayISO()}
        required
        inputRef={dateRef}
      />

      <TextAreaField
        id="description"
        label="Record description & notes"
        value={form.values.description}
        onChange={(value) => form.update('description', value)}
        onBlur={() => form.blur('description')}
        error={form.errors.description}
        hint="What happened, and what evidence supports it?"
        placeholder="Describe the moment, the source, and the historical significance…"
        required
        textareaRef={descriptionRef}
      />

      <EvidenceField
        file={form.values.evidence}
        onChange={(file) => form.update('evidence', file)}
        error={form.errors.evidence}
      />

      <button className="contribute-submit" type="submit" disabled={submitting}>
        {submitting ? 'Filing record…' : 'Submit record'}
      </button>

      <p className="contribute-note">
        Records are filed as pending review. You will receive an accession number immediately after submission.
      </p>

      <p className="sr-only" aria-live="polite">
        {submitting ? 'Submitting the record.' : ''}
      </p>
    </form>
  )
}

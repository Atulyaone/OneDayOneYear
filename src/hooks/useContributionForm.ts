import { useCallback, useState } from 'react'
import { SubmissionError, submitContribution, type SubmissionReceipt } from '../api/submissions'
import {
  emptyContribution,
  validateContribution,
  type ContributionErrors,
  type ContributionField,
  type ContributionValues,
} from '../data/validation'

export type ContributionStatus = 'idle' | 'submitting' | 'success' | 'error'

export const FIELD_ORDER: ContributionField[] = ['name', 'date', 'description', 'evidence']

export function useContributionForm(initialDate = '') {
  const [values, setValues] = useState<ContributionValues>({
    ...emptyContribution,
    date: initialDate,
  })
  const [errors, setErrors] = useState<ContributionErrors>({})
  const [status, setStatus] = useState<ContributionStatus>('idle')
  const [formError, setFormError] = useState('')
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null)

  const update = useCallback(
    <K extends keyof ContributionValues>(field: K, value: ContributionValues[K]) => {
      setValues((previous) => ({ ...previous, [field]: value }))
      setErrors((previous) => {
        const key = field as ContributionField
        if (!previous[key]) return previous
        const next = { ...previous }
        delete next[key]
        return next
      })
    },
    [],
  )

  const blur = useCallback(
    (field: ContributionField) => {
      const message = validateContribution(values)[field]
      setErrors((previous) => {
        const next = { ...previous }
        if (message) next[field] = message
        else delete next[field]
        return next
      })
    },
    [values],
  )

  const submit = useCallback(async (): Promise<ContributionErrors> => {
    if (status === 'submitting') return {}

    const nextErrors = validateContribution(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      setFormError('Some fields need attention before this record can be filed.')
      return nextErrors
    }

    setStatus('submitting')
    setFormError('')

    try {
      const result = await submitContribution(values)
      setReceipt(result)
      setStatus('success')
      return {}
    } catch (error) {
      setStatus('error')
      if (error instanceof SubmissionError) {
        setFormError(error.message)
        if (error.fields) {
          setErrors(error.fields as ContributionErrors)
          return error.fields as ContributionErrors
        }
        return {}
      }
      setFormError('The record could not be submitted. Check the API and try again.')
      return {}
    }
  }, [status, values])

  const reset = useCallback(() => {
    setValues({ ...emptyContribution })
    setErrors({})
    setStatus('idle')
    setFormError('')
    setReceipt(null)
  }, [])

  return { values, errors, status, formError, receipt, update, blur, submit, reset }
}

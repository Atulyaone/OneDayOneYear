import { useParams } from 'react-router-dom'
import { ArchiveNotFound } from '../components/ArchiveNotFound.tsx'
import { EditorialRecord } from '../components/records/EditorialRecord.tsx'
import { ModernRecord } from '../components/records/ModernRecord.tsx'
import { SpecialReportRecord } from '../components/records/SpecialReportRecord.tsx'
import { getEventByDate, getRecordTemplate } from '../data/selectors.ts'

export function HistoricalMomentPage() {
  const { date } = useParams()
  const event = getEventByDate(date)

  if (!event) {
    return <ArchiveNotFound detail="This historical moment is not filed in the current edition." />
  }

  const template = getRecordTemplate(event)

  if (template === 'broadsheet') return <SpecialReportRecord event={event} />
  if (template === 'modern') return <ModernRecord event={event} />

  return <EditorialRecord event={event} />
}

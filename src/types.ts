export type AudioMode = 'off' | 'on' | 'unavailable'
export type SearchStatus = 'idle' | 'searching' | 'results' | 'empty'
export type CursorMode = 'idle' | 'view' | 'open' | 'plate'

export interface ArchiveImage {
  src: string
  alt: string
  credit: string
  caption: string
}

export interface ArchiveVideo {
  src: string
  poster: string
  source: string
  duration: string
}

export interface TimelineEntry {
  date: string
  time?: string
  title: string
  description: string
}

export interface HistoricalEvent {
  date: string
  title: string
  year: number
  category: string
  keywords: string[]
  shortDescription: string
  fullStory: string
  heroImage: ArchiveImage
  galleryImages: ArchiveImage[]
  video: ArchiveVideo | null
  timeline: TimelineEntry[]
  quote?: string
  quoteAttribution?: string
  impact?: string
}

export interface CalendarCell {
  cellKey: string
  monthIndex: number
  monthDay: string
  isoDate: string
  day: number
  isCurrentMonth: boolean
  event: HistoricalEvent | null
}

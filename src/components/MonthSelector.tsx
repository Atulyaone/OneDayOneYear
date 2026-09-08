import { formatMonth } from '../data/selectors.ts'

interface MonthSelectorProps {
  monthIndex: number
  onSelect: (index: number) => void
}

export function MonthSelector({ monthIndex, onSelect }: MonthSelectorProps) {
  return (
    <div className="month-selector" aria-label="Select a month" role="list">
      {Array.from({ length: 12 }, (_, index) => (
        <button
          key={index}
          type="button"
          role="listitem"
          className={index === monthIndex ? 'is-active' : ''}
          onClick={() => onSelect(index)}
          aria-pressed={index === monthIndex}
          data-cursor="view"
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{formatMonth(index).slice(0, 3)}</strong>
        </button>
      ))}
    </div>
  )
}

import { createContext, useContext } from 'react'

export interface ArchiveShellContextValue {
  openSearch: (trigger?: HTMLElement | null) => void
}

export const ArchiveShellContext = createContext<ArchiveShellContextValue | null>(null)

export function useArchiveShell() {
  const context = useContext(ArchiveShellContext)
  if (!context) throw new Error('useArchiveShell must be used inside ArchiveShell')
  return context
}


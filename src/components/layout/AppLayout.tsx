import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface AppLayoutProps {
  children: ReactNode
  showFilters?: boolean
}

export function AppLayout({ children, showFilters }: AppLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-2)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>
        <Topbar showFilters={showFilters} />
        <main style={{ flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {children}
        </main>
      </div>
    </div>
  )
}

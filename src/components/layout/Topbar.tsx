import { useLocation } from 'react-router-dom'
import { ChevronDown, Calendar, Radio } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Início',
  '/conversations': 'Conversas',
  '/leads': 'Leads',
  '/reports': 'Relatórios',
  '/my-ai': 'Minha IA',
  '/access': 'Acessos',
  '/help': 'Ajuda',
  '/admin/clients': 'Clientes',
  '/admin/packages': 'Pacotes',
}

interface TopbarProps {
  month?: string
  channel?: string
  onMonthChange?: (v: string) => void
  onChannelChange?: (v: string) => void
  showFilters?: boolean
}

export function Topbar({ showFilters = true }: TopbarProps) {
  const location = useLocation()
  const pageTitle = routeLabels[location.pathname] || 'Sigma SDR'

  return (
    <header style={{
      height: 48,
      backgroundColor: 'var(--bg-1)',
      borderBottom: '1px solid var(--int-4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Left: page title */}
      <h1 style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>
        {pageTitle}
      </h1>

      {/* Right: filters */}
      {showFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 6,
            border: '1px solid var(--int-4)', backgroundColor: 'var(--bg-1)',
            cursor: 'pointer', fontSize: 12, color: 'var(--txt-11)',
            fontWeight: 500,
          }}>
            <Calendar size={12} style={{ color: 'var(--sol-10)' }} />
            Março, 2026
            <ChevronDown size={11} style={{ color: 'var(--brd-8)' }} />
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 6,
            border: '1px solid var(--int-4)', backgroundColor: 'var(--bg-1)',
            cursor: 'pointer', fontSize: 12, color: 'var(--txt-11)',
            fontWeight: 500,
          }}>
            <Radio size={12} style={{ color: 'var(--sol-10)' }} />
            Todos os canais
            <ChevronDown size={11} style={{ color: 'var(--brd-8)' }} />
          </button>
        </div>
      )}
    </header>
  )
}

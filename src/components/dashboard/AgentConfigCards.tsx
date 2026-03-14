import { useNavigate } from 'react-router-dom'
import { ChevronRight, Filter, Volume2, CreditCard, RefreshCw } from 'lucide-react'

const agentItems = [
  {
    icon: Filter,
    title: 'Critérios de qualificação',
    subtitle: 'O que o agente usa para qualificar leads',
    href: '/my-ai',
  },
  {
    icon: Volume2,
    title: 'Tom de voz e estilo',
    subtitle: 'Como o agente conversa com os leads',
    href: '/my-ai',
  },
  {
    icon: RefreshCw,
    title: 'Reengajamento',
    subtitle: 'Tentativas e intervalos automáticos',
    href: '/my-ai',
  },
  {
    icon: CreditCard,
    title: 'Integrações CRM',
    subtitle: 'HubSpot, RD Station, Pipedrive',
    href: '/my-ai',
  },
]

export function AgentConfigCards() {
  const navigate = useNavigate()

  return (
    <div className="sigma-card" style={{ padding: 15 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>
          Configurações do agente
        </p>
        <span style={{
          backgroundColor: 'var(--int-3)', color: 'var(--txt-11)',
          fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4
        }}>
          Minha IA
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {agentItems.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.href)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 11px', borderRadius: 8,
              border: '1px solid var(--int-4)', backgroundColor: 'var(--bg-1)',
              cursor: 'pointer', textAlign: 'left',
              transition: 'background-color 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--int-3)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-1)')}
          >
            <item.icon size={14} style={{ color: 'var(--sol-10)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0, lineHeight: 1.3 }}>
                {item.title}
              </p>
              <p style={{ fontSize: 11, color: 'var(--sol-9)', margin: 0, lineHeight: 1.3 }}>
                {item.subtitle}
              </p>
            </div>
            <ChevronRight size={13} style={{ color: 'var(--brd-8)', flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  )
}

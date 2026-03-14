import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import type { Lead } from '@/lib/types'
import { AvatarInitials } from '@/components/ui/AvatarInitials'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface RecentLeadsListProps {
  leads: Lead[]
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m atrás`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

export function RecentLeadsList({ leads }: RecentLeadsListProps) {
  return (
    <div className="sigma-card" style={{ padding: 15 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>
          Últimos leads
        </p>
        <Link to="/leads" style={{ fontSize: 12, color: 'var(--sol-10)', textDecoration: 'none', fontWeight: 500 }}>
          Ver todos →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {leads.slice(0, 5).map((lead, idx) => (
          <div key={lead.id}>
            {idx > 0 && <div style={{ height: 1, backgroundColor: 'var(--int-3)', margin: '8px 0' }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <AvatarInitials name={lead.name} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0, lineHeight: 1.3 }}>
                  {lead.name}
                </p>
                <p className="sigma-caption" style={{ margin: 0 }}>
                  {lead.channel} · {timeAgo(lead.lastContact)}
                </p>
              </div>
              <StatusBadge status={lead.status} />
              <div style={{
                display: 'flex', alignItems: 'center', gap: 3,
                backgroundColor: 'var(--int-3)', borderRadius: 10,
                padding: '2px 7px', fontSize: 11, color: 'var(--sol-10)'
              }}>
                <MessageSquare size={10} />
                {lead.interactions}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

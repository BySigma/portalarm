import type { LeadStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: LeadStatus
}

const statusConfig = {
  qualified: { label: 'Qualificado', className: 'badge-qualified' },
  in_progress: { label: 'Em andamento', className: 'badge-in-progress' },
  forwarded: { label: 'Encaminhado', className: 'badge-forwarded' },
  disqualified: { label: 'Desqualificado', className: 'badge-disqualified' },
  reengagement: { label: 'Re-engagement', className: 'badge-reengagement' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <span className={config.className}>{config.label}</span>
}

export function TenantStatusBadge({ status }: { status: string }) {
  if (status === 'active') return <span className="badge-forwarded">Ativo</span>
  if (status === 'no_balance') return <span className="badge-reengagement">Sem saldo</span>
  if (status === 'suspended') return <span className="badge-disqualified">Suspenso</span>
  return <span className="badge-in-progress">{status}</span>
}

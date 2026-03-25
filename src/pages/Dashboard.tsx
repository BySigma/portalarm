import { useQuery } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/AppLayout'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { LeadsBarChart } from '@/components/dashboard/LeadsBarChart'
import { StatusDonutChart } from '@/components/dashboard/StatusDonutChart'
import { RecentLeadsList } from '@/components/dashboard/RecentLeadsList'
import { AgentConfigCards } from '@/components/dashboard/AgentConfigCards'
import { getDashboardStats, getLeads } from '@/lib/api'
import { useTenant } from '@/contexts/TenantContext'
import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { tenantId } = useTenant()
  const { data: stats } = useQuery({
    queryKey: ['dashboard', tenantId],
    queryFn: () => getDashboardStats(tenantId ?? undefined),
    enabled: !!tenantId,
  })
  const { data: leadsData } = useQuery({
    queryKey: ['leads', tenantId],
    queryFn: () => getLeads({ tenant_id: tenantId ?? undefined }),
    enabled: !!tenantId,
  })

  if (!stats) return null

  const balancePct = stats.balance.total > 0 ? stats.balance.remaining / stats.balance.total : 1
  const showLowBalanceAlert = balancePct < 0.2

  const qualifiedRate = stats.totalLeads > 0 ? Math.round((stats.qualified / stats.totalLeads) * 100) : 0
  const recentLeads = leadsData?.leads?.slice(0, 5) ?? []

  return (
    <AppLayout showFilters>
      {/* Low balance alert */}
      {showLowBalanceAlert && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'var(--int-3)', border: '1px solid var(--int-5)',
          borderRadius: 8, padding: '10px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={14} style={{ color: 'var(--txt-11)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--txt-11)' }}>
              <strong>Saldo baixo</strong> — {stats.balance.remaining} atendimentos restantes no plano Pro 300
            </span>
          </div>
          <Link to="/access" style={{ fontSize: 12, color: 'var(--txt-12)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Adicionar créditos →
          </Link>
        </div>
      )}

      {/* Row 1 — 4 metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <MetricCard label="Topo de funil" value={stats.totalLeads} delta={12} />
        <MetricCard label="Atendidos pelo SDR" value={stats.attendedBySdr} delta={12} />
        <MetricCard
          label="Qualificados"
          value={stats.qualified}
          delta={qualifiedRate}
          deltaLabel="taxa"
        />
        <MetricCard label="Encaminhados ao CRM" value={stats.forwarded} delta={5} />
      </div>

      {/* Row 2 — 3 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <BalanceCard balance={stats.balance} plan="Pro 300" />
        <LeadsBarChart data={stats.byChannel} />
        <StatusDonutChart data={stats.byStatus} />
      </div>

      {/* Row 3 — 2 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <RecentLeadsList leads={recentLeads} />
        <AgentConfigCards />
      </div>
    </AppLayout>
  )
}

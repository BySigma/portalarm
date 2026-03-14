import type { DashboardStats } from '@/lib/types'

interface BalanceCardProps {
  balance: DashboardStats['balance']
  plan?: string
}

export function BalanceCard({ balance, plan = 'Pro 300' }: BalanceCardProps) {
  const pct = Math.round((balance.used / balance.total) * 100)
  const expDate = new Date(balance.expiresAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  return (
    <div className="sigma-card" style={{ padding: 15 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>
          Saldo de atendimentos
        </p>
        <span style={{
          backgroundColor: 'var(--txt-12)', color: '#fff',
          fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4
        }}>
          {plan}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="sigma-muted" style={{ fontSize: 12 }}>Consumido</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)' }}>{balance.used}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="sigma-muted" style={{ fontSize: 12 }}>Restante</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)' }}>{balance.remaining}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 5, backgroundColor: 'var(--int-3)', borderRadius: 3, overflow: 'hidden', marginBottom: 10
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: pct > 80 ? '#B91C1C' : 'var(--txt-12)',
          borderRadius: 3,
          transition: 'width 0.3s ease',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="sigma-caption">{pct}% utilizado</span>
        <span className="sigma-caption">Expira {expDate}</span>
      </div>
    </div>
  )
}

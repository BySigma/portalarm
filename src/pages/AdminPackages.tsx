import { AppLayout } from '@/components/layout/AppLayout'
import { useState } from 'react'
import { Plus, Edit2, Archive } from 'lucide-react'
import { MOCK_TENANTS } from '@/lib/mockData'

const MOCK_PLANS = [
  { id: '1', name: 'Pro 300', quantity: 300, price: 'R$ 397/mês' },
  { id: '2', name: 'Pro 600', quantity: 600, price: 'R$ 697/mês' },
  { id: '3', name: 'Enterprise', quantity: 1500, price: 'R$ 1.497/mês' },
]

const MOCK_ACTIVE_PACKAGES = MOCK_TENANTS.map(t => ({
  clientId: t.id,
  clientName: t.name,
  plan: t.plan,
  total: 300,
  used: 300 - t.balance,
  remaining: t.balance,
  expiration: '31/03/2026',
}))

export default function AdminPackages() {
  const [plans] = useState(MOCK_PLANS)

  return (
    <AppLayout showFilters={false}>
      {/* Plans table */}
      <div className="sigma-card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--int-4)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>Planos disponíveis</p>
          <button className="sigma-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
            <Plus size={12} /> Novo plano
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-2)' }}>
              {['Nome', 'Atendimentos', 'Preço', 'Ações'].map(h => (
                <th key={h} style={{
                  padding: '9px 14px', textAlign: 'left', fontSize: 11,
                  fontWeight: 600, color: 'var(--sol-9)', textTransform: 'uppercase',
                  letterSpacing: '0.04em', borderBottom: '1px solid var(--int-4)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, idx) => (
              <tr key={plan.id} style={{ backgroundColor: idx % 2 === 0 ? 'var(--bg-1)' : 'var(--bg-2)' }}>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', borderBottom: '1px solid var(--int-3)' }}>{plan.name}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>{plan.quantity} atendimentos/mês</td>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', borderBottom: '1px solid var(--int-3)' }}>{plan.price}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button className="sigma-btn-secondary" style={{ padding: '4px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Edit2 size={10} /> Editar
                    </button>
                    <button className="sigma-btn-secondary" style={{ padding: '4px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Archive size={10} /> Arquivar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active packages table */}
      <div className="sigma-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--int-4)' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>
            Pacotes ativos por cliente
          </p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-2)' }}>
              {['Cliente', 'Plano', 'Total', 'Consumido', 'Restante', 'Expiração', 'Ações'].map(h => (
                <th key={h} style={{
                  padding: '9px 14px', textAlign: 'left', fontSize: 11,
                  fontWeight: 600, color: 'var(--sol-9)', textTransform: 'uppercase',
                  letterSpacing: '0.04em', borderBottom: '1px solid var(--int-4)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ACTIVE_PACKAGES.map((pkg, idx) => (
              <tr key={pkg.clientId} style={{ backgroundColor: idx % 2 === 0 ? 'var(--bg-1)' : 'var(--bg-2)' }}>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: 'var(--txt-12)', borderBottom: '1px solid var(--int-3)' }}>
                  {pkg.clientName}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4, backgroundColor: 'var(--txt-12)', color: '#fff' }}>
                    {pkg.plan}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>{pkg.total}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>{pkg.used}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: pkg.remaining === 0 ? '#991B1B' : pkg.remaining < 50 ? '#854D0E' : '#166534',
                  }}>
                    {pkg.remaining}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>
                  {pkg.expiration}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <button className="sigma-btn-secondary" style={{ padding: '4px 9px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Plus size={10} /> Adicionar excedente
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}

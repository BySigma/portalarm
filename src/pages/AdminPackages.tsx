import { useQuery } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/AppLayout'
import { useState } from 'react'
import { Plus, Edit2, Archive } from 'lucide-react'
import { getTenants, getPackages } from '@/lib/api'
import { useTenant } from '@/contexts/TenantContext'
import { MOCK_TENANTS } from '@/lib/mockData'

const STATIC_PLANS = [
  { id: '1', name: 'Pro 300', quantity: 300, price: 'R$ 397/mês' },
  { id: '2', name: 'Pro 600', quantity: 600, price: 'R$ 697/mês' },
  { id: '3', name: 'Enterprise', quantity: 1500, price: 'R$ 1.497/mês' },
]

export default function AdminPackages() {
  const { isAuthenticated } = useTenant()
  const plans = STATIC_PLANS
  const { data: apiTenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
    enabled: isAuthenticated,
  })
  const tenants = apiTenants ?? MOCK_TENANTS

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

      {/* Active packages per tenant */}
      <div className="sigma-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--int-4)' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>
            Pacotes ativos por cliente
          </p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-2)' }}>
              {['Cliente', 'Plano', 'Saldo', 'Status', 'Ações'].map(h => (
                <th key={h} style={{
                  padding: '9px 14px', textAlign: 'left', fontSize: 11,
                  fontWeight: 600, color: 'var(--sol-9)', textTransform: 'uppercase',
                  letterSpacing: '0.04em', borderBottom: '1px solid var(--int-4)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant, idx) => (
              <tr key={tenant.id} style={{ backgroundColor: idx % 2 === 0 ? 'var(--bg-1)' : 'var(--bg-2)' }}>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: 'var(--txt-12)', borderBottom: '1px solid var(--int-3)' }}>
                  {tenant.name}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4, backgroundColor: 'var(--txt-12)', color: '#fff' }}>
                    {tenant.plan}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: tenant.balance === 0 ? '#991B1B' : tenant.balance < 50 ? '#854D0E' : '#166534',
                  }}>
                    {tenant.balance}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>
                  {tenant.status}
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

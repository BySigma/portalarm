import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/AppLayout'
import { getTenants, suspendTenant, updateTenant } from '@/lib/api'
import type { Tenant } from '@/lib/types'
import { TenantStatusBadge } from '@/components/ui/StatusBadge'
import { Plus, Eye, CreditCard, Ban, X } from 'lucide-react'
import { useState } from 'react'

const STEPS = ['Dados da empresa', 'Configuração WABA', 'Atribuir pacote', 'Confirmar']

export default function AdminClients() {
  const queryClient = useQueryClient()
  const { data: clients = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
  })
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState(0)

  async function toggleSuspend(client: Tenant) {
    if (client.status === 'suspended') {
      await updateTenant(client.id, { status: 'active' })
    } else {
      await suspendTenant(client.id)
    }
    queryClient.invalidateQueries({ queryKey: ['tenants'] })
  }

  return (
    <AppLayout showFilters={false}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div />
        <button
          className="sigma-btn-primary"
          onClick={() => { setShowModal(true); setStep(0) }}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={13} /> Novo cliente
        </button>
      </div>

      {/* Clients table */}
      <div className="sigma-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-2)' }}>
              {['Empresa', 'WABA ID', 'Número WhatsApp', 'Plano', 'Saldo restante', 'Status', 'Ações'].map(h => (
                <th key={h} style={{
                  padding: '9px 14px', textAlign: 'left', fontSize: 11,
                  fontWeight: 600, color: 'var(--sol-9)', textTransform: 'uppercase',
                  letterSpacing: '0.04em', borderBottom: '1px solid var(--int-4)', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((client, idx) => (
              <tr key={client.id} style={{ backgroundColor: idx % 2 === 0 ? 'var(--bg-1)' : 'var(--bg-2)' }}>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: 'var(--txt-12)', borderBottom: '1px solid var(--int-3)' }}>
                  {client.name}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)', fontFamily: 'monospace' }}>
                  {client.wabaId}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>
                  {client.phoneNumber}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                    backgroundColor: 'var(--txt-12)', color: '#fff',
                  }}>
                    {client.plan}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: client.balance === 0 ? '#991B1B' : client.balance < 50 ? '#854D0E' : '#166534',
                  }}>
                    {client.balance}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <TenantStatusBadge status={client.status} />
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button className="sigma-btn-secondary" style={{ padding: '4px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Eye size={10} /> Detalhes
                    </button>
                    <button className="sigma-btn-secondary" style={{ padding: '4px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CreditCard size={10} /> Créditos
                    </button>
                    <button
                      onClick={() => toggleSuspend(client)}
                      style={{
                        padding: '4px 7px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3,
                        border: '1px solid var(--int-4)', borderRadius: 6, cursor: 'pointer',
                        backgroundColor: 'var(--bg-1)', color: 'var(--sol-10)',
                      }}
                    >
                      <Ban size={10} /> {client.status === 'suspended' ? 'Reativar' : 'Suspender'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Onboarding modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          backgroundColor: 'rgba(26,26,24,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            backgroundColor: 'var(--bg-1)', border: '1px solid var(--int-4)',
            borderRadius: 12, width: 480, maxHeight: '85vh', overflow: 'auto',
          }} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--int-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>Novo cliente</p>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--sol-10)' }}>
                <X size={16} />
              </button>
            </div>

            {/* Steps indicator */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--int-4)', display: 'flex', gap: 6 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    backgroundColor: i <= step ? 'var(--txt-12)' : 'var(--int-4)',
                    color: i <= step ? '#fff' : 'var(--brd-8)',
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 11, color: i === step ? 'var(--txt-12)' : 'var(--brd-8)', fontWeight: i === step ? 600 : 400, whiteSpace: 'nowrap' }}>
                    {s}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 1, backgroundColor: 'var(--int-4)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            <div style={{ padding: 20 }}>
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div><label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)', display: 'block', marginBottom: 4 }}>Nome da empresa</label><input className="sigma-input" placeholder="Ex: Solar Nordeste Ltda" /></div>
                  <div><label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)', display: 'block', marginBottom: 4 }}>Email do admin</label><input className="sigma-input" placeholder="admin@empresa.com" type="email" /></div>
                  <div><label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)', display: 'block', marginBottom: 4 }}>Telefone</label><input className="sigma-input" placeholder="+55 11 99999-0000" /></div>
                </div>
              )}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 13, color: 'var(--sol-10)', margin: '0 0 8px', lineHeight: 1.5 }}>
                    Insira o WABA ID obtido após completar o processo de Embedded Signup no Meta Business.
                  </p>
                  <div><label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)', display: 'block', marginBottom: 4 }}>WABA ID</label><input className="sigma-input" placeholder="Ex: waba_001" /></div>
                  <div><label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)', display: 'block', marginBottom: 4 }}>Número WhatsApp</label><input className="sigma-input" placeholder="+55 81 99999-0001" /></div>
                </div>
              )}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div><label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)', display: 'block', marginBottom: 4 }}>Plano inicial</label>
                    <select className="sigma-input">
                      <option>Pro 300</option>
                      <option>Pro 600</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                  <div><label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)', display: 'block', marginBottom: 4 }}>Créditos iniciais</label><input className="sigma-input" type="number" defaultValue={300} /></div>
                </div>
              )}
              {step === 3 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt-12)', margin: '0 0 8px' }}>Tudo pronto!</p>
                  <p className="sigma-muted" style={{ fontSize: 12 }}>Clique em "Ativar cliente" para finalizar o onboarding.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--int-4)', display: 'flex', justifyContent: 'space-between' }}>
              <button className="sigma-btn-secondary" onClick={() => step > 0 ? setStep(s => s - 1) : setShowModal(false)}>
                {step === 0 ? 'Cancelar' : '← Voltar'}
              </button>
              <button className="sigma-btn-primary" onClick={() => step < 3 ? setStep(s => s + 1) : setShowModal(false)}>
                {step === 3 ? 'Ativar cliente' : 'Próximo →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

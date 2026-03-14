import { AppLayout } from '@/components/layout/AppLayout'
import { mockReportData } from '@/lib/mockData'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { mockLeads } from '@/lib/mockData'

type Period = '7d' | '30d' | '90d'

export default function Reports() {
  const [period, setPeriod] = useState<Period>('30d')

  const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const chartData = mockReportData.slice(-periodDays)

  const totalReceived = chartData.reduce((a, d) => a + d.received, 0)
  const totalQualified = chartData.reduce((a, d) => a + d.qualified, 0)
  const avgQualRate = totalReceived > 0 ? Math.round((totalQualified / totalReceived) * 100) : 0

  const disqualifiedLeads = mockLeads.filter(l => l.status === 'disqualified')
  const reengagementLeads = mockLeads.filter(l => l.status === 'reengagement')

  const periods: { key: Period; label: string }[] = [
    { key: '7d', label: 'Últimos 7 dias' },
    { key: '30d', label: 'Últimos 30 dias' },
    { key: '90d', label: 'Últimos 90 dias' },
  ]

  return (
    <AppLayout showFilters>
      {/* Period selector */}
      <div style={{ display: 'flex', gap: 6 }}>
        {periods.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: '1px solid var(--int-4)', cursor: 'pointer',
              backgroundColor: period === p.key ? 'var(--txt-12)' : 'var(--bg-1)',
              color: period === p.key ? '#fff' : 'var(--sol-10)',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Taxa de qualificação média', value: `${avgQualRate}%` },
          { label: 'Tempo médio de resposta', value: '< 30s' },
          { label: 'Leads em re-engagement', value: reengagementLeads.length },
        ].map(card => (
          <div key={card.label} className="sigma-card" style={{ padding: 15 }}>
            <p className="sigma-label" style={{ marginBottom: 8 }}>{card.label}</p>
            <span className="sigma-metric-value">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Line chart */}
      <div className="sigma-card" style={{ padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: '0 0 16px' }}>
          Performance do agente — Leads recebidos vs. qualificados
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--int-4)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--brd-8)' }}
              tickFormatter={d => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(chartData.length / 6)}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--brd-8)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-1)', border: '1px solid var(--int-4)',
                borderRadius: 6, fontSize: 12,
              }}
              labelFormatter={d => new Date(d).toLocaleDateString('pt-BR')}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            />
            <Line
              type="monotone" dataKey="received" name="Recebidos"
              stroke="var(--txt-12)" strokeWidth={1.5} dot={false}
            />
            <Line
              type="monotone" dataKey="qualified" name="Qualificados"
              stroke="var(--sol-9)" strokeWidth={1.5} strokeDasharray="4 4" dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Disqualified leads table */}
      <div className="sigma-card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--int-4)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>
            Leads desqualificados
          </p>
          <button className="sigma-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
            <Download size={11} /> Exportar lista
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-2)' }}>
              {['Nome', 'Telefone', 'Canal', 'Motivo', 'Data'].map(h => (
                <th key={h} style={{
                  padding: '9px 12px', textAlign: 'left', fontSize: 11,
                  fontWeight: 600, color: 'var(--sol-9)', textTransform: 'uppercase',
                  letterSpacing: '0.04em', borderBottom: '1px solid var(--int-4)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {disqualifiedLeads.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--brd-8)', fontSize: 13 }}>
                Nenhum lead desqualificado no período
              </td></tr>
            ) : disqualifiedLeads.map((lead, idx) => (
              <tr key={lead.id} style={{ backgroundColor: idx % 2 === 0 ? 'var(--bg-1)' : 'var(--bg-2)' }}>
                <td style={{ padding: '9px 12px', fontSize: 13, fontWeight: 500, color: 'var(--txt-12)', borderBottom: '1px solid var(--int-3)' }}>{lead.name}</td>
                <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>{lead.phone}</td>
                <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>{lead.channel}</td>
                <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>
                  {lead.disqualificationReason || 'Não informado'}
                </td>
                <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)', whiteSpace: 'nowrap' }}>
                  {new Date(lead.lastContact).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}

import { useState, useMemo, useCallback } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { mockLeads } from '@/lib/mockData'
import type { Lead, LeadStatus, LeadChannel } from '@/lib/types'
import { AvatarInitials } from '@/components/ui/AvatarInitials'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Search, Download, Eye, List, Columns } from 'lucide-react'
import { LeadDetailModal } from '@/components/leads/LeadDetailModal'

type ViewMode = 'list' | 'kanban'

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m atrás`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

const KANBAN_COLS: { key: LeadStatus; label: string }[] = [
  { key: 'in_progress', label: 'Em qualificação' },
  { key: 'qualified', label: 'Qualificado' },
  { key: 'forwarded', label: 'Encaminhado' },
  { key: 'disqualified', label: 'Desqualificado' },
]

function exportCSV(leads: Lead[]) {
  const headers = ['Nome', 'Telefone', 'Canal', 'Status', 'Interações', 'Último contato']
  const rows = leads.map(l => [l.name, l.phone, l.channel, l.status, l.interactions, l.lastContact])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'leads.csv'
  a.click()
}

export default function Leads() {
  const [view, setView] = useState<ViewMode>(
    (localStorage.getItem('sigma_leads_view') as ViewMode) || 'list'
  )
  const [search, setSearch] = useState('')
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 8

  const setViewMode = useCallback((v: ViewMode) => {
    setView(v)
    localStorage.setItem('sigma_leads_view', v)
  }, [])

  const filtered = useMemo(() => {
    return mockLeads.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search)
      const matchChannel = channelFilter === 'all' || l.channel === channelFilter
      const matchStatus = statusFilter === 'all' || l.status === statusFilter
      return matchSearch && matchChannel && matchStatus
    })
  }, [search, channelFilter, statusFilter])

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const channels: (LeadChannel | 'all')[] = ['all', 'WhatsApp', 'Instagram', 'Facebook', 'Site', 'Outros']
  const statuses: (LeadStatus | 'all')[] = ['all', 'qualified', 'in_progress', 'forwarded', 'disqualified', 'reengagement']
  const statusLabels: Record<string, string> = {
    all: 'Todos os status', qualified: 'Qualificado', in_progress: 'Em andamento',
    forwarded: 'Encaminhado', disqualified: 'Desqualificado', reengagement: 'Re-engagement'
  }

  return (
    <AppLayout showFilters>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div />
        <button className="sigma-btn-secondary" onClick={() => exportCSV(filtered)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Download size={13} /> Exportar CSV
        </button>
      </div>

      {/* Filters bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        backgroundColor: 'var(--bg-1)', border: '1px solid var(--int-4)',
        borderRadius: 10, padding: '10px 14px', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--brd-8)' }} />
          <input
            className="sigma-input"
            style={{ paddingLeft: 28, fontSize: 12 }}
            placeholder="Buscar por nome ou telefone..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        <select
          className="sigma-input"
          style={{ width: 'auto', fontSize: 12 }}
          value={channelFilter}
          onChange={e => { setChannelFilter(e.target.value); setPage(1) }}
        >
          <option value="all">Todos os canais</option>
          {channels.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="sigma-input"
          style={{ width: 'auto', fontSize: 12 }}
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
        >
          {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>

        <div style={{ display: 'flex', border: '1px solid var(--int-4)', borderRadius: 6, overflow: 'hidden' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '5px 9px', border: 'none', cursor: 'pointer',
              backgroundColor: view === 'list' ? 'var(--txt-12)' : 'var(--bg-1)',
              color: view === 'list' ? '#fff' : 'var(--sol-10)',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500,
            }}
          >
            <List size={12} /> Lista
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              padding: '5px 9px', border: 'none', cursor: 'pointer',
              backgroundColor: view === 'kanban' ? 'var(--txt-12)' : 'var(--bg-1)',
              color: view === 'kanban' ? '#fff' : 'var(--sol-10)',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500,
            }}
          >
            <Columns size={12} /> Kanban
          </button>
        </div>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="sigma-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-2)' }}>
                {['Nome', 'Telefone', 'Canal', 'Status', 'Interações', 'Último contato', 'Ações'].map(h => (
                  <th key={h} style={{
                    padding: '9px 12px', textAlign: 'left', fontSize: 11,
                    fontWeight: 600, color: 'var(--sol-9)', textTransform: 'uppercase',
                    letterSpacing: '0.04em', borderBottom: '1px solid var(--int-4)', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--brd-8)', fontSize: 13 }}>
                  Nenhum lead encontrado
                </td></tr>
              ) : paginated.map((lead, idx) => (
                <tr key={lead.id} style={{ backgroundColor: idx % 2 === 0 ? 'var(--bg-1)' : 'var(--bg-2)' }}>
                  <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--int-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AvatarInitials name={lead.name} size={26} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt-12)' }}>{lead.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>{lead.phone}</td>
                  <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>{lead.channel}</td>
                  <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--int-3)' }}>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)', textAlign: 'center' }}>{lead.interactions}</td>
                  <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)', whiteSpace: 'nowrap' }}>{timeAgo(lead.lastContact)}</td>
                  <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--int-3)' }}>
                    <button
                      className="sigma-btn-secondary"
                      onClick={() => setSelectedLead(lead)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px', fontSize: 11 }}
                    >
                      <Eye size={11} /> Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderTop: '1px solid var(--int-4)',
            }}>
              <span className="sigma-caption">{filtered.length} leads encontrados</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width: 26, height: 26, borderRadius: 6, fontSize: 11, fontWeight: 500,
                      border: '1px solid var(--int-4)', cursor: 'pointer',
                      backgroundColor: page === p ? 'var(--txt-12)' : 'var(--bg-1)',
                      color: page === p ? '#fff' : 'var(--sol-10)',
                    }}
                  >{p}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Kanban view */}
      {view === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignItems: 'start' }}>
          {KANBAN_COLS.map(col => {
            const colLeads = filtered.filter(l => l.status === col.key)
            return (
              <div key={col.key} style={{ backgroundColor: 'var(--bg-2)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                  padding: '10px 12px', borderBottom: '1px solid var(--int-4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-1)',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt-12)' }}>{col.label}</span>
                  <span style={{
                    backgroundColor: 'var(--int-3)', color: 'var(--sol-10)',
                    fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 10
                  }}>{colLeads.length}</span>
                </div>
                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {colLeads.length === 0 ? (
                    <p className="sigma-caption" style={{ textAlign: 'center', padding: '16px 0' }}>Sem leads</p>
                  ) : colLeads.map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="sigma-card"
                      style={{
                        padding: '10px', textAlign: 'left', cursor: 'pointer',
                        border: '1px solid var(--int-4)', borderRadius: 8,
                        backgroundColor: 'var(--bg-1)', width: '100%',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                        <AvatarInitials name={lead.name} size={24} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt-12)' }}>{lead.name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="sigma-caption">{lead.channel}</span>
                        <span className="sigma-caption">{timeAgo(lead.lastContact)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lead detail modal */}
      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </AppLayout>
  )
}

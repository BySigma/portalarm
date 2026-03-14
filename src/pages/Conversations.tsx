import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { mockConversations, mockLeads } from '@/lib/mockData'
import { AvatarInitials } from '@/components/ui/AvatarInitials'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Search, Mic, Image, MessageSquare } from 'lucide-react'
import type { Lead } from '@/lib/types'

type FilterType = 'all' | 'qualified' | 'in_progress' | 'disqualified'

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function Conversations() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(mockLeads[0]?.id ?? null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredLeads = useMemo(() => {
    return mockLeads.filter(lead => {
      const matchSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search)
      const matchFilter = filter === 'all' || lead.status === filter
      return matchSearch && matchFilter
    })
  }, [search, filter])

  const selectedLead = mockLeads.find(l => l.id === selectedLeadId)
  const selectedConv = mockConversations.find(c => c.leadId === selectedLeadId)

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'qualified', label: 'Qualificados' },
    { key: 'in_progress', label: 'Em andamento' },
    { key: 'disqualified', label: 'Desqualificados' },
  ]

  return (
    <AppLayout showFilters={false}>
      <div style={{
        display: 'flex', flex: 1,
        border: '1px solid var(--int-4)', borderRadius: 10,
        backgroundColor: 'var(--bg-1)', overflow: 'hidden',
        height: 'calc(100vh - 100px)',
      }}>
        {/* Left panel — conversation list */}
        <div style={{
          width: 320, minWidth: 320, borderRight: '1px solid var(--int-4)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--int-4)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{
                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--brd-8)',
              }} />
              <input
                className="sigma-input"
                style={{ paddingLeft: 28, fontSize: 12 }}
                placeholder="Buscar conversa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--int-4)', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '3px 9px', borderRadius: 20,
                  fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  border: filter === f.key ? '1px solid var(--txt-12)' : '1px solid var(--int-4)',
                  backgroundColor: filter === f.key ? 'var(--txt-12)' : 'var(--bg-1)',
                  color: filter === f.key ? '#fff' : 'var(--sol-10)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredLeads.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <MessageSquare size={24} style={{ color: 'var(--brd-8)', margin: '0 auto 8px' }} />
                <p className="sigma-muted" style={{ fontSize: 12 }}>Nenhuma conversa encontrada</p>
              </div>
            ) : filteredLeads.map(lead => {
              const conv = mockConversations.find(c => c.leadId === lead.id)
              const lastMsg = conv?.messages[conv.messages.length - 1]
              const isSelected = selectedLeadId === lead.id

              return (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  style={{
                    width: '100%', padding: '10px 12px', textAlign: 'left',
                    border: 'none', borderBottom: '1px solid var(--int-3)',
                    backgroundColor: isSelected ? 'var(--int-3)' : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 9,
                  }}
                >
                  <AvatarInitials name={lead.name} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)' }}>{lead.name}</span>
                      <span className="sigma-caption">{timeAgo(lead.lastContact)}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--sol-10)', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lastMsg?.content.slice(0, 50) || 'Sem mensagens'}...
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <StatusBadge status={lead.status} />
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 2,
                        backgroundColor: 'var(--int-3)', borderRadius: 10,
                        padding: '1px 5px', fontSize: 10, color: 'var(--sol-10)'
                      }}>
                        <MessageSquare size={9} />
                        {lead.interactions}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right panel — conversation detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedLead ? (
            <>
              {/* Header */}
              <div style={{
                padding: '12px 16px', borderBottom: '1px solid var(--int-4)',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <AvatarInitials name={selectedLead.name} size={32} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>
                    {selectedLead.name}
                  </p>
                  <p className="sigma-caption" style={{ margin: 0 }}>
                    {selectedLead.channel} · {selectedLead.phone} · {selectedLead.interactions} interações
                  </p>
                </div>
                <StatusBadge status={selectedLead.status} />
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedConv?.messages.length ? selectedConv.messages.map(msg => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'agent' ? 'flex-end' : 'flex-start',
                  }}>
                    {msg.type === 'audio_transcription' && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 10, color: 'var(--sol-10)', marginBottom: 3,
                        alignSelf: msg.role === 'agent' ? 'flex-end' : 'flex-start',
                      }}>
                        <Mic size={10} /> Áudio transcrito
                      </div>
                    )}
                    {msg.type === 'image_analysis' && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 10, color: 'var(--sol-10)', marginBottom: 3,
                        alignSelf: msg.role === 'agent' ? 'flex-end' : 'flex-start',
                      }}>
                        <Image size={10} /> Imagem analisada
                      </div>
                    )}
                    <div style={{
                      maxWidth: '68%',
                      backgroundColor: msg.role === 'agent' ? 'var(--txt-12)' : 'var(--int-3)',
                      color: msg.role === 'agent' ? '#fff' : 'var(--txt-12)',
                      borderRadius: msg.role === 'agent'
                        ? '8px 8px 0 8px'
                        : '8px 8px 8px 0',
                      padding: '8px 12px',
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}>
                      {msg.mediaDescription && (
                        <p style={{ fontSize: 11, fontStyle: 'italic', marginBottom: 4, opacity: 0.7, margin: '0 0 4px' }}>
                          {msg.mediaDescription}
                        </p>
                      )}
                      {msg.content}
                    </div>
                    <span className="sigma-caption" style={{ marginTop: 3 }}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <MessageSquare size={28} style={{ color: 'var(--brd-8)', margin: '0 auto 10px' }} />
                    <p className="sigma-muted" style={{ fontSize: 13 }}>Sem mensagens nesta conversa</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
              <MessageSquare size={32} style={{ color: 'var(--brd-8)' }} />
              <p className="sigma-muted">Selecione uma conversa</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

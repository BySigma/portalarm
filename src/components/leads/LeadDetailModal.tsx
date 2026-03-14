import type { Lead } from '@/lib/types'
import { mockConversations } from '@/lib/mockData'
import { AvatarInitials } from '@/components/ui/AvatarInitials'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { X, Mic, Image, Download } from 'lucide-react'

interface LeadDetailModalProps {
  lead: Lead
  onClose: () => void
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  const conv = mockConversations.find(c => c.leadId === lead.id)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      backgroundColor: 'rgba(26,26,24,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-1)', border: '1px solid var(--int-4)',
          borderRadius: 12, width: 560, maxHeight: '85vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '14px 16px', borderBottom: '1px solid var(--int-4)',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <AvatarInitials name={lead.name} size={34} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>{lead.name}</p>
            <p className="sigma-caption" style={{ margin: 0 }}>{lead.phone} · {lead.channel}</p>
          </div>
          <StatusBadge status={lead.status} />
          <button
            onClick={onClose}
            style={{ padding: 4, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--sol-10)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Info row */}
        <div style={{
          padding: '10px 16px', borderBottom: '1px solid var(--int-4)',
          display: 'flex', gap: 20
        }}>
          <div>
            <span className="sigma-caption">Interações</span>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>{lead.interactions}</p>
          </div>
          <div>
            <span className="sigma-caption">Último contato</span>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt-12)', margin: 0 }}>
              {new Date(lead.lastContact).toLocaleDateString('pt-BR')}
            </p>
          </div>
          {lead.disqualificationReason && (
            <div>
              <span className="sigma-caption">Motivo desqualificação</span>
              <p style={{ fontSize: 13, color: 'var(--txt-12)', margin: 0 }}>{lead.disqualificationReason}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {conv?.messages.length ? conv.messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: msg.role === 'agent' ? 'flex-end' : 'flex-start',
            }}>
              {msg.type === 'audio_transcription' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--sol-10)', marginBottom: 2 }}>
                  <Mic size={9} /> Áudio transcrito
                </div>
              )}
              {msg.type === 'image_analysis' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--sol-10)', marginBottom: 2 }}>
                  <Image size={9} /> Imagem analisada
                </div>
              )}
              <div style={{
                maxWidth: '75%', padding: '7px 11px',
                backgroundColor: msg.role === 'agent' ? 'var(--txt-12)' : 'var(--int-3)',
                color: msg.role === 'agent' ? '#fff' : 'var(--txt-12)',
                borderRadius: msg.role === 'agent' ? '8px 8px 0 8px' : '8px 8px 8px 0',
                fontSize: 12, lineHeight: 1.5,
              }}>
                {msg.content}
              </div>
              <span className="sigma-caption" style={{ marginTop: 2 }}>{formatTime(msg.timestamp)}</span>
            </div>
          )) : (
            <p className="sigma-muted" style={{ textAlign: 'center', padding: 20, fontSize: 12 }}>
              Sem histórico de conversa
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--int-4)' }}>
          <button className="sigma-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Download size={12} /> Exportar contato
          </button>
        </div>
      </div>
    </div>
  )
}

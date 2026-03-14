import { AppLayout } from '@/components/layout/AppLayout'
import { useState } from 'react'
import { AvatarInitials } from '@/components/ui/AvatarInitials'
import { UserPlus, X, Edit2, Trash2 } from 'lucide-react'

type UserRole = 'Admin' | 'Membro'
type UserStatus = 'Ativo' | 'Pendente'

interface TeamUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastAccess: string
}

const initialUsers: TeamUser[] = [
  { id: '1', name: 'Carlos Eduardo', email: 'carlos@solarnordeste.com', role: 'Admin', status: 'Ativo', lastAccess: '2026-03-14T09:30:00' },
  { id: '2', name: 'Mariana Souza', email: 'mariana@solarnordeste.com', role: 'Membro', status: 'Ativo', lastAccess: '2026-03-13T18:00:00' },
  { id: '3', name: 'João Paulo', email: 'joao@solarnordeste.com', role: 'Membro', status: 'Pendente', lastAccess: '' },
]

function timeAgo(ts: string) {
  if (!ts) return '—'
  const diff = Date.now() - new Date(ts).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

export default function Access() {
  const [users, setUsers] = useState<TeamUser[]>(initialUsers)
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('Membro')

  const handleInvite = () => {
    if (!email.trim()) return
    const name = email.split('@')[0]
    setUsers(u => [...u, {
      id: String(Date.now()), name, email, role, status: 'Pendente', lastAccess: ''
    }])
    setEmail('')
    setRole('Membro')
    setShowModal(false)
  }

  return (
    <AppLayout showFilters={false}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div />
        <button
          className="sigma-btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <UserPlus size={13} /> Convidar usuário
        </button>
      </div>

      {/* Users table */}
      <div className="sigma-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-2)' }}>
              {['Usuário', 'Email', 'Papel', 'Status', 'Último acesso', 'Ações'].map(h => (
                <th key={h} style={{
                  padding: '9px 14px', textAlign: 'left', fontSize: 11,
                  fontWeight: 600, color: 'var(--sol-9)', textTransform: 'uppercase',
                  letterSpacing: '0.04em', borderBottom: '1px solid var(--int-4)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} style={{ backgroundColor: idx % 2 === 0 ? 'var(--bg-1)' : 'var(--bg-2)' }}>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AvatarInitials name={user.name} size={28} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt-12)' }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>
                  {user.email}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                    backgroundColor: user.role === 'Admin' ? 'var(--txt-12)' : 'var(--int-3)',
                    color: user.role === 'Admin' ? '#fff' : 'var(--sol-10)',
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: '2px 7px', borderRadius: 4,
                    backgroundColor: user.status === 'Ativo' ? 'var(--status-forwarded-bg)' : 'var(--status-reengagement-bg)',
                    color: user.status === 'Ativo' ? 'var(--status-forwarded-text)' : 'var(--status-reengagement-text)',
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--sol-10)', borderBottom: '1px solid var(--int-3)' }}>
                  {timeAgo(user.lastAccess)}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--int-3)' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="sigma-btn-secondary" style={{ padding: '4px 7px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Edit2 size={10} /> Editar
                    </button>
                    <button
                      onClick={() => setUsers(u => u.filter(u2 => u2.id !== user.id))}
                      style={{
                        padding: '4px 7px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
                        border: '1px solid var(--status-disqualified-bg)', borderRadius: 6, cursor: 'pointer',
                        backgroundColor: 'var(--bg-1)', color: 'var(--status-disqualified-text)',
                      }}
                    >
                      <Trash2 size={10} /> Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          backgroundColor: 'rgba(26,26,24,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            backgroundColor: 'var(--bg-1)', border: '1px solid var(--int-4)',
            borderRadius: 10, width: 380, padding: 20,
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>Convidar usuário</p>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--sol-10)' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)', display: 'block', marginBottom: 4 }}>Email</label>
                <input className="sigma-input" placeholder="email@empresa.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)', display: 'block', marginBottom: 4 }}>Papel</label>
                <select className="sigma-input" value={role} onChange={e => setRole(e.target.value as UserRole)}>
                  <option>Admin</option>
                  <option>Membro</option>
                </select>
              </div>
              <button className="sigma-btn-primary" onClick={handleInvite} style={{ padding: '8px 16px', marginTop: 4 }}>
                Enviar convite
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

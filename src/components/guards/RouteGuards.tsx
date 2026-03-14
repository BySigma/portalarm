import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useTenant } from '@/contexts/TenantContext'

export function TenantGuard({ children }: { children: ReactNode }) {
  const { tenantId, isLoading } = useTenant()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-2)' }}>
        <div className="text-center">
          <div className="sigma-skeleton" style={{ width: 40, height: 40, borderRadius: 8, margin: '0 auto 12px' }} />
          <p className="sigma-muted">Carregando...</p>
        </div>
      </div>
    )
  }
  if (!tenantId) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isSuperAdmin, isLoading } = useTenant()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-2)' }}>
        <p className="sigma-muted">Carregando...</p>
      </div>
    )
  }
  if (!isSuperAdmin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

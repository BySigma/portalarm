import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { UserRole } from '@/lib/types'
import { getMe } from '@/lib/api'

interface TenantContextType {
  tenantId: string | null
  tenantName: string | null
  userRole: UserRole | null
  isSuperAdmin: boolean
  isLoading: boolean
  isAuthenticated: boolean
}

const TenantContext = createContext<TenantContextType>({
  tenantId: null,
  tenantName: null,
  userRole: null,
  isSuperAdmin: false,
  isLoading: true,
  isAuthenticated: false,
})

const MOCK_TENANT_ID = 'tenant-abc-123'
const MOCK_TENANT_NAME = 'Solar Nordeste Ltda'

export function TenantProvider({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<TenantContextType>({
    tenantId: null,
    tenantName: null,
    userRole: null,
    isSuperAdmin: false,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (token) {
      getMe()
        .then(profile => {
          setCtx({
            tenantId: profile.tenant_id,
            tenantName: profile.name,
            userRole: profile.role as UserRole,
            isSuperAdmin: profile.role === 'super_admin',
            isLoading: false,
            isAuthenticated: true,
          })
        })
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          setCtx(prev => ({ ...prev, ...mockCtx(), isLoading: false }))
        })
      return
    }

    setCtx(prev => ({ ...prev, ...mockCtx(), isLoading: false }))
  }, [])

  return (
    <TenantContext.Provider value={ctx}>
      {children}
    </TenantContext.Provider>
  )
}

function mockCtx() {
  const isAdmin = localStorage.getItem('sigma_admin_mode') === 'true'
  return {
    tenantId: MOCK_TENANT_ID,
    tenantName: MOCK_TENANT_NAME,
    userRole: (isAdmin ? 'super_admin' : 'tenant_admin') as UserRole,
    isSuperAdmin: isAdmin,
    isAuthenticated: false,
  }
}

export const useTenant = () => useContext(TenantContext)

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { UserRole } from '@/lib/types'
import { getMe } from '@/lib/api'

interface TenantContextType {
  tenantId: string | null
  tenantName: string | null
  userRole: UserRole | null
  isSuperAdmin: boolean
  isLoading: boolean
}

const TenantContext = createContext<TenantContextType>({
  tenantId: null,
  tenantName: null,
  userRole: null,
  isSuperAdmin: false,
  isLoading: true,
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
          })
        })
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          // Fall back to mock mode when token is invalid
          const isAdmin = localStorage.getItem('sigma_admin_mode') === 'true'
          setCtx({
            tenantId: MOCK_TENANT_ID,
            tenantName: MOCK_TENANT_NAME,
            userRole: isAdmin ? 'super_admin' : 'tenant_admin',
            isSuperAdmin: isAdmin,
            isLoading: false,
          })
        })
      return
    }

    // No token — use mock mode so the app remains accessible before backend login is wired up
    const isAdmin = localStorage.getItem('sigma_admin_mode') === 'true'
    setCtx({
      tenantId: MOCK_TENANT_ID,
      tenantName: MOCK_TENANT_NAME,
      userRole: isAdmin ? 'super_admin' : 'tenant_admin',
      isSuperAdmin: isAdmin,
      isLoading: false,
    })
  }, [])

  return (
    <TenantContext.Provider value={ctx}>
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => useContext(TenantContext)

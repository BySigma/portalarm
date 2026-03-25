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
    if (!token) {
      setCtx(c => ({ ...c, isLoading: false }))
      return
    }

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
        setCtx(c => ({ ...c, isLoading: false }))
      })
  }, [])

  return (
    <TenantContext.Provider value={ctx}>
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => useContext(TenantContext)

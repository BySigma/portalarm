import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { UserRole } from '@/lib/types'

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

// For mock mode — simulating an authenticated integrador
const MOCK_MODE = true

export function TenantProvider({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<TenantContextType>({
    tenantId: null,
    tenantName: null,
    userRole: null,
    isSuperAdmin: false,
    isLoading: true,
  })

  useEffect(() => {
    if (MOCK_MODE) {
      // Check if admin mode is toggled via localStorage
      const isAdmin = localStorage.getItem('sigma_admin_mode') === 'true'
      setCtx({
        tenantId: 'tenant-abc-123',
        tenantName: 'Solar Nordeste Ltda',
        userRole: isAdmin ? 'super_admin' : 'tenant_admin',
        isSuperAdmin: isAdmin,
        isLoading: false,
      })
      return
    }

    // Real Supabase auth would go here
    setCtx(c => ({ ...c, isLoading: false }))
  }, [])

  return (
    <TenantContext.Provider value={ctx}>
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => useContext(TenantContext)

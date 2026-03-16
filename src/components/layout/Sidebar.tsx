import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BarChart2,
  Bot,
  Shield,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  Package,
  type LucideIcon,
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NavItemProps {
  icon: LucideIcon
  label: string
  href: string
  collapsed: boolean
}

function NavItem({ icon: Icon, label, href, collapsed }: NavItemProps) {
  const location = useLocation()
  const isActive = location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href))

  return (
    <Link
      to={href}
      className={cn(
        'nav-item',
        isActive && 'active',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? label : undefined}
    >
      <Icon size={15} className="shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

function NavSection({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) {
    return <div style={{ height: 1, backgroundColor: 'var(--int-4)', margin: '6px 0' }} />
  }
  return (
    <p className="sigma-label" style={{ padding: '8px 8px 4px', letterSpacing: '0.06em', fontSize: 10 }}>
      {label}
    </p>
  )
}

export function Sidebar() {
  const { isSuperAdmin, tenantName } = useTenant()
  const [collapsed, setCollapsed] = useState(false)
  const isAdminMode = localStorage.getItem('sigma_admin_mode') === 'true'

  const toggleAdminMode = () => {
    localStorage.setItem('sigma_admin_mode', isAdminMode ? 'false' : 'true')
    window.location.reload()
  }

  return (
    <aside
      style={{
        width: collapsed ? 52 : 196,
        minWidth: collapsed ? 52 : 196,
        height: '100vh',
        backgroundColor: 'var(--bg-1)',
        borderRight: '1px solid var(--int-4)',
        display: 'flex',
        flexDirection: 'column',
        padding: collapsed ? '14px 8px' : '14px 10px',
        transition: 'width 0.15s ease, min-width 0.15s ease',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingLeft: collapsed ? 0 : 2 }}>
        <div style={{
          width: 26, height: 26, backgroundColor: 'var(--txt-12)', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0
        }}>
          S
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-12)', lineHeight: 1.2 }}>Sigma SDR</div>
            <div className="sigma-caption" style={{ lineHeight: 1.2 }}>
              {tenantName || 'Integrador Solar'}
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <NavItem icon={LayoutDashboard} label="Início" href="/dashboard" collapsed={collapsed} />

        <NavSection label="Atendimento" collapsed={collapsed} />
        <NavItem icon={MessageSquare} label="Conversas" href="/conversations" collapsed={collapsed} />
        <NavItem icon={Users} label="Leads" href="/leads" collapsed={collapsed} />
        <NavItem icon={BarChart2} label="Relatórios" href="/reports" collapsed={collapsed} />

        <NavSection label="Configurações" collapsed={collapsed} />
        <NavItem icon={Bot} label="Minha IA" href="/my-ai" collapsed={collapsed} />
        <NavItem icon={Shield} label="Acessos" href="/access" collapsed={collapsed} />

        <NavSection label="Ajuda" collapsed={collapsed} />
        <NavItem icon={HelpCircle} label="Ajuda" href="/help" collapsed={collapsed} />
      </nav>

      {/* Admin link for super_admin */}
      {isSuperAdmin && (
        <div style={{ marginBottom: 8, borderTop: '1px solid var(--int-4)', paddingTop: 8 }}>
          <NavSection label="Admin" collapsed={collapsed} />
          <NavItem icon={Building2} label="Clientes" href="/admin/clients" collapsed={collapsed} />
          <NavItem icon={Package} label="Pacotes" href="/admin/packages" collapsed={collapsed} />
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '6px',
          borderRadius: 7,
          border: '1px solid var(--int-4)',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          color: 'var(--sol-10)',
          marginTop: 4,
        }}
        title={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        {!collapsed && <span style={{ fontSize: 11, marginLeft: 4 }}>Recolher</span>}
      </button>
    </aside>
  )
}

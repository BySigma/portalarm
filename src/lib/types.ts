export type LeadStatus = 'qualified' | 'in_progress' | 'forwarded' | 'disqualified' | 'reengagement'
export type LeadChannel = 'WhatsApp' | 'Instagram' | 'Facebook' | 'Site' | 'Outros'
export type UserRole = 'super_admin' | 'tenant_admin' | 'member'
export type TenantStatus = 'active' | 'no_balance' | 'suspended'

export interface Lead {
  id: string
  tenant_id: string
  name: string
  phone: string
  channel: LeadChannel
  status: LeadStatus
  interactions: number
  lastContact: string
  createdAt: string
  disqualificationReason?: string
}

export interface Message {
  id: string
  role: 'lead' | 'agent'
  content: string
  timestamp: string
  type?: 'text' | 'audio_transcription' | 'image_analysis'
  mediaDescription?: string
}

export interface Conversation {
  leadId: string
  messages: Message[]
}

export interface Package {
  id: string
  tenantId: string
  total: number
  used: number
  remaining: number
  expiresAt: string
  type: 'base' | 'excess'
}

export interface Tenant {
  id: string
  name: string
  wabaId: string
  phoneNumber: string
  status: TenantStatus
  plan: string
  balance: number
  createdAt: string
}

export interface Profile {
  id: string
  tenant_id: string | null
  role: UserRole
  name: string
  email: string
}

export interface DashboardStats {
  totalLeads: number
  attendedBySdr: number
  qualified: number
  forwarded: number
  balance: {
    total: number
    used: number
    remaining: number
    expiresAt: string
  }
  byChannel: Array<{ channel: string; count: number }>
  byStatus: Array<{ status: string; count: number }>
}

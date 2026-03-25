import type {
  Lead,
  Conversation,
  DashboardStats,
  Tenant,
  Profile,
  Package,
} from './types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function getToken(): string | null {
  return localStorage.getItem('access_token')
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || err.error || 'Request failed')
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// Auth

export async function login(username: string, password: string) {
  const data = await request<{ access: string; refresh: string }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  return data
}

export async function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export async function getMe() {
  return request<Profile & { tenant_id: string | null }>('/auth/me/')
}

// Leads

export async function getLeads(params?: {
  tenant_id?: string
  status?: string
  channel?: string
  search?: string
}) {
  const qs = new URLSearchParams(
    Object.entries(params || {}).filter(([, v]) => v) as [string, string][]
  ).toString()
  return request<{ leads: Lead[]; total: number }>(`/leads/${qs ? `?${qs}` : ''}`)
}

export async function getLead(id: string) {
  return request<Lead>(`/leads/${id}/`)
}

export async function updateLead(id: string, data: Partial<Lead>) {
  return request<Lead>(`/leads/${id}/update/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteLead(id: string) {
  return request<{ success: boolean }>(`/leads/${id}/delete/`, { method: 'DELETE' })
}

// Conversations

export async function getConversation(leadId: string) {
  return request<Conversation>(`/conversations/${leadId}/`)
}

export async function listConversations(params?: { tenant_id?: string; status?: string }) {
  const qs = new URLSearchParams(
    Object.entries(params || {}).filter(([, v]) => v) as [string, string][]
  ).toString()
  return request<Conversation[]>(`/conversations/${qs ? `?${qs}` : ''}`)
}

// Analytics

export async function getDashboardStats(tenant_id?: string) {
  const qs = tenant_id ? `?tenant_id=${tenant_id}` : ''
  return request<DashboardStats>(`/analytics/dashboard/${qs}`)
}

export async function getReportData(period: '7d' | '30d' | '90d', tenant_id?: string) {
  const params = new URLSearchParams({ period })
  if (tenant_id) params.set('tenant_id', tenant_id)
  return request<Array<{ date: string; received: number; qualified: number }>>(
    `/analytics/reports/?${params}`
  )
}

export async function getDisqualifiedLeads(tenant_id?: string) {
  const qs = tenant_id ? `?tenant_id=${tenant_id}` : ''
  return request<Lead[]>(`/analytics/disqualified/${qs}`)
}

// Packages

export async function getPackages(tenant_id?: string) {
  const qs = tenant_id ? `?tenant_id=${tenant_id}` : ''
  return request<Package[]>(`/packages/${qs}`)
}

// Admin — Tenants

export async function getTenants() {
  return request<Tenant[]>('/admin/tenants/')
}

export async function createTenant(data: Partial<Tenant>) {
  return request<Tenant>('/admin/tenants/create/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTenant(id: string, data: Partial<Tenant>) {
  return request<Tenant>(`/admin/tenants/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function suspendTenant(id: string) {
  return request<{ success: boolean }>(`/admin/tenants/${id}/suspend/`, { method: 'POST' })
}

// Users / Team

export async function getUsers(tenant_id?: string) {
  const qs = tenant_id ? `?tenant_id=${tenant_id}` : ''
  return request<Profile[]>(`/users/${qs}`)
}

export async function inviteUser(data: { email: string; role: string; tenant_id?: string }) {
  return request<{ success: boolean; message: string }>('/users/invite/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteUser(id: string) {
  return request<{ success: boolean }>(`/users/${id}/delete/`, { method: 'DELETE' })
}

// Agent Config

export async function getAgentConfig(tenant_id?: string) {
  const qs = tenant_id ? `?tenant_id=${tenant_id}` : ''
  return request<Record<string, unknown>>(`/agent-config/${qs}`)
}

export async function updateAgentConfig(data: Record<string, unknown>) {
  return request<Record<string, unknown>>('/agent-config/update/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

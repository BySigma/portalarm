import type { Lead, Conversation, DashboardStats, Tenant } from './types'

export const MOCK_TENANT_ID = 'tenant-abc-123'
export const MOCK_TENANT_NAME = 'Solar Nordeste Ltda'

export const mockLeads: Lead[] = [
  { id: '1', tenant_id: MOCK_TENANT_ID, name: 'Marcos Oliveira', phone: '11999990001', channel: 'WhatsApp', status: 'qualified', interactions: 4, lastContact: '2026-03-14T10:30:00', createdAt: '2026-03-14T10:00:00' },
  { id: '2', tenant_id: MOCK_TENANT_ID, name: 'Ana Silva', phone: '11999990002', channel: 'Instagram', status: 'in_progress', interactions: 2, lastContact: '2026-03-14T10:15:00', createdAt: '2026-03-14T09:50:00' },
  { id: '3', tenant_id: MOCK_TENANT_ID, name: 'Rafael Costa', phone: '11999990003', channel: 'WhatsApp', status: 'forwarded', interactions: 7, lastContact: '2026-03-14T09:00:00', createdAt: '2026-03-13T15:00:00' },
  { id: '4', tenant_id: MOCK_TENANT_ID, name: 'Julia Pereira', phone: '11999990004', channel: 'Facebook', status: 'disqualified', interactions: 3, lastContact: '2026-03-14T08:00:00', createdAt: '2026-03-13T14:00:00', disqualificationReason: 'Conta de energia abaixo do mínimo' },
  { id: '5', tenant_id: MOCK_TENANT_ID, name: 'Thiago Santos', phone: '11999990005', channel: 'Site', status: 'reengagement', interactions: 1, lastContact: '2026-03-14T07:00:00', createdAt: '2026-03-13T12:00:00' },
  { id: '6', tenant_id: MOCK_TENANT_ID, name: 'Carla Mendes', phone: '11999990006', channel: 'WhatsApp', status: 'qualified', interactions: 5, lastContact: '2026-03-13T18:00:00', createdAt: '2026-03-13T10:00:00' },
  { id: '7', tenant_id: MOCK_TENANT_ID, name: 'Diego Ferreira', phone: '11999990007', channel: 'Instagram', status: 'in_progress', interactions: 3, lastContact: '2026-03-13T17:00:00', createdAt: '2026-03-13T09:00:00' },
  { id: '8', tenant_id: MOCK_TENANT_ID, name: 'Beatriz Lima', phone: '11999990008', channel: 'WhatsApp', status: 'forwarded', interactions: 9, lastContact: '2026-03-13T16:00:00', createdAt: '2026-03-12T15:00:00' },
  { id: '9', tenant_id: MOCK_TENANT_ID, name: 'Pedro Alves', phone: '11999990009', channel: 'Facebook', status: 'disqualified', interactions: 2, lastContact: '2026-03-13T14:00:00', createdAt: '2026-03-12T14:00:00', disqualificationReason: 'Imóvel alugado' },
  { id: '10', tenant_id: MOCK_TENANT_ID, name: 'Fernanda Rocha', phone: '11999990010', channel: 'Site', status: 'qualified', interactions: 6, lastContact: '2026-03-13T12:00:00', createdAt: '2026-03-12T10:00:00' },
  { id: '11', tenant_id: MOCK_TENANT_ID, name: 'Lucas Barbosa', phone: '11999990011', channel: 'WhatsApp', status: 'reengagement', interactions: 1, lastContact: '2026-03-12T20:00:00', createdAt: '2026-03-12T08:00:00' },
  { id: '12', tenant_id: MOCK_TENANT_ID, name: 'Marina Castro', phone: '11999990012', channel: 'Instagram', status: 'qualified', interactions: 4, lastContact: '2026-03-12T18:00:00', createdAt: '2026-03-11T16:00:00' },
]

export const mockConversations: Conversation[] = [
  {
    leadId: '1',
    messages: [
      { id: 'm1', role: 'lead', content: 'Oi, vi o anúncio de vocês sobre energia solar', timestamp: '2026-03-14T10:00:00' },
      { id: 'm2', role: 'agent', content: 'Olá! Que ótimo que você entrou em contato. Posso te ajudar a entender como a energia solar pode beneficiar você. Qual é o valor médio da sua conta de luz?', timestamp: '2026-03-14T10:00:05' },
      { id: 'm3', role: 'lead', content: 'Fica em torno de R$ 450 por mês', timestamp: '2026-03-14T10:02:00' },
      { id: 'm4', role: 'agent', content: 'Ótimo! Com esse valor, você teria um retorno muito interessante. Você mora em casa própria ou apartamento?', timestamp: '2026-03-14T10:02:10' },
      { id: 'm5', role: 'lead', content: 'Casa própria, tenho bastante espaço no telhado', timestamp: '2026-03-14T10:05:00' },
      { id: 'm6', role: 'agent', content: 'Perfeito! Você se encaixa no perfil ideal. Vou conectar você com nosso consultor para um orçamento sem compromisso. Qual o melhor horário para contato?', timestamp: '2026-03-14T10:05:15' },
      { id: 'm7', role: 'lead', content: 'Prefiro à tarde, depois das 14h', timestamp: '2026-03-14T10:07:00' },
      { id: 'm8', role: 'agent', content: 'Anotado! Nossa equipe vai entrar em contato hoje à tarde. Aguarde!', timestamp: '2026-03-14T10:07:10' },
    ]
  },
  {
    leadId: '2',
    messages: [
      { id: 'm1', role: 'lead', content: 'Tenho interesse em energia solar para meu comércio', timestamp: '2026-03-14T09:50:00' },
      { id: 'm2', role: 'agent', content: 'Olá! Ótima escolha. Para comércio, a economia pode ser ainda maior. Qual o consumo médio da sua conta de luz comercial?', timestamp: '2026-03-14T09:50:10' },
      { id: 'm3', role: 'lead', content: 'Não sei exatamente, vou verificar', timestamp: '2026-03-14T10:15:00' },
    ]
  },
  {
    leadId: '3',
    messages: [
      { id: 'm1', role: 'lead', content: 'Quero saber sobre instalação de painéis solares', timestamp: '2026-03-13T15:00:00' },
      { id: 'm2', role: 'agent', content: 'Olá! Vou te ajudar com todas as informações. Qual a sua conta de luz média?', timestamp: '2026-03-13T15:00:08' },
      { id: 'm3', role: 'lead', content: 'Paga uns R$ 800 por mês', timestamp: '2026-03-13T15:05:00' },
      { id: 'm4', role: 'agent', content: 'Excelente! Com R$800/mês você tem um ótimo potencial de economia. Sua residência é própria?', timestamp: '2026-03-13T15:05:12' },
      { id: 'm5', role: 'lead', content: 'Sim, tenho casa própria com telhado grande', timestamp: '2026-03-13T15:08:00', type: 'audio_transcription', mediaDescription: 'Áudio de 12 segundos transcrito' },
      { id: 'm6', role: 'agent', content: 'Maravilha! Você é um candidato perfeito. Posso agendar uma visita técnica gratuita?', timestamp: '2026-03-13T15:08:20' },
      { id: 'm7', role: 'lead', content: 'Com certeza! Quando podem vir?', timestamp: '2026-03-13T15:10:00' },
    ]
  },
  {
    leadId: '4',
    messages: [
      { id: 'm1', role: 'lead', content: 'Olá, gostaria de informações sobre energia solar', timestamp: '2026-03-13T14:00:00' },
      { id: 'm2', role: 'agent', content: 'Olá! Claro, vou te ajudar. Qual o valor da sua conta de energia?', timestamp: '2026-03-13T14:00:10' },
      { id: 'm3', role: 'lead', content: 'Pago só R$ 120 por mês', timestamp: '2026-03-13T14:05:00' },
      { id: 'm4', role: 'agent', content: 'Entendo. Com esse valor, infelizmente o retorno do investimento seria muito longo. Nosso perfil mínimo é de R$ 250/mês. Mas se sua conta aumentar no futuro, pode nos contactar novamente!', timestamp: '2026-03-13T14:05:15' },
    ]
  },
]

export const mockDashboardStats: DashboardStats = {
  totalLeads: 248,
  attendedBySdr: 248,
  qualified: 61,
  forwarded: 58,
  balance: { total: 300, used: 248, remaining: 52, expiresAt: '2026-03-31' },
  byChannel: [
    { channel: 'WhatsApp', count: 98 },
    { channel: 'Instagram', count: 112 },
    { channel: 'Facebook', count: 20 },
    { channel: 'Site', count: 12 },
    { channel: 'Outros', count: 6 },
  ],
  byStatus: [
    { status: 'Qualificados', count: 61 },
    { status: 'Em andamento', count: 109 },
    { status: 'Desqualificados', count: 20 },
    { status: 'Encaminhados', count: 58 },
  ]
}

export const MOCK_TENANTS: Tenant[] = [
  { id: 'tenant-abc-123', name: 'Solar Nordeste Ltda', wabaId: 'waba_001', phoneNumber: '+55 81 99999-0001', plan: 'Pro 300', status: 'active', balance: 52, createdAt: '2026-01-15T00:00:00' },
  { id: 'tenant-def-456', name: 'Energia Verde SP', wabaId: 'waba_002', phoneNumber: '+55 11 99999-0002', plan: 'Pro 300', status: 'no_balance', balance: 0, createdAt: '2026-02-01T00:00:00' },
  { id: 'tenant-ghi-789', name: 'Sol & Cia', wabaId: 'waba_003', phoneNumber: '+55 21 99999-0003', plan: 'Pro 300', status: 'active', balance: 187, createdAt: '2026-02-15T00:00:00' },
  { id: 'tenant-jkl-012', name: 'Raios Solares MG', wabaId: 'waba_004', phoneNumber: '+55 31 99999-0004', plan: 'Pro 300', status: 'suspended', balance: 0, createdAt: '2026-03-01T00:00:00' },
]

export const mockReportData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-02-13')
  date.setDate(date.getDate() + i)
  const received = Math.floor(Math.random() * 15) + 3
  const qualified = Math.floor(received * (0.2 + Math.random() * 0.3))
  return {
    date: date.toISOString().split('T')[0],
    received,
    qualified,
  }
})

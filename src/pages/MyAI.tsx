import { AppLayout } from '@/components/layout/AppLayout'
import { useState, useRef } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2, Save, CheckCircle } from 'lucide-react'

interface AccordionSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function AccordionSection({ title, children, defaultOpen = false }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="sigma-card" style={{ overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '13px 16px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid var(--int-4)' : 'none',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)' }}>{title}</span>
        {open ? <ChevronDown size={14} style={{ color: 'var(--sol-10)' }} /> : <ChevronRight size={14} style={{ color: 'var(--sol-10)' }} />}
      </button>
      {open && <div style={{ padding: 16 }}>{children}</div>}
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt-11)' }}>{label}</label>
      {children}
    </div>
  )
}

export default function MyAI() {
  const [saved, setSaved] = useState(false)
  const [questions, setQuestions] = useState([
    { q: 'Qual o valor médio da sua conta de luz?', qual: 'R$ 250+', disqual: 'Abaixo de R$ 250' },
    { q: 'O imóvel é próprio?', qual: 'Sim', disqual: 'Não / Alugado' },
  ])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AppLayout showFilters={false}>
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10 }}>

        <AccordionSection title="Informações da empresa" defaultOpen>
          <FormRow label="Nome da empresa">
            <input className="sigma-input" defaultValue="Solar Nordeste Ltda" />
          </FormRow>
          <FormRow label="Descrição do negócio">
            <textarea className="sigma-input" rows={3} defaultValue="Instalação e manutenção de sistemas fotovoltaicos para residências, comércios e propriedades rurais." style={{ resize: 'vertical' }} />
          </FormRow>
          <FormRow label="Produtos e serviços ofertados">
            <textarea className="sigma-input" rows={2} defaultValue="Sistemas de energia solar on-grid, off-grid e híbridos. Financiamento próprio e parcerias bancárias." style={{ resize: 'vertical' }} />
          </FormRow>
          <FormRow label="Área de atuação / estados atendidos">
            <input className="sigma-input" defaultValue="Nordeste: PE, PB, RN, CE, AL" />
          </FormRow>
        </AccordionSection>

        <AccordionSection title="Perfil do cliente ideal (ICP)">
          <FormRow label="Descrição do ICP">
            <textarea className="sigma-input" rows={3} defaultValue="Proprietários de imóvel residencial ou comercial com conta de energia acima de R$ 250/mês, na região Nordeste." style={{ resize: 'vertical' }} />
          </FormRow>
          <FormRow label="Consumo médio de energia esperado">
            <input className="sigma-input" defaultValue="Acima de R$ 250/mês" />
          </FormRow>
          <FormRow label="Tipo de imóvel preferencial">
            <select className="sigma-input">
              <option>Todos</option>
              <option>Residencial</option>
              <option>Comercial</option>
              <option>Rural</option>
            </select>
          </FormRow>
        </AccordionSection>

        <AccordionSection title="Critérios de qualificação">
          <p style={{ fontSize: 12, color: 'var(--sol-10)', marginBottom: 12, marginTop: 0 }}>
            Defina as perguntas obrigatórias e as respostas que qualificam ou desqualificam o lead.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {questions.map((item, idx) => (
              <div key={idx} style={{
                border: '1px solid var(--int-4)', borderRadius: 8, padding: 12,
                display: 'flex', flexDirection: 'column', gap: 8, backgroundColor: 'var(--bg-2)',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <input
                    className="sigma-input"
                    style={{ flex: 2 }}
                    value={item.q}
                    onChange={e => setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, q: e.target.value } : q))}
                    placeholder="Pergunta..."
                  />
                  <button
                    onClick={() => setQuestions(qs => qs.filter((_, i) => i !== idx))}
                    style={{ padding: 4, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brd-8)', marginTop: 6 }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <FormRow label="✓ Qualifica se">
                    <input className="sigma-input" value={item.qual}
                      onChange={e => setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, qual: e.target.value } : q))}
                      style={{ fontSize: 12 }} />
                  </FormRow>
                  <FormRow label="✗ Desqualifica se">
                    <input className="sigma-input" value={item.disqual}
                      onChange={e => setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, disqual: e.target.value } : q))}
                      style={{ fontSize: 12 }} />
                  </FormRow>
                </div>
              </div>
            ))}
          </div>
          <button
            className="sigma-btn-secondary"
            onClick={() => setQuestions(qs => [...qs, { q: '', qual: '', disqual: '' }])}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, marginTop: 8 }}
          >
            <Plus size={12} /> Adicionar pergunta
          </button>
        </AccordionSection>

        <AccordionSection title="Tom de voz">
          <FormRow label="Tom de voz">
            <select className="sigma-input">
              <option>Consultivo</option>
              <option>Formal</option>
              <option>Amigável</option>
              <option>Direto</option>
            </select>
          </FormRow>
          <FormRow label="Instruções adicionais de comportamento">
            <textarea className="sigma-input" rows={3} defaultValue="Sempre mencionar os benefícios financeiros. Nunca fazer promessas de valores específicos sem uma visita técnica." style={{ resize: 'vertical' }} />
          </FormRow>
          <FormRow label="Horário de funcionamento do agente">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="time" className="sigma-input" style={{ width: 110 }} defaultValue="08:00" />
              <span className="sigma-muted" style={{ fontSize: 12 }}>até</span>
              <input type="time" className="sigma-input" style={{ width: 110 }} defaultValue="18:00" />
            </div>
          </FormRow>
        </AccordionSection>

        <AccordionSection title="Reengajamento">
          <FormRow label="Número máximo de tentativas">
            <input type="number" className="sigma-input" style={{ width: 100 }} defaultValue={3} min={1} max={10} />
          </FormRow>
          <FormRow label="Intervalo entre tentativas">
            <select className="sigma-input">
              <option>1 hora</option>
              <option>3 horas</option>
              <option>6 horas</option>
              <option>12 horas</option>
              <option>24 horas</option>
            </select>
          </FormRow>
          <FormRow label="Mensagem de reengajamento personalizada">
            <textarea
              className="sigma-input" rows={3}
              defaultValue="Oi! Tudo bem? Vi que você se interessou em energia solar. Ainda posso te ajudar com mais informações? 🌞"
              style={{ resize: 'vertical' }}
            />
          </FormRow>
        </AccordionSection>
      </div>

      {/* Sticky save button */}
      <div style={{
        position: 'sticky', bottom: 0, padding: '12px 0', backgroundColor: 'var(--bg-2)',
        borderTop: '1px solid var(--int-4)', marginTop: 4,
      }}>
        <button
          className="sigma-btn-primary"
          onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 20px' }}
        >
          {saved ? <><CheckCircle size={14} /> Configurações salvas!</> : <><Save size={14} /> Salvar configurações</>}
        </button>
      </div>
    </AppLayout>
  )
}

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface StatusDonutChartProps {
  data: Array<{ status: string; count: number }>
}

const STATUS_COLORS: Record<string, string> = {
  'Qualificados': '#1A1A18',
  'Em andamento': '#7A7A78',
  'Desqualificados': '#C4C4C2',
  'Encaminhados': '#D4D4D2',
}

export function StatusDonutChart({ data }: StatusDonutChartProps) {
  const total = data.reduce((acc, d) => acc + d.count, 0)

  return (
    <div className="sigma-card" style={{ padding: 15 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: '0 0 12px' }}>
        Status dos leads
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flexShrink: 0 }}>
          <ResponsiveContainer width={80} height={80}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={24}
                outerRadius={38}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#999'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-1)',
                  border: '1px solid var(--int-4)',
                  borderRadius: 6,
                  fontSize: 12,
                  padding: '4px 8px',
                }}
                formatter={(val) => [val, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.map((entry) => (
            <div key={entry.status} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  backgroundColor: STATUS_COLORS[entry.status] || '#999',
                  flexShrink: 0
                }} />
                <span style={{ fontSize: 11, color: 'var(--sol-10)' }}>{entry.status}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt-12)' }}>
                {entry.count}
              </span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--int-3)', paddingTop: 4, marginTop: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--brd-8)' }}>Total</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt-12)' }}>{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

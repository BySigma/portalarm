import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface LeadsBarChartProps {
  data: Array<{ channel: string; count: number }>
}

export function LeadsBarChart({ data }: LeadsBarChartProps) {
  const maxVal = Math.max(...data.map(d => d.count))

  return (
    <div className="sigma-card" style={{ padding: 15 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-12)', margin: 0 }}>
          Leads por canal
        </p>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 3,
          fontSize: 11, color: 'var(--sol-10)',
          background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500
        }}>
          Visão geral ▾
        </button>
      </div>

      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={data} barSize={18}>
          <XAxis
            dataKey="channel"
            tick={{ fontSize: 10, fill: 'var(--brd-8)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-1)',
              border: '1px solid var(--int-4)',
              borderRadius: 6,
              fontSize: 12,
              padding: '4px 8px',
            }}
            formatter={(val) => [val, 'Leads']}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.channel}
                fill={entry.count === maxVal ? 'var(--txt-12)' : 'var(--int-5)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

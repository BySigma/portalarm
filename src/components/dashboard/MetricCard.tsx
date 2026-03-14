import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: number | string
  delta?: number
  deltaLabel?: string
  suffix?: string
}

export function MetricCard({ label, value, delta, deltaLabel, suffix }: MetricCardProps) {
  const isPositive = delta !== undefined && delta >= 0

  return (
    <div className="sigma-card" style={{ padding: 15 }}>
      <p className="sigma-label" style={{ marginBottom: 8 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <span className="sigma-metric-value">
          {value}
          {suffix && <span style={{ fontSize: 18, fontWeight: 600 }}>{suffix}</span>}
        </span>
        {delta !== undefined && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 2,
            fontSize: 11, fontWeight: 500, paddingBottom: 4,
            color: isPositive ? '#1D6F42' : '#B91C1C',
          }}>
            {isPositive
              ? <TrendingUp size={11} />
              : <TrendingDown size={11} />
            }
            {isPositive ? '+' : ''}{delta}%
            {deltaLabel && <span style={{ color: 'var(--brd-8)', fontWeight: 400 }}> {deltaLabel}</span>}
          </span>
        )}
      </div>
    </div>
  )
}

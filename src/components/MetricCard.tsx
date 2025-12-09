import './MetricCard.css'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down'
}

function MetricCard({ title, value, change, trend }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <h3 className="metric-title">{title}</h3>
        <span className={`metric-trend ${trend}`}>
          {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      </div>
      <div className="metric-value">{value}</div>
    </div>
  )
}

export default MetricCard


import { useState, useEffect } from 'react'
import './ChartWidget.css'

interface ChartWidgetProps {
  period: 'day' | 'week' | 'month'
}

function ChartWidget({ period }: ChartWidgetProps) {
  const [data, setData] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const newData = Array.from({ length: 12 }, () => Math.random() * 100)
      setData(newData)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [period])

  if (loading) {
    return (
      <div className="chart-widget">
        <div className="chart-header">
          <h2>Analytics Chart</h2>
        </div>
        <div className="chart-loading">Loading chart data...</div>
      </div>
    )
  }

  const maxValue = Math.max(...data, 1)
  const chartHeight = 200

  return (
    <div className="chart-widget">
      <div className="chart-header">
        <h2>Analytics Chart</h2>
        <span className="chart-period">{period}</span>
      </div>
      <div className="chart-container">
        <svg className="chart-svg" viewBox={`0 0 ${data.length * 40} ${chartHeight}`}>
          {data.map((value, index) => {
            const barHeight = (value / maxValue) * chartHeight
            const x = index * 40 + 10
            const y = chartHeight - barHeight
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width="20"
                  height={barHeight}
                  fill="#667eea"
                  className="chart-bar"
                />
                <text
                  x={x + 10}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#666"
                >
                  {index + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default ChartWidget


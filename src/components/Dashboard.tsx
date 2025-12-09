import { useState, useEffect } from 'react'
import { useAsyncData } from '../hooks/useAsyncData'
import MetricCard from './MetricCard'
import ChartWidget from './ChartWidget'
import NotificationPanel from './NotificationPanel'
import './Dashboard.css'

interface DashboardData {
  totalUsers: number
  activeSessions: number
  revenue: number
  conversionRate: number
}

function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week')
  const { data, loading, error, refetch } = useAsyncData<DashboardData>(
    () => fetchDashboardData(selectedPeriod),
    [selectedPeriod]
  )

  const [notifications, setNotifications] = useState<any[]>([])
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications().then(newNotifications => {
        setNotifications(prev => {
          const combined = [...prev, ...newNotifications]
          return combined.slice(-50)
        })
        setNotificationCount(prev => prev + newNotifications.length)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handlePeriodChange = (period: 'day' | 'week' | 'month') => {
    setSelectedPeriod(period)
  }

  if (loading && !data) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  if (error) {
    return <div className="dashboard-error">Error: {error.message}</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="period-selector">
          <button
            className={selectedPeriod === 'day' ? 'active' : ''}
            onClick={() => handlePeriodChange('day')}
          >
            Day
          </button>
          <button
            className={selectedPeriod === 'week' ? 'active' : ''}
            onClick={() => handlePeriodChange('week')}
          >
            Week
          </button>
          <button
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => handlePeriodChange('month')}
          >
            Month
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Total Users"
          value={data?.totalUsers || 0}
          change={12.5}
          trend="up"
        />
        <MetricCard
          title="Active Sessions"
          value={data?.activeSessions || 0}
          change={-3.2}
          trend="down"
        />
        <MetricCard
          title="Revenue"
          value={`$${(data?.revenue || 0).toLocaleString()}`}
          change={8.7}
          trend="up"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${(data?.conversionRate || 0).toFixed(2)}%`}
          change={2.1}
          trend="up"
        />
      </div>

      <div className="dashboard-widgets">
        <ChartWidget period={selectedPeriod} />
        <NotificationPanel
          notifications={notifications}
          count={notificationCount}
          onClear={() => {
            setNotifications([])
            setNotificationCount(0)
          }}
        />
      </div>
    </div>
  )
}

async function fetchDashboardData(period: 'day' | 'week' | 'month'): Promise<DashboardData> {
  await new Promise(resolve => setTimeout(resolve, 800))
  return {
    totalUsers: Math.floor(Math.random() * 100000) + 50000,
    activeSessions: Math.floor(Math.random() * 10000) + 2000,
    revenue: Math.floor(Math.random() * 500000) + 100000,
    conversionRate: Math.random() * 5 + 2
  }
}

async function fetchNotifications(): Promise<any[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  const count = Math.floor(Math.random() * 3)
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    message: `New notification ${i + 1}`,
    timestamp: new Date()
  }))
}

export default Dashboard


import { useState } from 'react'
import './NotificationPanel.css'

interface NotificationPanelProps {
  notifications: any[]
  count: number
  onClear: () => void
}

function NotificationPanel({ notifications, count, onClear }: NotificationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h2>Notifications</h2>
        <div className="notification-actions">
          {count > 0 && (
            <span className="notification-badge">{count}</span>
          )}
          <button
            className="notification-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty">No notifications</div>
          ) : (
            <>
              {notifications.slice().reverse().map(notification => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">
                    {notification.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <button className="notification-clear" onClick={onClear}>
                Clear All
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationPanel


import { useState, useEffect } from 'react'
import Modal from './Modal'
import './UserManagement.css'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar: string
  lastActive: string
  status: 'online' | 'offline' | 'away'
}

const generateUsers = (): User[] => {
  const names = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson', 'Frank Miller', 'Grace Lee', 'Henry Davis']
  const roles = ['Administrator', 'Editor', 'Viewer', 'Moderator']
  const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away']
  
  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[i % statuses.length]
  }))
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<User>>({})

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUsers(generateUsers())
      setLoading(false)
    }
    loadUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    setEditedUser(user)
    setEditMode(false)
    setShowModal(true)
  }

  const handleEdit = () => {
    setEditMode(true)
  }

  const handleSave = () => {
    if (selectedUser) {
      setUsers(prev => prev.map(user =>
        user.id === selectedUser.id ? { ...user, ...editedUser } as User : user
      ))
      setEditMode(false)
      setShowModal(false)
      setSelectedUser(null)
    }
  }

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id))
      setShowModal(false)
      setSelectedUser(null)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    setEditMode(false)
    setEditedUser({})
  }

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h1>User Management</h1>
        <div className="user-stats">
          <span>Total: {users.length}</span>
          <span>Online: {users.filter(u => u.status === 'online').length}</span>
        </div>
      </div>

      <div className="user-search">
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="user-grid">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => handleUserClick(user)}
          >
            <div className="user-avatar-container">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <span className={`status-indicator status-${user.status}`}></span>
            </div>
            <div className="user-info">
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <span className="user-role">{user.role}</span>
            </div>
            <div className="user-meta">
              <span className="last-active">
                Active {new Date(user.lastActive).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-results">
          No users found matching your search.
        </div>
      )}

      {showModal && selectedUser && (
        <Modal onClose={handleCloseModal}>
          <div className="user-modal-content">
            <div className="modal-header">
              <h2>{editMode ? 'Edit User' : 'User Details'}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-avatar-section">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="modal-avatar" />
                <span className={`modal-status status-${selectedUser.status}`}>
                  {selectedUser.status}
                </span>
              </div>

              {editMode ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editedUser.name || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editedUser.email || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={editedUser.role || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                      <option value="Moderator">Moderator</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="user-details">
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedUser.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Role:</span>
                    <span className="detail-value">{selectedUser.role}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Active:</span>
                    <span className="detail-value">
                      {new Date(selectedUser.lastActive).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              {editMode ? (
                <>
                  <button className="save-button" onClick={handleSave}>
                    Save Changes
                  </button>
                  <button className="cancel-button" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="edit-button" onClick={handleEdit}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default UserManagement


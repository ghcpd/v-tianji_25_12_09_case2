import { useState, useMemo } from 'react'
import './DataTable.css'

interface TableRow {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  revenue: number
}

const generateMockData = (): TableRow[] => {
  const roles = ['Admin', 'User', 'Manager', 'Guest']
  const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending']
  const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank']
  
  return Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    name: `${names[i % names.length]} ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    revenue: Math.floor(Math.random() * 100000)
  }))
}

function DataTable() {
  const [data] = useState<TableRow[]>(generateMockData())
  const [sortColumn, setSortColumn] = useState<keyof TableRow | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterText, setFilterText] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  const filteredAndSortedData = useMemo(() => {
    let result = [...data]

    if (filterText) {
      result = result.filter(row =>
        row.name.toLowerCase().includes(filterText.toLowerCase()) ||
        row.email.toLowerCase().includes(filterText.toLowerCase())
      )
    }

    if (filterRole !== 'all') {
      result = result.filter(row => row.role === filterRole)
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }
        
        return 0
      })
    }

    return result
  }, [data, filterText, filterRole, sortColumn, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize)
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSort = (column: keyof TableRow) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map(row => row.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteSelected = () => {
    console.log('Deleting rows:', Array.from(selectedRows))
    setSelectedRows(new Set())
  }

  const uniqueRoles = useMemo(() => {
    const roles = new Set(data.map(row => row.role))
    return Array.from(roles)
  }, [data])

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h1>Data Table</h1>
        <div className="table-actions">
          {selectedRows.size > 0 && (
            <button className="delete-button" onClick={handleDeleteSelected}>
              Delete Selected ({selectedRows.size})
            </button>
          )}
        </div>
      </div>

      <div className="table-filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value)
            setCurrentPage(1)
          }}
          className="filter-input"
        />
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value)
            setCurrentPage(1)
          }}
          className="filter-select"
        >
          <option value="all">All Roles</option>
          {uniqueRoles.map(role => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setCurrentPage(1)
          }}
          className="page-size-select"
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(row.id))}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th onClick={() => handleSort('id')} className="sortable">
                ID {sortColumn === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('role')} className="sortable">
                Role {sortColumn === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('revenue')} className="sortable">
                Revenue {sortColumn === 'revenue' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(row => (
              <tr key={row.id} className={selectedRows.has(row.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                  />
                </td>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <span className={`status-badge status-${row.status}`}>
                    {row.status}
                  </span>
                </td>
                <td>${row.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages} ({filteredAndSortedData.length} total)
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default DataTable


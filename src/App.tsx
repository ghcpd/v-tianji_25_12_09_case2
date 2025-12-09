import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import DataTable from './components/DataTable'
import FormBuilder from './components/FormBuilder'
import UserManagement from './components/UserManagement'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">ComplexUI</h1>
            <div className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/table">Data Table</Link>
              <Link to="/form">Form Builder</Link>
              <Link to="/users">Users</Link>
            </div>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/table" element={<DataTable />} />
            <Route path="/form" element={<FormBuilder />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App


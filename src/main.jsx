import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './Login.jsx'
import Dashboard from './dashboard.jsx'

const SESSION_KEY = 'drive-user'

function readSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

function Root() {
  const [user, setUser] = useState(readSession)

  function handleLogin(username) {
    try {
      sessionStorage.setItem(SESSION_KEY, username)
    } catch {
      // ignore storage errors
    }
    setUser(username)
  }

  function handleLogout() {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // ignore storage errors
    }
    setUser(null)
  }

  return user ? <Dashboard user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
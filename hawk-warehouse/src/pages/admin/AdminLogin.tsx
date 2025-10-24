import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_TOKEN_KEY, EXPECTED_TOKEN } from '../../auth'

export default function AdminLogin() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (token === EXPECTED_TOKEN) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token)
      nav('/admin', { replace: true })
    } else {
      setError('Invalid token.')
    }
  }

  return (
    <div className="hw-card" style={{ maxWidth: 420, margin: '32px auto' }}>
      <div className="hw-card-body">
        <h3 style={{ marginTop: 0 }}>Admin Login</h3>
        <form className="hw-col" onSubmit={submit}>
          <label>Access token</label>
          <input
            className="hw-input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter demo token"
          />
          {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
          <button className="hw-btn" type="submit">Enter</button>
        </form>
        <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>
          Demo token is <code>{EXPECTED_TOKEN}</code> (change in <code>src/auth.tsx</code>).
        </p>
      </div>
    </div>
  )
}
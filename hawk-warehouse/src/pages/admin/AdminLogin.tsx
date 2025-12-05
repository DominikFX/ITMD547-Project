import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { api } from '../../api'

export default function AdminLogin() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { dispatch } = useStore()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const isValid = await api.login(token)

    if (isValid) {
      dispatch({ type: 'LOGIN_ADMIN' })
      nav('/admin', { replace: true })
    } else {
      setError('Invalid token.')
    }
    setLoading(false)
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
            placeholder="Enter admin token"
            type="password"
          />
          {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
          <button className="hw-btn" type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
import { Navigate, Outlet } from 'react-router-dom'
import { useStore } from './store'

export function RequireAuth() {
  const { state } = useStore()

  return state.isAdmin ? <Outlet /> : <Navigate to="/admin-login" replace />
}
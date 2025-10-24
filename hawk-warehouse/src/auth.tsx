import { Navigate, Outlet } from 'react-router-dom'

export const ADMIN_TOKEN_KEY = 'hw-admin-token'
export const EXPECTED_TOKEN = 'hawk-admin' // change for your demo

export function isAuthed() {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) === EXPECTED_TOKEN
  } catch {
    return false
  }
}

export function RequireAuth() {
  return isAuthed() ? <Outlet /> : <Navigate to="/admin-login" replace />
}
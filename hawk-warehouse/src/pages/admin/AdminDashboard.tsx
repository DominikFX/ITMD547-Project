import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Hero from '../../components/Hero'
import Inventory from './Inventory'

export default function AdminDashboard() {
  const { pathname } = useLocation()
  const onRoot = pathname === '/admin' || pathname === '/admin/'

  useEffect(() => {
    document.body.classList.add('hw-admin-mode')
    return () => document.body.classList.remove('hw-admin-mode')
  }, [])

  return (
    <div className="hw-col" style={{ gap: 12 }}>
      <Hero
        title="Management Dashboard"
        subtitle="Inventory and orders for catalog and rentals."
        image="/images/hero-admin.jpg"
      />
      <div className="hw-subnav">
        <NavLink to="/admin/inventory" className={({ isActive }) => `hw-tab ${isActive || onRoot ? 'active' : ''}`}>
          Inventory
        </NavLink>
        <NavLink to="/admin/add" className={({ isActive }) => `hw-tab ${isActive ? 'active' : ''}`}>
          Add Product
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `hw-tab ${isActive ? 'active' : ''}`}>
          Orders
        </NavLink>
      </div>

      {onRoot ? <Inventory /> : <Outlet />}
    </div>
  )
}
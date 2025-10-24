import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Hero from '../../components/Hero'
import Inventory from './Inventory'

export default function AdminDashboard() {
  const { pathname } = useLocation()
  const onRoot = pathname === '/admin' || pathname === '/admin/'

  return (
    <div className="hw-col" style={{ gap: 12 }}>
      <Hero
        title="Management Dashboard"
        subtitle="Inventory and orders for catalog and rentals."
        image="/images/hero-admin.jpg"
      />
      <div className="hw-row" style={{ gap: 8 }}>
        <NavLink to="/admin/inventory" className="hw-link">Inventory</NavLink>
        <NavLink to="/admin/add" className="hw-link">Add Product</NavLink>
        <NavLink to="/admin/orders" className="hw-link">Orders</NavLink>
      </div>

      {onRoot ? <Inventory /> : <Outlet />}
    </div>
  )
}
import { NavLink, Link } from 'react-router-dom'
import { useStore } from '../store'
import { Package, ShoppingCart } from 'lucide-react'

export default function NavBar() {
  const { state } = useStore()
  const cartCount = state.cart.reduce((s, x) => s + x.qty, 0)

  return (
    <header className="hw-navbar">
      <div className="hw-navbar-inner">

        <Link to="/" className="hw-brand">
          <div className="hw-logo-icon">
            <Package size={20} strokeWidth={2.5} />
          </div>
          <div className="hw-brand-text">
            <span className="hw-brand-title">Hawk Warehouse</span>
            <span className="hw-brand-sub">Illinois Tech</span>
          </div>
        </Link>

        <nav className="hw-menu">
          <NavLink to="/catalog" className={({ isActive }) => `hw-nav-item ${isActive ? 'active' : ''}`}>
            Catalog
          </NavLink>
          <NavLink to="/rental" className={({ isActive }) => `hw-nav-item ${isActive ? 'active' : ''}`}>
            Rentals
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `hw-nav-item ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
        </nav>

        <div className="hw-actions">
          <NavLink to="/admin" className="hw-nav-item small">
            Admin
          </NavLink>
          <NavLink to="/cart" className="hw-btn-cart">
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && <span className="hw-cart-count">{cartCount}</span>}
          </NavLink>
        </div>
      </div>
    </header>
  )
}
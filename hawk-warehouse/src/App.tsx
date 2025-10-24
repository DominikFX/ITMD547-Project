import { Outlet, NavLink } from 'react-router-dom'
import { useStore } from './store'
import NavBar from './components/NavBar'
import Footer from './components/footer'

export default function App() {
  const { state } = useStore()
  const cartCount = state.cart.reduce((s, x) => s + x.qty, 0)

  return (
    <div className="hw-app">
      <NavBar>
        <nav className="hw-nav">
          <NavLink to="/catalog" className="hw-link">Catalog</NavLink>
          <NavLink to="/rental" className="hw-link">Rental</NavLink>
          <NavLink to="/about" className="hw-link">About</NavLink>

          <div style={{ flex: 1 }} />

          <NavLink to="/cart" className="hw-link hw-cart">Cart ({cartCount})</NavLink>
          <NavLink to="/admin" className="hw-link">Admin</NavLink>
        </nav>
      </NavBar>

      <main className="hw-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
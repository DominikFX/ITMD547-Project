import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/footer'

export default function App() {
  return (
    <div className="hw-app">
      <NavBar />
      <main className="hw-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
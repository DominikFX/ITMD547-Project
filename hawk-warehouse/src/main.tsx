import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './theme.css'

import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Rental from './pages/Rental'
import About from './pages/About'

import AdminDashboard from './pages/admin/AdminDashboard'
import Inventory from './pages/admin/Inventory'
import AddProduct from './pages/admin/AddProduct'
import Orders from './pages/admin/Orders'
import AdminLogin from './pages/admin/AdminLogin'
import { StoreProvider } from './store'
import { RequireAuth } from './auth'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Catalog /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'rental', element: <Rental /> },
      { path: 'about', element: <About /> },
      { path: 'admin-login', element: <AdminLogin /> },
      {
        path: 'admin',
        element: <RequireAuth />,
        children: [
          {
            path: '',
            element: <AdminDashboard />,
            children: [
              { index: true, element: <Inventory /> },
              { path: 'inventory', element: <Inventory /> },
              { path: 'add', element: <AddProduct /> },
              { path: 'orders', element: <Orders /> }
            ]
          }
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>
)
// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/Cartcontext'

// Pages — User
import HomePage        from './pages/Homepage'
import ShopPage        from './pages/ShopPage'
import ProductPage     from './pages/ProductPage'
import CartPage        from './pages/CartPage'
import CheckoutPage    from './pages/CheckoutPage'
import OrdersPage      from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ProfilePage     from './pages/ProfilePage'
import AuthPage        from './pages/Authpage'

// Pages — Admin
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminProducts   from './pages/admin/AdminProducts'
import AdminOrders     from './pages/admin/AdminOrders'
import AdminUsers      from './pages/admin/AdminUsers'
import AdminProductForm from './pages/admin/AdminProductForm'

// Layout
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'

function RequireAuth({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" replace />
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (!user)             return <Navigate to="/auth"  replace />
  if (user.role !== 'admin') return <Navigate to="/"  replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/auth"     element={<AuthPage />} />

      {/* User routes with Navbar+Footer */}
      <Route path="/" element={<UserLayout />}>
        <Route index              element={<HomePage />} />
        <Route path="shop"        element={<ShopPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart"        element={<RequireAuth><CartPage /></RequireAuth>} />
        <Route path="checkout"    element={<RequireAuth><CheckoutPage /></RequireAuth>} />
        <Route path="orders"      element={<RequireAuth><OrdersPage /></RequireAuth>} />
        <Route path="orders/:id"  element={<RequireAuth><OrderDetailPage /></RequireAuth>} />
        <Route path="profile"     element={<RequireAuth><ProfilePage /></RequireAuth>} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      <Route path="/admin/products"        element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
      <Route path="/admin/products/new"    element={<RequireAdmin><AdminProductForm /></RequireAdmin>} />
      <Route path="/admin/products/:id"    element={<RequireAdmin><AdminProductForm /></RequireAdmin>} />
      <Route path="/admin/orders"          element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
      <Route path="/admin/users"           element={<RequireAdmin><AdminUsers /></RequireAdmin>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import { Outlet } from 'react-router-dom'
function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  )
}
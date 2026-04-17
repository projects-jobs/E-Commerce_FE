import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Bell, LogOut, Settings, Package } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/Cartcontext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems }   = useCart()
  const nav  = useNavigate()
  const loc  = useLocation()
  const [open,     setOpen]     = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  const handleLogout = () => { logout(); nav('/auth') }

  const links = [
    { to: '/',    label: 'Home'  },
    { to: '/shop', label: 'Shop' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-ink-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-ink-900 hidden sm:block">E-Commerce</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${loc.pathname === l.to ? 'bg-brand-50 text-brand-600' : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          {user && (
            <Link to="/cart" className="relative p-2 text-ink-600 hover:text-ink-900 hover:bg-ink-100 rounded-xl transition-colors">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* User menu */}
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenu(o => !o)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-ink-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-ink-700">{user.name?.split(' ')[0]}</span>
              </button>
              {userMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-ink-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-ink-100 mb-1">
                      <p className="font-semibold text-ink-900 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-ink-400 truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                        <Settings size={16} className="text-ink-400" /> Admin Panel
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                      <Package size={16} className="text-ink-400" /> My Orders
                    </Link>
                    <Link to="/profile" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                      <User size={16} className="text-ink-400" /> Profile
                    </Link>
                    <hr className="my-1 border-ink-100" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn-primary py-2 px-5 text-sm">Sign In</Link>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-xl hover:bg-ink-100" onClick={() => setOpen(o => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-ink-100 bg-white px-4 py-3 space-y-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-ink-700 hover:bg-ink-100 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
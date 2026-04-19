// src/components/Navbar.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, LogOut, Settings, Package, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/Cartcontext'   // ✅ correct casing

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { totalItems }            = useCart()
  const nav = useNavigate()
  const loc = useLocation()
  const [open,     setOpen]     = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  const handleLogout = () => { logout(); setUserMenu(false); nav('/auth') }

  // Only Electronics and Clothing as requested
  const CATS = ['Electronics', 'Clothing']

  return (
    <header className="sticky top-0 z-50 shadow-lg"
      style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #1a1a2e 100%)' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
            <ShoppingCart size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg hidden sm:block tracking-tight">E-Commerce</span>
        </Link>

        {/* ── Desktop nav ───────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              loc.pathname === '/'
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/8'
            }`}>
            Home
          </Link>
          <Link to="/shop"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              loc.pathname.startsWith('/shop')
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/8'
            }`}>
            All Products
          </Link>
         
        </div>

        {/* ── Right actions ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Cart */}
          <Link to="/cart"
            className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenu(o => !o)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-300 font-bold text-sm">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-200 max-w-[80px] truncate">
                  {user.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
              </button>

              {userMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                      <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <Settings size={15} className="text-slate-400"/> Admin Panel
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Package size={15} className="text-slate-400"/> My Orders
                    </Link>
                    <Link to="/profile" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <User size={15} className="text-slate-400"/> Profile
                    </Link>
                    <hr className="my-1 border-slate-100"/>
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={15}/> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/auth"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-lg shadow-orange-500/25">
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
            onClick={() => setOpen(o => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1"
          style={{ background: 'rgba(15,23,42,0.98)' }}>
          {[['/', 'Home'], ['/shop', 'All Products']].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors">
              {label}
            </Link>
          ))}
          {CATS.map(c => (
            <Link key={c} to={`/shop?category=${c}`} onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors">
              {c}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, ShoppingCart, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin',           icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/products',  icon: Package,         label: 'Products'   },
  { to: '/admin/orders',    icon: ShoppingBag,     label: 'Orders'     },
  { to: '/admin/users',     icon: Users,           label: 'Users'      },
]

export default function AdminLayout({ children }) {
  const loc = useLocation()
  const { logout } = useAuth()
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <ShoppingCart size={16} className="text-white" />
            </div>
            <span className="text-white font-bold">E-Commerce</span>
          </Link>
          <p className="text-slate-500 text-xs mt-1 font-medium">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => {
            const active = loc.pathname === to
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all mb-1">
            <ShoppingCart size={18} /> View Store
          </Link>
          <button onClick={() => { logout(); nav('/auth') }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Users, ShoppingBag, DollarSign,
  Package, ArrowUpRight, LogOut
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('ec_token')}` })

const NAV = [
  { to: '/admin',          label: 'Dashboard',  icon: '📊' },
  { to: '/admin/products', label: 'Products',   icon: '📦' },
  { to: '/admin/orders',   label: 'Orders',     icon: '🛒' },
  { to: '/admin/users',    label: 'Users',      icon: '👥' },
  { to: '/',               label: 'Storefront', icon: '🏪' },
]

export default function AdminDashboard() {
  const { user, logout }      = useAuth()
  const [stats,   setStats]   = useState(null)
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE}/admin/dashboard`, { headers: authH() }).catch(() => ({ data: null })),
      axios.get(`${BASE}/orders?limit=5`,  { headers: authH() }).catch(() => ({ data: { orders: [] } })),
    ]).then(([d, o]) => {
      setStats(d.data)
      setOrders(o.data?.orders || [])
    }).finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Total Revenue',   value: stats ? `₹${(stats.totalRevenue  || 0).toLocaleString()}` : '₹0', icon: <DollarSign size={20} />, color: 'bg-emerald-500', growth: '+12.5%' },
    { label: 'Active Orders',   value: stats?.activeOrders  || 0, icon: <ShoppingBag size={20} />, color: 'bg-blue-500',   growth: '+8%'  },
    { label: 'Total Customers', value: stats?.totalUsers    || 0, icon: <Users size={20} />,       color: 'bg-violet-500', growth: '+18%' },
    { label: 'Total Products',  value: stats?.totalProducts || 0, icon: <Package size={20} />,     color: 'bg-amber-500',  growth: '+5%'  },
  ]

  const statusStyle = (s) => ({
    Pending:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Shipped:    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Delivered:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
  }[s] || 'bg-slate-700 text-slate-400')

  return (
    <div className="min-h-screen bg-[#0f172a] flex">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0b1120] border-r border-slate-800 p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">E-Commerce</p>
            <p className="text-slate-500 text-xs">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <span>{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-4"
        >
          <LogOut size={16} /> Sign Out
        </button>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <header className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <p className="text-slate-500 text-sm mb-1">Good to see you, {user?.name?.split(' ')[0]} 👋</p>
            <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
          </div>
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            + Add Product
          </Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${s.color} bg-opacity-10`}>
                  {React.cloneElement(s.icon, { className: s.color.replace('bg-', 'text-') })}
                </div>
                <span className={`text-xs font-bold ${s.growth.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {s.growth}
                </span>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black text-white mt-1">{loading ? '…' : s.value}</h3>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { to: '/admin/products',     label: 'Manage Products', icon: '📦', color: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'    },
            { to: '/admin/orders',       label: 'View Orders',     icon: '🛒', color: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' },
            { to: '/admin/users',        label: 'Manage Users',    icon: '👥', color: 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-400' },
            { to: '/admin/products/new', label: 'Add Product',     icon: '➕', color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400' },
          ].map(q => (
            <Link
              key={q.to}
              to={q.to}
              className={`${q.color} border border-white/5 rounded-2xl p-4 transition-all flex items-center gap-3`}
            >
              <span className="text-2xl">{q.icon}</span>
              <span className="text-sm font-bold">{q.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" /> Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-black uppercase tracking-widest">
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-3 bg-slate-700 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No orders yet</td>
                  </tr>
                ) : (
                  orders.map(o => (
                    <tr key={o._id} className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-indigo-400">
                        #{o._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">{o.user?.name || 'Guest'}</td>
                      <td className="px-6 py-4 font-bold text-emerald-400 text-sm">₹{o.totalPrice?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusStyle(o.orderStatus)}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/orders/${o._id}`}
                          className="text-xs text-slate-400 hover:text-white font-semibold transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
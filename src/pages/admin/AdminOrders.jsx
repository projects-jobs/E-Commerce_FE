// src/pages/admin/AdminOrders.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, Clock, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('kf_token')}` })

const STATUS_OPTIONS = ['Pending','Processing','Shipped','Delivered','Cancelled']
const STATUS_STYLE = {
  Pending:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Shipped:    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Delivered:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
}
const STATUS_ICON = {
  Pending:    <Clock size={14}/>,
  Processing: <Package size={14}/>,
  Shipped:    <Truck size={14}/>,
  Delivered:  <CheckCircle size={14}/>,
  Cancelled:  <XCircle size={14}/>,
}

export default function AdminOrders() {
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [keyword,  setKeyword]  = useState('')
  const [filter,   setFilter]   = useState('All')
  const [updating, setUpdating] = useState(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${BASE}/orders`, { headers: authH() })
      setOrders(data.orders || data || [])
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await axios.put(`${BASE}/orders/${orderId}/status`, { orderStatus: status }, { headers: authH() })
      setOrders(o => o.map(x => x._id === orderId ? { ...x, orderStatus: status } : x))
      toast.success(`Order marked as ${status}`)
    } catch { toast.error('Update failed') }
    finally { setUpdating(null) }
  }

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'All' || o.orderStatus === filter
    const matchSearch = !keyword ||
      o._id?.includes(keyword) ||
      o.user?.name?.toLowerCase().includes(keyword.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <Link to="/admin" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors mb-1 inline-block">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily:'Syne,sans-serif' }}>
              Orders
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">{filtered.length} results</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder="Search order ID or customer…"
                className="input-dark pl-9 w-full"/>
            </div>
            <button onClick={fetchOrders}
              className="p-2.5 bg-[#1e293b] border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
              <RefreshCw size={18}/>
            </button>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['All', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === s
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-[#1e293b] text-slate-400 border border-slate-800 hover:text-white'
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_,i) => <div key={i} className="h-24 bg-[#1e293b] rounded-3xl animate-pulse"/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(o => (
              <div key={o._id} className="bg-[#1e293b] rounded-3xl border border-slate-800 hover:border-slate-700 transition-all p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">

                  {/* Icon */}
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Package size={22}/>
                  </div>

                  {/* Order info */}
                  <div className="flex-1 min-w-[160px]">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-0.5">Order</p>
                    <p className="text-white text-sm font-bold font-mono">#{o._id?.slice(-10).toUpperCase()}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''} • ₹{o.totalPrice?.toLocaleString()}
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="min-w-[140px]">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-0.5">Customer</p>
                    <p className="text-white text-sm font-semibold">{o.user?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>

                  {/* Status badge */}
                  <div className="min-w-[120px]">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${STATUS_STYLE[o.orderStatus]}`}>
                      {STATUS_ICON[o.orderStatus]} {o.orderStatus}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-auto shrink-0">
                    <Link to={`/orders/${o._id}`}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all">
                      View
                    </Link>
                    <select
                      value={o.orderStatus}
                      disabled={updating === o._id}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 border-0 outline-none"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
// src/pages/OrdersPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('kf_token')}` })

const STEPS = [
  { key:'Pending',    label:'Placed',    Icon:Clock },
  { key:'Processing', label:'Packed',    Icon:Package },
  { key:'Shipped',    label:'Shipped',   Icon:Truck },
  { key:'Delivered',  label:'Delivered', Icon:CheckCircle2 },
]

const STATUS_STYLE = {
  Pending:    'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Shipped:    'bg-indigo-50 text-indigo-700 border-indigo-200',
  Delivered:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled:  'bg-red-50 text-red-700 border-red-200',
}

function StatusTracker({ status }) {
  if (status === 'Cancelled') return (
    <div className="flex items-center gap-2 py-4 text-red-500 text-sm font-semibold">
      <XCircle size={18}/> This order was cancelled
    </div>
  )
  const currentIdx = STEPS.findIndex(s => s.key === status)
  return (
    <div className="relative flex justify-between items-center mt-6 px-2">
      {/* Track line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-ink-100 mx-8"/>
      <div className="absolute top-5 left-0 h-0.5 bg-brand-500 mx-8 transition-all"
        style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}/>

      {STEPS.map((s, i) => {
        const done    = i <= currentIdx
        const current = i === currentIdx
        return (
          <div key={s.key} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              done
                ? current
                  ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                  : 'bg-brand-500 text-white'
                : 'bg-white text-ink-300 border-2 border-ink-200'
            }`}>
              <s.Icon size={18}/>
            </div>
            <span className={`text-xs font-bold ${done ? 'text-brand-600' : 'text-ink-400'}`}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${BASE}/orders/my`, { headers: authH() })
      .then(r => setOrders(r.data.orders || r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="h-8 w-48 bg-ink-100 rounded-xl animate-pulse mb-8"/>
      {[...Array(2)].map((_,i) => <div key={i} className="card h-56 animate-pulse bg-ink-100"/>)}
    </div>
  )

  if (orders.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-ink-50 flex items-center justify-center text-4xl mb-5">📦</div>
      <h2 className="text-2xl font-bold text-ink-900 mb-2">No orders yet</h2>
      <p className="text-ink-400 mb-8">Time to explore our shop!</p>
      <Link to="/shop" className="btn-primary px-8 py-3">Start Shopping</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-ink-900 mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map(o => (
          <div key={o._id} className="card overflow-hidden">
            {/* Order header */}
            <div className="flex flex-wrap justify-between items-center gap-4 p-5 sm:p-6 bg-ink-50 border-b border-ink-100">
              <div className="flex gap-6 flex-wrap">
                <div>
                  <p className="section-label mb-1">Order ID</p>
                  <p className="font-mono text-sm text-brand-600 font-bold">
                    #{o._id?.slice(-10).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="section-label mb-1">Placed on</p>
                  <p className="text-sm font-semibold text-ink-700">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="section-label mb-1">Total</p>
                  <p className="text-sm font-bold text-ink-900">₹{o.totalPrice?.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLE[o.orderStatus]}`}>
                  {o.orderStatus}
                </span>
                <Link to={`/orders/${o._id}`}
                  className="flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors">
                  Details <ChevronRight size={15}/>
                </Link>
              </div>
            </div>

            {/* Items preview */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-3">
                  {o.items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white bg-ink-50 shrink-0">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                      }
                    </div>
                  ))}
                  {o.items?.length > 3 && (
                    <div className="w-12 h-12 rounded-xl bg-ink-100 border-2 border-white flex items-center justify-center text-xs font-bold text-ink-500">
                      +{o.items.length - 3}
                    </div>
                  )}
                </div>
                <p className="text-sm text-ink-600 font-medium">
                  {o.items?.map(i => i.name).slice(0,2).join(', ')}
                  {o.items?.length > 2 ? ` and ${o.items.length - 2} more` : ''}
                </p>
              </div>

              {/* Status tracker */}
              <StatusTracker status={o.orderStatus}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
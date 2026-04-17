// src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit3, Trash2, Search, AlertCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('kf_token')}` })

export default function AdminProducts() {
  const navigate            = useNavigate()
  const [products, setProducts] = useState([])
  const [keyword,  setKeyword]  = useState('')
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${BASE}/products`, { headers: authH() })
      setProducts(data.products || data || [])
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    setDeleting(id)
    try {
      await axios.delete(`${BASE}/products/${id}`, { headers: authH() })
      setProducts(p => p.filter(x => x._id !== id))
      toast.success('Product deleted')
    } catch { toast.error('Delete failed') }
    finally { setDeleting(null) }
  }

  const filtered = products.filter(p =>
    !keyword || p.name?.toLowerCase().includes(keyword.toLowerCase())
  )

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
              Inventory
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">{filtered.length} products</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder="Search products…"
                className="input-dark pl-9 w-full"/>
            </div>
            <button onClick={() => navigate('/admin/products/new')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap">
              <Plus size={18}/> Add Product
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_,i) => <div key={i} className="h-72 bg-[#1e293b] rounded-3xl animate-pulse"/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertCircle size={48} className="text-slate-600 mb-4"/>
            <h3 className="text-xl font-bold text-white">No products found</h3>
            <p className="text-slate-500 mt-1">{keyword ? 'Try a different search' : 'Add your first product'}</p>
            <button onClick={() => navigate('/admin/products/new')}
              className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all">
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(p => (
              <div key={p._id} className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all">
                {/* Image */}
                <div className="relative h-44 bg-[#0f172a] overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent"/>
                  {/* Action buttons on hover */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigate(`/admin/products/${p._id}`)}
                      className="p-2 bg-white text-slate-900 rounded-lg shadow-xl hover:bg-slate-100 transition-colors">
                      <Edit3 size={14}/>
                    </button>
                    <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                      className="p-2 bg-red-500 text-white rounded-lg shadow-xl hover:bg-red-600 transition-colors disabled:opacity-50">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                  {/* Stock badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.stock > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="text-white font-bold text-sm truncate">{p.name}</h3>
                      <p className="text-slate-500 text-xs mt-0.5 font-mono">#{p._id?.slice(-6).toUpperCase()}</p>
                    </div>
                    <span className="text-emerald-400 font-black shrink-0">₹{p.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-slate-700/50 text-slate-400 rounded-lg text-xs font-semibold">
                      {p.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>⭐ {p.rating?.toFixed(1) || '0.0'}</span>
                      <span>🛒 {p.sold || 0} sold</span>
                    </div>
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
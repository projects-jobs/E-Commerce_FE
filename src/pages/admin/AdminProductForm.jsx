// src/pages/admin/AdminProductForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Save, X, Upload, Info, Tag, Layers, Plus, Trash2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE     = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const authH    = () => ({ Authorization: `Bearer ${localStorage.getItem('kf_token')}` })
const CATS     = ['Electronics','Clothing','Books','Home','Sports','Beauty','Toys','Food','Other']

export default function AdminProductForm() {
  const { id }         = useParams()
  const navigate       = useNavigate()
  const isEdit         = Boolean(id)

  const [form, setForm] = useState({
    name:'', description:'', price:'', originalPrice:'',
    category:'Electronics', brand:'', stock:'', featured: false, tags:'',
    images: [],
  })
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [imgInput, setImgInput] = useState('')

  useEffect(() => {
    if (!isEdit) return
    axios.get(`${BASE}/products/${id}`, { headers: authH() })
      .then(r => {
        const p = r.data.product || r.data
        setForm({
          name:          p.name || '',
          description:   p.description || '',
          price:         p.price || '',
          originalPrice: p.originalPrice || '',
          category:      p.category || 'Electronics',
          brand:         p.brand || '',
          stock:         p.stock || '',
          featured:      p.featured || false,
          tags:          p.tags?.join(', ') || '',
          images:        p.images || [],
        })
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setFetching(false))
  }, )

  const handle = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const addImage = () => {
    if (!imgInput.trim()) return
    setForm(f => ({ ...f, images: [...f.images, imgInput.trim()] }))
    setImgInput('')
  }

  const removeImage = (i) => setForm(f => ({ ...f, images: f.images.filter((_,idx) => idx !== i) }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        price:         Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock:         Number(form.stock),
        tags:          form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }
      if (isEdit) {
        await axios.put(`${BASE}/products/${id}`, payload, { headers: authH() })
        toast.success('Product updated!')
      } else {
        await axios.post(`${BASE}/products`, payload, { headers: authH() })
        toast.success('Product created!')
      }
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/products"
              className="p-2.5 bg-[#1e293b] rounded-xl text-slate-400 hover:text-white transition-colors">
              <X size={18}/>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily:'Syne,sans-serif' }}>
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {isEdit ? `Editing product ID: ${id?.slice(-8)}` : 'Fill in the details below to publish'}
              </p>
            </div>
          </div>
          <button onClick={submit} disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20">
            <Save size={18}/> {loading ? 'Saving…' : isEdit ? 'Update' : 'Publish'}
          </button>
        </header>

        <form onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ── Left: Main info ───────────────────────────────── */}
            <div className="md:col-span-2 space-y-6">

              {/* Basic info */}
              <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 space-y-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Info size={13}/> Product Information
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Product Name *
                  </label>
                  <input name="name" value={form.name} onChange={handle} required
                    placeholder="e.g. Sony WH-1000XM5 Headphones"
                    className="input-dark w-full"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Description *
                  </label>
                  <textarea name="description" value={form.description} onChange={handle} required
                    rows={5} placeholder="Write a compelling product description…"
                    className="input-dark w-full resize-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input name="tags" value={form.tags} onChange={handle}
                    placeholder="wireless, premium, noise-cancelling"
                    className="input-dark w-full"/>
                </div>
              </div>

              {/* Images */}
              <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                  <Upload size={13}/> Product Images (URLs)
                </h3>
                <div className="flex gap-2 mb-4">
                  <input value={imgInput} onChange={e => setImgInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    placeholder="https://example.com/image.jpg"
                    className="input-dark flex-1"/>
                  <button type="button" onClick={addImage}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
                    <Plus size={18}/>
                  </button>
                </div>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#0f172a] group">
                        <img src={url} alt="" className="w-full h-full object-cover" onError={e => e.currentTarget.src=''}/>
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={12}/>
                        </button>
                        {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded font-bold">Main</span>}
                      </div>
                    ))}
                  </div>
                )}
                {form.images.length === 0 && (
                  <div className="border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center text-slate-500 hover:border-indigo-500/50 transition-colors">
                    <Upload size={28} className="mx-auto mb-2 opacity-40"/>
                    <p className="text-sm">Paste image URLs above</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Settings ──────────────────────────────── */}
            <div className="space-y-6">

              {/* Pricing */}
              <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Pricing</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Sale Price (₹) *
                  </label>
                  <input name="price" type="number" value={form.price} onChange={handle} required min="0"
                    className="input-dark w-full font-bold"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Original Price (₹)
                  </label>
                  <input name="originalPrice" type="number" value={form.originalPrice} onChange={handle} min="0"
                    className="input-dark w-full"/>
                  <p className="text-xs text-slate-600 mt-1">Set higher than sale price to show discount</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Stock *
                  </label>
                  <input name="stock" type="number" value={form.stock} onChange={handle} required min="0"
                    className="input-dark w-full font-bold"/>
                </div>
              </div>

              {/* Categorization */}
              <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Layers size={12}/> Categorization
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Category *
                  </label>
                  <select name="category" value={form.category} onChange={handle}
                    className="input-dark w-full">
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <Tag size={11}/> Brand
                  </label>
                  <input name="brand" value={form.brand} onChange={handle}
                    placeholder="e.g. Sony, Nike, Apple"
                    className="input-dark w-full"/>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Settings</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handle}
                    className="w-4 h-4 accent-indigo-600 rounded"/>
                  <div>
                    <p className="text-white text-sm font-semibold">Featured Product</p>
                    <p className="text-slate-500 text-xs">Show on homepage featured section</p>
                  </div>
                </label>
              </div>

              {/* Info */}
              <div className="bg-indigo-600/10 p-4 rounded-2xl border border-indigo-500/20 flex items-start gap-3">
                <Info size={16} className="text-indigo-400 shrink-0 mt-0.5"/>
                <p className="text-xs text-indigo-300 leading-relaxed">
                  Once published, this product will immediately appear on the shop page for all customers.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
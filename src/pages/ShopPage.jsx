// src/pages/ShopPage.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { productAPI } from '../api'          // ✅ fixed: no /index suffix
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Food', 'Other']
const SORTS = [
  { value:'newest',     label:'Newest First'       },
  { value:'price-asc',  label:'Price: Low to High' },
  { value:'price-desc', label:'Price: High to Low' },
  { value:'rating',     label:'Top Rated'          },
  { value:'popular',    label:'Most Popular'       },
]

export default function ShopPage() {
  const [sp] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState(1)
  const [loading,  setLoading]  = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  const [filters, setFilters] = useState({
    keyword:  sp.get('search') || sp.get('keyword') || '',
    category: sp.get('category') || 'All',
    sort:     sp.get('sort')     || 'newest',
    minPrice: sp.get('minPrice') || '',
    maxPrice: sp.get('maxPrice') || '',
    page:     1,
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = { ...filters, limit: 12 }
        if (filters.category === 'All') delete params.category
        if (!params.keyword)  delete params.keyword
        if (!params.minPrice) delete params.minPrice
        if (!params.maxPrice) delete params.maxPrice
        const r = await productAPI.getAll(params)
        setProducts(r.data?.products || r.data || [])
        setTotal(r.data?.total   || 0)
        setPages(r.data?.pages   || 1)
      } catch { setProducts([]) }
      setLoading(false)
    }
    load()
  }, [filters])

  const setF = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }))

  return (
    <div className="min-h-screen bg-ink-50 flex">

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-ink-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto pt-16 lg:pt-0 ${showFilter ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-ink-100">
          <h3 className="font-bold text-ink-900 flex items-center gap-2">
            <SlidersHorizontal size={16}/> Filters
          </h3>
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-ink-100 text-ink-500" onClick={() => setShowFilter(false)}>
            <X size={16}/>
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto" style={{ height:'calc(100vh - 64px)' }}>
          {/* Search */}
          <div>
            <label className="section-label block mb-2">Search</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"/>
              <input value={filters.keyword} onChange={e => setF('keyword', e.target.value)}
                placeholder="Search products…" className="input pl-9 text-sm"/>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="section-label block mb-3">Category</label>
            <div className="space-y-0.5">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setF('category', c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.category === c
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-ink-600 hover:bg-ink-50'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="section-label block mb-2">Price Range (₹)</label>
            <div className="flex gap-2">
              <input type="number" value={filters.minPrice} onChange={e => setF('minPrice', e.target.value)}
                placeholder="Min" className="input text-sm"/>
              <input type="number" value={filters.maxPrice} onChange={e => setF('maxPrice', e.target.value)}
                placeholder="Max" className="input text-sm"/>
            </div>
          </div>

          <button
            onClick={() => setFilters({ keyword:'', category:'All', sort:'newest', minPrice:'', maxPrice:'', page:1 })}
            className="w-full btn-outline text-sm py-2.5">
            Clear All Filters
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {showFilter && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setShowFilter(false)}/>
      )}

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-ink-900">
              {filters.category === 'All' ? 'All Products' : filters.category}
            </h1>
            <p className="text-sm text-ink-400">{total} product{total !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="lg:hidden btn-outline py-2 px-3 text-sm flex items-center gap-2"
              onClick={() => setShowFilter(true)}>
              <SlidersHorizontal size={15}/> Filters
            </button>
            <select value={filters.sort} onChange={e => setF('sort', e.target.value)}
              className="input text-sm py-2 w-44">
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_,i) => <div key={i} className="card h-64 animate-pulse bg-ink-100"/>)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-ink-900">No products found</h3>
            <p className="text-ink-400 mt-1">Try adjusting your filters or search</p>
            <button onClick={() => setFilters({ keyword:'', category:'All', sort:'newest', minPrice:'', maxPrice:'', page:1 })}
              className="btn-primary mt-6">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10 flex-wrap">
                {[...Array(pages)].map((_,i) => (
                  <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                      filters.page === i + 1
                        ? 'bg-brand-500 text-white shadow-brand'
                        : 'bg-white text-ink-700 border border-ink-200 hover:border-brand-400 hover:text-brand-600'
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
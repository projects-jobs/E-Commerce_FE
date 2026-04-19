// src/pages/ShopPage.jsx
import { useState, useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { productAPI } from '../api'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All Products', 'Electronics', 'Clothing']

export default function ShopPage() {
  const [products,    setProducts]    = useState([])
  const [filtered,    setFiltered]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [category,    setCategory]    = useState('All Products')
  const [search,      setSearch]      = useState('')
  const [minPrice,    setMinPrice]    = useState('')
  const [maxPrice,    setMaxPrice]    = useState('')
  const [sortBy,      setSortBy]      = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch all products on mount
  useEffect(() => {
    productAPI.getAll()
      .then(r => {
        const data = r.data?.products || r.data || []
        setProducts(data)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  // Apply filters whenever dependencies change
  useEffect(() => {
    let result = [...products]

    // Category filter
    if (category !== 'All Products') {
      result = result.filter(p => p.category === category)
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }

    // Price filter
    if (minPrice !== '') result = result.filter(p => p.price >= Number(minPrice))
    if (maxPrice !== '') result = result.filter(p => p.price <= Number(maxPrice))

    // Sort
    switch (sortBy) {
      case 'newest':       result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      case 'price-asc':    result.sort((a, b) => a.price - b.price); break
      case 'price-desc':   result.sort((a, b) => b.price - a.price); break
      case 'rating':       result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break
      default: break
    }

    setFiltered(result)
  }, [products, category, search, minPrice, maxPrice, sortBy])

  const clearFilters = () => {
    setCategory('All Products')
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('newest')
  }

  const categoryEmoji = { 'All Products': '🛍️', Electronics: '📱', Clothing: '👕' }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen lg:h-auto overflow-y-auto
          w-64 bg-white border-r border-slate-100 shadow-sm flex-shrink-0
          transition-transform duration-300
          ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={16}/> Filters
              </h2>
              <button className="lg:hidden p-1 text-slate-400 hover:text-slate-900" onClick={() => setShowFilters(false)}>
                <X size={18}/>
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Search</p>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Category</p>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setShowFilters(false) }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                      category === cat
                        ? 'bg-orange-50 text-orange-600 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{categoryEmoji[cat]}</span>
                    {cat}
                    <span className="ml-auto text-xs text-slate-400">
                      {cat === 'All Products'
                        ? products.length
                        : products.filter(p => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Price Range (₹)</p>
              <div className="flex gap-2">
                <input
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value.replace(/\D/g, ''))}
                  placeholder="Min"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value.replace(/\D/g, ''))}
                  placeholder="Max"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-2.5 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Mobile filter overlay */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setShowFilters(false)}/>
        )}

        {/* ── Main Content ─────────────────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 min-w-0">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {category} &nbsp;
                <span className="text-slate-400 font-normal text-base">
                  {loading ? '...' : `${filtered.length} products`}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold"
              >
                <SlidersHorizontal size={15}/> Filters
              </button>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                  <div className="aspect-[4/3] bg-slate-100 animate-pulse"/>
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2"/>
                    <div className="h-4 bg-slate-100 rounded animate-pulse"/>
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"/>
                    <div className="h-8 bg-slate-100 rounded-xl animate-pulse mt-3"/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(product => (
                <ProductCard key={product._id} product={product}/>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-400 mb-6 text-sm">Try adjusting your filters or search term.</p>
              <button
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
// src/components/ProductCard.jsx
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/Cartcontext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const FALLBACKS = {
  Electronics: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  Clothing:    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  Other:       'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80',
}

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart()
  const { user }               = useAuth()
  const nav                    = useNavigate()

  const img      = product.images?.[0] || FALLBACKS[product.category] || FALLBACKS.Other
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('Please login to add items to cart')
      nav('/auth')
      return
    }
    if (!product.stock) {
      toast.error('Product is out of stock')
      return
    }
    try {
      await addToCart(product._id, 1)
      toast.success(`${product.name} added to cart!`)
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.currentTarget.src = FALLBACKS.Other }}
        />
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold shadow">
            -{discount}%
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow">
            ⭐ Featured
          </span>
        )}
        {!product.stock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="font-bold text-slate-500 text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-semibold text-orange-500 mb-1 uppercase tracking-wide">
          {product.brand || product.category}
        </p>
        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="text-amber-400 fill-amber-400"/>
            <span className="text-xs font-semibold text-slate-700">{product.rating?.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({product.numReviews})</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="font-bold text-slate-900 text-base">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through ml-1.5">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.stock || loading}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-sm"
          >
            <ShoppingCart size={13}/> Add
          </button>
        </div>
      </div>
    </Link>
  )
}
import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/Cartcontext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const FALLBACKS = {
  Electronics: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  Clothing:    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  Books:       'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  Home:        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80',
  Sports:      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80',
  Beauty:      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
  Toys:        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  Food:        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  Other:       'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80',
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user }      = useAuth()
  const nav           = useNavigate()

  const img = product.images?.[0] || FALLBACKS[product.category] || FALLBACKS.Other
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!user) { nav('/auth'); return }
    try {
      await addToCart(product._id, 1)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add')
    }
  }

  return (
    <Link to={`/product/${product._id}`}
      className="group card overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        <img src={img} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = FALLBACKS.Other }}
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 badge bg-red-500 text-white">-{discount}%</span>
        )}
        {!product.stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="badge bg-white text-ink-900">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-ink-400 font-medium mb-1">{product.brand || product.category}</p>
        <h3 className="font-semibold text-ink-900 text-sm leading-snug mb-2 line-clamp-2 flex-1">{product.name}</h3>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-ink-700">{product.rating}</span>
            <span className="text-xs text-ink-400">({product.numReviews})</span>
          </div>
        )}

        {/* Price + Button */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            <p className="font-bold text-ink-900">₹{product.price.toLocaleString()}</p>
            {product.originalPrice > product.price && (
              <p className="text-xs text-ink-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
            )}
          </div>
          <button onClick={handleAdd} disabled={!product.stock}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </Link>
  )
}
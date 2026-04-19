import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/Cartcontext'

export default function CartPage() {
  const { cart, updateItem, removeItem, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()
  const items = cart?.items || []

  const shipping = totalPrice > 999 ? 0 : 99
  const tax      = Math.round(totalPrice * 0.18)
  const total    = totalPrice + shipping + tax

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 rounded-3xl bg-orange-50 flex items-center justify-center text-5xl mb-6">🛒</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
      <p className="text-slate-400 mb-8">Looks like you haven't added anything yet.</p>
      <Link
        to="/shop"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
      >
        Browse Products
      </Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Continue Shopping
      </button>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Your Cart{' '}
        <span className="text-slate-400 font-normal text-xl">
          ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => {
            const p   = item.product
            const qty = item.quantity || 1
            if (!p) return null
            return (
              <div key={p._id || idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex gap-4 sm:gap-5">
                {/* Image */}
                <Link
                  to={`/product/${p._id}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-50 shrink-0"
                >
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
                  }
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <Link
                      to={`/product/${p._id}`}
                      className="font-semibold text-slate-900 hover:text-orange-600 transition-colors line-clamp-2 text-sm sm:text-base"
                    >
                      {p.name}
                    </Link>
                    <p className="font-bold text-slate-900 shrink-0 text-sm sm:text-base">
                      ₹{(p.price * qty).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">₹{p.price?.toLocaleString()} each</p>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => qty > 1 ? updateItem(p._id, qty - 1) : removeItem(p._id)}
                        className="px-3 py-1.5 hover:bg-slate-50 transition-colors text-slate-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1.5 font-semibold text-sm min-w-[2rem] text-center">{qty}</span>
                      <button
                        onClick={() => updateItem(p._id, qty + 1)}
                        disabled={qty >= p.stock}
                        className="px-3 py-1.5 hover:bg-slate-50 transition-colors text-slate-600 disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(p._id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <ShoppingBag size={18} className="text-orange-500" /> Order Summary
            </h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-orange-500 font-medium">
                  Add ₹{(999 - totalPrice).toLocaleString()} more for free shipping!
                </p>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span className="text-xl">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-base"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <span>🔒</span> Secure checkout — 256-bit SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
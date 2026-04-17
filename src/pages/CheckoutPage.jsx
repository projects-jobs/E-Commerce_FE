import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, ShieldCheck, Lock, ChevronRight, Truck } from 'lucide-react'
import { useCart } from '../context/Cartcontext'
import { useAuth } from '../context/AuthContext'
import { orderAPI } from '../api/index'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const { user }   = useAuth()
  const nav        = useNavigate()
  const [loading, setLoading] = useState(false)
  const [addr, setAddr] = useState({
    street: user?.address?.street || '',
    city:   user?.address?.city   || '',
    state:  user?.address?.state  || '',
    pincode:user?.address?.pincode|| '',
    country:'India',
  })

  const shipping = totalPrice > 999 ? 0 : 50
  const tax      = Math.round(totalPrice * 0.18)
  const grand    = totalPrice + shipping + tax

  const handlePay = async () => {
    if (!addr.street || !addr.city || !addr.state || !addr.pincode) {
      toast.error('Please fill shipping address'); return
    }
    if (!cart.items?.length) { toast.error('Your cart is empty'); return }

    setLoading(true)
    try {
      const items = cart.items.map(i => ({ product: i.product._id, quantity: i.quantity }))
      const { data } = await orderAPI.createRazorpay({ items, shippingAddress: addr })

      // Open Razorpay popup
      const rzp = new window.Razorpay({
        key:          data.key,
        amount:       data.amount * 100,
        currency:     'INR',
        name:         'E-Commerce',
        description:  'Purchase',
        order_id:     data.razorpayOrderId,
        prefill:      { name: user.name, email: user.email },
        theme:        { color: '#f97316' },
        handler: async (response) => {
          try {
            const verify = await orderAPI.verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              orderData:           data.orderData,
            })
            toast.success('Payment successful! Order confirmed ✅')
            await clearCart()
            nav(`/orders/${verify.data.order._id}`)
          } catch {
            toast.error('Payment verification failed')
          }
        },
        modal: { ondismiss: () => toast('Payment cancelled') },
      })
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment')
    } finally { setLoading(false) }
  }

  const inp = 'w-full bg-ink-100 border-none rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm'

  return (
    <div className="min-h-screen bg-ink-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">Checkout</h1>
            <p className="text-ink-500 mt-1">Complete your purchase securely</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-ink-100">
            <Lock size={16} className="text-emerald-500" />
            <span className="text-sm font-semibold text-ink-700">SSL Secured</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left */}
          <div className="lg:col-span-8 space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ink-100">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center">
                  <MapPin size={22} />
                </div>
                <h2 className="text-xl font-bold text-ink-900">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Street Address</label>
                  <input className={inp} placeholder="123 Main Street" value={addr.street}
                    onChange={e => setAddr(a => ({ ...a, street: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">City</label>
                  <input className={inp} placeholder="Chennai" value={addr.city}
                    onChange={e => setAddr(a => ({ ...a, city: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Pincode</label>
                  <input className={inp} placeholder="600001" value={addr.pincode}
                    onChange={e => setAddr(a => ({ ...a, pincode: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">State</label>
                  <input className={inp} placeholder="Tamil Nadu" value={addr.state}
                    onChange={e => setAddr(a => ({ ...a, state: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Country</label>
                  <input className={inp} disabled value="India" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ink-100">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center">
                  <CreditCard size={22} />
                </div>
                <h2 className="text-xl font-bold text-ink-900">Payment</h2>
              </div>
              <div className="flex items-center gap-4 bg-brand-50 border-2 border-brand-500 rounded-2xl p-5">
                <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                </div>
                <div>
                  <p className="font-semibold text-ink-900">Razorpay</p>
                  <p className="text-xs text-ink-400">UPI, Cards, Net Banking, Wallets</p>
                </div>
                <div className="ml-auto">
                  <ShieldCheck size={22} className="text-brand-500" />
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3 flex items-center gap-1.5">
                <Lock size={12} /> Your payment is processed securely by Razorpay. We never store card details.
              </p>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="bg-ink-900 rounded-3xl p-7 text-white shadow-2xl">
                <h3 className="text-lg font-bold mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6 max-h-52 overflow-y-auto">
                  {cart.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=80'} alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-ink-800 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product?.name}</p>
                        <p className="text-xs text-ink-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-ink-400">
                    <span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-ink-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-400 font-semibold' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-ink-400">
                    <span>GST (18%)</span><span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold text-brand-400">₹{grand.toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={handlePay} disabled={loading || !cart.items?.length}
                  className="mt-6 w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all group">
                  {loading ? 'Processing…' : (<>Pay ₹{grand.toLocaleString()} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>)}
                </button>

                <div className="mt-5 flex items-center gap-2 text-ink-500 text-xs">
                  <ShieldCheck size={15} />
                  <span>Secure checkout powered by Razorpay</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-ink-100 flex items-center gap-3">
                <Truck size={20} className="text-brand-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Free shipping over ₹999</p>
                  <p className="text-xs text-ink-400 mt-0.5">30-day easy returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
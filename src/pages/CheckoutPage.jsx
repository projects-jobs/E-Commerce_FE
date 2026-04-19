// src/pages/CheckoutPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, ShieldCheck, Lock, ChevronRight, Truck } from 'lucide-react'
import { useCart } from '../context/Cartcontext'
import { useAuth } from '../context/AuthContext'
import { orderAPI } from '../api'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const { user }   = useAuth()
  const nav        = useNavigate()
  const [loading, setLoading] = useState(false)
  const [addr, setAddr] = useState({
    street:  user?.address?.street  || '',
    city:    user?.address?.city    || '',
    state:   user?.address?.state   || '',
    pincode: user?.address?.pincode || '',
    country: 'India',
  })

  const shipping = totalPrice > 999 ? 0 : 50
  const tax      = Math.round(totalPrice * 0.18)
  const grand    = totalPrice + shipping + tax

  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve()
      const s = document.createElement('script')
      s.src = 'https://checkout.razorpay.com/v1/checkout.js'
      s.onload = resolve
      s.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
      document.body.appendChild(s)
    })

  const handlePay = async () => {
    if (!addr.street || !addr.city || !addr.state || !addr.pincode) {
      toast.error('Please fill all shipping address fields')
      return
    }
    if (!cart?.items?.length) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)
    try {
      // Step 1: Create Razorpay order on backend
      const items = cart.items.map(i => ({
        product:  i.product._id,
        quantity: i.quantity,
      }))

      const { data } = await orderAPI.createRazorpay({ items, shippingAddress: addr })

      if (!data.success) {
        toast.error(data.message || 'Failed to create order')
        setLoading(false)
        return
      }

      // Step 2: Load Razorpay SDK
      await loadRazorpayScript()

      // Step 3: Open Razorpay checkout
      const options = {
        key:         data.key || import.meta.env.VITE_RAZORPAY_KEY,
        amount:      data.amount * 100,   // Convert to paise
        currency:    'INR',
        name:        'E-Commerce',
        description: 'Order Payment',
        order_id:    data.razorpayOrderId,
        prefill: {
          name:    user?.name    || '',
          email:   user?.email   || '',
          contact: user?.phone   || '',
        },
        theme: { color: '#f97316' },
        handler: async (response) => {
          try {
            const { data: verifyData } = await orderAPI.verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              orderData:           data.orderData,
            })

            if (verifyData.success) {
              toast.success('Payment successful! Order confirmed ✅')
              await clearCart()
              nav(`/orders/${verifyData.order._id}`)
            } else {
              toast.error('Payment verification failed. Contact support.')
              setLoading(false)
            }
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed. Contact support.')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast('Payment cancelled', { icon: '⚠️' })
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error?.description || 'Please try again.'}`)
        setLoading(false)
      })
      rzp.open()

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to initiate payment')
      setLoading(false)
    }
  }

  const inp = 'w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all'

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            <p className="text-slate-500 text-sm mt-0.5">Complete your purchase securely</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <Lock size={14} className="text-emerald-500"/>
            <span className="text-xs font-semibold text-slate-700">SSL Secured</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Forms */}
          <div className="lg:col-span-8 space-y-5">

            {/* Shipping address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <MapPin size={20}/>
                </div>
                <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Street Address *</label>
                  <input className={inp} placeholder="123 Main Street, Apt 4B" value={addr.street}
                    onChange={e => setAddr(a => ({ ...a, street: e.target.value }))}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">City *</label>
                  <input className={inp} placeholder="Chennai" value={addr.city}
                    onChange={e => setAddr(a => ({ ...a, city: e.target.value }))}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pincode *</label>
                  <input className={inp} placeholder="600001" value={addr.pincode} maxLength={6}
                    onChange={e => setAddr(a => ({ ...a, pincode: e.target.value.replace(/\D/g,'') }))}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">State *</label>
                  <input className={inp} placeholder="Tamil Nadu" value={addr.state}
                    onChange={e => setAddr(a => ({ ...a, state: e.target.value }))}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Country</label>
                  <input className={`${inp} bg-slate-100 text-slate-500`} disabled value="India"/>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <CreditCard size={20}/>
                </div>
                <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
              </div>
              <div className="flex items-center gap-4 bg-orange-50 border-2 border-orange-400 rounded-xl p-4">
                <div className="w-5 h-5 rounded-full border-2 border-orange-400 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400"/>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">Razorpay</p>
                  <p className="text-xs text-slate-500">UPI, Cards, Net Banking, Wallets</p>
                </div>
                <ShieldCheck size={20} className="text-orange-500"/>
              </div>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
                <Lock size={11}/> Payments processed securely by Razorpay. We never store card details.
              </p>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl p-6 text-white shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                <h3 className="text-lg font-bold mb-5">Order Summary</h3>

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
                  {cart?.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=80'}
                        alt="" className="w-11 h-11 rounded-xl object-cover bg-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product?.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-400 font-semibold' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST (18%)</span><span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold text-orange-400">₹{grand.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={loading || !cart?.items?.length}
                  className="mt-5 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    <>Pay ₹{grand.toLocaleString()} <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform"/></>
                  )}
                </button>

                <p className="mt-4 flex items-center gap-2 text-slate-500 text-xs">
                  <ShieldCheck size={13}/> Secure checkout powered by Razorpay
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
                <Truck size={18} className="text-orange-500 shrink-0"/>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Free shipping over ₹999</p>
                  <p className="text-xs text-slate-400">30-day easy returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
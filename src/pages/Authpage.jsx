import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, Zap, Shield, RefreshCw, Headphones } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const { user, login, register, loading } = useAuth()
  const navigate = useNavigate()
  const [mode,   setMode]   = useState('login')
  const [form,   setForm]   = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [busy,   setBusy]   = useState(false)

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'login') {
        const u = await login(form.email, form.password)
        if (u) {
          toast.success(`Welcome back, ${u.name}!`)
          navigate(u.role === 'admin' ? '/admin' : '/')
        }
      } else {
        if (!form.name.trim()) { toast.error('Name is required'); setBusy(false); return }
        await register(form.name, form.email, form.password)
        navigate('/')
      }
    } catch {
      // errors already toasted inside login/register
    } finally {
      setBusy(false)
    }
  }

  const features = [
    { icon: '📦', label: 'Fast Delivery',   sub: '2-5 business days'    },
    { icon: '🔒', label: 'Secure Payment',  sub: '256-bit SSL encrypted' },
    { icon: '↩️', label: 'Easy Returns',    sub: '30-day return policy'  },
    { icon: '⭐', label: 'Top Rated',       sub: '4.8★ average rating'   },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <ShoppingCart size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">E-Commerce</span>
        </div>

        {/* Hero text */}
        <div className="relative">
          <h2 className="text-5xl font-bold text-white leading-tight mb-4">
            Shop smarter.<br />
            <span className="text-orange-400">Live better.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Thousands of products, unbeatable prices, delivered to your door.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {features.map(f => (
              <div key={f.label} className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{f.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-slate-600 text-sm">
          © {new Date().getFullYear()} E-Commerce. All rights reserved.
        </p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex w-14 h-14 bg-orange-500 rounded-2xl items-center justify-center mb-3 shadow-lg">
              <ShoppingCart size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">E-Commerce</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/60 border border-orange-100/50 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {mode === 'login' ? 'Welcome back 👋' : 'Create account'}
            </h2>
            <p className="text-sm text-slate-400 mb-7">
              {mode === 'login' ? 'Sign in to your account' : 'Join thousands of happy shoppers'}
            </p>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handle}
                    required
                    placeholder="John Doe"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={handle}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-semibold"
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={busy || loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all mt-2 text-base"
              >
                {busy ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}
                className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
              >
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Suppress unused import warnings — kept for potential future use
void Zap; void Shield; void RefreshCw; void Headphones
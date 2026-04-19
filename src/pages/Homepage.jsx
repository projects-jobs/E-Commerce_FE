import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, RefreshCw, Headphones, ShoppingCart } from 'lucide-react'
import { productAPI } from '../api/index'
import ProductCard from '../components/ProductCard'

const FEATURES = [
  { icon: <Zap size={20} />,        title: 'Fast Delivery',    desc: 'Get your order in 2-5 days'  },
  { icon: <Shield size={20} />,     title: 'Secure Payments',  desc: '100% safe & encrypted'       },
  { icon: <RefreshCw size={20} />,  title: 'Easy Returns',     desc: '30-day hassle-free returns'  },
  { icon: <Headphones size={20} />, title: '24/7 Support',     desc: 'Here when you need us'       },
]

const CATEGORIES = [
  {
    name:  'Electronics',
    icon:  '📱',
    desc:  'Latest gadgets & tech',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name:  'Clothing',
    icon:  '👗',
    desc:  'Fashion for everyone',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    color: 'from-pink-500 to-rose-600',
  },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    productAPI.getAll({ limit: 8, sort: 'newest' })
      .then(r => setFeatured(r.data?.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white">

      {/* HERO */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,#f97316 1px,transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Zap size={14} /> New arrivals every week
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Discover.<br />Shop.<br /><span className="text-orange-400">Enjoy.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Premium Electronics & Fashion — delivered fast, priced right.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/shop"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl text-base flex items-center gap-2 transition-colors"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/shop?category=Electronics"
                className="inline-flex items-center gap-2 border-2 border-slate-700 hover:border-orange-400 hover:text-orange-400 text-slate-300 font-semibold px-8 py-3.5 rounded-xl transition-all text-base"
              >
                Browse Electronics
              </Link>
            </div>
            <div className="flex gap-8 mt-12">
              {[['2K+', 'Products'], ['10K+', 'Customers'], ['4.8★', 'Rating']].map(([n, l]) => (
                <div key={l}>
                  <p className="text-2xl font-bold text-white">{n}</p>
                  <p className="text-sm text-slate-400">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES BAR */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
          {FEATURES.map(f => (
            <div key={f.title} className="flex items-center gap-3 p-5 md:p-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{f.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2 CATEGORY BANNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map(c => (
            <Link
              key={c.name}
              to={`/shop?category=${c.name}`}
              className="relative group overflow-hidden rounded-3xl h-56 flex items-end p-8 cursor-pointer"
            >
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.color} opacity-70`} />
              <div className="relative">
                <p className="text-3xl mb-1">{c.icon}</p>
                <h3 className="text-2xl font-bold text-white">{c.name}</h3>
                <p className="text-white/80 text-sm">{c.desc}</p>
              </div>
              <div className="relative ml-auto">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={18} className="text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-orange-500 text-sm font-semibold mb-1">🔥 Hot picks</p>
              <h2 className="text-2xl font-bold text-slate-900">Latest Products</h2>
            </div>
            <Link to="/shop" className="text-sm text-orange-500 font-semibold hover:text-orange-600 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingCart size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium text-lg">No products yet</p>
              <p className="text-slate-400 text-sm mt-1">Admin can add products from the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-orange-500 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Summer Sale is Live! 🎉</h2>
            <p className="text-orange-100 text-lg">Up to 60% off on select items. Limited time only.</p>
          </div>
          <Link
            to="/shop"
            className="relative shrink-0 bg-white text-orange-600 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50 transition-colors text-base flex items-center gap-2 shadow-lg"
          >
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
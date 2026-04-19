import { useState } from 'react'
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Heart,
  Share2,
  ChevronRight,
} from 'lucide-react'

const ProductPage = () => {
  const [selectedConfig, setSelectedConfig] = useState('Standard')
  const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000')

  const product = {
    name:          'Aura Noise Cancelling Headphones',
    brand:         'LuxeAudio',
    price:         299,
    originalPrice: 399,
    description:   'Experience sonic perfection. Our Aura series uses AI-driven noise cancellation to adapt to your environment in real-time. With a 40-hour battery life and memory foam cushions, comfort meets unparalleled sound quality.',
    rating:        4.8,
    numReviews:    128,
    stock:         15,
    tags:          ['Electronics', 'Premium', 'Wireless'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=1000',
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="p-6 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-slate-50">
        <button className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium font-mono uppercase tracking-widest">Back to Collection</span>
        </button>
        <div className="flex gap-4">
          <button className="p-2 rounded-full border border-slate-200 hover:bg-slate-50"><Share2 size={18} /></button>
          <button className="p-2 rounded-full border border-slate-200 hover:bg-slate-50"><Heart size={18} /></button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">

        {/* LEFT COLUMN: Gallery */}
        <div className="lg:w-1/2 p-6 lg:p-12">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-[2rem] overflow-hidden bg-slate-50 aspect-[4/5] shadow-2xl">
              <img
                src={mainImage}
                alt="Product"
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    mainImage === img ? 'border-indigo-600 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Info */}
        <div className="lg:w-1/2 p-6 lg:p-12 lg:border-l border-slate-100">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-100 text-[10px] font-black uppercase tracking-tighter rounded-full text-slate-500">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-5xl font-black text-slate-900 leading-tight mb-2 tracking-tighter">
              {product.name}
            </h1>
            <p className="text-lg text-slate-400 font-medium mb-6">Designed by {product.brand}</p>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-slate-900">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-slate-400 line-through text-sm font-medium">₹{product.originalPrice}</span>
                )}
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-slate-900 font-bold">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400 underline cursor-pointer">{product.numReviews} Reviews</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-8">{product.description}</p>

            {/* Configuration selection */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Select Configuration</h3>
              <div className="flex gap-3">
                {['Standard', 'Pro Max', 'Lite'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSelectedConfig(opt)}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
                      selectedConfig === opt
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                        : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Badge */}
            <div className={`mb-8 flex items-center gap-2 font-bold text-xs p-3 rounded-2xl w-fit ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? `In Stock: ${product.stock} units left` : 'Out of Stock'}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95">
                <ShoppingBag size={22} /> ADD TO CART
              </button>
              <button className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors">
                BUY IT NOW
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                <Truck size={20} className="text-indigo-600" />
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600">Free Express Delivery</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                <ShieldCheck size={20} className="text-indigo-600" />
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600">2 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <section className="max-w-7xl mx-auto p-12 mt-12 border-t border-slate-100">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-black italic tracking-tighter">THE FEEDBACK.</h2>
          <button className="text-indigo-600 font-bold flex items-center gap-1 group">
            View All Reviews <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(rev => (
            <div key={rev} className="bg-slate-50 p-8 rounded-[2rem]">
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-slate-700 font-medium mb-4 italic">
                "The sound quality is honestly better than the industry leaders. The design is just a bonus!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-200" />
                <span className="text-xs font-bold uppercase tracking-widest">User_{rev}29</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductPage
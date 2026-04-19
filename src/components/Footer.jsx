// src/components/Footer.jsx
import { Link } from 'react-router-dom'
import { ShoppingCart, Mail, Phone, MapPin, Shield, Truck, RefreshCw } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>

      {/* Trust bar */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-3 divide-x divide-white/8">
          {[
            { icon:<Truck size={18}/>,    label:'Free Shipping', sub:'Orders over ₹999' },
            { icon:<Shield size={18}/>,   label:'Secure Payment',sub:'Razorpay protected' },
            { icon:<RefreshCw size={18}/>,label:'Easy Returns',  sub:'30-day policy'     },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-3 px-4 sm:px-6 first:pl-0 last:pr-0">
              <div className="text-orange-400 shrink-0">{f.icon}</div>
              <div>
                <p className="text-white text-xs font-bold">{f.label}</p>
                <p className="text-slate-500 text-xs">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
                <ShoppingCart size={18} className="text-white"/>
              </div>
              <span className="text-white font-bold text-lg">E-Commerce</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-4">
              Your one-stop destination for premium products at unbeatable prices.
            </p>
          </div>

          {/* Shop — only Electronics and Clothing */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="text-slate-400 hover:text-orange-400 transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=Electronics" className="text-slate-400 hover:text-orange-400 transition-colors">Electronics</Link></li>
              <li><Link to="/shop?category=Clothing"    className="text-slate-400 hover:text-orange-400 transition-colors">Clothing</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Account</h4>
            <ul className="space-y-2.5 text-sm">
              {[['My Orders','/orders'],['Profile','/profile'],['Cart','/cart'],['Sign In','/auth']].map(([l,to]) => (
                <li key={l}><Link to={to} className="text-slate-400 hover:text-orange-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Mail size={14} className="text-orange-400 shrink-0"/> support@ecommerce.in</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-orange-400 shrink-0"/> +91 98765 43210</li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-orange-400 shrink-0"/> Chennai, India</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Payments secured by</span>
            <span className="text-white font-bold text-sm">Razorpay</span>
            <Shield size={14} className="text-green-400"/>
          </div>
        </div>
      </div>
    </footer>
  )
}
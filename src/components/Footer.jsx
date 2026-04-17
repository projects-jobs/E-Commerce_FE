import { Link } from 'react-router-dom'
import { ShoppingCart, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
                <ShoppingCart size={18} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">E-Commerce</span>
            </Link>
            <p className="text-sm leading-relaxed text-ink-400">
              Your one-stop destination for premium products at unbeatable prices.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              {['Electronics', 'Clothing', 'Home & Garden', 'Sports'].map(c => (
                <li key={c}><Link to={`/shop?category=${c}`} className="hover:text-brand-400 transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              {[['My Orders', '/orders'], ['Profile', '/profile'], ['Cart', '/cart'], ['Sign In', '/auth']].map(([l, to]) => (
                <li key={l}><Link to={to} className="hover:text-brand-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /> support@ecommerce.in</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Chennai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-ink-500">
          <p>© {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Payments secured by</span>
            <span className="text-white font-semibold">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
import React from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  Download,
  MessageSquare
} from 'lucide-react';

const OrderDetailPage = () => {
  // Mock data following your Order Schema structure
  const order = {
    _id: "ORD-8829-PX10",
    createdAt: "2024-03-15T10:30:00Z",
    orderStatus: "Shipped",
    items: [
      { name: "Aura Headphones", price: 299, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200" },
      { name: "Leather Carry Case", price: 45, quantity: 2, image: "https://images.unsplash.com/photo-1544816153-199d8bbbc197?q=80&w=200" }
    ],
    shippingAddress: {
      street: "450 Silicon Valley Blvd",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India"
    },
    itemsPrice: 389,
    taxPrice: 15,
    shippingPrice: 0,
    totalPrice: 404,
    statusHistory: [
      { status: "Shipped", updatedAt: "2024-03-16", note: "Package is with the carrier" },
      { status: "Processing", updatedAt: "2024-03-15", note: "Payment verified" },
      { status: "Pending", updatedAt: "2024-03-15", note: "Order received" }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Order Details</h1>
              <p className="text-slate-500 font-mono text-xs">{order._id}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50">
              <Download size={18} /> Invoice
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700">
              <MessageSquare size={18} /> Support
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Items & Tracking */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Order Items Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black italic mb-6 tracking-tighter">SHIPMENT CONTENT.</h2>
              <div className="divide-y divide-slate-50">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-6 flex items-center gap-6">
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover bg-slate-100" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-slate-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking History (From statusHistory Schema) */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black italic mb-8 tracking-tighter">TRACKING HISTORY.</h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-100">
                {order.statusHistory.map((history, idx) => (
                  <div key={idx} className="relative flex items-start gap-8">
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${idx === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {idx === 0 ? <Truck size={18} /> : <CheckCircle2 size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{history.status}</p>
                      <p className="text-sm text-slate-500 mb-1">{history.note}</p>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{history.updatedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Content: Logistics & Totals */}
          <div className="space-y-8">
            
            {/* Logistics Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="space-y-8">
                {/* Shipping info */}
                <div className="flex gap-4">
                  <div className="text-indigo-600"><MapPin size={24} /></div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Deliver To</h3>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed">
                      {order.shippingAddress.street},<br />
                      {order.shippingAddress.city}, {order.shippingAddress.pincode}<br />
                      {order.shippingAddress.state}, {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                {/* Date info */}
                <div className="flex gap-4">
                  <div className="text-indigo-600"><Calendar size={24} /></div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Estimated Arrival</h3>
                    <p className="text-sm font-bold text-slate-800">Friday, April 20, 2026</p>
                  </div>
                </div>

                {/* Payment info */}
                <div className="flex gap-4">
                  <div className="text-indigo-600"><CreditCard size={24} /></div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Payment</h3>
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Razorpay ID: #883921</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Totals Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
              <h3 className="text-lg font-black mb-6 italic tracking-tighter uppercase">Final Receipt.</h3>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-white/50">Subtotal</span>
                  <span>₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Shipping</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Tax (GST)</span>
                  <span>₹{order.taxPrice}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-white/50 font-black text-xs uppercase tracking-widest">Total Paid</span>
                  <span className="text-3xl font-black italic">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
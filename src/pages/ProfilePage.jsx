import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Bell, 
  //ShieldLock, 
  LogOut, 
  Camera, 
  Package, 
  Heart,
  Settings
} from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');

  // Example data based on your User Schema
  const user = {
    name: "Buvanesh Kumar",
    email: "buvanesh@example.com",
    phone: "+91 98765 43210",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    address: {
      street: "Main Street, Block 4",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001"
    },
    notifications: [
      { message: "Your order #ORD-8829 has been shipped!", read: false, createdAt: "2 hours ago" },
      { message: "Flash Sale starts in 1 hour!", read: true, createdAt: "1 day ago" }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section: Hero Profile */}
        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-slate-50 shadow-xl">
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{user.name}</h1>
              <p className="text-slate-500 font-medium">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">Premium Member</span>
                <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest">{user.role}</span>
              </div>
            </div>

            <div className="flex gap-4">
               <div className="text-center px-6 border-r border-slate-100">
                  <p className="text-2xl font-black italic">12</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Orders</p>
               </div>
               <div className="text-center px-6">
                  <p className="text-2xl font-black italic">4</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wishlist</p>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-4 space-y-4">
            {[
              { id: 'personal', icon: <User />, label: 'Personal Info' },
              { id: 'address', icon: <MapPin />, label: 'Addresses' },
              { id: 'notifications', icon: <Bell />, label: 'Notifications', badge: 1 },
              { id: 'security', icon: <ShieldLock />, label: 'Security' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-5 rounded-3xl font-bold transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                <div className="flex items-center gap-4">
                  {React.cloneElement(tab.icon, { size: 20 })}
                  <span>{tab.label}</span>
                </div>
                {tab.badge && <span className="w-5 h-5 bg-indigo-500 text-white text-[10px] flex items-center justify-center rounded-full">{tab.badge}</span>}
              </button>
            ))}
            
            <button className="w-full flex items-center gap-4 p-5 rounded-3xl font-bold text-red-500 hover:bg-red-50 transition-all mt-8">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Dynamic Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 min-h-[500px]">
              
              {activeTab === 'personal' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-xl font-black italic tracking-tighter uppercase">Edit Profile.</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                      <input type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
                      <input type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500" defaultValue={user.phone} />
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-colors">
                    Update Details
                  </button>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black italic tracking-tighter uppercase">My Addresses.</h2>
                    <button className="text-sm font-bold text-indigo-600">+ Add New</button>
                  </div>
                  <div className="p-6 border-2 border-indigo-100 bg-indigo-50/20 rounded-3xl relative">
                    <span className="absolute top-4 right-4 text-[10px] font-black bg-indigo-600 text-white px-2 py-1 rounded-md">DEFAULT</span>
                    <h3 className="font-bold text-slate-900 mb-2">Home Address</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {user.address.street}, {user.address.city}<br />
                      {user.address.state} - {user.address.pincode}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-black italic tracking-tighter uppercase mb-6">Activity.</h2>
                  {user.notifications.map((notif, i) => (
                    <div key={i} className={`p-5 rounded-2xl flex items-start gap-4 ${notif.read ? 'bg-slate-50 opacity-60' : 'bg-white border border-slate-100 shadow-sm'}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 ${notif.read ? 'bg-slate-300' : 'bg-indigo-500'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{notif.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
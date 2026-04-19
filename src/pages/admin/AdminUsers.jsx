import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, UserX, Search, Mail, Phone } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const BASE  = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('ec_token')}` })

export default function AdminUsers() {
  const { user: me }              = useAuth()
  const [users,   setUsers]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [keyword, setKeyword]     = useState('')

  useEffect(() => {
    axios.get(`${BASE}/admin/users`, { headers: authH() })
      .then(r => setUsers(r.data.users || r.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!confirm(`Change role to ${newRole}?`)) return
    try {
      await axios.put(`${BASE}/admin/users/${id}`, { role: newRole }, { headers: authH() })
      setUsers(u => u.map(x => x._id === id ? { ...x, role: newRole } : x))
      toast.success(`Role updated to ${newRole}`)
    } catch {
      toast.error('Update failed')
    }
  }

  const toggleStatus = async (id, isActive) => {
    if (!confirm(`${isActive ? 'Deactivate' : 'Activate'} this user?`)) return
    try {
      await axios.put(`${BASE}/admin/users/${id}`, { isActive: !isActive }, { headers: authH() })
      setUsers(u => u.map(x => x._id === id ? { ...x, isActive: !isActive } : x))
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`)
    } catch {
      toast.error('Update failed')
    }
  }

  const filtered = users.filter(u =>
    !keyword ||
    u.name?.toLowerCase().includes(keyword.toLowerCase()) ||
    u.email?.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <Link to="/admin" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors mb-1 inline-block">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight">Users</h1>
            <p className="text-slate-400 text-sm mt-0.5">{users.length} registered</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 pl-9 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs font-black uppercase tracking-widest">
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left hidden md:table-cell">Contact</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left hidden sm:table-cell">Status</th>
                <th className="px-6 py-4 text-left hidden lg:table-cell">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3 bg-slate-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No users found</td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Avatar + name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 ${u.role === 'admin' ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{u.name}</p>
                          <p className="text-xs text-slate-500 md:hidden">{u.email}</p>
                        </div>
                        {u._id === me?._id && (
                          <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-xs font-bold">You</span>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail size={11} /> {u.email}
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Phone size={11} /> {u.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                        u.role === 'admin'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          : 'bg-slate-700/50 text-slate-400 border-slate-700'
                      }`}>
                        {u.role === 'admin' ? '👑 Admin' : 'User'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${u.isActive !== false ? 'text-emerald-400' : 'text-red-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${u.isActive !== false ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-xs text-slate-500 hidden lg:table-cell">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        {u._id !== me?._id && (
                          <>
                            <button
                              onClick={() => toggleRole(u._id, u.role)}
                              title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                              className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                            >
                              <Shield size={15} />
                            </button>
                            <button
                              onClick={() => toggleStatus(u._id, u.isActive !== false)}
                              title={u.isActive !== false ? 'Deactivate' : 'Activate'}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <UserX size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
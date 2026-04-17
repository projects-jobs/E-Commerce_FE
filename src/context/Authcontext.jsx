// eslint-disable-next-line react-refresh/only-export-components
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kf_user')) || null }
    catch { return null }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('kf_token')
    if (token && !user) {
      axios.get(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setUser(r.data.user))
        .catch(() => logout())
    }
  }, [])

  const saveSession = (token, userObj) => {
    localStorage.setItem('kf_token', token)
    localStorage.setItem('kf_user', JSON.stringify(userObj))
    setUser(userObj)
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${BASE}/auth/login`, { email, password })
      saveSession(data.token, data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      return data.user
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed')
    }
    finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${BASE}/auth/register`, { name, email, password })
      saveSession(data.token, data.user)
      toast.success('Account created! Welcome to Kartify 🎉')
      return data.user
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('kf_token')
    localStorage.removeItem('kf_user')
    setUser(null)
    toast('Logged out', { icon: '👋' })
  }

  const updateUser = (u) => {
    const merged = { ...user, ...u }
    localStorage.setItem('kf_user', JSON.stringify(merged))
    setUser(merged)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
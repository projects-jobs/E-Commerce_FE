// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/index'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('ec_user')) || null }
    catch { return null }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('ec_token')
    if (token && !user) {
      authAPI.me()
        .then(r => saveSession(r.data.token || token, r.data.user))
        .catch(() => logout())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveSession = (token, userObj) => {
    localStorage.setItem('ec_token', token)
    localStorage.setItem('ec_user',  JSON.stringify(userObj))
    setUser(userObj)
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, password })
      saveSession(data.token, data.user)
      toast.success(`Welcome back, ${data.user.name}! 👋`)
      return data.user
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const { data } = await authAPI.register({ name, email, password })
      saveSession(data.token, data.user)
      toast.success('Account created! Welcome 🎉')
      return data.user
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('ec_token')
    localStorage.removeItem('ec_user')
    setUser(null)
    toast('Logged out', { icon: '👋' })
  }

  const updateUser = (u) => {
    const merged = { ...user, ...u }
    localStorage.setItem('ec_user', JSON.stringify(merged))
    setUser(merged)
  }

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout, updateUser,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
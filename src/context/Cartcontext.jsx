// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const CartContext = createContext(null)

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('kf_token')}` })

export function CartProvider({ children }) {
  const { user }    = useAuth()
  const [cart,      setCart]      = useState({ items: [] })
  const [loading,   setLoading]   = useState(false)

  useEffect(() => {
    if (user) fetchCart()
    else      setCart({ items: [] })
  }, [user])

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`${BASE}/cart`, { headers: authHeader() })
      setCart(data.cart || { items: [] })
    } catch { setCart({ items: [] }) }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please sign in first'); return }
    setLoading(true)
    try {
      const { data } = await axios.post(`${BASE}/cart/add`, { productId, quantity }, { headers: authHeader() })
      setCart(data.cart)
      toast.success('Added to cart!')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add')
    } finally { setLoading(false) }
  }

  const updateItem = async (productId, quantity) => {
    try {
      const { data } = await axios.put(`${BASE}/cart/update`, { productId, quantity }, { headers: authHeader() })
      setCart(data.cart)
    } catch { toast.error('Update failed') }
  }

  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete(`${BASE}/cart/${productId}`, { headers: authHeader() })
      setCart(data.cart)
      toast.success('Removed')
    } catch { toast.error('Remove failed') }
  }

  const clearCart = async () => {
    try {
      await axios.delete(`${BASE}/cart/clear`, { headers: authHeader() })
      setCart({ items: [] })
    } catch { toast.error('Failed to clear cart') }
  }

  const totalItems = cart.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0
  const totalPrice = cart.items?.reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 1), 0) || 0

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, clearCart, fetchCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

// ✅ FIX: eslint-disable suppresses the react-refresh/only-export-components warning
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
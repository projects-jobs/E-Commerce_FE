import { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user }   = useAuth()
  const [cart,     setCart]    = useState({ items: [] })
  const [loading,  setLoading] = useState(false)

  useEffect(() => {
    if (user) fetchCart()
    else      setCart({ items: [] })
  }, [user])

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.get()
      setCart(data.cart || { items: [] })
    } catch { setCart({ items: [] }) }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please sign in first'); return }
    setLoading(true)
    try {
      const { data } = await cartAPI.add({ productId, quantity })
      setCart(data.cart)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add to cart')
    } finally { setLoading(false) }
  }

  const updateItem = async (productId, quantity) => {
    try {
      const { data } = await cartAPI.update(productId, quantity)
      setCart(data.cart)
    } catch { toast.error('Update failed') }
  }

  const removeItem = async (productId) => {
    try {
      const { data } = await cartAPI.remove(productId)
      setCart(data.cart)
      toast.success('Removed from cart')
    } catch { toast.error('Remove failed') }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clear()
      setCart({ items: [] })
    } catch { toast.error('Clear cart failed') }
  }

  const totalItems = cart.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0
  const totalPrice = cart.items?.reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 1), 0) || 0

  return (
    <CartContext.Provider value={{
      cart, loading, fetchCart,
      addToCart, updateItem, removeItem, clearCart,
      totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
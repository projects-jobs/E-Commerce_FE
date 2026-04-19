// src/api/index.js
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL:         BASE,
  withCredentials: true,
  headers:         { 'Content-Type': 'application/json' },
})

// Attach JWT automatically
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ec_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (d) => api.post('/auth/register', d),
  login:    (d) => api.post('/auth/login',    d),
  logout:   ()  => api.post('/auth/logout'),
  me:       ()  => api.get('/auth/me'),
  update:   (d) => api.put('/auth/update', d),
}

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:      (params) => api.get('/products',               { params }),
  getOne:      (id)     => api.get(`/products/${id}`),
  getFeatured: ()       => api.get('/products',               { params: { featured: true, limit: 8 } }),
  review:      (id, d)  => api.post(`/products/${id}/review`, d),
  // Admin
  adminGetAll: ()       => api.get('/admin/products'),
  create:      (d)      => api.post('/products',              d),
  update:      (id, d)  => api.put(`/products/${id}`,         d),
  delete:      (id)     => api.delete(`/products/${id}`),
}

// ── CART ──────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:    ()           => api.get('/cart'),
  add:    (d)          => api.post('/cart/add',    d),
  update: (pId, qty)   => api.put(`/cart/${pId}`,  { quantity: qty }),
  remove: (pId)        => api.delete(`/cart/${pId}`),
  clear:  ()           => api.delete('/cart/clear'),
}

// ── ORDERS ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  // Must match backend routes: POST /orders/razorpay, POST /orders/verify
  createRazorpay: (d)      => api.post('/orders/razorpay',        d),
  verifyPayment:  (d)      => api.post('/orders/verify',          d),
  getMyOrders:    ()       => api.get('/orders/my'),
  getOne:         (id)     => api.get(`/orders/${id}`),
  // Admin
  getAll:         (params) => api.get('/orders',                  { params }),
  updateStatus:   (id, d)  => api.put(`/orders/${id}/status`,     d),
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: ()      => api.get('/admin/dashboard'),
  getUsers:     ()      => api.get('/admin/users'),
  updateUser:   (id, d) => api.put(`/admin/users/${id}`, d),
  deleteUser:   (id)    => api.delete(`/admin/users/${id}`),
}

export default api
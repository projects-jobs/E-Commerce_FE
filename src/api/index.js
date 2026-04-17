import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL: BASE })

// Attach token automatically
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Auth
export const authAPI = {
  register: (d)  => api.post('/auth/register', d),
  login:    (d)  => api.post('/auth/login', d),
  getMe:    ()   => api.get('/auth/me'),
  updateProfile: (d) => api.put('/auth/update-profile', d),
  changePassword:(d) => api.put('/auth/change-password', d),
}

// Products
export const productAPI = {
  getAll:  (params) => api.get('/products', { params }),
  getOne:  (id)     => api.get(`/products/${id}`),
  addReview:(id, d) => api.post(`/products/${id}/review`, d),
  // Admin
  adminAll:()       => api.get('/products/admin/all'),
  create:  (d)      => api.post('/products', d),
  update:  (id, d)  => api.put(`/products/${id}`, d),
  remove:  (id)     => api.delete(`/products/${id}`),
}

// Cart
export const cartAPI = {
  get:    ()         => api.get('/cart'),
  add:    (d)        => api.post('/cart', d),
  update: (pid, d)   => api.put(`/cart/${pid}`, d),
  remove: (pid)      => api.delete(`/cart/${pid}`),
  clear:  ()         => api.delete('/cart'),
}

// Orders
export const orderAPI = {
  createRazorpay: (d)    => api.post('/orders/create-razorpay-order', d),
  verifyPayment:  (d)    => api.post('/orders/verify-payment', d),
  myOrders:       ()     => api.get('/orders/my'),
  getOne:         (id)   => api.get(`/orders/${id}`),
  // Admin
  adminAll:       (p)    => api.get('/orders/all', { params: p }),
  stats:          ()     => api.get('/orders/stats'),
  updateStatus:   (id,d) => api.put(`/orders/${id}/status`, d),
}

// Admin users
export const adminAPI = {
  users:      ()     => api.get('/admin/users'),
  updateUser: (id,d) => api.put(`/admin/users/${id}`, d),
  deleteUser: (id)   => api.delete(`/admin/users/${id}`),
}

export default api
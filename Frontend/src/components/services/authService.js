import api from './api'

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
}

export default authService

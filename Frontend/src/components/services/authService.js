import api from './api'

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Register error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      }
    }
  },

  // Verify OTP — sends userId + otp
  verifyOTP: async (userId, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { userId, otp })
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Verify OTP error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid OTP. Please try again.' 
      }
    }
  },

  resendOTP: async (email) => {
    try {
      const response = await api.post('/auth/resend-otp', { email })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Resend OTP error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to resend OTP. Please try again.' 
      }
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid email or password.' 
      }
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { success: true }
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  getMe: async () => {
    try {
      const response = await api.get('/auth/me')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('GetMe error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch user data.' 
      }
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Password Reset Methods
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/password-reset/request', { email })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Request reset error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send reset code. Please try again.' 
      }
    }
  },

  verifyResetOTP: async (email, otp) => {
    try {
      const response = await api.post('/password-reset/verify-otp', { email, otp })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Verify reset OTP error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid or expired OTP.' 
      }
    }
  },

  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await api.post('/password-reset/reset', { email, otp, newPassword })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Reset password error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to reset password.' 
      }
    }
  }
}

export default authService
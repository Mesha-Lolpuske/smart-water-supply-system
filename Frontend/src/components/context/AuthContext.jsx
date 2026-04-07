import { createContext, useState, useEffect } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          // Verify token with backend and get fresh user data
          const result = await authService.getMe()
          if (result.success) {
            setUser(result.data.user)
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(result.data.user))
          } else {
            // If API call fails, try using cached data but still consider it valid if token exists
            const cachedUser = authService.getCurrentUser()
            if (cachedUser) {
              setUser(cachedUser)
            } else {
              throw new Error('No user data available')
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      
      // Save token and user
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setUser(response.data.user)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      
      return { 
        success: true, 
        data: response.data,
        message: 'Registration successful! Please verify your email.' 
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      }
    }
  }

  // Verify OTP function
  const verifyOTP = async (email, otp) => {
    try {
      const response = await authService.verifyOTP(email, otp)
      
      // Save token and user after verification
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setUser(response.data.user)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('OTP verification failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid OTP. Please try again.' 
      }
    }
  }

  // Logout function
  const logout = () => {
    authService.logout()
    setUser(null)
    window.location.href = '/login'
  }

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email)
      return { 
        success: true, 
        message: response.data.message || 'Password reset link sent to your email.' 
      }
    } catch (error) {
      console.error('Forgot password failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send reset link.' 
      }
    }
  }

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      const response = await authService.resetPassword(token, password)
      return { 
        success: true, 
        message: response.data.message || 'Password reset successful!' 
      }
    } catch (error) {
      console.error('Reset password failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to reset password.' 
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    verifyOTP,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTechnician: user?.role === 'technician',
    isStaff: user?.role === 'admin' || user?.role === 'technician',
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-b-4 rounded-full animate-spin border-sky-500"></div>
          <p className="text-lg font-semibold text-blue-950">Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Will handle login API call later
    console.log('Login:', formData)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800">
      {/* Back to Home */}
      <div className="px-8 py-5">
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium transition text-sky-300 hover:text-sky-200"
        >
          ← Back to Home
        </button>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-lg bg-gradient-to-br from-sky-300 to-sky-400 shadow-sky-400/50">
              <span className="text-4xl">💧</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-blue-200">Sign in to your AquaTrack account</p>
          </div>

          {/* Form Card */}
          <div className="p-8 border-2 rounded-2xl bg-gradient-to-br from-blue-800/80 to-blue-900/80 border-sky-400/30 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    className="w-full py-3 pl-10 pr-4 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    className="w-full py-3 pl-10 pr-12 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-blue-300 right-3 top-3.5 hover:text-sky-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-sky-400/30 bg-white/10"
                  />
                  <span className="text-sm text-blue-200">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm font-medium transition text-sky-300 hover:text-sky-200"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 font-bold transition-all duration-300 rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-2xl hover:shadow-sky-400/50"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-sky-400/30"></div>
              <span className="text-sm text-blue-300">or</span>
              <div className="flex-1 h-px bg-sky-400/30"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-blue-200">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="font-semibold transition text-sky-300 hover:text-sky-200"
                >
                  Sign up now
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
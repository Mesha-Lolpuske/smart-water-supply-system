import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, MapPin, Eye, EyeOff } from 'lucide-react'

function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters!')
      return
    }
    
    // Will handle register API call later
    console.log('Register:', formData)
    
    // Navigate to OTP verification
    navigate('/verify-otp', { state: { email: formData.email } })
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

      {/* Register Form */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-lg bg-gradient-to-br from-sky-300 to-sky-400 shadow-sky-400/50">
              <span className="text-4xl">💧</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Create Account</h1>
            <p className="text-blue-200">Join AquaTrack community today</p>
          </div>

          {/* Form Card */}
          <div className="p-8 border-2 rounded-2xl bg-gradient-to-br from-blue-800/80 to-blue-900/80 border-sky-400/30 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full py-3 pl-10 pr-4 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

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

              {/* Address */}
              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="123 Main Street, Nairobi"
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
                    placeholder="At least 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Re-enter your password"
                    className="w-full py-3 pl-10 pr-12 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute text-blue-300 right-3 top-3.5 hover:text-sky-300"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 rounded border-sky-400/30 bg-white/10"
                />
                <label className="text-sm text-blue-200">
                  I agree to the{' '}
                  <a href="#" className="font-semibold transition text-sky-300 hover:text-sky-200">
                    Terms & Conditions
                  </a>
                  {' '}and{' '}
                  <a href="#" className="font-semibold transition text-sky-300 hover:text-sky-200">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 font-bold transition-all duration-300 rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-2xl hover:shadow-sky-400/50"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-sky-400/30"></div>
              <span className="text-sm text-blue-300">or</span>
              <div className="flex-1 h-px bg-sky-400/30"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-blue-200">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-semibold transition text-sky-300 hover:text-sky-200"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
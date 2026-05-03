import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, MapPin, Map, Eye, EyeOff, Phone } from 'lucide-react' // Added Map icon
import authService from '../../services/authService'
import { validatePassword } from '../../utils/validation'
import { PasswordStrengthBar } from '../../utils/PasswordStrengthBar'

function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    supplyArea: '', // 1. Added supplyArea to state
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      setLoading(false)
      return
    }

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }
    
    console.log('🚀 Registering user...')
    
    // 2. Included supplyArea in the API payload
    const result = await authService.register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address,
      supplyArea: formData.supplyArea 
    })
    
    console.log('📡 Response:', result)
    
    if (result.success) {
      console.log('✅ Success! Check your email and phone for OTP')
      navigate('/verify-otp', { 
        state: { 
          userId: result.data.userId,
          email: formData.email,
          phone: formData.phone
        } 
      })
    } else {
      console.error('❌ Error:', result.error)
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800">
      <div className="px-8 py-5">
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium transition text-sky-300 hover:text-sky-200"
        >
          ← Back to Home
        </button>
      </div>

      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-lg bg-gradient-to-br from-sky-300 to-sky-400 shadow-sky-400/50">
              <span className="text-4xl">💧</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Create Account</h1>
            <p className="text-blue-200">Join AquaTrack community today</p>
          </div>

          <div className="p-8 border-2 rounded-2xl bg-gradient-to-br from-blue-800/80 to-blue-900/80 border-sky-400/30 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {error && (
                <div className="p-3 text-sm text-red-100 border rounded-lg bg-red-500/20 border-red-400/30">
                  {error}
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">Full Name</label>
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

              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    className="w-full py-3 pl-10 pr-4 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="0712345678 or +254712345678"
                    className="w-full py-3 pl-10 pr-4 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">Specific Address</label>
                <div className="relative">
                  <MapPin className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="e.g. Njokerio, Plot 45 or Near Post Office"
                    className="w-full py-3 pl-10 pr-4 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* 3. New Supply Area Dropdown */}
              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">Water Supply Area</label>
                <div className="relative">
                  <Map className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <select
                    required
                    value={formData.supplyArea}
                    onChange={(e) => setFormData({...formData, supplyArea: e.target.value})}
                    className="w-full py-3 pl-10 pr-4 text-white transition border rounded-lg appearance-none bg-blue-900/50 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  >
                    <option value="" disabled className="text-gray-400">-- Select Njoro Area --</option>
                    <option value="Njoro Center" className="text-blue-900 bg-white">Njoro Center</option>
                    <option value="Egerton University Area" className="text-blue-900 bg-white">Egerton University Area</option>
                    <option value="Kihingo Ward" className="text-blue-900 bg-white">Kihingo Ward</option>
                    <option value="Lare Ward" className="text-blue-900 bg-white">Lare Ward</option>
                    <option value="Nesuit" className="text-blue-900 bg-white">Nesuit</option>
                    <option value="Mau Narok" className="text-blue-900 bg-white">Mau Narok</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">Password</label>
                <div className="relative">
                  <Lock className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="At least 8 characters"
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
                <PasswordStrengthBar password={formData.password} />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">Confirm Password</label>
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
                {formData.confirmPassword && (
                  formData.password === formData.confirmPassword
                    ? <p className="mt-1.5 text-xs text-emerald-400">✓ Passwords match</p>
                    : <p className="mt-1.5 text-xs text-red-400">✗ Passwords do not match</p>
                )}
              </div>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-bold transition-all duration-300 rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-2xl hover:shadow-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-sky-400/30"></div>
              <span className="text-sm text-blue-300">or</span>
              <div className="flex-1 h-px bg-sky-400/30"></div>
            </div>

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
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Eye, EyeOff, Key } from 'lucide-react'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (formData.otp.length !== 6) {
      alert('Please enter a valid 6-digit code')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!')
      return
    }
    
    // Will handle reset password API call later
    console.log('Reset password:', { email, ...formData })
    
    // Show success and navigate to login
    alert('Password reset successful!')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800">
      {/* Back button */}
      <div className="px-8 py-5">
        <button
          onClick={() => navigate('/forgot-password')}
          className="text-sm font-medium transition text-sky-300 hover:text-sky-200"
        >
          ← Back
        </button>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-lg bg-gradient-to-br from-sky-300 to-sky-400 shadow-sky-400/50">
              <Key className="text-blue-950" size={32} />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Reset Password</h1>
            <p className="text-blue-200">
              Enter the code sent to
            </p>
            <p className="font-semibold text-sky-300">{email}</p>
          </div>

          {/* Form Card */}
          <div className="p-8 border-2 rounded-2xl bg-gradient-to-br from-blue-800/80 to-blue-900/80 border-sky-400/30 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* OTP Code */}
              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">
                  Verification Code
                </label>
                <div className="relative">
                  <Key className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                    placeholder="Enter 6-digit code"
                    className="w-full py-3 pl-10 pr-4 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
                  />
                </div>
                <p className="mt-1 text-xs text-blue-300">
                  Check your email for the code
                </p>
              </div>

              {/* New Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    placeholder="At least 6 characters"
                    className="w-full py-3 pl-10 pr-12 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
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

              {/* Confirm New Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-sky-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute text-blue-300 left-3 top-3.5" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Re-enter your password"
                    className="w-full py-3 pl-10 pr-12 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
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

              {/* Password Requirements */}
              <div className="p-3 border rounded-lg bg-blue-900/30 border-sky-400/20">
                <p className="mb-2 text-xs font-semibold text-sky-300">Password must contain:</p>
                <ul className="space-y-1 text-xs text-blue-200">
                  <li className="flex items-center gap-2">
                    <span className={formData.newPassword.length >= 6 ? "text-green-400" : "text-blue-300"}>
                      {formData.newPassword.length >= 6 ? "✓" : "○"}
                    </span>
                    At least 6 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={formData.newPassword === formData.confirmPassword && formData.confirmPassword ? "text-green-400" : "text-blue-300"}>
                      {formData.newPassword === formData.confirmPassword && formData.confirmPassword ? "✓" : "○"}
                    </span>
                    Passwords match
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 font-bold transition-all duration-300 rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-2xl hover:shadow-sky-400/50"
              >
                Reset Password
              </button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center">
              <p className="text-sm text-blue-200">
                Didn't receive the code?{' '}
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="font-semibold transition text-sky-300 hover:text-sky-200"
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
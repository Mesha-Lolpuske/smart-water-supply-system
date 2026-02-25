import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Will handle forgot password API call later
    console.log('Request password reset for:', email)
    
    // Show success message
    setIsSubmitted(true)
    
    // Navigate to reset password page after 2 seconds
    setTimeout(() => {
      navigate('/reset-password', { state: { email } })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800">
      {/* Back button */}
      <div className="px-8 py-5">
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-medium transition text-sky-300 hover:text-sky-200"
        >
          ← Back to Login
        </button>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-lg bg-gradient-to-br from-sky-300 to-sky-400 shadow-sky-400/50">
              <Mail className="text-blue-950" size={32} />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Forgot Password?</h1>
            <p className="text-blue-200">
              No worries! Enter your email and we'll send you a reset code
            </p>
          </div>

          {/* Form Card */}
          <div className="p-8 border-2 rounded-2xl bg-gradient-to-br from-blue-800/80 to-blue-900/80 border-sky-400/30 backdrop-blur">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-sky-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute text-blue-300 left-3 top-3.5" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full py-3 pl-10 pr-4 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 font-bold transition-all duration-300 rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-2xl hover:shadow-sky-400/50"
                >
                  Send Reset Code
                </button>
              </form>
            ) : (
              // Success Message
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-500/20">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Check Your Email!</h3>
                <p className="mb-4 text-blue-200">
                  We've sent a password reset code to
                </p>
                <p className="mb-6 font-semibold text-sky-300">{email}</p>
                <p className="text-sm text-blue-300">
                  Redirecting to reset password page...
                </p>
              </div>
            )}

            {/* Back to Login */}
            {!isSubmitted && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition text-sky-300 hover:text-sky-200"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
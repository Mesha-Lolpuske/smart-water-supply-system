import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, RefreshCw } from 'lucide-react'
import authService from '../../services/authService'

function VerifyOTPPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const userId = location.state?.userId || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(600)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (timer <= 0) return

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const canResend = timer === 0

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = pastedData.split('')
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])
    
    const nextEmptyIndex = newOtp.length
    if (nextEmptyIndex < 6) {
      document.getElementById(`otp-${nextEmptyIndex}`)?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      setLoading(false)
      return
    }

    console.log('🚀 Verifying OTP...')
    
    const result = await authService.verifyOTP(userId, otpCode)
    
    console.log('📡 Response:', result)
    
    if (result.success) {
      console.log('✅ OTP verified! Redirecting to login...')
      navigate('/login')
    } else {
      console.error('❌ Error:', result.error)
      setError(result.error)
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    }
    
    setLoading(false)
  }

  const handleResend = async () => {
    setError('')
    console.log('🚀 Resending OTP...')
    
    const result = await authService.resendOTP(email)
    
    console.log('📡 Response:', result)
    
    if (result.success) {
      console.log('✅ OTP resent! Check your email')
      setTimer(600)
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } else {
      console.error('❌ Error:', result.error)
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800">
      <div className="px-8 py-5">
        <button
          onClick={() => navigate('/register')}
          className="text-sm font-medium transition text-sky-300 hover:text-sky-200"
        >
          ← Back to Register
        </button>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-lg bg-gradient-to-br from-sky-300 to-sky-400 shadow-sky-400/50">
              <Mail className="text-blue-950" size={32} />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Verify Your Email</h1>
            <p className="text-blue-200">We've sent a 6-digit code to</p>
            <p className="font-semibold text-sky-300">{email}</p>
          </div>

          <div className="p-8 border-2 rounded-2xl bg-gradient-to-br from-blue-800/80 to-blue-900/80 border-sky-400/30 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-3 text-sm text-red-100 border rounded-lg bg-red-500/20 border-red-400/30">
                  {error}
                </div>
              )}

              <div>
                <label className="block mb-4 text-sm font-medium text-center text-sky-300">
                  Enter Verification Code
                </label>
                <div className="flex justify-center gap-2" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 text-2xl font-bold text-center text-white transition border rounded-lg h-14 bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-blue-200">
                    Code expires in{' '}
                    <span className="font-semibold text-sky-300">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-orange-300">
                    Code expired! Please resend.
                  </p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 540}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition text-sky-300 hover:text-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={16} />
                  {canResend ? 'Resend Code' : "Didn't receive code? Resend"}
                </button>
              </div>

              <button
                type="submit"
                disabled={otp.join('').length !== 6 || loading}
                className="w-full py-3 font-bold transition-all duration-300 rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-2xl hover:shadow-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-blue-300">
                Check your spam folder if you don't see the email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTPPage
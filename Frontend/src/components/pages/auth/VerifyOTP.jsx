import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, RefreshCw } from 'lucide-react'

function VerifyOTPPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(600) // 10 minutes in seconds

  // Derive canResend from timer value
  const canResend = timer === 0

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (value.length > 1) return // Only allow single digit

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = pastedData.split('')
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])
  }

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault()
    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      alert('Please enter all 6 digits')
      return
    }

    // Will handle OTP verification API call later
    console.log('Verify OTP:', otpCode)
    
    // Navigate to login after successful verification
    navigate('/login')
  }

  // Handle resend OTP
  const handleResend = () => {
    // Will handle resend OTP API call later
    console.log('Resend OTP to:', email)
    setTimer(600) // Reset timer
    setOtp(['', '', '', '', '', ''])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800">
      {/* Back button */}
      <div className="px-8 py-5">
        <button
          onClick={() => navigate('/register')}
          className="text-sm font-medium transition text-sky-300 hover:text-sky-200"
        >
          ← Back to Register
        </button>
      </div>

      {/* OTP Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-lg bg-gradient-to-br from-sky-300 to-sky-400 shadow-sky-400/50">
              <Mail className="text-blue-950" size={32} />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Verify Your Email</h1>
            <p className="text-blue-200">
              We've sent a 6-digit code to
            </p>
            <p className="font-semibold text-sky-300">{email}</p>
          </div>

          {/* Form Card */}
          <div className="p-8 border-2 rounded-2xl bg-gradient-to-br from-blue-800/80 to-blue-900/80 border-sky-400/30 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
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
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-2xl font-bold text-center text-white transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="text-center">
                {!canResend ? (
                  <p className="text-sm text-blue-200">
                    Code expires in{' '}
                    <span className="font-semibold text-sky-300">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-orange-300">
                    Code expired! Please resend.
                  </p>
                )}
              </div>

              {/* Resend Button */}
              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition text-sky-300 hover:text-sky-200"
                  >
                    <RefreshCw size={16} />
                    Resend Code
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition text-blue-400 hover:text-sky-300"
                  >
                    <RefreshCw size={16} />
                    Didn't receive code? Resend
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={otp.join('').length !== 6}
                className="w-full py-3 font-bold transition-all duration-300 rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-2xl hover:shadow-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify Email
              </button>
            </form>

            {/* Help text */}
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
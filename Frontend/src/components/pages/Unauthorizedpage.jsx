import { useNavigate } from 'react-router-dom'
import { Lock, Home, LogIn } from 'lucide-react'

function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="p-6 rounded-full bg-red-500/20 border border-red-500/40">
            <Lock size={48} className="text-red-400" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-sky-200 mb-8">You don't have permission to access this resource. Please log in with proper credentials.</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-lg hover:shadow-sky-400/50 transition-all"
          >
            <LogIn size={20} />
            Login
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-sky-300 border-2 border-sky-300 hover:bg-sky-300/10 transition-all"
          >
            <Home size={20} />
            Go to Homepage
          </button>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-white/5 border border-sky-400/20">
          <p className="text-sm text-blue-200">Error Code: 401 | Unauthorized Access</p>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage

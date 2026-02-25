import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-200 mb-4">404</h1>
          <p className="text-3xl font-bold text-white mb-2">Page Not Found</p>
          <p className="text-sky-200 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-lg hover:shadow-sky-400/50 transition-all"
          >
            <Home size={20} />
            Go to Homepage
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-sky-300 border-2 border-sky-300 hover:bg-sky-300/10 transition-all"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-white/5 border border-sky-400/20">
          <p className="text-sm text-blue-200">Error Code: 404 | Resource Not Found</p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

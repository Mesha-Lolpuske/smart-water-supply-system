import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const StaffRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-sky-400"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin' && user.role !== 'technician') {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default StaffRoute

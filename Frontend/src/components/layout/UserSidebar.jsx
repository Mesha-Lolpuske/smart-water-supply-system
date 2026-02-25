import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Megaphone, 
  Bell,
  User,
  AlertCircle,
  ChevronRight
} from 'lucide-react'

function UserSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Schedules', path: '/schedules' },
    { icon: FileText, label: 'My Reports', path: '/reports/my-reports' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className="fixed left-0 z-40 w-64 h-screen pt-24 transition-all bg-white border-r-2 border-sky-200 shadow-xl">
      <div className="h-full px-4 pb-4 overflow-y-auto">
        {/* User Badge */}
        <div className="mb-6 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-sky-200">
          <p className="text-xs font-semibold text-sky-600 mb-1">Account Type</p>
          <p className="text-sm font-bold text-blue-950">👤 User</p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-all group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30'
                  : 'text-slate-700 hover:bg-sky-50 hover:text-sky-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive(item.path) && <ChevronRight size={18} className="opacity-50" />}
            </button>
          ))}
        </nav>

        {/* Quick Action Card */}
        <div className="p-4 mt-8 border-2 border-dashed rounded-xl border-sky-300 bg-gradient-to-br from-sky-50 to-blue-50 hover:shadow-md transition-all">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
            <h3 className="text-sm font-bold text-blue-950">Report Issue</h3>
          </div>
          <p className="mb-3 text-xs text-slate-600">Quickly report water supply problems</p>
          <button 
            onClick={() => navigate('/reports/create')}
            className="w-full px-3 py-2 text-sm font-semibold transition rounded-lg text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg hover:shadow-sky-500/30 active:scale-95"
          >
            + New Report
          </button>
        </div>

        {/* Status Card */}
        <div className="p-4 mt-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
          <p className="text-xs font-semibold text-emerald-700 mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-emerald-700 font-medium">All Services Up</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default UserSidebar
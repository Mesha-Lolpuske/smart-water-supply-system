import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Megaphone, 
  Bell,
  User,
  Users,
  Settings,
  ChevronRight,
  Shield
} from 'lucide-react'

function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: FileText, label: 'All Reports', path: '/admin/reports' },
    { icon: Calendar, label: 'Schedules', path: '/admin/schedules' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: User, label: 'Profile', path: '/admin/profile' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className="fixed left-0 z-40 w-64 h-screen pt-24 transition-all bg-white border-r-2 border-orange-200 shadow-xl">
      <div className="h-full px-4 pb-4 overflow-y-auto">
        <div className="p-3 mb-6 border-2 border-orange-300 rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
          <p className="mb-1 text-xs font-semibold text-orange-600">Account Type</p>
          <div className="flex items-center gap-2">
            <Shield className="text-orange-600" size={16} />
            <p className="text-sm font-bold text-red-950">Administrator</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-all group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30'
                  : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
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

        <div className="p-4 mt-8 border-2 border-orange-200 rounded-xl bg-gradient-to-br from-orange-50 to-red-50">
          <p className="mb-3 text-xs font-semibold text-orange-700">Quick Stats</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Pending Reports</span>
              <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">28</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Active Users</span>
              <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">1,234</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
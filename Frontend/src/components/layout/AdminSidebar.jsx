import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
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
  Shield,
  LogOut,
  Activity,
  ShieldCheck,
  HelpCircle,
  BarChart3,    // ← ADDED
  Droplets,     // ← ADDED
  UserCheck,    // ← ADDED
  Wrench,       // ← ADDED
  TestTube      // ← ADDED
} from 'lucide-react'

function AdminSidebar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const location = useLocation()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: FileText, label: 'Incident Management', path: '/admin/reports' },
    { icon: Calendar, label: 'Schedules', path: '/admin/schedules' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
  ]

  // ✅ NEW: Report menu items
  const reportMenuItems = [
    { icon: Users, label: 'User Analytics', path: '/admin/reports/user-analytics' },
    { icon: Wrench, label: 'Incident Resolution', path: '/admin/reports/incident-resolution' },
    { icon: Calendar, label: 'Schedule Management', path: '/admin/reports/schedule-management' },
    { icon: Megaphone, label: 'Announcement Engagement', path: '/admin/reports/announcement-engagement' },
    { icon: Bell, label: 'Notification Effectiveness', path: '/admin/reports/notification-effectiveness' },
  ]

  const bottomItems = [
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    { icon: User, label: 'Admin Profile', path: '/admin/profile' },
    { icon: HelpCircle, label: 'FAQs', path: '/admin/faq' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 z-40 w-64 h-screen pt-20 transition-all bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col h-full px-4 pb-6 overflow-y-auto">
        
        {/* Admin Profile Summary */}
        <div className="px-2 mt-6 mb-8">
          <div className="flex items-center gap-3 p-3 border border-blue-900 shadow-xl rounded-2xl bg-blue-950 shadow-blue-950/10">
            <div className="flex items-center justify-center w-10 h-10 font-bold text-white shadow-lg rounded-xl bg-sky-500 shadow-sky-500/20">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{user?.name || 'Admin User'}</p>
              <div className="flex items-center gap-1">
                <Shield size={12} className="text-sky-400" />
                <p className="text-[10px] font-bold text-sky-300/60 uppercase tracking-widest">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 space-y-8">
          <div>
            <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operations</p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-blue-950 text-white shadow-xl shadow-blue-950/20'
                      : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive(item.path) ? 'text-sky-400' : 'group-hover:scale-110 transition-transform'} />
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  </div>
                  {isActive(item.path) && <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></div>}
                </button>
              ))}
            </nav>
          </div>

          {/* ✅ NEW: Analytics Section */}
          <div>
            <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analytics</p>
            <nav className="space-y-1.5">
              {reportMenuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-blue-950 text-white shadow-xl shadow-blue-950/20'
                      : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive(item.path) ? 'text-sky-400' : 'group-hover:scale-110 transition-transform'} />
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  </div>
                  {isActive(item.path) && <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></div>}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Management</p>
            <nav className="space-y-1.5">
              {bottomItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-blue-950 text-white shadow-xl shadow-blue-950/20'
                      : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive(item.path) ? 'text-sky-400' : 'group-hover:scale-110 transition-transform'} />
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 mt-6 space-y-4 border-t border-slate-100">
          {/* Quick Stats Summary */}
          <div className="p-4 border rounded-2xl bg-slate-50 border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-blue-600" size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Pulse</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">STATUS</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">UPTIME</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">99.99%</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 transition-all duration-200 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 group"
          >
            <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-bold tracking-tight">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar

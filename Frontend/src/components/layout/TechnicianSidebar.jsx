import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  LayoutDashboard, 
  FileText, 
  Megaphone, 
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Wrench,
  ClipboardList,
  HelpCircle,
  Calendar,
  CheckSquare,
  Users
} from 'lucide-react'

function TechnicianSidebar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const location = useLocation()

  const menuItems = [
    { icon: ClipboardList, label: 'Active Jobs', path: '/technician/dashboard' },
    { icon: CheckSquare, label: 'Job History', path: '/technician/dashboard?view=history' }, 
    { icon: Users, label: 'Staff Directory', path: '/technician/directory' },
    { icon: Calendar, label: 'Water Schedules', path: '/schedules' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
  ]

  const bottomItems = [
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'My Profile', path: '/profile' },
  ]

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path
    }
    return location.pathname === path && !location.search
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 z-40 w-64 h-screen pt-20 transition-all bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col h-full px-4 pb-6 overflow-y-auto">
        
        {/* Technician Profile Summary */}
        <div className="mt-6 mb-8 px-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20">
              {user?.name?.charAt(0) || 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-blue-950 truncate">{user?.name || 'Technician'}</p>
              <div className="flex items-center gap-1">
                <Wrench size={12} className="text-emerald-600" />
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Field Expert</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 space-y-8">
          <div>
            <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Management</p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive(item.path) ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  </div>
                  {isActive(item.path) && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Preferences</p>
            <nav className="space-y-1.5">
              {bottomItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive(item.path) ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-tight">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default TechnicianSidebar

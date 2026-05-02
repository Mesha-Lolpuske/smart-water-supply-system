import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Droplet, Search } from 'lucide-react'
import { useSearch } from '../context/SearchContext'
import { useAuth } from '../hooks/useAuth'

function Header() {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery } = useSearch()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 shadow-lg bg-gradient-to-r from-blue-950 to-blue-900 border-sky-400/30">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="flex items-center justify-center w-12 h-12 transition-transform shadow-lg rounded-xl bg-gradient-to-br from-sky-400 to-sky-300 shadow-sky-400/50 group-hover:scale-110">
              <Droplet className="text-blue-950" size={28} />
            </div>
            <div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-200">MajiTrack</span>
              <p className="hidden text-xs font-medium text-sky-300/80 sm:block">Dashboard</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 px-4 py-2 transition-all border rounded-lg bg-white/10 border-sky-400/20 hover:border-sky-400/50 focus-within:ring-2 focus-within:ring-sky-400/30">
            <Search size={18} className="text-sky-300" />
            <input 
              type="text" 
              placeholder="Search users, reports..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-white placeholder-blue-300 transition-all bg-transparent outline-none w-28 sm:w-48" 
              autoFocus
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button 
              onClick={() => navigate('/notifications')}
              className="relative p-2 transition rounded-lg text-sky-300 hover:bg-white/10 hover:text-sky-200 group"
            >
              <Bell size={22} />
              <span className="absolute w-2.5 h-2.5 bg-red-500 rounded-full top-1 right-1 animate-pulse"></span>
            </button>

            {/* Profile */}
            <button 
              onClick={() => navigate('/profile')}
              className="items-center hidden gap-2 px-4 py-2 transition rounded-lg sm:flex text-sky-300 hover:bg-white/10 hover:text-sky-200"
            >
              <User size={20} />
              <span className="hidden text-sm font-medium lg:block">Profile</span>
            </button>

            <div className="w-px h-6 bg-sky-400/30"></div>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 font-medium transition rounded-lg text-sky-300 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={20} />
              <span className="hidden text-sm sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
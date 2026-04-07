import DashboardLayout from '../../layout/DashboardLayout'
import { Edit, Mail, Phone, MapPin, User, LogOut, ShieldCheck, Calendar as CalendarIcon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState, useEffect } from 'react'
import { reportService } from '../../services/reportService'

function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const isAdmin = location.pathname.startsWith('/admin')
  const [reportCount, setReportCount] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!isAdmin) {
          const res = await reportService.getMyReports()
          setReportCount(res.data?.reports?.length || 0)
        }
      } catch (err) {
        console.error('Error fetching profile stats:', err)
      }
    }
    fetchStats()
  }, [isAdmin])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 to-blue-900 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white md:text-4xl">My Profile</h1>
          <p className="mt-2 text-lg font-medium text-sky-200/80">Manage your account and preferences.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 rounded-full bg-sky-400/10 blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Profile Card */}
        <div className="p-8 mb-8 bg-white border border-slate-100 shadow-sm rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-24 h-24 text-4xl font-black rounded-3xl shadow-xl bg-blue-950 text-white border-4 border-sky-400">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-black text-blue-950">{user.name}</h2>
                  {user.role === 'admin' && <ShieldCheck className="text-sky-500" size={24} />}
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 rounded-lg">
                    {user.role} Account
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <CalendarIcon size={14} />
                    Active since {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
                      : 'Recently joined'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(isAdmin ? '/admin/profile/edit' : '/profile/edit')}
              className="flex items-center justify-center gap-2 px-8 py-4 font-black transition-all rounded-xl text-blue-950 bg-sky-300 hover:bg-sky-200 active:scale-95 shadow-lg shadow-sky-400/20"
            >
              <Edit size={20} />
              EDIT PROFILE
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="md:col-span-2 p-8 bg-white border border-slate-100 shadow-sm rounded-2xl">
            <h3 className="text-sm font-black text-blue-950 uppercase tracking-[0.2em] mb-8">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-sky-500" />
                  <p className="font-bold text-blue-950">{user.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Address</p>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-sky-500" />
                  <p className="font-bold text-blue-950">{user.address}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Water Zone</p>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-sky-500" />
                  <p className="font-bold text-blue-950">{user.zone || 'Default Zone'}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-sky-500" />
                  <p className="font-bold text-blue-950">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="space-y-6">
            <div className="p-6 bg-blue-950 text-white rounded-2xl shadow-xl">
              <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-4">Engagement</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-300">Reports Filed</span>
                  <span className="text-2xl font-black text-white">{reportCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-300">Status</span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-500 text-white rounded-lg">VERIFIED</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full gap-3 px-6 py-4 font-black transition-all rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 active:scale-95"
            >
              <LogOut size={20} />
              SIGN OUT
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile
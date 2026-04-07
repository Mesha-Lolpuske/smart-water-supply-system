import { useState, useEffect } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import { userService } from '../../services/userService'
import { Search, Phone, Mail, User, Shield, Wrench, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function StaffDirectory() {
  const navigate = useNavigate()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const res = await userService.getAllUsers()
      if (res.success) {
        // Filter only staff (admins and technicians)
        const staffList = res.users.filter(u => u.role === 'admin' || u.role === 'technician')
        setStaff(staffList)
      }
    } catch (error) {
      console.error('Error fetching staff directory:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-16 h-16 border-t-4 border-emerald-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-bold text-blue-950">Loading Directory...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
        <div className="relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-400 font-bold mb-4 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft size={18} />
            BACK
          </button>
          <h1 className="text-3xl font-black text-white md:text-4xl">Staff Directory</h1>
          <p className="mt-2 text-lg font-medium text-slate-400">Connect with other administrators and field technicians.</p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 -mr-32 -mt-32 rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, role, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-blue-950"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
            <User className="mx-auto text-slate-200 mb-4" size={48} />
            <h3 className="text-xl font-bold text-blue-950">No Staff Found</h3>
            <p className="text-slate-500">No team members match your search criteria.</p>
          </div>
        ) : (
          filteredStaff.map((member) => (
            <div key={member._id} className="group p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-14 h-14 rounded-2xl font-black text-white text-xl shadow-lg ${
                  member.role === 'admin' ? 'bg-blue-600 shadow-blue-600/20' : 'bg-emerald-600 shadow-emerald-600/20'
                }`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-blue-950 text-lg group-hover:text-emerald-600 transition-colors">{member.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {member.role === 'admin' ? (
                      <Shield size={14} className="text-blue-600" />
                    ) : (
                      <Wrench size={14} className="text-emerald-600" />
                    )}
                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                      member.role === 'admin' ? 'text-blue-600' : 'text-emerald-600'
                    }`}>
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <a 
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all group/link"
                >
                  <div className="p-2 rounded-lg bg-white shadow-sm group-hover/link:bg-emerald-600 group-hover/link:text-white transition-colors">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-bold truncate">{member.email}</span>
                </a>
                
                {/* Placeholder for phone if available in schema */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm font-bold italic">Phone not provided</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}

export default StaffDirectory

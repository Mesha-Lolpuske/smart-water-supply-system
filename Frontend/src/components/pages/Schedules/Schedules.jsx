import DashboardLayout from '../../layout/DashboardLayout'
import { Calendar, Plus, Edit, Trash2, MapPin, Clock, Users, Eye } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

function Schedules() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Check if admin route
  const isAdmin = location.pathname.startsWith('/admin')

  const schedules = [
    { id: 1, title: 'Morning Supply - Zone A', zone: 'Westlands', time: '6:00 AM - 10:00 AM', days: 'Mon-Fri', users: 1250, status: 'active' },
    { id: 2, title: 'Evening Supply - Zone B', zone: 'Kilimani', time: '5:00 PM - 9:00 PM', days: 'Daily', users: 980, status: 'active' },
    { id: 3, title: 'Night Supply - Zone C', zone: 'CBD', time: '10:00 PM - 6:00 AM', days: 'Daily', users: 450, status: 'scheduled' },
    { id: 4, title: 'Weekend Supply - Zone D', zone: 'Karen', time: '8:00 AM - 4:00 PM', days: 'Sat-Sun', users: 320, status: 'active' },
  ]

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="p-6 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-950 to-blue-900">
        <h1 className="mb-2 text-3xl font-bold">Water Distribution Schedules</h1>
        <p className="text-sky-200">
          {isAdmin ? 'Manage and monitor all water supply schedules' : 'View water supply schedules'}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-blue-950">{schedules.length} Total Schedules</p>
        </div>
        
        {/* ONLY SHOW CREATE BUTTON TO ADMINS */}
        {isAdmin && (
          <button
            onClick={() => navigate('/admin/schedules/create')}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg"
          >
            <Plus size={20} />
            Create Schedule
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="p-6 transition-all bg-white border-l-4 shadow-sm rounded-xl border-sky-400 hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-blue-950">{schedule.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><MapPin size={16} />{schedule.zone}</span>
                  <span className="flex items-center gap-1"><Calendar size={16} />{schedule.days}</span>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${schedule.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                {schedule.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-sky-50">
                <p className="text-xs text-slate-600">Time</p>
                <p className="flex items-center gap-1 font-semibold text-blue-950"><Clock size={16} />{schedule.time}</p>
              </div>
              <div className="p-3 rounded-lg bg-sky-50">
                <p className="text-xs text-slate-600">Affected Users</p>
                <p className="flex items-center gap-1 font-semibold text-blue-950"><Users size={16} />{schedule.users.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-sky-50">
                <p className="text-xs text-slate-600">Zone</p>
                <p className="font-semibold text-blue-950">{schedule.zone}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {/* VIEW DETAILS - Everyone can see */}
              <button
                onClick={() => navigate(isAdmin ? `/admin/schedules/${schedule.id}` : `/schedules/${schedule.id}`)}
                className="flex items-center justify-center flex-1 gap-1 px-4 py-2 text-sm font-semibold transition-all border rounded-lg text-sky-600 border-sky-300 hover:bg-sky-50"
              >
                <Eye size={16} />
                View Details
              </button>
              
              {/* EDIT & DELETE - ONLY ADMINS */}
              {isAdmin && (
                <>
                  <button
                    onClick={() => navigate(`/admin/schedules/edit/${schedule.id}`)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-semibold transition-all bg-blue-100 rounded-lg text-blue-950 hover:bg-blue-200"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button className="px-4 py-2 text-sm font-semibold text-red-600 transition-all border border-red-300 rounded-lg hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default Schedules
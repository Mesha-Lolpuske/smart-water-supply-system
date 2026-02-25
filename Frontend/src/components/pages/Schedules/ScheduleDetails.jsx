import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Edit, Trash2, MapPin, Clock, Users, Calendar } from 'lucide-react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function ScheduleDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    const fetchSchedule = async () => {
      await Promise.resolve()
      setSchedule({
        id,
        title: 'Morning Supply - Zone A',
        description: 'Regular morning water distribution for Zone A',
        startTime: '6:00 AM',
        endTime: '10:00 AM',
        zone: 'Westlands',
        days: 'Mon-Fri',
        affectedUsers: 1250,
        status: 'active'
      })
      setLoading(false)
    }
    fetchSchedule()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout isAdmin={isAdmin}>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-sky-400"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!schedule) {
    return (
      <DashboardLayout isAdmin={isAdmin}>
        <div className="p-6 text-center">
          <p className="text-slate-600">Schedule not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 font-semibold text-sky-600 hover:text-sky-700">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-4xl p-8 bg-white shadow-sm rounded-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-blue-950">{schedule.title}</h1>
            <p className="text-slate-600">{schedule.description}</p>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/admin/schedules/edit/${id}`)} 
                className="flex items-center gap-2 px-4 py-2 font-semibold transition-all bg-blue-100 rounded-lg text-blue-950 hover:bg-blue-200"
              >
                <Edit size={18} />
                Edit
              </button>
              <button className="px-4 py-2 font-semibold text-red-600 transition-all border border-red-300 rounded-lg hover:bg-red-50">
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-4 border-2 rounded-lg bg-sky-50 border-sky-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-sky-600" />
              <p className="text-sm text-slate-600">Time</p>
            </div>
            <p className="font-semibold text-blue-950">{schedule.startTime} - {schedule.endTime}</p>
          </div>
          <div className="p-4 border-2 rounded-lg bg-sky-50 border-sky-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-sky-600" />
              <p className="text-sm text-slate-600">Zone</p>
            </div>
            <p className="font-semibold text-blue-950">{schedule.zone}</p>
          </div>
          <div className="p-4 border-2 rounded-lg bg-sky-50 border-sky-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-sky-600" />
              <p className="text-sm text-slate-600">Days</p>
            </div>
            <p className="font-semibold text-blue-950">{schedule.days}</p>
          </div>
          <div className="p-4 border-2 rounded-lg bg-sky-50 border-sky-200">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-sky-600" />
              <p className="text-sm text-slate-600">Affected Users</p>
            </div>
            <p className="font-semibold text-blue-950">{schedule.affectedUsers?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="p-6 border-l-4 rounded-lg bg-slate-50 border-sky-400">
          <h3 className="mb-2 font-semibold text-blue-950">Status</h3>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${schedule.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
            {schedule.status}
          </span>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ScheduleDetails
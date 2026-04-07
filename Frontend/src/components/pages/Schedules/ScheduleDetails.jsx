import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Edit, Trash2, MapPin, Clock, Users, Calendar, Activity } from 'lucide-react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { scheduleService } from '../../services/ScheduleService'
import { toast } from "react-toastify";

function ScheduleDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    fetchScheduleDetails()
  }, [id])

  const fetchScheduleDetails = async () => {
    try {
      setLoading(true)
      const res = await scheduleService.getScheduleById(id)
      if (res.success) {
        setSchedule(res.schedule)
      } else {
        setError('Schedule not found')
      }
    } catch (err) {
      console.error('Error fetching schedule:', err)
      setError('Failed to load schedule details.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this schedule?`)) {
      try {
        const res = await scheduleService.deleteSchedule(id)
        if (res.success) {
          toast.success('Schedule deleted successfully')
          navigate(isAdmin ? '/admin/schedules' : '/schedules')
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error('Failed to delete schedule')
      }
    }
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin={isAdmin}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-16 h-16 mb-4 border-4 rounded-full border-t-sky-500 border-sky-100 animate-spin"></div>
          <p className="font-bold text-blue-950">Fetching Analytics...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !schedule) {
    return (
      <DashboardLayout isAdmin={isAdmin}>
        <div className="p-12 text-center bg-white border shadow-sm rounded-3xl border-slate-100">
          <p className="mb-4 text-sm font-black tracking-widest text-red-500 uppercase">{error || 'Schedule not found'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-3 text-xs font-black tracking-widest text-white uppercase bg-blue-950 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 mb-8 text-xs font-black tracking-widest uppercase transition-colors text-sky-600 hover:text-sky-700"
      >
        <ArrowLeft size={20} />
        Back to List
      </button>

      <div className="max-w-5xl p-10 bg-white shadow-2xl rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
          <Activity size={200} />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col justify-between gap-8 mb-12 md:flex-row md:items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 ${
                  schedule.scheduleType === 'emergency' ? 'bg-red-50 text-red-600 border-red-100' :
                  schedule.scheduleType === 'maintenance' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                  'bg-sky-50 text-sky-600 border-sky-100'
                }`}>
                  {schedule.scheduleType} schedule
                </span>
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${schedule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {schedule.isActive ? 'System Active' : 'Suspended'}
                </span>
              </div>
              <h1 className="mb-4 text-4xl font-black tracking-tight text-blue-950">{schedule.title}</h1>
              <p className="max-w-3xl text-xl font-medium leading-relaxed text-slate-500">{schedule.description}</p>
            </div>
            
            {isAdmin && (
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(`/admin/schedules/${id}/edit`)} 
                  className="flex items-center gap-2 px-8 py-4 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-blue-950 rounded-2xl hover:bg-blue-900 shadow-blue-950/20"
                >
                  <Edit size={18} />
                  MODIFY
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-4 font-black text-red-600 transition-all border-2 border-red-100 bg-red-50 hover:bg-red-100 rounded-2xl"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-slate-100 transition-all hover:border-sky-200 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 transition-transform bg-white shadow-sm rounded-xl text-sky-500 group-hover:scale-110">
                  <Clock size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Window</p>
              </div>
              <p className="text-lg font-black text-blue-950">{schedule.startTime} — {schedule.endTime}</p>
            </div>

            <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-slate-100 transition-all hover:border-sky-200 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 transition-transform bg-white shadow-sm rounded-xl text-sky-500 group-hover:scale-110">
                  <Calendar size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation Days</p>
              </div>
              <p className="text-lg font-black text-blue-950">{schedule.daysOfWeek?.join(', ') || 'All Days'}</p>
            </div>

            <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-slate-100 transition-all hover:border-sky-200 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 transition-transform bg-white shadow-sm rounded-xl text-sky-500 group-hover:scale-110">
                  <MapPin size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coverage Type</p>
              </div>
              <p className="text-lg font-black tracking-tight uppercase text-blue-950">{schedule.scheduleType}</p>
            </div>

            <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-slate-100 transition-all hover:border-sky-200 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 transition-transform bg-white shadow-sm rounded-xl text-sky-500 group-hover:scale-110">
                  <Users size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
              </div>
              <p className="text-lg font-black text-blue-950">
                {new Date(schedule.startDate).toLocaleDateString()} to {new Date(schedule.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100">
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-sky-500"></span>
              Infrastructure Pulse
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-6 py-3 border bg-emerald-50 rounded-2xl border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-black tracking-widest uppercase text-emerald-700">Flow Normal</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 text-blue-700 border border-blue-100 bg-blue-50 rounded-2xl">
                <Activity size={16} />
                <span className="text-xs font-black tracking-widest uppercase">Pressure Stabilized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ScheduleDetails
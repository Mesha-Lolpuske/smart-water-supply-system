/* eslint-disable no-unused-vars */
import DashboardLayout from '../../layout/DashboardLayout'
import { Calendar, Plus, Edit, Trash2, MapPin, Clock, Users, Eye, Search, Filter } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { scheduleService } from '../../services/ScheduleService'
import { toast } from "react-toastify";
import { useSearch } from '../../context/SearchContext'
import { useAuth } from '../../hooks/useAuth'
import { njoroAreas } from '../../utils/njoroData'

function Schedules() {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchQuery } = useSearch()
  const { user } = useAuth()
  
  // Check if admin route
  const isAdmin = location.pathname.startsWith('/admin')

  // State
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Zone Filtering State (Admin defaults to All, Citizens default to their address or Njoro Center)
  const [selectedZone, setSelectedZone] = useState(isAdmin ? 'All Zones' : (user?.address || njoroAreas[0].name))

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const res = await scheduleService.getAllSchedules()
      
      if (res.success) {
        // 1. Get the EXACT current date AND time
        const now = new Date(); 

        const validSchedules = [];
        const elapsedSchedules = [];

        // Sort schedules into Valid vs Elapsed
        res.schedules.forEach(schedule => {
          if (schedule.endDate) {
            // 2. Create a base Date object from the endDate
            const exactEndDateTime = new Date(schedule.endDate);
            
            // 3. Inject the specific endTime (e.g., "14:30") into the Date object
            if (schedule.endTime) {
              const [hours, minutes] = schedule.endTime.split(':');
              exactEndDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            } else {
              // Default to 11:59 PM if no specific time is provided
              exactEndDateTime.setHours(23, 59, 59, 999);
            }

            // 4. Strict check: Has this exact minute passed?
            if (exactEndDateTime < now) {
              elapsedSchedules.push(schedule);
              return;
            }
          }
          validSchedules.push(schedule);
        });

        // AUTO-CLEANUP: If Admin is viewing, silently delete expired schedules from the database
        if (isAdmin && elapsedSchedules.length > 0) {
          elapsedSchedules.forEach(async (expired) => {
            try {
              await scheduleService.deleteSchedule(expired._id);
              console.log(`Auto-cleaned elapsed schedule: ${expired.title}`);
            } catch (e) {
              console.error("Cleanup failed for", expired._id);
            }
          });
        }

        setSchedules(validSchedules);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err)
      setError('Failed to load schedules. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter based on Zone Selection AND Search Query
  const filteredSchedules = schedules.filter(s => {
    // 1. Region Filter
    if (selectedZone !== 'All Zones' && s.supplyArea !== selectedZone) {
      return false;
    }

    // 2. Search Query Filter
    const query = (searchQuery || '').toLowerCase().trim()
    if (!query) return true
    
    return (
      s.title.toLowerCase().includes(query) ||
      (s.scheduleType && s.scheduleType.toLowerCase().includes(query)) ||
      (s.supplyArea && s.supplyArea.toLowerCase().includes(query)) ||
      (s.daysOfWeek && s.daysOfWeek.some(day => day.toLowerCase().includes(query)))
    )
  })

  // Delete schedule manually
  const handleDelete = async (id) => {
    const schedule = schedules.find(s => s._id === id)
    if (window.confirm(`Are you sure you want to delete "${schedule.title}"?`)) {
      try {
        const res = await scheduleService.deleteSchedule(id)
        if (res.success) {
          setSchedules(prev => prev.filter(s => s._id !== id))
          toast.success(`Schedule deleted successfully!`)
        }
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
          <p className="font-bold text-blue-950">Loading schedules...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <div className="relative p-8 mb-8 overflow-hidden text-white shadow-xl rounded-2xl bg-blue-950">
        <div className="relative z-10">
          <h1 className="text-3xl font-black md:text-4xl">Water Distribution</h1>
          <p className="mt-2 text-lg font-medium text-sky-300/70">
            {isAdmin ? 'System-wide distribution management' : 'Live water supply schedules for your area'}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 rounded-full bg-sky-400/10 blur-3xl"></div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
        
        {/* Zone Selector */}
        <div className="flex items-center w-full pr-2 overflow-hidden bg-white border shadow-sm md:w-auto border-slate-200 rounded-xl">
          <div className="pl-4 text-slate-400">
            <Filter size={18} />
          </div>
          <select 
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="w-full py-3 pl-2 pr-4 text-sm font-black tracking-wider uppercase bg-transparent border-none outline-none cursor-pointer md:w-64 text-blue-950 focus:ring-0"
          >
            {isAdmin && <option value="All Zones">All Regions (Global)</option>}
            {njoroAreas.map(area => (
              <option key={area.id} value={area.name}>{area.name}</option>
            ))}
          </select>
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between w-full gap-4 px-6 py-3 border-2 md:w-auto bg-sky-50 border-sky-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Search className="text-sky-600" size={18} />
              <p className="text-sm font-bold text-blue-950">
                Searching: <span className="font-black text-sky-600">"{searchQuery}"</span>
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
              {filteredSchedules.length} match
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 mb-6 font-bold text-red-600 border border-red-100 bg-red-50 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black tracking-tight text-blue-950">
            {selectedZone === 'All Zones' ? 'Network Wide Schedules' : `${selectedZone} Schedules`}
          </h2>
          <p className="mt-1 text-xs font-bold tracking-widest uppercase text-slate-400">
            {filteredSchedules.length} Active Records
          </p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => navigate('/admin/schedules/create')}
            className="flex items-center gap-2 px-6 py-4 text-xs font-black tracking-widest uppercase transition-all shadow-lg rounded-xl text-blue-950 bg-sky-300 hover:bg-sky-200 shadow-sky-400/20 active:scale-95"
          >
            <Plus size={18} />
            CREATE NEW
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredSchedules.length === 0 ? (
          <div className="p-20 text-center bg-white border-2 border-dashed border-slate-100 rounded-3xl">
            <Calendar className="w-20 h-20 mx-auto mb-6 text-slate-200" />
            <h3 className="mb-2 text-2xl font-black text-blue-950">
              No Schedules for {selectedZone}
            </h3>
            <p className="max-w-sm mx-auto text-slate-500">
              {selectedZone !== 'All Zones' 
                ? `There are no active distribution schedules routed for ${selectedZone} right now. Select a different region or check back later.` 
                : 'There are currently no active water supply schedules registered in the system.'}
            </p>
            {isAdmin && !searchQuery && (
              <button
                onClick={() => navigate('/admin/schedules/create')}
                className="px-8 py-4 mt-8 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl rounded-xl bg-blue-950 hover:bg-blue-900 active:scale-95"
              >
                Create First Schedule
              </button>
            )}
          </div>
        ) : (
          filteredSchedules.map((schedule) => (
            <div key={schedule._id} className="p-6 transition-all bg-white border shadow-sm group border-slate-100 rounded-2xl hover:shadow-xl hover:border-sky-200">
              <div className="flex flex-col justify-between gap-6 mb-6 md:flex-row md:items-start">
                <div>
                  <h3 className="text-2xl font-black transition-colors text-blue-950 group-hover:text-sky-600">{schedule.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg">
                      <MapPin size={14} className="text-sky-500" />
                      {schedule.supplyArea}
                    </span>
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg">
                      <Calendar size={14} className="text-sky-500" />
                      {schedule.daysOfWeek?.join(', ') || 'All Days'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-4 text-right rounded-2xl bg-sky-50">
                    <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-1">Active Window</p>
                    <p className="flex items-center justify-end gap-2 text-lg font-black text-blue-950">
                      <Clock size={18} className="text-sky-500" />
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t sm:flex-row border-slate-50">
                <button
                  onClick={() => navigate(isAdmin ? `/admin/schedules/${schedule._id}` : `/schedules/${schedule._id}`)}
                  className="flex items-center justify-center flex-1 gap-2 px-6 py-3.5 text-xs font-black transition-all rounded-xl text-blue-950 bg-slate-100 hover:bg-slate-200 uppercase tracking-widest"
                >
                  <Eye size={16} />
                  View Details
                </button>
                
                {isAdmin && (
                  <>
                    <button
                      onClick={() => navigate(`/admin/schedules/${schedule._id}/edit`)}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black transition-all bg-blue-950 text-white rounded-xl hover:bg-blue-900 shadow-lg shadow-blue-900/10 uppercase tracking-widest"
                    >
                      <Edit size={16} />
                      Modify
                    </button>
                    <button 
                      onClick={() => handleDelete(schedule._id)}
                      className="flex items-center justify-center px-6 py-3.5 text-red-600 transition-all bg-red-50 rounded-xl hover:bg-red-100 border border-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}

export default Schedules
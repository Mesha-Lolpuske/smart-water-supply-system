import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, CheckCircle, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function CreateSchedule() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '', zone: '', startTime: '', endTime: '', days: [], affectedUsers: ''
  })
  
  // TODO: Get from AuthContext later
  const userRole = 'user' // Change to 'admin' to test

  // REDIRECT IF NOT ADMIN
  if (userRole !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-8 text-center bg-white shadow-lg rounded-xl">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold text-blue-950">Access Denied</h1>
            <p className="mb-6 text-slate-600">Only administrators can create schedules</p>
            <button 
              onClick={() => navigate('/schedules')} 
              className="px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg"
            >
              Back to Schedules
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Schedule created successfully!')
    navigate('/admin/schedules')
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <DashboardLayout isAdmin={true}>
      <button onClick={() => navigate('/admin/schedules')} className="flex items-center gap-2 mb-6 font-semibold text-sky-600 hover:text-sky-700">
        <ArrowLeft size={20} />
        Back to Schedules
      </button>

      <div className="max-w-2xl p-8 bg-white shadow-sm rounded-xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Create New Schedule</h1>
        <p className="mb-8 text-slate-600">Set up a new water distribution schedule</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Schedule Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" placeholder="e.g., Morning Supply - Zone A" required />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Zone</label>
            <select name="zone" value={formData.zone} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required>
              <option value="">Select Zone</option>
              <option value="Westlands">Westlands</option>
              <option value="Kilimani">Kilimani</option>
              <option value="CBD">CBD</option>
              <option value="Karen">Karen</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required />
            </div>
          </div>

          <div>
            <label className="block mb-3 text-sm font-semibold text-blue-950">Days of Operation</label>
            <div className="grid grid-cols-4 gap-2">
              {days.map(day => (
                <label key={day} className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-slate-700">{day.slice(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Affected Users (Estimated)</label>
            <input type="number" name="affectedUsers" value={formData.affectedUsers} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" placeholder="e.g., 1250" required />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg">
              <CheckCircle size={20} />
              Create Schedule
            </button>
            <button type="button" onClick={() => navigate('/admin/schedules')} className="flex-1 px-6 py-3 font-semibold transition-all border-2 rounded-lg text-blue-950 border-sky-300 hover:bg-sky-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default CreateSchedule
import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Save, Shield } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function EditSchedule() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // TODO: Get from AuthContext later
  const userRole = 'user' // Change to 'admin' to test

  // ✅ useEffect BEFORE any early returns
  useEffect(() => {
    const fetchSchedule = async () => {
      await Promise.resolve()
      setFormData({
        title: 'Morning Supply - Zone A',
        zone: 'Westlands',
        startTime: '06:00',
        endTime: '10:00'
      })
      setLoading(false)
    }
    fetchSchedule()
  }, [id])

  // ✅ Admin check AFTER all hooks
  if (userRole !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-8 text-center bg-white shadow-lg rounded-xl">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold text-blue-950">Access Denied</h1>
            <p className="mb-6 text-slate-600">Only administrators can edit schedules</p>
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      alert('Schedule updated successfully!')
      navigate('/admin/schedules')
      setSubmitting(false)
    }, 1000)
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin={true}>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-sky-400"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={true}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 font-semibold text-sky-600 hover:text-sky-700">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-2xl p-8 bg-white shadow-sm rounded-xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Edit Schedule</h1>
        <p className="mb-8 text-slate-600">Update schedule details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title || ''} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" 
              required 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Zone</label>
            <input 
              type="text" 
              name="zone" 
              value={formData.zone || ''} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">Start Time</label>
              <input 
                type="time" 
                name="startTime" 
                value={formData.startTime || ''} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" 
                required 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">End Time</label>
              <input 
                type="time" 
                name="endTime" 
                value={formData.endTime || ''} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" 
                required 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={submitting} 
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg disabled:opacity-50"
            >
              <Save size={20} />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="flex-1 px-6 py-3 font-semibold transition-all border-2 rounded-lg text-blue-950 border-sky-300 hover:bg-sky-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default EditSchedule
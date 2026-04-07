import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Save, Shield } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import { announcementService } from '../../services/announcement'

function EditAnnouncement() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true)
        const res = await announcementService.getAnnouncementById(id)
        if (res.success) {
          setFormData(res.announcement)
        }
      } catch (err) {
        console.error('Error fetching announcement:', err)
        setError('Failed to load announcement details.')
      } finally {
        setLoading(false)
      }
    }
    if (isAdmin) fetchAnnouncement()
  }, [id, isAdmin])

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="p-8 text-center bg-white shadow-lg rounded-xl">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold text-blue-950">Access Denied</h1>
            <p className="mb-6 text-slate-600">Only administrators can edit announcements</p>
            <button 
              onClick={() => navigate('/announcements')} 
              className="px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg"
            >
              Back to Announcements
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      setError('')
      const res = await announcementService.updateAnnouncement(id, formData)
      if (res.success) {
        toast.success('Announcement updated successfully!')
        navigate('/admin/announcements')
      }
    } catch (err) {
      console.error('Error updating announcement:', err)
      setError(err.response?.data?.message || 'Failed to update announcement')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin={true}>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-t-sky-500 border-sky-100 rounded-full animate-spin"></div>
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
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Edit Announcement</h1>
        <p className="mb-8 text-slate-600">Update announcement details</p>

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
              >
                <option value="general">General Update</option>
                <option value="shortage">Water Shortage</option>
                <option value="maintenance">Maintenance</option>
                <option value="emergency">Emergency</option>
                <option value="update">Policy Update</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">Priority</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Content</label>
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              rows="6" 
              className="w-full px-4 py-3 border-2 rounded-lg resize-none border-sky-200 focus:outline-none focus:border-sky-400" 
              required 
            />
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              name="isActive" 
              id="isActive" 
              checked={formData.isActive} 
              onChange={handleChange} 
              className="w-4 h-4 rounded border-sky-300" 
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-blue-950">Published (Visible to users)</label>
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

export default EditAnnouncement

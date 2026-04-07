import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Megaphone, Shield, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import { announcementService } from '../../services/announcement'

function CreateAnnouncementPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal',
    isActive: true
  })

  const isAdmin = user?.role === 'admin'

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="p-8 text-center bg-white shadow-lg rounded-xl">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold text-blue-950">Access Denied</h1>
            <p className="mb-6 text-slate-600">Only administrators can create announcements</p>
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
      setLoading(true)
      setError('')
      const res = await announcementService.createAnnouncement(formData)
      if (res.success) {
        toast.success('Announcement published successfully!')
        navigate('/admin/announcements')
      }
    } catch (err) {
      console.error('Error creating announcement:', err)
      setError(err.response?.data?.message || 'Failed to publish announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout isAdmin={true}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 font-semibold text-sky-600 hover:text-sky-700">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-2xl p-8 bg-white shadow-sm rounded-xl">
        <h1 className="flex items-center gap-3 mb-2 text-3xl font-bold text-blue-950">
          <Megaphone className="text-sky-500" size={32} />
          Create Announcement
        </h1>
        <p className="mb-8 text-slate-600">Broadcast important information to all citizens</p>

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
              placeholder="e.g., Scheduled Maintenance"
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
              placeholder="Enter the full message details..."
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
              disabled={loading}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Publishing...' : (
                <>
                  <CheckCircle size={20} />
                  Publish Announcement
                </>
              )}
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

export default CreateAnnouncementPage

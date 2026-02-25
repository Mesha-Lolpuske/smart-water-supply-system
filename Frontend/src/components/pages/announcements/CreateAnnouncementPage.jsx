import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Save, Shield } from 'lucide-react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState } from 'react'

function EditAnnouncement() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [formData, setFormData] = useState({
    title: 'Water Shortage Alert',
    content: 'Limited supply expected in Zone A for the next 48 hours',
    type: 'alert',
    urgent: true
  })

  const isAdmin = location.pathname.startsWith('/admin')

  if (!isAdmin) {
    return (
      <DashboardLayout isAdmin={false}>
        <div className="flex items-center justify-center min-h-screen">
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

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Announcement updated successfully!')
    navigate('/admin/announcements')
  }

  return (
    <DashboardLayout isAdmin={true}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 font-semibold text-sky-600 hover:text-sky-700">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-2xl p-8 bg-white shadow-sm rounded-xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Edit Announcement #{id}</h1>
        <p className="mb-8 text-slate-600">Update announcement details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400">
              <option value="general">General Update</option>
              <option value="maintenance">Maintenance Notice</option>
              <option value="alert">Alert</option>
              <option value="schedule">Schedule Change</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Content</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows="6" className="w-full px-4 py-3 border-2 rounded-lg resize-none border-sky-200 focus:outline-none focus:border-sky-400" required />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="urgent" id="urgent" checked={formData.urgent} onChange={handleChange} className="w-4 h-4 rounded border-sky-300" />
            <label htmlFor="urgent" className="text-sm font-semibold text-blue-950">Mark as Urgent</label>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg">
              <Save size={20} />
              Save Changes
            </button>
            <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 font-semibold transition-all border-2 rounded-lg text-blue-950 border-sky-300 hover:bg-sky-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default EditAnnouncement
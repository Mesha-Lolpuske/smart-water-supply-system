import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Save, Shield } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

function EditReport() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: 'No water supply',
    description: 'No water supply since morning',
    severity: 'high',
    location: 'Westlands',
    issueType: 'no-supply'
  })

  // TODO: Get from AuthContext later
  // Users can edit their OWN reports only if status is pending
  const reportStatus = 'pending' // TODO: fetch from API
  const isOwner = true // TODO: check if current user owns this report

  if (!isOwner || reportStatus !== 'pending') {
    return (
      <DashboardLayout isAdmin={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-8 text-center bg-white shadow-lg rounded-xl">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold text-blue-950">Cannot Edit Report</h1>
            <p className="mb-6 text-slate-600">
              {!isOwner ? 'You can only edit your own reports.' : 'Only pending reports can be edited.'}
            </p>
            <button
              onClick={() => navigate('/reports/my-reports')}
              className="px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg"
            >
              Back to My Reports
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
    alert('Report updated successfully!')
    navigate('/reports/my-reports')
  }

  return (
    <DashboardLayout isAdmin={false}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 font-semibold text-sky-600 hover:text-sky-700"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-2xl p-8 bg-white shadow-sm rounded-xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Edit Report #{id}</h1>
        <p className="mb-8 text-slate-600">Update your report details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">Issue Type</label>
              <select name="issueType" value={formData.issueType} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400">
                <option value="no-supply">No Water Supply</option>
                <option value="low-pressure">Low Water Pressure</option>
                <option value="contamination">Water Contamination</option>
                <option value="leak">Pipe Leak</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">Severity</label>
              <select name="severity" value={formData.severity} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full px-4 py-3 border-2 rounded-lg resize-none border-sky-200 focus:outline-none focus:border-sky-400" required />
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

export default EditReport
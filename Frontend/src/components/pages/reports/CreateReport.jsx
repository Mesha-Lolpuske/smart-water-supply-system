import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { reportService } from '../../services/reportService'

function CreateReport() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '', description: '', severity: 'medium', location: '', reportType: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const res = await reportService.createReport(formData)
      if (res.success) {
        toast.success('Report submitted successfully!')
        navigate('/reports/my-reports')
      }
    } catch (err) {
      console.error('Error submitting report:', err)
      setError(err.response?.data?.message || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
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
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Report an Issue</h1>
        <p className="mb-8 text-slate-600">Help us improve service by reporting problems immediately</p>

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Issue Type</label>
            <select name="reportType" value={formData.reportType} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required>
              <option value="">Select Issue Type</option>
              <option value="leak">Pipe Leak</option>
              <option value="outage">No Water Supply (Outage)</option>
              <option value="low_pressure">Low Pressure</option>
              <option value="contamination">Water Contamination</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" placeholder="Brief title of the issue" required />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" placeholder="e.g., Westlands, House No. 123" required />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Severity Level</label>
            <select name="severity" value={formData.severity} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full px-4 py-3 border-2 rounded-lg resize-none border-sky-200 focus:outline-none focus:border-sky-400" placeholder="Describe the issue in detail..." required />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg disabled:opacity-50"
            >
              <Send size={20} />
              {loading ? 'Submitting...' : 'Submit Report'}
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

export default CreateReport
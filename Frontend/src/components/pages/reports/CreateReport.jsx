import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Send, Upload, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { reportService } from '../../services/reportService'

function CreateReport() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    title: '', description: '', severity: 'medium', location: '', reportType: '', issueImage: null
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setFormData({ ...formData, issueImage: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, issueImage: null })
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('severity', formData.severity)
      data.append('location', formData.location)
      data.append('reportType', formData.reportType)
      if (formData.issueImage) {
        data.append('issueImage', formData.issueImage)
      }

      const res = await reportService.createReport(data)
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
          <div className="p-4 mb-6 font-bold text-red-600 border border-red-100 rounded-lg bg-red-50">
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

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Upload Picture (Optional)</label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-sky-200 bg-sky-50 hover:bg-sky-100 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-sky-500" />
                  <p className="mb-2 text-sm text-sky-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-sky-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              
              {imagePreview && (
                <div className="relative w-32 h-32 overflow-hidden rounded-lg border-2 border-sky-200">
                  <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
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
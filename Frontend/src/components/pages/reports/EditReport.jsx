import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Save, Shield } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import { reportService } from '../../services/reportService'

function EditReport() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    supplyArea: '',  // ✅ Changed from 'location' to 'supplyArea'
    reportType: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true)
        const res = await reportService.getReportById(id)
        if (res.success) {
          setReport(res.report)
          setFormData({
            title: res.report.title,
            description: res.report.description,
            severity: res.report.severity,
            supplyArea: res.report.supplyArea,  // ✅ Changed from res.report.location
            reportType: res.report.reportType
          })
        }
      } catch (err) {
        console.error('Error fetching report:', err)
        setError('Failed to load report details.')
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [id])

  const isOwner = report && (report.reportedBy?._id === user?.id || report.reportedBy === user?.id)
  const canEdit = isOwner && ['Reported', 'Technician Assigned'].includes(report?.status)

  if (loading) {
    return (
      <DashboardLayout isAdmin={false}>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 rounded-full border-t-sky-500 border-sky-100 animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!canEdit) {
    return (
      <DashboardLayout isAdmin={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      setError('')
      const res = await reportService.updateReport(id, formData)
      if (res.success) {
        toast.success('Report updated successfully!')
        navigate('/reports/my-reports')
      }
    } catch (err) {
      console.error('Error updating report:', err)
      setError(err.response?.data?.message || 'Failed to update report')
    } finally {
      setSubmitting(false)
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
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Edit Report</h1>
        <p className="mb-8 text-slate-600">Update your report details</p>

        {error && (
          <div className="p-4 mb-6 font-bold text-red-600 border border-red-100 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        {/* ✅ Added warning for Technician Assigned status */}
        {report?.status === 'Technician Assigned' && (
          <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
            <p className="text-sm font-bold text-yellow-800">
              ⚠️ A technician has been assigned to this report.
            </p>
            <p className="text-sm text-yellow-700">
              Changes you make may affect the assigned technician's work. Please double-check your corrections.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-950">Supply Area</label>  {/* ✅ Changed label */}
            <input type="text" name="supplyArea" value={formData.supplyArea} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-950">Issue Type</label>
              <select name="reportType" value={formData.reportType} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400" required>
                <option value="leak">Pipe Leak</option>
                <option value="outage">No Water Supply (Outage)</option>
                <option value="low_pressure">Low Pressure</option>
                <option value="contamination">Water Contamination</option>
                <option value="other">Other</option>
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
            <button type="submit" disabled={submitting} className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg disabled:opacity-50">
              <Save size={20} />
              {submitting ? 'Saving...' : 'Save Changes'}
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
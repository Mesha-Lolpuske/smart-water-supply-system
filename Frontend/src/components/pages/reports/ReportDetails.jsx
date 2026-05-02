import DashboardLayout from '../../layout/DashboardLayout'
import { ArrowLeft, Edit, Trash2, MessageSquare, Clock, MapPin, CheckCircle, Wrench, User, ShieldCheck } from 'lucide-react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { reportService } from '../../services/reportService'
import { useAuth } from '../../hooks/useAuth'
import userService from '../../services/userService'
import { API_BASE_URL } from '../../services/api'

function ReportDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const { user: currentUser, isAdmin, isTechnician, isStaff } = useAuth()
  
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [technicians, setTechnicians] = useState([])
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [notes, setNotes] = useState('')

  const serverUrl = API_BASE_URL.replace(/\/api\/?$/, '')

  useEffect(() => {
    fetchReportDetails()
    if (isAdmin) {
      fetchTechnicians()
    }
  }, [id])

  const fetchReportDetails = async () => {
    try {
      setLoading(true)
      const res = await reportService.getReportById(id)
      if (res.success) {
        setReport(res.report)
        setNewStatus(res.report.status)
        setNotes(isAdmin ? res.report.adminNotes : res.report.technicianNotes)
      } else {
        setError('Report not found')
      }
    } catch (err) {
      console.error('Error fetching report details:', err)
      setError('Failed to load report details.')
    } finally {
      setLoading(false)
    }
  }

  const fetchTechnicians = async () => {
    try {
      const res = await userService.getTechnicians()
      if (res.success) {
        setTechnicians(res.technicians)
      }
    } catch (err) {
      console.error('Error fetching technicians:', err)
    }
  }

  const handleUpdateStatus = async () => {
    try {
      const updateData = {}
      if (isAdmin) updateData.adminNotes = notes
      if (isTechnician) updateData.technicianNotes = notes

      const res = await reportService.updateStatus(id, newStatus, updateData)
      if (res.success) {
        setReport(res.report)
        setShowStatusModal(false)
        toast.success('Report updated successfully')
      }
    } catch {
      toast.error('Failed to update report')
    }
  }

  const handleAssignTechnician = async (techId) => {
    try {
      const res = await reportService.assignTechnician(id, techId)
      if (res.success) {
        setReport(res.report)
        toast.success('Technician assigned successfully')
      }
    } catch {
      toast.error('Failed to assign technician')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this report?')) {
      try {
        const res = await reportService.deleteReport(id)
        if (res.success) {
          navigate(isAdmin ? '/admin/reports' : '/reports/my-reports')
        }
      } catch {
        toast.error('Failed to delete report')
      }
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-t-sky-500 border-sky-100 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center bg-white rounded-2xl shadow-sm">
          <p className="text-red-500 font-bold">{error || 'Report not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sky-600 font-bold">Go Back</button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 font-black text-sky-600 hover:text-sky-700 transition-colors uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={20} />
        Back to Log
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-white shadow-xl rounded-3xl border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-black text-blue-950 tracking-tight mb-3">{report.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-400">
                  <span className="flex items-center gap-1.5 font-black text-sky-600 bg-sky-50 px-2 py-1 rounded-lg">
                    <MapPin size={16} />{report.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} className="text-sky-500" />
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {isStaff ? (
                  <>
                    <button 
                      onClick={() => setShowStatusModal(true)}
                      className="flex items-center gap-2 px-6 py-3 font-black transition-all bg-blue-950 text-white rounded-xl hover:bg-blue-900 shadow-xl uppercase tracking-widest text-xs"
                    >
                      <CheckCircle size={18} />
                      UPDATE STATUS
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={handleDelete}
                        className="px-4 py-3 font-black text-red-600 transition-all bg-red-50 hover:bg-red-100 rounded-xl uppercase tracking-widest text-xs"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </>
                ) : (
                  report.status === 'pending' && report.reportedBy?._id === currentUser?.id && (
                    <button
                      onClick={() => navigate(`/reports/edit/${id}`)}
                      className="flex items-center gap-2 px-6 py-3 font-black transition-all bg-blue-950 text-white rounded-xl hover:bg-blue-900 shadow-xl uppercase tracking-widest text-xs"
                    >
                      <Edit size={18} />
                      EDIT
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border-2 ${
                report.severity === 'critical' ? 'bg-red-50 text-red-600 border-red-100' :
                report.severity === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                report.severity === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                {report.severity}
              </span>
              <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full ${
                report.status === 'Reported' ? 'bg-orange-100 text-orange-700' :
                report.status === 'Technician Assigned' ? 'bg-blue-100 text-blue-700' :
                report.status === 'In Progress' ? 'bg-sky-100 text-sky-700' :
                report.status === 'Fixed' ? 'bg-emerald-100 text-emerald-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {report.status}
              </span>
            </div>

            <div className="p-8 mb-8 bg-slate-50 rounded-3xl border-2 border-slate-100 relative overflow-hidden">
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                Incident Description
              </h3>
              <p className="text-lg font-medium text-slate-700 leading-relaxed relative z-10">{report.description}</p>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <MessageSquare size={80} />
              </div>
            </div>

            {report.issueImage && (
              <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100">
                <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-4 p-4 pb-0 flex items-center gap-2">
                  Attached Evidence
                </h3>
                <div className="p-4 pt-2">
                  <img 
                    src={`${serverUrl}${report.issueImage}`} 
                    alt="Issue Evidence" 
                    className="w-full h-auto max-h-[500px] object-contain rounded-2xl cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => window.open(`${serverUrl}${report.issueImage}`, '_blank')}
                  />
                </div>
              </div>
            )}

            <div className="space-y-6">
              {report.adminNotes && (
                <div className="p-8 bg-blue-50 rounded-3xl border-2 border-blue-100">
                  <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} /> Admin Update
                  </h3>
                  <p className="text-lg font-medium text-blue-900 leading-relaxed">{report.adminNotes}</p>
                </div>
              )}

              {/* ✅ FIX: Admin and Technician (Staff) can both see internal technical findings */}
              {(isAdmin || isTechnician) && report.technicianNotes && (
                <div className="p-8 bg-emerald-50 rounded-3xl border-2 border-emerald-100">
                  <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Wrench size={16} /> Technician Findings (Internal)
                  </h3>
                  <p className="text-lg font-medium text-emerald-900 leading-relaxed">{report.technicianNotes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 bg-white shadow-xl rounded-3xl border border-slate-100">
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-6 flex items-center gap-2">
              Timeline
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                  <div className="w-0.5 h-full bg-slate-100"></div>
                </div>
                <div>
                  <p className="text-sm font-black text-blue-950 uppercase tracking-tight">Report Created</p>
                  <p className="text-xs font-bold text-slate-400">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {report.status !== 'pending' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-blue-950 uppercase tracking-tight">Status: {report.status}</p>
                    <p className="text-xs font-bold text-slate-400">Last updated {new Date(report.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 bg-white shadow-xl rounded-3xl border border-slate-100">
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-6">Reporter Information</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-950">
                <User size={24} />
              </div>
              <div>
                <p className="font-black text-blue-950">{report.reportedBy?.name || 'Anonymous'}</p>
                <p className="text-xs font-bold text-slate-400">{report.reportedBy?.email || 'No email provided'}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Address</p>
              <p className="text-sm font-bold text-blue-950">{report.reportedBy?.address || 'Not specified'}</p>
            </div>
          </div>

          <div className="p-6 bg-white shadow-xl rounded-3xl border border-slate-100">
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-6">Assigned Technician</h3>
            {report.assignedTo ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Wrench size={24} />
                </div>
                <div>
                  <p className="font-black text-blue-950">{report.assignedTo.name}</p>
                  <p className="text-xs font-bold text-slate-400">{report.assignedTo.email}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-500">No technician assigned yet</p>
              </div>
            )}

            {isAdmin && !report.assignedTo && (
              <div className="mt-6 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign New</p>
                <select 
                  onChange={(e) => handleAssignTechnician(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-blue-950 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  value={report.assignedTo?._id || ''}
                >
                  <option value="" disabled>Select Technician</option>
                  {technicians.map(tech => (
                    <option key={tech._id} value={tech._id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            )}

            {isAdmin && report.assignedTo && (report.status !== 'Fixed' && report.status !== 'Resolved') && (
              <div className="mt-6">
                <button 
                  onClick={() => {
                    // This allows admin to see the dropdown again to re-assign
                    setReport({...report, assignedTo: null})
                  }}
                  className="w-full py-2.5 text-[10px] font-black text-blue-950 border-2 border-slate-100 rounded-xl hover:bg-slate-50 hover:border-blue-950/10 transition-all uppercase tracking-widest"
                >
                  Change Assigned Technician
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-blue-950 mb-6 uppercase tracking-tight">Update Report Status</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Reported', 'Technician Assigned', 'In Progress', 'Fixed', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => setNewStatus(status)}
                      className={`p-3 rounded-xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${
                        newStatus === status ? 'bg-blue-950 text-white border-blue-950 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-blue-950/20'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  {isAdmin ? 'Admin' : 'Technician'} Progress Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-blue-950 focus:border-blue-950 focus:ring-0 outline-none transition-all resize-none"
                  placeholder="Enter detailed update notes here..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-6 py-4 font-black text-slate-400 hover:text-blue-950 transition-colors uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 px-6 py-4 bg-blue-950 text-white font-black rounded-2xl hover:bg-blue-900 transition-all shadow-xl uppercase tracking-widest text-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ReportDetails
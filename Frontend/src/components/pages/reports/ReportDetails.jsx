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
  // eslint-disable-next-line no-unused-vars
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
        
        // Dispatch event to trigger map refresh across dashboard
        window.dispatchEvent(new CustomEvent('reportStatusChanged', { 
          detail: { id, status: newStatus, area: res.report.supplyArea } 
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update report')
    }
  }

  // ✅ NEW: Dedicated function for the Admin to instantly resolve verified fixes
  const handleDirectResolve = async () => {
    if (window.confirm("Verify that the technician has fixed this issue. Marking this as Resolved will clear the alert and turn the map Green. Proceed?")) {
      try {
        const res = await reportService.updateStatus(id, 'Resolved', { adminNotes: notes })
        if (res.success) {
          setReport(res.report)
          setNewStatus('Resolved')
          toast.success('Issue officially Resolved. Map updated.')
          
          window.dispatchEvent(new CustomEvent('reportStatusChanged', { 
            detail: { id, status: 'Resolved', area: res.report.supplyArea } 
          }));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to resolve report')
      }
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

  const getAvailableStatuses = () => {
    if (isAdmin) {
      const baseStatuses = ['Reported', 'Technician Assigned', 'In Progress', 'Fixed', 'Cancelled']
      if (report.status === 'Fixed') {
        baseStatuses.push('Resolved')
      }
      return baseStatuses
    }
    if (isTechnician) {
      return ['In Progress', 'Fixed', 'Cancelled']
    }
    return []
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-12 h-12 border-4 rounded-full border-t-sky-500 border-sky-100 animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center bg-white shadow-sm rounded-2xl">
          <p className="font-bold text-red-500">{error || 'Report not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 font-bold text-sky-600">Go Back</button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-xs font-black tracking-widest uppercase transition-colors text-sky-600 hover:text-sky-700"
      >
        <ArrowLeft size={20} />
        Back to Log
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="p-8 bg-white border shadow-xl rounded-3xl border-slate-100">
            <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-start">
              <div>
                <h1 className="mb-3 text-3xl font-black tracking-tight text-blue-950">{report.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-400">
                  <span className="flex items-center gap-1.5 font-black text-sky-600 bg-sky-50 px-2 py-1 rounded-lg">
                    <MapPin size={16} />{report.supplyArea}
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
                      className="flex items-center gap-2 px-6 py-3 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-blue-950 rounded-xl hover:bg-blue-900"
                    >
                      <CheckCircle size={18} />
                      UPDATE STATUS
                    </button>

                    {/* ✅ NEW: Dedicated 'Resolve' Button ONLY for Admins when the issue is 'Fixed' */}
                    {isAdmin && report.status === 'Fixed' && (
                      <button 
                        onClick={handleDirectResolve}
                        className="flex items-center gap-2 px-6 py-3 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-emerald-500/20"
                      >
                        <ShieldCheck size={18} />
                        VERIFY & RESOLVE
                      </button>
                    )}

                    {isAdmin && (
                      <button 
                        onClick={handleDelete}
                        className="px-4 py-3 text-xs font-black tracking-widest text-red-600 uppercase transition-all bg-red-50 hover:bg-red-100 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </>
                ) : (
                  report.status === 'Reported' && report.reportedBy?._id === currentUser?.id && (
                    <button
                      onClick={() => navigate(`/reports/${report._id}/edit`)}
                      className="flex items-center gap-2 px-6 py-3 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-blue-950 rounded-xl hover:bg-blue-900"
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
                report.status === 'Fixed' ? 'bg-indigo-100 text-indigo-700' :
                report.status === 'Resolved' ? 'bg-emerald-600 text-white' :
                'bg-slate-100 text-slate-700'
              }`}>
                {report.status === 'Fixed' 
                  ? (isStaff ? 'Verification Required' : 'Repair Under Review') 
                  : report.status === 'Resolved' 
                    ? 'Fixed' 
                    : report.status}
              </span>
            </div>

            <div className="relative p-8 mb-8 overflow-hidden border-2 bg-slate-50 rounded-3xl border-slate-100">
              <h3 className="flex items-center gap-2 mb-4 text-xs font-black tracking-widest uppercase text-blue-950">
                Incident Description
              </h3>
              <p className="relative z-10 text-lg font-medium leading-relaxed text-slate-700">{report.description}</p>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <MessageSquare size={80} />
              </div>
            </div>

            {report.issueImage && (
              <div className="mb-8 overflow-hidden border-2 rounded-3xl border-slate-100">
                <h3 className="flex items-center gap-2 p-4 pb-0 mb-4 text-xs font-black tracking-widest uppercase text-blue-950">
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
                <div className="p-8 border-2 border-blue-100 bg-blue-50 rounded-3xl">
                  <h3 className="flex items-center gap-2 mb-4 text-xs font-black tracking-widest uppercase text-blue-950">
                    <ShieldCheck size={16} /> Admin Update
                  </h3>
                  <p className="text-lg font-medium leading-relaxed text-blue-900">{report.adminNotes}</p>
                </div>
              )}

              {(isAdmin || isTechnician) && report.technicianNotes && (
                <div className="p-8 border-2 bg-emerald-50 rounded-3xl border-emerald-100">
                  <h3 className="flex items-center gap-2 mb-4 text-xs font-black tracking-widest uppercase text-blue-950">
                    <Wrench size={16} /> Technician Findings (Internal)
                  </h3>
                  <p className="text-lg font-medium leading-relaxed text-emerald-900">{report.technicianNotes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 bg-white border shadow-xl rounded-3xl border-slate-100">
            <h3 className="flex items-center gap-2 mb-6 text-xs font-black tracking-widest uppercase text-blue-950">
              Timeline
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full shadow-lg bg-emerald-500 shadow-emerald-500/50"></div>
                  <div className="w-0.5 h-full bg-slate-100"></div>
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight uppercase text-blue-950">Report Created</p>
                  <p className="text-xs font-bold text-slate-400">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {report.status !== 'Reported' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight uppercase text-blue-950">Status: {report.status}</p>
                    <p className="text-xs font-bold text-slate-400">Last updated {new Date(report.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 bg-white border shadow-xl rounded-3xl border-slate-100">
            <h3 className="mb-6 text-xs font-black tracking-widest uppercase text-blue-950">Reporter Information</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-2xl text-blue-950">
                <User size={24} />
              </div>
              <div>
                <p className="font-black text-blue-950">{report.reportedBy?.name || 'Anonymous'}</p>
                <p className="text-xs font-bold text-slate-400">{report.reportedBy?.email || 'No email provided'}</p>
              </div>
            </div>
            <div className="p-4 border bg-slate-50 rounded-2xl border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Address</p>
              <p className="text-sm font-bold text-blue-950">{report.reportedBy?.address || 'Not specified'}</p>
            </div>
          </div>

          <div className="p-6 bg-white border shadow-xl rounded-3xl border-slate-100">
            <h3 className="mb-6 text-xs font-black tracking-widest uppercase text-blue-950">Assigned Technician</h3>
            {report.assignedTo ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-2xl text-emerald-600">
                  <Wrench size={24} />
                </div>
                <div>
                  <p className="font-black text-blue-950">{report.assignedTo.name}</p>
                  <p className="text-xs font-bold text-slate-400">{report.assignedTo.email}</p>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center border-2 border-dashed bg-slate-50 rounded-2xl border-slate-200">
                <p className="text-xs font-bold text-slate-500">No technician assigned yet</p>
              </div>
            )}

            {isAdmin && !report.assignedTo && (
              <div className="mt-6 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign New</p>
                <select 
                  onChange={(e) => handleAssignTechnician(e.target.value)}
                  className="w-full p-3 text-sm font-bold border outline-none bg-slate-50 border-slate-100 rounded-xl text-blue-950 focus:ring-2 focus:ring-sky-500"
                  value={report.assignedTo?._id || ''}
                >
                  <option value="" disabled>Select Technician</option>
                  {technicians.map(tech => (
                    <option key={tech._id} value={tech._id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* ✅ FIXED: Do not hide the Change Technician button even if it is Fixed, only hide it when completely Resolved */}
            {isAdmin && report.assignedTo && report.status !== 'Resolved' && (
              <div className="mt-6">
                <button 
                  onClick={() => {
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
          <div className="w-full max-w-lg p-8 duration-300 bg-white shadow-2xl rounded-3xl animate-in zoom-in">
            <h2 className="mb-6 text-2xl font-black tracking-tight uppercase text-blue-950">Update Report Status</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {getAvailableStatuses().map(status => (
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
                  className="w-full h-32 p-4 font-medium transition-all border-2 outline-none resize-none bg-slate-50 border-slate-100 rounded-2xl text-blue-950 focus:border-blue-950 focus:ring-0"
                  placeholder="Enter detailed update notes here..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-6 py-4 text-xs font-black tracking-widest uppercase transition-colors text-slate-400 hover:text-blue-950"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 px-6 py-4 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-blue-950 rounded-2xl hover:bg-blue-900"
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
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import technicianService from '../../services/technicianService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { toast } from 'react-toastify'
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  ClipboardList,
  Wrench,
  CheckSquare,
  X,
  Save,
  MessageSquare,
  History
} from 'lucide-react'

function TechnicianDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchQuery } = useSearch()
  
  const queryParams = new URLSearchParams(location.search)
  const isHistoryView = queryParams.get('view') === 'history'

  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: ''
  })

  useEffect(() => {
    fetchTechnicianData()
  }, [])

  const fetchTechnicianData = async () => {
    try {
      setLoading(true)
      const res = await technicianService.getAssignedReports()
      if (res.success) {
        setReports(res.reports || [])
      }
    } catch (error) {
      console.error('Error fetching technician data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenUpdate = (report, e) => {
    e.stopPropagation()
    setSelectedReport(report)
    setUpdateForm({
      status: report.status,
      notes: report.technicianNotes || ''
    })
    setShowUpdateModal(true)
  }

  const handleUpdateSubmit = async () => {
    try {
      const res = await technicianService.updateReportStatus(
        selectedReport._id, 
        updateForm.status, 
        updateForm.notes
      )
      if (res.success) {
        toast.success('Work order updated successfully')
        setShowUpdateModal(false)
        fetchTechnicianData() // Refresh list
      }
    } catch (error) {
      toast.error('Failed to update work order')
    }
  }

  const filteredReports = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim()
    
    // Toggle between active and history
    const baseReports = isHistoryView 
      ? reports.filter(r => r.status === 'Fixed' || r.status === 'Cancelled')
      : reports.filter(r => r.status !== 'Fixed' && r.status !== 'Cancelled')
    
    if (!query) return baseReports
    return baseReports.filter(report => 
      report.title.toLowerCase().includes(query) ||
      report.location.toLowerCase().includes(query) ||
      report.status.toLowerCase().includes(query)
    )
  }, [reports, searchQuery, isHistoryView])

  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter(r => ['Reported', 'Technician Assigned', 'In Progress'].includes(r.status)).length,
      resolved: reports.filter(r => r.status === 'Fixed').length,
      critical: reports.filter(r => r.severity === 'critical' && r.status !== 'Fixed').length
    }
  }, [reports])

  const getRelativeTime = (date) => {
    const now = new Date()
    const created = new Date(date)
    const diffMs = now - created
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-50 text-red-600 border-red-100'
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-100'
      case 'medium': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Reported': return 'bg-orange-100 text-orange-700'
      case 'Technician Assigned': return 'bg-blue-100 text-blue-700'
      case 'In Progress': return 'bg-sky-100 text-sky-700'
      case 'Fixed': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-16 h-16 border-t-4 border-blue-900 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-bold text-blue-950 animate-pulse">Accessing Field Portal...</p>
        </div>
      </DashboardLayout>
    )
  }

  const mainStats = [
    { icon: ClipboardList, label: 'Work Orders', value: stats.total, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: Clock, label: 'Active Tasks', value: stats.pending, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: CheckSquare, label: 'Completed', value: stats.resolved, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: AlertTriangle, label: 'High Priority', value: stats.critical, bg: 'bg-red-50', iconColor: 'text-red-600' },
  ]

  return (
    <DashboardLayout>
      <div className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black tracking-widest uppercase border rounded-lg text-emerald-400 border-emerald-400/20 bg-emerald-400/5">
            <Wrench size={14} />
            <span>Field Technician Console</span>
          </div>
          <h1 className="text-3xl font-black text-white md:text-4xl">
            {isHistoryView ? 'Job History' : 'Service Assignments'}
          </h1>
          <p className="mt-2 text-lg font-medium text-slate-400">
            {isHistoryView ? 'Review your completed maintenance records.' : 'Manage your active maintenance tickets and repair logs.'}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 -mr-32 -mt-32 rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>

      {!isHistoryView && (
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {mainStats.map((stat, index) => (
            <div key={index} className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
              <div className={`flex items-center justify-center w-12 h-12 mb-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
              <div className="text-3xl font-black text-blue-950">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isHistoryView ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isHistoryView ? <History size={24} /> : <ClipboardList size={24} />}
            </div>
            <h2 className="text-2xl font-black text-blue-950">
              {isHistoryView ? 'Completed Jobs' : 'Active Work Orders'}
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              {isHistoryView ? (
                <>
                  <History className="mx-auto text-slate-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-blue-950">No History</h3>
                  <p className="text-slate-500">You haven't completed any work orders yet.</p>
                </>
              ) : (
                <>
                  <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-blue-950">No Active Tasks</h3>
                  <p className="text-slate-500">All your assigned work orders are currently completed.</p>
                </>
              )}
            </div>
          ) : (
            filteredReports.map((report) => (
              <div 
                key={report._id}
                onClick={() => navigate(`/reports/${report._id}`)}
                className="group flex flex-col md:flex-row md:items-center gap-4 p-5 transition-all border border-slate-100 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-slate-50/50"
              >
                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl flex-shrink-0 border ${getSeverityColor(report.severity)}`}>
                  <Zap size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-blue-950 truncate group-hover:text-emerald-600 transition-colors">{report.title}</h3>
                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{report.location} • {getRelativeTime(report.createdAt)}</p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-1">{report.description}</p>
                </div>
                {!isHistoryView && (
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2">
                    <button 
                      onClick={(e) => handleOpenUpdate(report, e)}
                      className="px-6 py-2.5 text-xs font-black text-white bg-blue-950 rounded-xl hover:bg-blue-900 transition-all shadow-lg flex items-center gap-2"
                    >
                      <Wrench size={14} />
                      UPDATE LOG
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== UPDATE PROGRESS MODAL ===== */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Update Work Order</h2>
              <button onClick={() => setShowUpdateModal(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Task Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {['In Progress', 'Fixed', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => setUpdateForm({...updateForm, status})}
                      className={`p-3 rounded-xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${
                        updateForm.status === status ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-emerald-600/20'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Technical Findings / Notes</label>
                <textarea
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                  className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-blue-950 focus:border-emerald-600 focus:ring-0 outline-none transition-all resize-none"
                  placeholder="Describe the repair work performed..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-6 py-4 font-black text-slate-400 hover:text-blue-950 transition-colors uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  <Save size={18} />
                  Save Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default TechnicianDashboard

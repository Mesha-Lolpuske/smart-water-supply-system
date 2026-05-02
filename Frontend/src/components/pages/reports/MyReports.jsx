import DashboardLayout from '../../layout/DashboardLayout'
import { Plus, Filter, Eye, Trash2, AlertTriangle, FileText, Clock, Search, MapPin, Image as ImageIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { reportService } from '../../services/reportService'
import { useSearch } from '../../context/SearchContext'

function MyReports() {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery } = useSearch()
  const [filterStatus, setFilterStatus] = useState('all')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyReports()
  }, [])

  const fetchMyReports = async () => {
    try {
      setLoading(true)
      const res = await reportService.getMyReports()
      if (res.success) {
        setReports(res.reports || [])
      }
    } catch (err) {
      console.error('Error fetching my reports:', err)
      setError('Failed to load your reports.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const res = await reportService.deleteReport(id)
        if (res.success) {
          setReports(prev => prev.filter(r => r._id !== id))
          toast.success('Report deleted successfully')
        }
        } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete report')
        }
        }
        }

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
    const colors = {
      critical: 'bg-red-50 text-red-600 border-red-100',
      high: 'bg-orange-50 text-orange-600 border-orange-100',
      medium: 'bg-blue-50 text-blue-600 border-blue-100',
      low: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    }
    return colors[severity] || 'bg-slate-50 text-slate-600'
  }

  const getStatusColor = (status) => {
    const colors = {
      'Reported': 'bg-orange-100 text-orange-700',
      'Technician Assigned': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-sky-100 text-sky-700',
      'Fixed': 'bg-emerald-100 text-emerald-700',
      'Resolved': 'bg-emerald-100 text-emerald-700',
      'Cancelled': 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-slate-100 text-slate-700'
  }

  const filteredReports = reports.filter(r => {
    let matchesStatus = true;
    if (filterStatus === 'pending') matchesStatus = r.status === 'Reported';
    else if (filterStatus === 'investigating') matchesStatus = ['Technician Assigned', 'In Progress'].includes(r.status);
    else if (filterStatus === 'resolved') matchesStatus = ['Fixed', 'Resolved'].includes(r.status);
    
    const query = (searchQuery || '').toLowerCase().trim()
    const matchesSearch = !query || 
      r.title.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query) ||
      r.severity.toLowerCase().includes(query)
    
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <DashboardLayout isAdmin={false}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-t-sky-500 border-sky-100 rounded-full animate-spin mb-4"></div>
          <p className="text-blue-950 font-black uppercase tracking-widest text-xs">Syncing your incident logs...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={false}>
      <div className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-blue-950 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black md:text-4xl tracking-tight">Incident Logs</h1>
            <p className="mt-2 text-lg font-medium text-sky-300/70">Track and manage your submitted infrastructure incidents.</p>
          </div>
          <button
            onClick={() => navigate('/reports/create')}
            className="flex items-center justify-center gap-2 px-8 py-4 font-black transition-all rounded-xl text-blue-950 bg-sky-300 hover:bg-sky-200 shadow-lg shadow-sky-400/20 active:scale-95"
          >
            <Plus size={20} />
            LOG NEW INCIDENT
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 rounded-full bg-sky-400/10 blur-3xl"></div>
      </div>

      {searchQuery && (
        <div className="p-4 mb-8 border-2 bg-sky-50 border-sky-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="text-sky-600" size={20} />
            <p className="text-sm font-bold text-blue-950">
              Showing results for: <span className="text-sky-600 font-black">"{searchQuery}"</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
              {filteredReports.length} match(es)
            </span>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-black transition-colors text-sky-600 hover:text-sky-800 underline underline-offset-4"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Filter size={18} className="text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm font-bold text-blue-950 bg-transparent outline-none cursor-pointer pr-4"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="px-4 py-2.5 bg-blue-950 text-white rounded-xl shadow-lg">
            <span className="text-xs font-black tracking-widest uppercase">{filteredReports.length} Total</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.length === 0 ? (
          <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-3xl">
            <FileText className="w-20 h-20 mx-auto mb-6 text-slate-200" />
            <h3 className="mb-2 text-2xl font-black text-blue-950">No Incident Logs Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">You haven't submitted any incidents matching this criteria.</p>
            <button
              onClick={() => navigate('/reports/create')}
              className="px-8 py-4 mt-8 font-black text-white transition-all rounded-xl bg-blue-950 hover:bg-blue-900 shadow-xl active:scale-95"
            >
              Log Your First Incident
            </button>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report._id} className="group p-6 transition-all bg-white border border-slate-100 shadow-sm rounded-2xl hover:shadow-xl hover:border-sky-200">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-blue-950 group-hover:text-sky-600 transition-colors truncate">{report.title}</h3>
                    <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border-2 ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-sky-500" />{report.location}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-sky-500" />{getRelativeTime(report.createdAt)}</span>
                    {report.issueImage && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-sky-50 text-sky-600 rounded-lg text-[10px] uppercase font-black">
                        <ImageIcon size={14} />
                        Image Attached
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl ${getStatusColor(report.status)} shadow-sm`}>
                    {report.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-50">
                <button
                  onClick={() => navigate(`/reports/${report._id}`)}
                  className="flex items-center justify-center flex-1 gap-2 px-6 py-3.5 text-xs font-black transition-all rounded-xl text-blue-950 bg-slate-100 hover:bg-slate-200 uppercase tracking-widest"
                >
                  <Eye size={16} />
                  View Details
                </button>
                {report.status === 'pending' && (
                  <button 
                    onClick={() => handleDelete(report._id)}
                    className="flex items-center justify-center px-6 py-3.5 text-red-600 transition-all bg-red-50 rounded-xl hover:bg-red-100 border border-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}

export default MyReports
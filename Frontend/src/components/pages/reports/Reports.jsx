import DashboardLayout from '../../layout/DashboardLayout'
import { Filter, Eye, Trash2, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Reports() {
  const navigate = useNavigate()
  const [filterSeverity, setFilterSeverity] = useState('all')

 

  const reports = [
    { id: 1, title: 'No water supply', user: 'John Doe', severity: 'critical', status: 'pending', time: '10 mins ago', location: 'Westlands' },
    { id: 2, title: 'Low water pressure', user: 'Jane Smith', severity: 'high', status: 'investigating', time: '1 hour ago', location: 'Kilimani' },
    { id: 3, title: 'Water contamination', user: 'Mike Johnson', severity: 'critical', status: 'pending', time: '2 hours ago', location: 'CBD' },
    { id: 4, title: 'Pipe leak', user: 'Sarah Williams', severity: 'medium', status: 'resolved', time: '5 hours ago', location: 'Karen' },
  ]

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    }
    return colors[severity] || colors.low
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-red-100 text-red-700',
      investigating: 'bg-blue-100 text-blue-700',
      resolved: 'bg-emerald-100 text-emerald-700'
    }
    return colors[status] || colors.pending
  }

  const filteredReports = filterSeverity === 'all'
    ? reports
    : reports.filter(r => r.severity === filterSeverity)

  return (
    <DashboardLayout isAdmin={true}>
      <div className="p-6 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-950 to-blue-900">
        <h1 className="text-3xl font-bold">All Reports</h1>
        <p className="text-sky-200">Monitor and manage all water supply reports from users</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white border-l-4 border-red-400 rounded-lg shadow-sm">
          <p className="text-sm text-slate-600">Pending</p>
          <p className="text-2xl font-bold text-red-600">
            {reports.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="p-4 bg-white border-l-4 border-blue-400 rounded-lg shadow-sm">
          <p className="text-sm text-slate-600">Investigating</p>
          <p className="text-2xl font-bold text-blue-600">
            {reports.filter(r => r.status === 'investigating').length}
          </p>
        </div>
        <div className="p-4 bg-white border-l-4 rounded-lg shadow-sm border-emerald-400">
          <p className="text-sm text-slate-600">Resolved</p>
          <p className="text-2xl font-bold text-emerald-600">
            {reports.filter(r => r.status === 'resolved').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-slate-600" />
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-2 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="p-6 transition-all bg-white border-l-4 rounded-lg border-sky-400 hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-blue-950">{report.title}</h3>
                {/* Admin sees WHO submitted it */}
                <p className="text-sm text-slate-600">
                  Submitted by <span className="font-semibold text-sky-600">{report.user}</span> • {report.location}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getSeverityColor(report.severity)}`}>
                  {report.severity}
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            </div>
            <p className="mb-4 text-xs text-slate-500">{report.time}</p>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/reports/${report.id}`)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border rounded-lg text-sky-600 border-sky-300 hover:bg-sky-50"
              >
                <Eye size={16} />
                View & Manage
              </button>
              {/* Admin can mark as resolved */}
              {report.status !== 'resolved' && (
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border rounded-lg text-emerald-600 border-emerald-300 hover:bg-emerald-50">
                  <CheckCircle size={16} />
                  Mark Resolved
                </button>
              )}
              {/* Admin can delete */}
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 transition-all border border-red-300 rounded-lg hover:bg-red-50">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default Reports
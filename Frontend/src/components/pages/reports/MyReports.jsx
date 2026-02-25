import DashboardLayout from '../../layout/DashboardLayout'
import { Plus, Filter, Eye, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function MyReports() {
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('all')

  const myReports = [
    { id: 1, title: 'No water supply', severity: 'high', status: 'pending', time: '2 hours ago', location: 'Westlands' },
    { id: 2, title: 'Low water pressure', severity: 'medium', status: 'investigating', time: '5 hours ago', location: 'Kilimani' },
    { id: 3, title: 'Water leak reported', severity: 'low', status: 'resolved', time: '1 day ago', location: 'CBD' },
    { id: 4, title: 'Meter malfunction', severity: 'medium', status: 'resolved', time: '3 days ago', location: 'Karen' },
  ]

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    }
    return colors[severity] || colors.low
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-700',
      investigating: 'bg-blue-100 text-blue-700',
      resolved: 'bg-emerald-100 text-emerald-700'
    }
    return colors[status] || colors.pending
  }

  const filteredReports = filterStatus === 'all'
    ? myReports
    : myReports.filter(r => r.status === filterStatus)

  return (
    <DashboardLayout isAdmin={false}>
      <div className="flex items-center justify-between p-6 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-950 to-blue-900">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="text-sky-200">Track your submitted water supply reports</p>
        </div>
        {/* Users CAN create reports */}
        <button
          onClick={() => navigate('/reports/create')}
          className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-sky-400 to-sky-300 hover:shadow-lg"
        >
          <Plus size={20} />
          New Report
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-slate-600" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border-2 rounded-lg border-sky-200 focus:outline-none focus:border-sky-400"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="p-6 transition-all bg-white border-l-4 rounded-lg border-sky-400 hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-blue-950">{report.title}</h3>
                <p className="text-sm text-slate-600">{report.location}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getSeverityColor(report.severity)}`}>
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
                onClick={() => navigate(`/reports/${report.id}`)}
                className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-semibold transition-all border rounded-lg text-sky-600 border-sky-300 hover:bg-sky-50"
              >
                <Eye size={16} />
                View Details
              </button>
              {/* Users can only delete their OWN pending reports */}
              {report.status === 'pending' && (
                <button className="px-4 py-2 text-sm font-semibold text-red-600 transition-all border border-red-300 rounded-lg hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default MyReports
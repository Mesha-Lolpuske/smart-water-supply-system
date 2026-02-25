import DashboardLayout from '../../layout/DashboardLayout'
import { 
  Users,
  Calendar,
  FileText,
  Megaphone,
  Bell,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()

  // Mock data - Admin stats
  const stats = [
    { icon: Users, label: 'Total Users', value: '1,234', change: '+12%', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: FileText, label: 'Pending Reports', value: '28', change: '+5', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: Calendar, label: 'Active Schedules', value: '15', change: '+3', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: Megaphone, label: 'Announcements', value: '42', change: '+8', color: 'from-green-500 to-green-600', bg: 'bg-green-50', iconColor: 'text-green-600' },
  ]

  // System overview stats
  const systemStats = [
    { label: 'Critical Reports', value: '5', color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Resolved Today', value: '12', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Investigating', value: '8', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Response Time', value: '2.5h', color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  // Recent reports
  const recentReports = [
    { id: 1, user: 'John Doe', title: 'No water supply', severity: 'critical', status: 'pending', time: '10 mins ago', location: 'Westlands' },
    { id: 2, user: 'Jane Smith', title: 'Low water pressure', severity: 'high', status: 'investigating', time: '1 hour ago', location: 'Kilimani' },
    { id: 3, user: 'Mike Johnson', title: 'Water contamination', severity: 'critical', status: 'pending', time: '2 hours ago', location: 'CBD' },
    { id: 4, user: 'Sarah Williams', title: 'Pipe leak', severity: 'medium', status: 'resolved', time: '5 hours ago', location: 'Karen' },
  ]

  // Recent activities
  const recentActivities = [
    { type: 'report', message: 'New critical report from John Doe', time: '5 mins ago', icon: AlertTriangle, color: 'text-red-600' },
    { type: 'schedule', message: 'New schedule created for Zone A', time: '15 mins ago', icon: Calendar, color: 'text-blue-600' },
    { type: 'announcement', message: 'Urgent announcement published', time: '30 mins ago', icon: Megaphone, color: 'text-orange-600' },
    { type: 'resolved', message: 'Report #1234 marked as resolved', time: '1 hour ago', icon: CheckCircle, color: 'text-green-600' },
  ]

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-orange-100 text-orange-700'
      case 'investigating': return 'bg-blue-100 text-blue-700'
      case 'resolved': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <DashboardLayout isAdmin={true}>
      {/* Welcome Section */}
      <div className="p-6 mb-8 text-white rounded-xl bg-gradient-to-r from-blue-950 to-blue-900">
        <h1 className="mb-2 text-3xl font-bold">Admin Dashboard 👨‍💼</h1>
        <p className="text-sky-200">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 transition-all duration-300 bg-white border-2 border-transparent shadow-sm rounded-xl hover:shadow-lg hover:border-sky-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
              <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold text-blue-950">{stat.value}</div>
            <div className="text-sm font-medium text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
        {systemStats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg border-2 border-sky-200 ${stat.bg} hover:border-sky-400 hover:shadow-md transition-all`}>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm font-medium text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* Recent Reports */}
        <div className="p-6 bg-white border-l-4 shadow-sm rounded-xl border-sky-400">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-blue-950">Recent Reports</h2>
            <button onClick={() => navigate('/admin/reports')} className="text-sm font-semibold text-sky-600 hover:text-sky-700">View All →</button>
          </div>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 transition-all border rounded-lg cursor-pointer hover:bg-sky-50 hover:border-sky-300 group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold transition text-blue-950 group-hover:text-sky-600">{report.title}</h3>
                    <p className="text-xs text-slate-500">{report.user} • {report.location}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getSeverityColor(report.severity)}`}>{report.severity}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>{report.status}</span>
                  <span className="text-xs text-slate-500">{report.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 bg-white border-l-4 border-purple-400 shadow-sm rounded-xl">
          <h2 className="mb-6 text-xl font-bold text-blue-950">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-3 pb-4 border-b last:border-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100">
                  <activity.icon className={activity.color} size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-950">{activity.message}</p>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-2 rounded-xl border-sky-300 bg-gradient-to-r from-sky-50 to-blue-50">
        <h2 className="mb-4 text-xl font-bold text-blue-950">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {([
            { icon: Calendar, label: 'Create Schedule', onClick: () => navigate('/admin/schedules/create') },
            { icon: Megaphone, label: 'New Announcement', onClick: () => navigate('/admin/announcements/create') },
            { icon: FileText, label: 'Manage Reports', onClick: () => navigate('/admin/reports') },
            { icon: Users, label: 'User Management', onClick: () => navigate('/admin/users') }
          ]).map((action, i) => (
            <button key={i} onClick={action.onClick} className="p-4 text-left transition-all bg-white border-2 rounded-lg border-sky-200 hover:border-sky-400 hover:shadow-md group">
              <action.icon className="mb-2 transition-transform text-sky-600 group-hover:scale-110" size={24} />
              <h3 className="text-sm font-semibold text-blue-950">{action.label}</h3>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
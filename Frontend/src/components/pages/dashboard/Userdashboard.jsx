import DashboardLayout from '../../layout/DashboardLayout'
import { 
  Calendar, 
  FileText, 
  Bell, 
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function UserDashboard() {
  const navigate = useNavigate()

  // Mock data
  const stats = [
    { icon: Calendar, label: 'Active Schedules', value: '3', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: FileText, label: 'My Reports', value: '5', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: Bell, label: 'Notifications', value: '12', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: CheckCircle, label: 'Resolved Issues', value: '8', color: 'from-green-500 to-green-600', bg: 'bg-green-50', iconColor: 'text-green-600' },
  ]

  const recentReports = [
    { id: 1, title: 'No water supply', status: 'pending', severity: 'high', time: '2 hours ago', statusColor: 'bg-orange-100 text-orange-700' },
    { id: 2, title: 'Low water pressure', status: 'investigating', severity: 'medium', time: '5 hours ago', statusColor: 'bg-blue-100 text-blue-700' },
    { id: 3, title: 'Water leak reported', status: 'resolved', severity: 'low', time: '1 day ago', statusColor: 'bg-green-100 text-green-700' },
  ]

  const activeSchedules = [
    { id: 1, title: 'Morning Water Supply', time: '6:00 AM - 10:00 AM', days: 'Mon-Fri' },
    { id: 2, title: 'Evening Supply', time: '5:00 PM - 8:00 PM', days: 'Daily' },
  ]

  const urgentAnnouncements = [
    { id: 1, title: 'Water Shortage Alert', message: 'Limited supply expected tomorrow', time: '1 hour ago' },
    { id: 2, title: 'Maintenance Notice', message: 'Scheduled maintenance on Sunday', time: '3 hours ago' },
  ]

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-blue-950">Welcome back, John! 👋</h1>
        <p className="text-slate-600">Here's what's happening with your water supply today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 transition-all duration-300 bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-blue-950">{stat.value}</div>
            <div className="text-sm font-medium text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* Recent Reports */}
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-blue-950">My Recent Reports</h2>
            <button 
              onClick={() => navigate('/reports/create')}
              className="px-4 py-2 text-sm font-semibold transition rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-lg"
            >
              + New Report
            </button>
          </div>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <div 
                key={report.id}
                className="flex items-start gap-4 p-4 transition border rounded-lg cursor-pointer border-slate-200 hover:border-sky-300 hover:bg-slate-50"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  report.severity === 'high' ? 'bg-red-100' :
                  report.severity === 'medium' ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  {report.status === 'resolved' ? 
                    <CheckCircle className="text-green-600" size={20} /> :
                    <AlertTriangle className={
                      report.severity === 'high' ? 'text-red-600' :
                      report.severity === 'medium' ? 'text-orange-600' : 'text-green-600'
                    } size={20} />
                  }
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-950">{report.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.statusColor}`}>
                      {report.status}
                    </span>
                    <span className="text-xs text-slate-500">{report.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/reports/my-reports')}
            className="w-full py-2 mt-4 text-sm font-medium transition rounded-lg text-sky-600 hover:bg-sky-50"
          >
            View All Reports
          </button>
        </div>

        {/* Active Schedules */}
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-blue-950">Active Schedules</h2>
            <button 
              onClick={() => navigate('/schedules')}
              className="text-sm font-medium transition text-sky-600 hover:text-sky-700"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {activeSchedules.map((schedule) => (
              <div 
                key={schedule.id}
                className="p-4 transition border-2 border-blue-100 rounded-lg cursor-pointer hover:border-sky-300 hover:bg-blue-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                    <Calendar className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-950">{schedule.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      <Clock className="inline mr-1" size={14} />
                      {schedule.time}
                    </p>
                    <span className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                      {schedule.days}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Announcements */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-blue-950">Urgent Announcements</h2>
          <button 
            onClick={() => navigate('/announcements')}
            className="text-sm font-medium transition text-sky-600 hover:text-sky-700"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {urgentAnnouncements.map((announcement) => (
            <div 
              key={announcement.id}
              className="flex items-start gap-4 p-4 transition border-l-4 border-orange-500 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100"
            >
              <AlertTriangle className="flex-shrink-0 text-orange-600" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-950">{announcement.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{announcement.message}</p>
                <span className="inline-block mt-2 text-xs text-slate-500">{announcement.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
        <button 
          onClick={() => navigate('/reports/create')}
          className="p-6 text-left transition bg-white border-2 border-transparent shadow-sm rounded-xl hover:border-sky-300 hover:shadow-md"
        >
          <FileText className="mb-3 text-blue-600" size={32} />
          <h3 className="mb-1 font-semibold text-blue-950">Report an Issue</h3>
          <p className="text-sm text-slate-600">Submit a new water supply report</p>
        </button>

        <button 
          onClick={() => navigate('/schedules')}
          className="p-6 text-left transition bg-white border-2 border-transparent shadow-sm rounded-xl hover:border-sky-300 hover:shadow-md"
        >
          <Calendar className="mb-3 text-blue-600" size={32} />
          <h3 className="mb-1 font-semibold text-blue-950">View Schedules</h3>
          <p className="text-sm text-slate-600">Check water distribution times</p>
        </button>

        <button 
          onClick={() => navigate('/notifications')}
          className="p-6 text-left transition bg-white border-2 border-transparent shadow-sm rounded-xl hover:border-sky-300 hover:shadow-md"
        >
          <Bell className="mb-3 text-blue-600" size={32} />
          <h3 className="mb-1 font-semibold text-blue-950">Notifications</h3>
          <p className="text-sm text-slate-600">View all your notifications</p>
        </button>
      </div>
    </DashboardLayout>
  )
}

export default UserDashboard
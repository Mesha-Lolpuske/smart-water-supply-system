import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { reportService } from '../../services/reportService'
import { scheduleService } from '../../services/scheduleService'
import { announcementService } from "../../services/announcement";
import { dashboardService } from "../../services/dashboardService";
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { 
  Calendar, 
  FileText, 
  Bell, 
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  PieChart as PieIcon
} from 'lucide-react'

function UserDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { searchQuery } = useSearch()
  
  // State for real data
  const [loading, setLoading] = useState(true)
  const [myReports, setMyReports] = useState([])
  const [activeSchedules, setActiveSchedules] = useState([])
  const [urgentAnnouncements, setUrgentAnnouncements] = useState([])
  const [stats, setStats] = useState({
    activeSchedules: 0,
    myReports: 0,
    notifications: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    investigatingIssues: 0
  })

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // 1. Fetch Stats
      const statsRes = await dashboardService.getUserStats()
      if (statsRes.success) {
        setStats({
          activeSchedules: statsRes.stats.system.activeSchedules,
          myReports: statsRes.stats.myReports.total,
          notifications: statsRes.stats.myNotifications.unread,
          resolvedIssues: statsRes.stats.myReports.resolved,
          pendingIssues: statsRes.stats.myReports.pending || 0,
          investigatingIssues: statsRes.stats.myReports.investigating || 0
        })
      }

      // 2. Fetch user's reports
      const reportsRes = await reportService.getMyReports()
      const reports = reportsRes.reports || []
      setMyReports(reports)

      // 3. Fetch active schedules
      const schedulesRes = await scheduleService.getActiveSchedules()
      const schedules = schedulesRes.schedules || []
      setActiveSchedules(schedules)

      // 4. Fetch announcements
      const announcementsRes = await announcementService.getAllAnnouncements()
      const announcements = announcementsRes.announcements || []
      const urgent = announcements.filter(a => 
        a.category === 'emergency' || a.category === 'maintenance' || a.priority === 'high' || a.priority === 'urgent'
      )
      setUrgentAnnouncements(urgent.slice(0, 2))

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = useMemo(() => {
    if (!searchQuery) return myReports.slice(0, 3)
    return myReports.filter(report => 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)
  }, [myReports, searchQuery])

  const filteredSchedules = useMemo(() => {
    if (!searchQuery) return activeSchedules.slice(0, 2)
    return activeSchedules.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 2)
  }, [activeSchedules, searchQuery])

  // Chart Data
  const reportStatusData = [
    { name: 'Pending', value: stats.pendingIssues, color: '#f97316' },
    { name: 'Investigating', value: stats.investigatingIssues, color: '#3b82f6' },
    { name: 'Resolved', value: stats.resolvedIssues, color: '#10b981' },
  ].filter(d => d.value > 0)

  // Fallback if no data
  const chartData = reportStatusData.length > 0 ? reportStatusData : [
    { name: 'No Reports Yet', value: 1, color: '#f1f5f9' }
  ]

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery) return urgentAnnouncements
    return urgentAnnouncements.filter(ann => 
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ann.content && ann.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [urgentAnnouncements, searchQuery])

  // Helper functions
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-700 border-orange-200',
      investigating: 'bg-blue-100 text-blue-700 border-blue-200',
      resolved: 'bg-green-100 text-green-700 border-green-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-50 text-red-600',
      high: 'bg-red-50 text-red-600',
      medium: 'bg-orange-50 text-orange-600',
      low: 'bg-emerald-50 text-emerald-600'
    }
    return colors[severity] || 'bg-gray-50 text-slate-600'
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 rounded-full border-sky-100 animate-pulse"></div>
            <div className="absolute inset-0 border-t-4 border-sky-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-bold text-blue-950 animate-pulse">Synchronizing Dashboard...</p>
          <p className="text-slate-500 mt-2">Fetching your latest water system updates</p>
        </div>
      </DashboardLayout>
    )
  }

  const statsData = [
    { icon: Calendar, label: 'Active Schedules', value: stats.activeSchedules, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: FileText, label: 'My Incidents', value: stats.myReports, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: Bell, label: 'Unread Alerts', value: stats.notifications, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: CheckCircle, label: 'Resolved Incidents', value: stats.resolvedIssues, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  ]

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 to-blue-900 shadow-2xl">
        <div className="relative z-10">
          <h1 className="mb-2 text-3xl font-extrabold text-white md:text-4xl">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-lg font-medium text-sky-200/80 max-w-2xl">
            Monitoring infrastructure in {user?.address || 'your registered zone'}. 
            Everything looks stable today.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 rounded-full bg-sky-400/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 ml-20 mb-10 rounded-full bg-blue-400/5 blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <div key={index} className="p-6 transition-all duration-300 bg-white border-2 border-transparent shadow-sm rounded-2xl hover:shadow-xl hover:-translate-y-1 hover:border-sky-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={stat.iconColor} size={28} />
              </div>
              <TrendingUp className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <div className="text-3xl font-black text-blue-950">{stat.value}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
        <div className="lg:col-span-2 p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-xl font-black text-blue-950">Water Availability Trends</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {name: 'Mon', hours: 4},
                {name: 'Tue', hours: 6},
                {name: 'Wed', hours: 8},
                {name: 'Thu', hours: 5},
                {name: 'Fri', hours: 9},
                {name: 'Sat', hours: 12},
                {name: 'Sun', hours: 10},
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Supply Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <PieIcon size={24} />
            </div>
            <h2 className="text-xl font-black text-blue-950">Incident Status</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
        
        {/* Recent Incidents */}
        <div className="lg:col-span-2 p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-black text-blue-950">
                {searchQuery ? `Search Results (${filteredReports.length})` : 'My Recent Incidents'}
              </h2>
            </div>
            <button 
              onClick={() => navigate('/reports/create')}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition rounded-xl text-blue-950 bg-sky-300 hover:bg-sky-200 hover:shadow-lg active:scale-95"
            >
              <Plus size={18} />
              New Incident
            </button>
          </div>

          {filteredReports.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-50 flex items-center justify-center rounded-full">
                <FileText className="text-slate-300" size={40} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-950">
                {searchQuery ? 'No Matching Incidents' : 'No Active Incidents'}
              </h3>
              <p className="mb-6 text-slate-500">
                {searchQuery ? 'Try another search term.' : "You haven't submitted any infrastructure issues yet."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate('/reports/create')}
                  className="px-8 py-3 font-bold text-white transition rounded-xl bg-blue-950 hover:bg-blue-900 shadow-xl"
                >
                  Log Your First Incident
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div 
                  key={report._id}
                  onClick={() => navigate(`/reports/${report._id}`)}
                  className="group flex items-center gap-4 p-5 transition-all border border-slate-100 rounded-2xl cursor-pointer hover:border-sky-300 hover:bg-sky-50/30"
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${getSeverityColor(report.severity)}`}>
                    {report.status === 'resolved' ? 
                      <CheckCircle size={24} /> :
                      <AlertTriangle size={24} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-blue-950 truncate group-hover:text-sky-600 transition-colors">{report.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <Clock size={12} />
                        {getRelativeTime(report.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-300 group-hover:text-sky-500 transition-colors" size={20} />
                </div>
              ))}
              <button 
                onClick={() => navigate('/reports/my-reports')}
                className="w-full py-4 mt-4 font-bold transition rounded-xl text-blue-950 bg-slate-50 hover:bg-slate-100"
              >
                View History
              </button>
            </div>
          )}
        </div>

        {/* Active Schedules */}
        <div className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Calendar size={24} />
              </div>
              <h2 className="text-2xl font-black text-blue-950">
                {searchQuery ? 'Flow Search' : 'Active Flows'}
              </h2>
            </div>
            <button 
              onClick={() => navigate('/schedules')}
              className="text-sm font-bold text-sky-600 hover:text-sky-700 underline underline-offset-4"
            >
              View Map
            </button>
          </div>

          {filteredSchedules.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300 opacity-20" size={60} />
              <h3 className="mb-2 text-lg font-bold text-blue-950">No Results</h3>
              <p className="text-sm text-slate-500">No matching flow schedules found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <div 
                  key={schedule._id}
                  onClick={() => navigate(`/schedules/${schedule._id}`)}
                  className="p-5 transition-all border-2 border-sky-50 bg-sky-50/50 rounded-2xl cursor-pointer hover:border-sky-300 hover:bg-sky-100/50"
                >
                  <h3 className="font-bold text-blue-950 mb-3">{schedule.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-sky-700">
                      <Clock size={16} />
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white bg-sky-500 rounded-lg">
                      {schedule.days || 'Daily'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Urgent Announcements */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-4">
              {searchQuery ? 'Alert Search' : 'Critical Alerts'}
            </h3>
            {filteredAnnouncements.length === 0 ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle size={20} />
                <p className="text-xs font-bold uppercase">{searchQuery ? 'No Matching Alerts' : 'System Stable'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAnnouncements.map((ann) => (
                  <div 
                    key={ann._id}
                    onClick={() => navigate(`/announcements/${ann._id}`)}
                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl cursor-pointer hover:bg-red-100 transition-colors"
                  >
                    <AlertTriangle className="text-red-600 flex-shrink-0" size={18} />
                    <div>
                      <h4 className="text-xs font-bold text-red-950 leading-tight">{ann.title}</h4>
                      <p className="text-[10px] font-medium text-red-700/80 mt-1 uppercase tracking-wider">{getRelativeTime(ann.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserDashboard
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardService } from '../../services/dashboardService'
import { reportService } from '../../services/reportService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
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
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Settings,
  Wrench,
  PieChart as PieIcon
} from 'lucide-react'

function AdminDashboard() {
  const navigate = useNavigate()
  const { searchQuery } = useSearch()
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentReports, setRecentReports] = useState([])

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      const statsRes = await dashboardService.getAdminStats()
      if (statsRes.success) {
        setStats(statsRes.stats)
      }

      const reportsRes = await reportService.getAllReports()
      const reports = reportsRes.reports || []
      setRecentReports(reports)

    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim()
    if (!query) return recentReports.slice(0, 5)
    return recentReports.filter(report => 
      report.title.toLowerCase().includes(query) ||
      report.location.toLowerCase().includes(query) ||
      (report.reportedBy?.name && report.reportedBy.name.toLowerCase().includes(query)) ||
      report.status.toLowerCase().includes(query) ||
      report.severity.toLowerCase().includes(query)
    ).slice(0, 5)
  }, [recentReports, searchQuery])

  const quickActions = [
    { label: 'New Flow', path: '/admin/schedules/create', icon: Calendar, color: 'text-blue-600', bg: 'hover:bg-blue-50' },
    { label: 'Announce', path: '/admin/announcements/create', icon: Megaphone, color: 'text-emerald-600', bg: 'hover:bg-emerald-50' },
    { label: 'Users', path: '/admin/users', icon: Users, color: 'text-purple-600', bg: 'hover:bg-purple-50' },
    { label: 'Settings', path: '/admin/settings', icon: Settings, color: 'text-slate-600', bg: 'hover:bg-slate-50' },
  ]

  const filteredActions = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim()
    if (!query) return quickActions
    return quickActions.filter(action => action.label.toLowerCase().includes(query))
  }, [searchQuery])

  // Chart Data
  const statusData = useMemo(() => {
    if (!stats) return []
    return [
      { name: 'Reported', value: stats.reports?.pending || 0, color: '#f97316' },
      { name: 'In Progress', value: stats.reports?.investigating || 0, color: '#3b82f6' },
      { name: 'Fixed', value: stats.reports?.resolved || 0, color: '#10b981' },
    ]
  }, [stats])

  const trendData = [
    { name: 'Mon', reports: 4, schedules: 2 },
    { name: 'Tue', reports: 7, schedules: 3 },
    { name: 'Wed', reports: 5, schedules: 5 },
    { name: 'Thu', reports: 8, schedules: 4 },
    { name: 'Fri', reports: 12, schedules: 6 },
    { name: 'Sat', reports: 9, schedules: 3 },
    { name: 'Sun', reports: 6, schedules: 2 },
  ]

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#ef4444']

  const getRelativeTime = (date) => {
    const now = new Date()
    const created = new Date(date)
    const diffMs = now - created
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 84000000)

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
      case 'Resolved': return 'bg-emerald-600 text-white'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin={true}>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 rounded-full border-blue-100 animate-pulse"></div>
            <div className="absolute inset-0 border-t-4 border-blue-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-bold text-blue-950 animate-pulse">Initializing Command Center...</p>
        </div>
      </DashboardLayout>
    )
  }

  const mainStats = [
    { icon: Users, label: 'Total Citizens', value: stats?.users?.total || 0, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: FileText, label: 'New Reports', value: stats?.reports?.pending || 0, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: Wrench, label: 'Work In Progress', value: stats?.reports?.investigating || 0, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: CheckCircle, label: 'Resolved Tickets', value: stats?.reports?.resolved || 0, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  ]

  return (
    <DashboardLayout isAdmin={true}>
      {/* Admin Header */}
      <div className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-blue-950 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black tracking-widest uppercase border rounded-lg text-sky-400 border-sky-400/20 bg-sky-400/5">
              <ShieldCheck size={14} />
              <span>System Administrator</span>
            </div>
            <h1 className="text-3xl font-black text-white md:text-4xl">Command Center</h1>
            <p className="mt-2 text-lg font-medium text-slate-400">Real-time infrastructure oversight and management.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">System Health</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xl font-bold text-white">Optimal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 -mr-32 -mt-32 rounded-full bg-sky-500/10 blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat, index) => (
          <div key={index} className="p-6 transition-all duration-300 bg-white border-2 border-transparent shadow-sm rounded-2xl hover:shadow-xl hover:-translate-y-1 hover:border-sky-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={stat.iconColor} size={28} />
              </div>
              <Activity className="text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <div className="text-3xl font-black text-blue-950">{stat.value}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
        <div className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-xl font-black text-blue-950">System Activity Trend</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={4} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 8}} name="Incident Reports" />
                <Line type="monotone" dataKey="schedules" stroke="#10b981" strokeWidth={4} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 8}} name="Flow Schedules" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <PieIcon size={24} />
            </div>
            <h2 className="text-xl font-black text-blue-950">Incident Status Distribution</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
        
        {/* Recent System-Wide Reports */}
        <div className="lg:col-span-2 p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-black text-blue-950">
                {searchQuery ? `Search Results (${filteredReports.length})` : 'Active Alerts'}
              </h2>
            </div>
            <button 
              onClick={() => navigate('/admin/reports')}
              className="text-sm font-bold text-sky-600 hover:text-sky-700 underline underline-offset-4"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-blue-950">
                  {searchQuery ? 'No Matching Records' : 'System Clear'}
                </h3>
                <p className="text-slate-500">
                  {searchQuery ? 'Try a different search term.' : 'No active infrastructure reports detected.'}
                </p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div 
                  key={report._id}
                  onClick={() => navigate(`/admin/reports/${report._id}`)}
                  className="group flex items-center gap-4 p-5 transition-all border border-slate-100 rounded-2xl cursor-pointer hover:border-blue-950 hover:bg-slate-50/50"
                >
                  <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl flex-shrink-0 border ${getSeverityColor(report.severity)}`}>
                    <span className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1">{report.severity}</span>
                    <Zap size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-blue-950 truncate group-hover:text-blue-600 transition-colors">{report.title}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{report.location} • Submitted by {report.reportedBy?.name || 'User'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${getStatusColor(report.status)} mb-2`}>
                      {report.status}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400">{getRelativeTime(report.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Management & System Vitals */}
        <div className="space-y-6">
          <div className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
            <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="text-sky-500" size={16} />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filteredActions.map((action, i) => (
                <button 
                  key={i}
                  onClick={() => navigate(action.path)}
                  className={`p-4 text-left border border-slate-100 rounded-xl transition-all group border-slate-200 ${action.bg}`}
                >
                  <action.icon className={`${action.color} mb-2 group-hover:scale-110 transition-transform`} size={20} />
                  <p className="text-xs font-bold text-blue-950">{action.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Infrastructure Distribution Map Placeholder */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-sky-50 border border-sky-100 rounded-2xl">
            <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-4">Network Distribution</h3>
            <div className="space-y-4">
              {[
                { zone: 'Northern Sector', load: '65%', color: 'bg-sky-500' },
                { zone: 'Central Hub', load: '92%', color: 'bg-red-500' },
                { zone: 'Western Grid', load: '40%', color: 'bg-emerald-500' },
              ].map((grid, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="text-slate-600 uppercase">{grid.zone}</span>
                    <span className="text-blue-950">{grid.load} Capacity</span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <div className={`h-full ${grid.color}`} style={{ width: grid.load }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { analyticsService } from '../../services/analyticsService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { 
  ArrowLeft, Users, TrendingUp, Calendar, ShieldCheck, Download, 
  RefreshCw, BarChart2, PieChart as PieIcon, AlertTriangle, Activity, 
  Clock, CheckCircle, XCircle, MapPin, Megaphone, FileText, ChevronRight
} from 'lucide-react'

const TABS = [
  { id: 'users', label: 'User Growth', icon: Users, color: 'blue' },
  { id: 'incidents', label: 'Incidents & Logs', icon: AlertTriangle, color: 'orange' },
  { id: 'schedules', label: 'Distribution', icon: MapPin, color: 'purple' },
  { id: 'performance', label: 'Performance', icon: Activity, color: 'emerald' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, color: 'indigo' }
]

function SystemReports() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'users'
  
  useSearch()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    users: null,
    incidents: null,
    activity: null,
    detailed: null
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [uRes, iRes, aRes, dRes] = await Promise.all([
        analyticsService.getUserAnalytics(),
        analyticsService.getIncidentAnalytics(),
        analyticsService.getActivityAnalytics(),
        analyticsService.getDetailedReports()
      ])
      
      setData({
        users: uRes.success ? uRes.data : null,
        incidents: iRes.success ? iRes.data : null,
        activity: aRes.success ? aRes.data : null,
        detailed: dRes.success ? dRes.data : null
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId })
  }

  const exportCSV = () => {
    let rows = []
    let filename = 'report.csv'

    if (activeTab === 'users' && data.users) {
      rows = [
        ['Month', 'Registrations', 'Cumulative'],
        ...data.users.registrationTrend.map((item, i) => [
          item.name, 
          item.users, 
          data.users.registrationTrend.slice(0, i + 1).reduce((s, x) => s + x.users, 0)
        ])
      ]
      filename = 'user-growth-report.csv'
    } else if (activeTab === 'incidents' && data.incidents) {
      rows = [
        ['Severity', 'Count'],
        ...data.incidents.severityDistribution.map(s => [s._id, s.count])
      ]
      filename = 'incident-report.csv'
    } else if (activeTab === 'schedules' && data.activity) {
      rows = [
        ['Location', 'Schedules'],
        ...data.activity.schedulesByLocation.map(s => [s._id, s.count])
      ]
      filename = 'schedule-report.csv'
    } else if (activeTab === 'announcements' && data.activity) {
      rows = [
        ['Category', 'Count', 'Engagement %'],
        ...data.activity.announcementsByCategory.map(c => [c._id, c.count, (c.engagement || 0).toFixed(1)])
      ]
      filename = 'announcement-report.csv'
    }

    if (rows.length === 0) return

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin={true}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 mb-4 border-4 border-blue-100 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="font-medium text-slate-500 animate-pulse">Generating your system reports...</p>
        </div>
      </DashboardLayout>
    )
  }

  // eslint-disable-next-line no-unused-vars
  const MetricCard = ({ icon: Icon, label, value, subtext, colorClass }) => (
    <div className="p-6 transition-all duration-300 bg-white border shadow-sm rounded-2xl border-slate-100 hover:shadow-md group">
      <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className="text-white" />
      </div>
      <h4 className="mb-1 text-sm font-semibold tracking-wider uppercase text-slate-500">{label}</h4>
      <div className="mb-1 text-3xl font-bold text-slate-900">{value}</div>
      <p className="text-xs font-medium text-slate-400">{subtext}</p>
    </div>
  )

  const ChartContainer = ({ title, sub, children }) => (
    <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{sub}</p>
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )

  const renderUsersReport = () => {
    const trend = data.users?.registrationTrend || []
    const roles = data.users?.roleDistribution || []
    const userList = data.users?.userList || []
    const total = userList.length || trend.reduce((s, i) => s + i.users, 0)
    const enhanced = trend.map((item, i) => ({ 
      ...item, 
      cum: trend.slice(0, i + 1).reduce((s, x) => s + x.users, 0) 
    }))

    return (
      <div className="space-y-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Users} label="Total Users" value={total} subtext="Lifetime registrations" colorClass="bg-blue-600" />
          <MetricCard icon={TrendingUp} label="Monthly Users" value={trend[trend.length-1]?.users || 0} subtext="Latest month" colorClass="bg-emerald-500" />
          <MetricCard icon={ShieldCheck} label="Admin Roles" value={roles.find(r => r._id === 'admin')?.count || 0} subtext="Privileged accounts" colorClass="bg-indigo-600" />
          <MetricCard icon={Calendar} label="Active Since" value={trend[0]?.name || 'N/A'} subtext="Data tracking start" colorClass="bg-purple-600" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {trend.length > 0 && (
            <ChartContainer title="Registration Trend" sub="Monthly new user registrations">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ChartContainer>
          )}

          {enhanced.length > 0 && (
            <ChartContainer title="Cumulative Growth" sub="Total user count over time">
              <LineChart data={enhanced}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="cum" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          )}
        </div>

        {/* Users Table */}
        {userList.length > 0 && (
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">User Directory</h3>
                <p className="text-sm text-slate-500">Full list of registered users in the system</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-black tracking-widest uppercase border-b border-slate-50 text-slate-400">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {userList.map((user, i) => (
                    <tr key={i} className="transition-colors border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-blue-600 rounded-full bg-blue-50">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{user.email}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                          user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 
                          user.role === 'technician' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderIncidentsReport = () => {
    const severity = data.incidents?.severityDistribution || []
    const categories = data.incidents?.categoryDistribution || []
    const status = data.incidents?.statusDistribution || []
    const trend = data.incidents?.incidentTrend || []
    const incidentList = data.incidents?.incidentList || []
    const total = incidentList.length || severity.reduce((s, i) => s + (i.count || 0), 0)
    
    const COLORS = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#eab308',
      low: '#10b981'
    }

    const STATUS_COLORS = {
      'Reported': '#f97316',
      'Technician Assigned': '#3b82f6',
      'In Progress': '#0ea5e9',
      'Fixed': '#10b981',
      'Resolved': '#059669'
    }

    const CAT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b']

    return (
      <div className="space-y-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={AlertTriangle} label="Total Incidents" value={total} subtext="Reported issues" colorClass="bg-orange-500" />
          <MetricCard icon={XCircle} label="Critical" value={severity.find(s => s._id === 'critical')?.count || 0} subtext="Urgent attention needed" colorClass="bg-red-600" />
          <MetricCard icon={Clock} label="Pending" value={total - (status.find(s => s._id === 'Resolved')?.count || 0)} subtext="Requiring action" colorClass="bg-amber-500" />
          <MetricCard icon={Activity} label="Latest Daily" value={trend[trend.length-1]?.reports || 0} subtext="Recent volume" colorClass="bg-blue-600" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {trend.length > 0 && (
            <ChartContainer title="Incident Volume Trend" sub="Daily reports over the last 30 days">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="reports" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" name="Reports" />
              </AreaChart>
            </ChartContainer>
          )}

          {status.length > 0 && (
            <ChartContainer title="Workflow Status" sub="Current state of all incident tickets">
              <PieChart>
                <Pie
                  data={status}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry._id] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ChartContainer>
          )}

          {severity.length > 0 && (
            <ChartContainer title="Severity Distribution" sub="Incidents categorized by severity level">
              <BarChart data={severity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {severity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry._id] || '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}

          {categories.length > 0 && (
            <ChartContainer title="Incident Categories" sub="Distribution of report types">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CAT_COLORS[index % CAT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ChartContainer>
          )}
        </div>

        {/* Incident Reports Table */}
        {incidentList.length > 0 && (
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Incident Reports Table</h3>
                <p className="text-sm text-slate-500">Comprehensive list of all incidents reported based on categories</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-black tracking-widest uppercase border-b border-slate-50 text-slate-400">
                    <th className="px-4 py-3">Report Date</th>
                    <th className="px-4 py-3">Issue Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {incidentList.map((incident, i) => (
                    <tr key={i} className="transition-colors border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-4 text-slate-500">{new Date(incident.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4 font-bold text-slate-900">{incident.title}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                          {incident.reportType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{incident.location}</td>
                      <td className="px-4 py-4">
                        <span className={`font-bold ${
                          incident.severity === 'critical' ? 'text-red-600' :
                          incident.severity === 'high' ? 'text-orange-600' :
                          incident.severity === 'medium' ? 'text-yellow-600' : 'text-emerald-600'
                        }`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                          incident.status === 'Resolved' || incident.status === 'Fixed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSchedulesReport = () => {
    const locations = data.activity?.schedulesByLocation || []
    const detailedSchedules = data.detailed?.waterSchedules || []
    const total = locations.reduce((s, l) => s + (l.count || 0), 0)

    return (
      <div className="space-y-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={MapPin} label="Covered Areas" value={locations.length} subtext="Unique locations" colorClass="bg-purple-600" />
          <MetricCard icon={Calendar} label="Total Schedules" value={total} subtext="Active & upcoming" colorClass="bg-blue-600" />
          <MetricCard icon={TrendingUp} label="Density" value={(total / (locations.length || 1)).toFixed(1)} subtext="Avg per location" colorClass="bg-indigo-500" />
          <MetricCard icon={CheckCircle} label="Coverage" value="94%" subtext="Network efficiency" colorClass="bg-emerald-600" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {locations.length > 0 && (
            <ChartContainer title="Geographic Distribution" sub="Schedule density by location">
              <BarChart data={locations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="_id" type="category" tick={{fontSize: 11, fontWeight: 500}} width={100} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
          )}

          {locations.length > 0 && (
            <div className="p-6 overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-100">
              <h3 className="mb-6 text-lg font-bold text-slate-900">Location Hotspots</h3>
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {locations.sort((a,b) => b.count - a.count).map((loc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 transition-colors rounded-xl hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-purple-600 rounded-lg bg-purple-50">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{loc._id}</p>
                        <p className="text-xs text-slate-400">{loc.count} active schedules</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Water Distribution Schedules Table */}
        {detailedSchedules.length > 0 && (
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Water Distribution Schedules</h3>
                <p className="text-sm text-slate-500">Structured timetable of active water supply zones</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-black tracking-widest uppercase border-b border-slate-50 text-slate-400">
                    <th className="px-4 py-3">Schedule Title</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Days</th>
                    <th className="px-4 py-3">Time Window</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {detailedSchedules.map((schedule, i) => (
                    <tr key={i} className="transition-colors border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-4 font-bold text-slate-900">{schedule.title}</td>
                      <td className="px-4 py-4 text-slate-600">{schedule.location || 'All Zones'}</td>
                      <td className="px-4 py-4 text-slate-600">
                        <span className="capitalize">{schedule.scheduleType}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {schedule.daysOfWeek?.join(', ') || 'Everyday'}
                      </td>
                      <td className="px-4 py-4 font-bold text-blue-600">
                        {schedule.startTime} - {schedule.endTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderPerformanceReport = () => {
    const performance = data.detailed?.technicianPerformance || []
    
    return (
      <div className="space-y-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Activity} label="Fleet Size" value={performance.length} subtext="Active technicians" colorClass="bg-emerald-600" />
          <MetricCard icon={CheckCircle} label="Total Resolved" value={performance.reduce((s, t) => s + t.resolved, 0)} subtext="Lifetime completions" colorClass="bg-blue-600" />
          <MetricCard icon={Clock} label="Load Factor" value={(performance.reduce((s, t) => s + t.pending, 0) / (performance.length || 1)).toFixed(1)} subtext="Avg pending per tech" colorClass="bg-orange-500" />
          <MetricCard icon={ShieldCheck} label="Efficiency" value="88%" subtext="Network-wide score" colorClass="bg-indigo-600" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {performance.length > 0 && (
            <ChartContainer title="Technician Output" sub="Comparison of resolved vs pending tasks">
              <BarChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" />
                <Bar dataKey="pending" fill="#f97316" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ChartContainer>
          )}

          {performance.length > 0 && (
            <ChartContainer title="Task Distribution" sub="Share of total tasks among technicians">
              <PieChart>
                <Pie
                  data={performance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="name"
                >
                  {performance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${120 + index * 45}, 60%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ChartContainer>
          )}
        </div>

        {/* Technician Performance Roster Table */}
        {performance.length > 0 && (
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Technician Performance Roster</h3>
                <p className="text-sm text-slate-500">List of technicians and their job resolution metrics</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-black tracking-widest uppercase border-b border-slate-50 text-slate-400">
                    <th className="px-4 py-3">Technician Name</th>
                    <th className="px-4 py-3 text-center">Resolved Jobs</th>
                    <th className="px-4 py-3 text-center">Pending Jobs</th>
                    <th className="px-4 py-3 text-center">Total Assigned</th>
                    <th className="px-4 py-3 text-right">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {performance.map((tech, i) => (
                    <tr key={i} className="transition-colors border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="flex items-center gap-3 px-4 py-4">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full bg-emerald-50 text-emerald-600">
                          {tech.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{tech.name}</span>
                      </td>
                      <td className="px-4 py-4 font-bold text-center text-emerald-600">{tech.resolved}</td>
                      <td className="px-4 py-4 font-bold text-center text-orange-600">{tech.pending}</td>
                      <td className="px-4 py-4 font-bold text-center text-slate-600">{tech.total}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-black text-slate-900">
                            {tech.total > 0 ? ((tech.resolved / tech.total) * 100).toFixed(0) : 0}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500" 
                              style={{ width: `${tech.total > 0 ? (tech.resolved / tech.total) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderAnnouncementsReport = () => {
    const categories = data.activity?.announcementsByCategory || []
    const total = categories.reduce((s, c) => s + (c.count || 0), 0)

    return (
      <div className="space-y-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Megaphone} label="Announcements" value={total} subtext="Total published" colorClass="bg-indigo-600" />
          <MetricCard icon={Activity} label="Engagement" value="68%" subtext="Average reach" colorClass="bg-emerald-500" />
          <MetricCard icon={FileText} label="Templates" value={categories.length} subtext="Active categories" colorClass="bg-blue-600" />
          <MetricCard icon={CheckCircle} label="Delivery" value="100%" subtext="Success rate" colorClass="bg-purple-600" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {categories.length > 0 && (
            <ChartContainer title="Content Categories" sub="Types of communications sent">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 40}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ChartContainer>
          )}

          {categories.length > 0 && (
            <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
              <h3 className="mb-6 text-lg font-bold text-slate-900">Engagement Performance</h3>
              <div className="space-y-6">
                {categories.map((cat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-end justify-between">
                      <span className="text-sm font-bold text-slate-700">{cat._id}</span>
                      <span className="text-xs font-semibold text-slate-400">{(cat.engagement || 0).toFixed(1)}% reach</span>
                    </div>
                    <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100">
                      <div 
                        className="h-full transition-all duration-1000 bg-indigo-500 rounded-full" 
                        style={{ width: `${cat.engagement || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout isAdmin={true}>
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="flex flex-col justify-between gap-4 mb-10 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="p-3 transition-all bg-white border shadow-sm border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">System Reports</h1>
              <p className="font-medium text-slate-500">Insights and analytics across the platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchAllData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Tabs section */}
        <div className="flex overflow-x-auto p-1.5 bg-slate-100/80 rounded-2xl mb-10 gap-1 no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }
                `}
              >
                <Icon size={18} className={isActive ? `text-${tab.color}-600` : ''} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div className="min-h-[500px]">
          {activeTab === 'users' && renderUsersReport()}
          {activeTab === 'incidents' && renderIncidentsReport()}
          {activeTab === 'schedules' && renderSchedulesReport()}
          {activeTab === 'performance' && renderPerformanceReport()}
          {activeTab === 'announcements' && renderAnnouncementsReport()}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SystemReports

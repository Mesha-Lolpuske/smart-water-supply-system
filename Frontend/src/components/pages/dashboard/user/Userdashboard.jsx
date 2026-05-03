import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { reportService } from '../../../services/reportService'
import { scheduleService } from '../../../services/scheduleService'
import { announcementService } from "../../../services/announcement";
import { dashboardService } from "../../../services/dashboardService";
import DashboardLayout from '../../../layout/DashboardLayout'
import { useSearch } from '../../../context/SearchContext'

// Newly Extracted Components
import WaterSupplyMap from './WaterSupplyMap'
import ActivityFeeds from './ActivityFeeds'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Calendar, FileText, Bell, CheckCircle, TrendingUp, PieChart as PieIcon } from 'lucide-react'

export default function UserDashboard() {
  const { user } = useAuth()
  const { searchQuery } = useSearch()
  
  const [loading, setLoading] = useState(true)
  const [myReports, setMyReports] = useState([])
  const [activeSchedules, setActiveSchedules] = useState([])
  const [urgentAnnouncements, setUrgentAnnouncements] = useState([])
  const [stats, setStats] = useState({
    activeSchedules: 0, myReports: 0, notifications: 0, resolvedIssues: 0, pendingIssues: 0, investigatingIssues: 0
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
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

        const reportsRes = await reportService.getMyReports()
        setMyReports(reportsRes.reports || [])

        const schedulesRes = await scheduleService.getActiveSchedules()
        setActiveSchedules(schedulesRes.schedules || [])

        const announcementsRes = await announcementService.getAllAnnouncements()
        const urgent = (announcementsRes.announcements || []).filter(a => 
          ['emergency', 'maintenance', 'high', 'urgent'].includes(a.category) || ['high', 'urgent'].includes(a.priority)
        )
        setUrgentAnnouncements(urgent.slice(0, 2))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  // Filtering Logic
  const filteredReports = useMemo(() => myReports.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3), [myReports, searchQuery])
  const filteredSchedules = useMemo(() => activeSchedules.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2), [activeSchedules, searchQuery])
  const filteredAnnouncements = useMemo(() => urgentAnnouncements.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())), [urgentAnnouncements, searchQuery])

  const chartData = [
    { name: 'Pending', value: stats.pendingIssues, color: '#f97316' },
    { name: 'Investigating', value: stats.investigatingIssues, color: '#3b82f6' },
    { name: 'Resolved', value: stats.resolvedIssues, color: '#10b981' },
  ].filter(d => d.value > 0) || [{ name: 'No Reports Yet', value: 1, color: '#f1f5f9' }]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 font-bold text-blue-950">Synchronizing Dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <WaterSupplyMap />

      {/* Welcome Banner */}
      <div className="relative p-8 mb-8 overflow-hidden shadow-2xl rounded-2xl bg-gradient-to-r from-blue-950 to-blue-900">
        <div className="relative z-10">
          <h1 className="mb-2 text-3xl font-extrabold text-white">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
          <p className="text-lg font-medium text-sky-200/80">Monitoring infrastructure in {user?.supplyArea || 'your area'}. Everything looks stable today.</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
        <div className="p-6 bg-white border shadow-sm lg:col-span-2 border-slate-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 text-blue-600 rounded-lg bg-blue-50"><TrendingUp size={24} /></div>
            <h2 className="text-xl font-black text-blue-950">Water Availability Trends</h2>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{name: 'Mon', hours: 4}, {name: 'Tue', hours: 6}, {name: 'Wed', hours: 8}, {name: 'Thu', hours: 5}, {name: 'Fri', hours: 9}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 text-orange-600 rounded-lg bg-orange-50"><PieIcon size={24} /></div>
            <h2 className="text-xl font-black text-blue-950">Incident Status</h2>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <ActivityFeeds 
        reports={filteredReports} 
        schedules={filteredSchedules} 
        announcements={filteredAnnouncements} 
        searchQuery={searchQuery} 
      />
    </DashboardLayout>
  )
}
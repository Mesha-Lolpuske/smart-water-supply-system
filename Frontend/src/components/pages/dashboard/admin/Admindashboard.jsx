import { useState, useEffect, useMemo } from 'react'
import { dashboardService } from '../../../services/dashboardService'
import { reportService } from '../../../services/reportService'
import DashboardLayout from '../../../layout/DashboardLayout'
import { useSearch } from '../../../context/SearchContext'
import { 
  Users,
  Calendar,
  Megaphone,
  ShieldCheck,
  Settings
} from 'lucide-react'

// New Sub-components
import AdminMap from './AdminMap'
import AdminStatsGrid from './AdminStatsGrid'
import AdminMaintenanceTable from './AdminMaintenanceTable'
import AdminQuickActions from './AdminQuickActions'

function AdminDashboard() {
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
      setRecentReports(reportsRes.reports || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim()
    const reports = recentReports
    if (!query) return reports.slice(0, 5)
    return reports.filter(report => 
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

  if (loading) {
    return (
      <DashboardLayout isAdmin={true}>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-t-4 border-blue-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-bold text-blue-950 animate-pulse">Initializing Command Center...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout isAdmin={true}>
      {/* Admin Header */}
      <div className="relative p-8 mb-8 overflow-hidden shadow-2xl rounded-2xl bg-blue-950">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black tracking-widest uppercase border rounded-lg text-sky-400 border-sky-400/20 bg-sky-400/5">
              <ShieldCheck size={14} />
              <span>System Administrator</span>
            </div>
            <h1 className="text-3xl font-black text-white md:text-4xl">Command Center</h1>
            <p className="mt-2 text-lg font-medium text-slate-400">Real-time infrastructure oversight and management.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="px-6 py-4 border rounded-2xl bg-white/5 border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">System Health</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xl font-bold text-white">Optimal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-32 -mr-32 rounded-full w-96 h-96 bg-sky-500/10 blur-3xl"></div>
      </div>

      <AdminMap />

      <AdminStatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
        <AdminMaintenanceTable reports={filteredReports} searchQuery={searchQuery} />
        <AdminQuickActions actions={quickActions} />
      </div>

    </DashboardLayout>
  )
}

export default AdminDashboard

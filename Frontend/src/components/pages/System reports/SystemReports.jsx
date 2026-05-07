// SystemReports.jsx - Complete rewrite
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { analyticsService } from '../../services/analyticsService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { 
  ArrowLeft, Users, Download, RefreshCw, AlertTriangle, Activity, 
  MapPin, Filter, Calendar, CheckCircle, XCircle, Clock, 
  TrendingUp, FileText, Printer, ChevronDown, Search, 
  Wrench, Droplet, BarChart3, Eye
} from 'lucide-react'

// Import Tab Components
import UsersReport from './tabs/UsersReport'
import IncidentsReport from './tabs/IncidentsReport'
import SchedulesReport from './tabs/SchedulesReport'
import PerformanceReport from './tabs/PerformanceReport'

const TABS = [
  { id: 'users', label: 'User Activity', icon: Users, color: 'blue', description: 'Track user registrations and growth' },
  { id: 'incidents', label: 'Incident Analytics', icon: AlertTriangle, color: 'orange', description: 'Monitor issues and resolution rates' },
  { id: 'schedules', label: 'Water Schedules', icon: Droplet, color: 'cyan', description: 'Manage distribution plans' },
  { id: 'performance', label: 'Technician Performance', icon: Wrench, color: 'emerald', description: 'Track job completion rates' },
]

function SystemReports() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'users'
  const reportRef = useRef(null)
  
  useSearch()
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('all')
  const [rawData, setRawData] = useState({
    users: null,
    incidents: null,
    activity: null,
    detailed: null
  })

  useEffect(() => {
    fetchAllData()
  }, [timeFilter])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [uRes, iRes, aRes, dRes] = await Promise.all([
        analyticsService.getUserAnalytics(timeFilter),
        analyticsService.getIncidentAnalytics(timeFilter),
        analyticsService.getActivityAnalytics(timeFilter),
        analyticsService.getDetailedReports(timeFilter)
      ])
      
      setRawData({
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

  const isWithinTimeRange = (dateString) => {
    if (timeFilter === 'all') return true;
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    
    if (timeFilter === '7d') return diffDays <= 7;
    if (timeFilter === '30d') return diffDays <= 30;
    if (timeFilter === '90d') return diffDays <= 90;
    return true;
  }

  const processedIncidents = useMemo(() => {
    if (!rawData.incidents?.incidentList) return null;
    const filtered = rawData.incidents.incidentList.filter(inc => isWithinTimeRange(inc.createdAt));
    
    let resolved = 0;
    filtered.forEach(inc => {
      if (['Fixed', 'Resolved', 'Closed'].includes(inc.status)) resolved++;
    });

    return {
      list: filtered,
      total: filtered.length,
      resolved,
      unresolved: filtered.length - resolved,
      resolutionRate: filtered.length > 0 ? ((resolved / filtered.length) * 100).toFixed(1) : 0,
    }
  }, [rawData.incidents, timeFilter]);

  const processedUsers = useMemo(() => {
    if (!rawData.users?.userList) return null;
    const filteredUsers = rawData.users.userList.filter(u => isWithinTimeRange(u.createdAt));
    
    return {
      total: filteredUsers.length,
      list: filteredUsers,
    }
  }, [rawData.users, timeFilter]);

  const handlePrint = () => {
    window.print();
  }

  const getSummaryStats = () => {
    const users = processedUsers?.list || []
    const incidents = processedIncidents?.list || []
    const schedules = rawData.detailed?.waterSchedules || []
    const jobs = rawData.detailed?.maintenanceLogs || []
    
    const resolvedJobs = jobs.filter(j => ['Resolved', 'Fixed'].includes(j.status)).length
    
    return {
      totalUsers: users.length,
      totalIncidents: incidents.length,
      resolvedIncidents: processedIncidents?.resolved || 0,
      totalSchedules: schedules.length,
      totalJobs: jobs.length,
      resolvedJobs
    }
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin={true}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 mb-4 border-4 border-blue-100 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="font-medium text-slate-500 animate-pulse">Loading report data...</p>
        </div>
      </DashboardLayout>
    )
  }

  const stats = getSummaryStats()

  return (
    <DashboardLayout isAdmin={true}>
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8" ref={reportRef}>
        
        {/* Header Section */}
        <div className="mb-8 print:mb-4">
          <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="p-3 transition-all bg-white border shadow-sm border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200 print:hidden"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">System Performance Report</h1>
                <p className="mt-1 text-slate-500">
                  Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 print:hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border shadow-sm border-slate-200 rounded-xl">
                <Calendar size={16} className="text-slate-400" />
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer text-slate-700 focus:ring-0"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <button 
                onClick={fetchAllData}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all bg-white border shadow-sm border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white transition-all bg-blue-600 shadow-md rounded-xl hover:bg-blue-700 shadow-blue-200"
              >
                <Printer size={16} /> Export PDF
              </button>
            </div>
          </div>

          {/* KPI Cards - Quick Decision Metrics */}
          <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-5 print:grid-cols-5">
            <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <Users size={20} className="text-blue-500" />
                <span className="text-xs font-medium text-slate-400">Total</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
              <p className="text-xs text-slate-500">Registered Users</p>
            </div>
            <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle size={20} className="text-orange-500" />
                <span className="text-xs font-medium text-slate-400">Reports</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalIncidents}</p>
              <p className="text-xs text-slate-500">Total Incidents</p>
            </div>
            <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle size={20} className="text-emerald-500" />
                <span className="text-xs font-medium text-slate-400">Rate</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{processedIncidents?.resolutionRate || 0}%</p>
              <p className="text-xs text-slate-500">Resolution Rate</p>
            </div>
            <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <Droplet size={20} className="text-cyan-500" />
                <span className="text-xs font-medium text-slate-400">Active</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalSchedules}</p>
              <p className="text-xs text-slate-500">Water Schedules</p>
            </div>
            <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <Wrench size={20} className="text-purple-500" />
                <span className="text-xs font-medium text-slate-400">Completion</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.totalJobs > 0 ? Math.round((stats.resolvedJobs / stats.totalJobs) * 100) : 0}%</p>
              <p className="text-xs text-slate-500">Jobs Completed</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 print:hidden">
          <div className="flex flex-wrap gap-2 border-b border-slate-200">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all rounded-t-lg
                    ${isActive 
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {TABS.find(t => t.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px] print:m-0 print:p-0">
          {activeTab === 'users' && (
            <UsersReport 
              processedUsers={processedUsers} 
              timeFilter={timeFilter}
              rawData={rawData}
            />
          )}
          {activeTab === 'incidents' && (
            <IncidentsReport 
              processedIncidents={processedIncidents} 
              timeFilter={timeFilter}
              rawData={rawData}
            />
          )}
          {activeTab === 'schedules' && (
            <SchedulesReport 
              rawData={rawData} 
              timeFilter={timeFilter}
            />
          )}
          {activeTab === 'performance' && (
            <PerformanceReport 
              rawData={rawData}
              timeFilter={timeFilter}
            />
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #root, [ref] {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:grid-cols-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
          .print\\:m-0 {
            margin: 0;
          }
          .print\\:p-0 {
            padding: 0;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem;
          }
          @page {
            size: landscape;
            margin: 1.5cm;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}

export default SystemReports
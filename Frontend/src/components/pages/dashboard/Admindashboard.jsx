import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardService } from '../../services/dashboardService'
import { reportService } from '../../services/reportService'
import { analyticsService } from '../../services/analyticsService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { MapContainer, TileLayer, Polygon, Popup, ZoomControl, ScaleControl, LayersControl, Marker } from 'react-leaflet'
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
  ShieldCheck,
  Zap,
  Settings,
  Wrench,
  PieChart as PieIcon,
  Map,
  MapPin,
  Droplets
} from 'lucide-react'
import 'leaflet/dist/leaflet.css'
// import SMSAlertPanel from './SMSAlertPanel' // Removed SMS functionality

function AdminDashboard() {
  const navigate = useNavigate()
  const { searchQuery } = useSearch()
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentReports, setRecentReports] = useState([])
  const [selectedZone, setSelectedZone] = useState(null)
  const [mapLoading, setMapLoading] = useState(true)
  const [mapError, setMapError] = useState(null)
  
  const [, setAnalyticsData] = useState({
    users: null,
    incidents: null,
    activity: null
  })

  // Kenya Water Supply Zones (Major regions and cities)
  const kenyaZones = [
    {
      id: 1,
      name: 'Nairobi Central',
      region: 'Nairobi County',
      status: 'good',
      waterPressure: 85,
      population: 450000,
      coordinates: [[-1.2864, 36.8172], [-1.2864, 36.8272], [-1.2764, 36.8272], [-1.2764, 36.8172]],
      nextSupply: '24/7',
      lastOutage: null
    },
    {
      id: 2,
      name: 'Westlands',
      region: 'Nairobi County',
      status: 'warning',
      waterPressure: 65,
      population: 120000,
      coordinates: [[-1.2630, 36.8050], [-1.2630, 36.8150], [-1.2530, 36.8150], [-1.2530, 36.8050]],
      nextSupply: '6AM-10PM',
      lastOutage: '2024-01-15'
    },
    {
      id: 3,
      name: 'Kilimani',
      region: 'Nairobi County',
      status: 'good',
      waterPressure: 78,
      population: 95000,
      coordinates: [[-1.2950, 36.7850], [-1.2950, 36.7950], [-1.2850, 36.7950], [-1.2850, 36.7850]],
      nextSupply: '24/7',
      lastOutage: null
    },
    {
      id: 4,
      name: 'Mombasa Central',
      region: 'Mombasa County',
      status: 'critical',
      waterPressure: 35,
      population: 200000,
      coordinates: [[-4.0435, 39.6682], [-4.0435, 39.6782], [-4.0335, 39.6782], [-4.0335, 39.6682]],
      nextSupply: '8AM-2PM',
      lastOutage: '2024-01-18'
    },
    {
      id: 5,
      name: 'Koinange Street',
      region: 'Nairobi County',
      status: 'critical',
      waterPressure: 25,
      population: 80000,
      coordinates: [[-1.2830, 36.8200], [-1.2830, 36.8300], [-1.2730, 36.8300], [-1.2730, 36.8200]],
      nextSupply: '10AM-4PM',
      lastOutage: '2024-01-20'
    },
    {
      id: 6,
      name: 'Karen',
      region: 'Nairobi County',
      status: 'good',
      waterPressure: 82,
      population: 75000,
      coordinates: [[-1.3167, 36.7167], [-1.3167, 36.7267], [-1.3067, 36.7267], [-1.3067, 36.7167]],
      nextSupply: '24/7',
      lastOutage: null
    },
    {
      id: 7,
      name: 'Eldoret Central',
      region: 'Uasin Gishu County',
      status: 'warning',
      waterPressure: 55,
      population: 150000,
      coordinates: [[0.5143, 35.2698], [0.5143, 35.2798], [0.5243, 35.2798], [0.5243, 35.2698]],
      nextSupply: '5AM-11PM',
      lastOutage: '2024-01-12'
    },
    {
      id: 8,
      name: 'Kisumu Central',
      region: 'Kisumu County',
      status: 'good',
      waterPressure: 70,
      population: 180000,
      coordinates: [[-0.1022, 34.7617], [-0.1022, 34.7717], [-0.0922, 34.7717], [-0.0922, 34.7617]],
      nextSupply: '24/7',
      lastOutage: null
    }
  ]

  // Water infrastructure markers
  const infrastructure = [
    {
      id: 1,
      type: 'treatment',
      name: 'Nairobi Central Water Treatment Plant',
      lat: -1.2864,
      lng: 36.8172,
      capacity: '500,000 m³/day',
      status: 'operational'
    },
    {
      id: 2,
      type: 'pump',
      name: 'Westlands Main Pump Station',
      lat: -1.2630,
      lng: 36.8050,
      capacity: '200,000 m³/day',
      status: 'operational'
    },
    {
      id: 3,
      type: 'reservoir',
      name: 'Karen Water Reservoir',
      lat: -1.3167,
      lng: 36.7167,
      capacity: '1,000,000 m³',
      status: 'operational'
    },
    {
      id: 4,
      type: 'treatment',
      name: 'Mombasa Coastal Treatment Plant',
      lat: -4.0435,
      lng: 39.6682,
      capacity: '300,000 m³/day',
      status: 'maintenance'
    },
    {
      id: 5,
      type: 'pump',
      name: 'Eldoret Distribution Pump',
      lat: 0.5143,
      lng: 35.2698,
      capacity: '150,000 m³/day',
      status: 'operational'
    },
    {
      id: 6,
      type: 'reservoir',
      name: 'Kisumu Main Reservoir',
      lat: -0.1022,
      lng: 34.7617,
      capacity: '800,000 m³',
      status: 'operational'
    }
  ]

  useEffect(() => {
    fetchAdminData()
    fetchAnalytics()
  }, [])

  const getZoneStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10b981' // green
      case 'warning': return '#f59e0b' // yellow
      case 'critical': return '#ef4444' // red
      default: return '#6b7280' // gray
    }
  }

  const getZoneStatusText = (status) => {
    switch (status) {
      case 'good': return 'Water Available'
      case 'warning': return 'Limited Supply'
      case 'critical': return 'Supply Cut'
      default: return 'Unknown'
    }
  }

  const getInfrastructureIcon = (type) => {
    switch (type) {
      case 'treatment': return '🏭'
      case 'pump': return '⚙️'
      case 'reservoir': return '💧'
      default: return '📍'
    }
  }

  const getInfrastructureColor = (status) => {
    switch (status) {
      case 'operational': return '#10b981' // green
      case 'maintenance': return '#f59e0b' // yellow
      case 'offline': return '#ef4444' // red
      default: return '#6b7280' // gray
    }
  }

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

  const fetchAnalytics = async () => {
    try {
      const [usersRes, incidentRes, activityRes] = await Promise.all([
        analyticsService.getUserAnalytics(),
        analyticsService.getIncidentAnalytics(),
        analyticsService.getActivityAnalytics()
      ]);

      setAnalyticsData({
        users: usersRes.data,
        incidents: incidentRes.data,
        activity: activityRes.data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-pulse"></div>
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

      {/* Interactive Water Supply Management Map - ADMIN CONTROL CENTER */}
      <div className="mb-8">
        <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <Map size={24} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-blue-950">Water Supply Control Center</h2>
                <p className="text-sm text-slate-500">Monitor and manage all water zones across Kenya</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-green-700">Operational</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-full">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs font-medium text-yellow-700">Maintenance</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs font-medium text-red-700">Critical</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Map Container */}
            <div className="lg:col-span-3">
              <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200" style={{ height: '500px' }}>
                {mapLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {mapError && (
                  <div className="absolute inset-0 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="text-red-500 text-2xl mb-2">⚠️</div>
                      <p className="text-red-700 font-medium">Map failed to load</p>
                      <p className="text-red-600 text-sm">Please check your connection</p>
                      <button 
                        onClick={() => {
                          setMapError(null)
                          setMapLoading(true)
                          window.location.reload()
                        }}
                        className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
                <MapContainer center={[0.0236, 37.9062]} zoom={7} style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }} className="rounded-lg" whenReady={() => setMapLoading(false)} onError={() => { setMapLoading(false); setMapError('Failed to load map'); }}>
                  <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite">
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.arcgis.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                      />
                    </LayersControl.BaseLayer>
                  </LayersControl>
                  
                  <ZoomControl position="topright" />
                  <ScaleControl position="bottomleft" />
                  
                  {kenyaZones.map((zone) => (
                    <Polygon
                      key={zone.id}
                      positions={zone.coordinates}
                      pathOptions={{
                        color: getZoneStatusColor(zone.status),
                        fillColor: getZoneStatusColor(zone.status),
                        fillOpacity: 0.8,
                        weight: 3,
                        opacity: 1
                      }}
                      eventHandlers={{
                        click: () => setSelectedZone(zone)
                      }}
                    >
                      <Popup>
                        <div className="p-3 min-w-[250px]">
                          <h3 className="font-bold text-lg text-blue-950 mb-2">{zone.name}</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${zone.status === 'good' ? 'bg-green-500' : zone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                              <span className="font-medium">{getZoneStatusText(zone.status)}</span>
                            </div>
                            <p className="text-sm text-gray-600"><strong>Region:</strong> {zone.region}</p>
                            <p className="text-sm text-gray-600"><strong>Population:</strong> {zone.population.toLocaleString()}</p>
                            <p className="text-sm text-gray-600"><strong>Supply Schedule:</strong> {zone.nextSupply}</p>
                            <p className="text-sm text-gray-600"><strong>Pressure:</strong> {zone.waterPressure}%</p>
                            {zone.lastOutage && (
                              <p className="text-sm text-red-600"><strong>Last Outage:</strong> {zone.lastOutage}</p>
                            )}
                            <div className="mt-3 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-500">Click to manage this zone</p>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Polygon>
                  ))}
                  
                  {infrastructure.map((item) => (
                    <Marker
                      key={item.id}
                      position={[item.lat, item.lng]}
                    >
                      <Popup>
                        <div className="p-3 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{getInfrastructureIcon(item.type)}</span>
                            <h3 className="font-bold text-lg text-blue-950">{item.name}</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getInfrastructureColor(item.status) }}></div>
                              <span className="font-medium capitalize">{item.status}</span>
                            </div>
                            <p className="text-sm text-gray-600"><strong>Type:</strong> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                            <p className="text-sm text-gray-600"><strong>Capacity:</strong> {item.capacity}</p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Admin Control Panel */}
            <div className="space-y-4">
              {selectedZone ? (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg text-blue-950 mb-3">Zone Management</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">{selectedZone.name}</p>
                      <p className="text-sm text-gray-600">{selectedZone.region}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedZone.status === 'good' ? 'bg-green-500' : selectedZone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{getZoneStatusText(selectedZone.status)}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Population:</strong> {selectedZone.population.toLocaleString()}</p>
                      <p><strong>Pressure:</strong> {selectedZone.waterPressure}%</p>
                      <p><strong>Schedule:</strong> {selectedZone.nextSupply}</p>
                    </div>
                    <div className="pt-2 space-y-2">
                      <button className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Update Status
                      </button>
                      <button className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                        Schedule Maintenance
                      </button>
                      <button className="w-full px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <MapPin className="mx-auto text-blue-500 mb-2" size={24} />
                    <p className="text-sm font-medium text-blue-900">Select a zone</p>
                    <p className="text-xs text-blue-700">to manage water supply</p>
                  </div>
                </div>
              )}

              {/* System Overview */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">System Overview</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Zones:</span>
                    <span className="font-medium">{kenyaZones.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Operational:</span>
                    <span className="font-medium text-green-600">{kenyaZones.filter(z => z.status === 'good').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-600">Maintenance:</span>
                    <span className="font-medium text-yellow-600">{kenyaZones.filter(z => z.status === 'warning').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Critical:</span>
                    <span className="font-medium text-red-600">{kenyaZones.filter(z => z.status === 'critical').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Alert System Removed */}


      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat, index) => (
          <div key={index} className="p-6 transition-all duration-300 bg-white border-2 border-transparent shadow-sm rounded-2xl hover:shadow-xl hover:-translate-y-1 hover:border-sky-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={stat.iconColor} size={28} />
              </div>
              <Activity className="text-blue-200 transition-opacity opacity-0 group-hover:opacity-100" size={20} />
            </div>
            <div className="text-3xl font-black text-blue-950">{stat.value}</div>
            <div className="text-sm font-bold tracking-wider uppercase text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
        <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 text-blue-600 rounded-lg bg-blue-50">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-xl font-black text-blue-950">System Activity Trend</h2>
          </div>
          <div className="w-full h-80">
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

        <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 text-orange-600 rounded-lg bg-orange-50">
              <PieIcon size={24} />
            </div>
            <h2 className="text-xl font-black text-blue-950">Incident Status Distribution</h2>
          </div>
          <div className="w-full h-80">
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
        
        {/* Recent System-Wide Reports / Maintenance Ticketing Logs */}
        <div className="p-6 bg-white border shadow-sm lg:col-span-2 border-slate-100 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 text-red-600 rounded-lg bg-red-50">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-black text-blue-950">
                {searchQuery ? `Search Results (${filteredReports.length})` : 'Maintenance Ticketing Logs'}
              </h2>
            </div>
            <button 
              onClick={() => navigate('/admin/reports')}
              className="text-sm font-bold underline text-sky-600 hover:text-sky-700 underline-offset-4"
            >
              Manage All
            </button>
          </div>

          <div className="overflow-x-auto">
            {filteredReports.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed bg-slate-50 rounded-2xl border-slate-200">
                <CheckCircle className="mx-auto mb-4 text-emerald-500" size={48} />
                <h3 className="text-xl font-bold text-blue-950">
                  {searchQuery ? 'No Matching Records' : 'System Clear'}
                </h3>
                <p className="text-slate-500">
                  {searchQuery ? 'Try a different search term.' : 'No active infrastructure reports detected.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-2 py-3">Severity</th>
                    <th className="px-2 py-3">Incident / Area</th>
                    <th className="px-2 py-3">Technician</th>
                    <th className="px-2 py-3">Status</th>
                    <th className="px-2 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredReports.map((report) => (
                    <tr 
                      key={report._id}
                      onClick={() => navigate(`/admin/reports/${report._id}`)}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-2 py-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border ${getSeverityColor(report.severity)}`}>
                          <Zap size={14} />
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-blue-950 group-hover:text-blue-600 transition-colors truncate max-w-[180px]">
                            {report.title}
                          </p>
                          {report.issueImage && (
                            <span title="Image Evidence Attached">
                              <Droplets size={12} className="text-sky-500 animate-pulse" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin size={10} /> {report.location}
                        </p>
                      </td>
                      <td className="px-2 py-4 text-slate-600 font-medium">
                        {report.assignedTo?.name || <span className="text-slate-300 italic">Unassigned</span>}
                      </td>
                      <td className="px-2 py-4">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter rounded-md ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-right text-[10px] font-bold text-slate-400">
                        {getRelativeTime(report.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Management & System Vitals */}
        <div className="space-y-6">
          <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
            <h3 className="flex items-center gap-2 mb-6 text-sm font-black tracking-widest uppercase text-blue-950">
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
          <div className="p-6 border bg-gradient-to-br from-blue-50 to-sky-50 border-sky-100 rounded-2xl">
            <h3 className="mb-4 text-sm font-black tracking-widest uppercase text-blue-950">Network Distribution</h3>
            <div className="space-y-4">
              {[
                { zone: 'Northern Sector', load: '65%', color: 'bg-sky-500' },
                { zone: 'Central Hub', load: '92%', color: 'bg-red-500' },
                { zone: 'Western Grid', load: '40%', color: 'bg-emerald-500' },
              ].map((grid, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="uppercase text-slate-600">{grid.zone}</span>
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
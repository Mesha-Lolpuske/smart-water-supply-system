import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import technicianService from '../../services/technicianService'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { MapContainer, TileLayer, Polygon, Popup, ZoomControl, ScaleControl, LayersControl, Marker } from 'react-leaflet'
import { toast } from 'react-toastify'
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  ClipboardList,
  Wrench,
  CheckSquare,
  X,
  Save,
  MessageSquare,
  History,
  Map,
  MapPin,
  Droplets
} from 'lucide-react'
import 'leaflet/dist/leaflet.css'

function TechnicianDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchQuery } = useSearch()
  
  const queryParams = new URLSearchParams(location.search)
  const isHistoryView = queryParams.get('view') === 'history'

  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [mapLoading, setMapLoading] = useState(true)
  const [mapError, setMapError] = useState(null)
  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: ''
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
    fetchTechnicianData()
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

  const fetchTechnicianData = async () => {
    try {
      setLoading(true)
      const res = await technicianService.getAssignedReports()
      if (res.success) {
        setReports(res.reports || [])
      }
    } catch (error) {
      console.error('Error fetching technician data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenUpdate = (report, e) => {
    e.stopPropagation()
    setSelectedReport(report)
    setUpdateForm({
      status: report.status,
      notes: report.technicianNotes || ''
    })
    setShowUpdateModal(true)
  }

  const handleUpdateSubmit = async () => {
    try {
      const res = await technicianService.updateReportStatus(
        selectedReport._id, 
        updateForm.status, 
        updateForm.notes
      )
      if (res.success) {
        toast.success('Work order updated successfully')
        setShowUpdateModal(false)
        fetchTechnicianData() // Refresh list
      }
    } catch (error) {
      toast.error('Failed to update work order')
    }
  }

  const filteredReports = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim()
    
    // Toggle between active and history
    const baseReports = isHistoryView 
      ? reports.filter(r => r.status === 'Fixed' || r.status === 'Cancelled')
      : reports.filter(r => r.status !== 'Fixed' && r.status !== 'Cancelled')
    
    if (!query) return baseReports
    return baseReports.filter(report => 
      report.title.toLowerCase().includes(query) ||
      report.location.toLowerCase().includes(query) ||
      report.status.toLowerCase().includes(query)
    )
  }, [reports, searchQuery, isHistoryView])

  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter(r => ['Reported', 'Technician Assigned', 'In Progress'].includes(r.status)).length,
      resolved: reports.filter(r => r.status === 'Fixed').length,
      critical: reports.filter(r => r.severity === 'critical' && r.status !== 'Fixed').length
    }
  }, [reports])

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
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-16 h-16 border-t-4 border-blue-900 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-bold text-blue-950 animate-pulse">Accessing Field Portal...</p>
        </div>
      </DashboardLayout>
    )
  }

  const mainStats = [
    { icon: ClipboardList, label: 'Work Orders', value: stats.total, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: Clock, label: 'Active Tasks', value: stats.pending, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { icon: CheckSquare, label: 'Completed', value: stats.resolved, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: AlertTriangle, label: 'High Priority', value: stats.critical, bg: 'bg-red-50', iconColor: 'text-red-600' },
  ]

  return (
    <DashboardLayout>
      <div className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black tracking-widest uppercase border rounded-lg text-emerald-400 border-emerald-400/20 bg-emerald-400/5">
            <Wrench size={14} />
            <span>Field Technician Console</span>
          </div>
          <h1 className="text-3xl font-black text-white md:text-4xl">
            {isHistoryView ? 'Job History' : 'Service Assignments'}
          </h1>
          <p className="mt-2 text-lg font-medium text-slate-400">
            {isHistoryView ? 'Review your completed maintenance records.' : 'Manage your active maintenance tickets and repair logs.'}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 -mr-32 -mt-32 rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>

      {/* Interactive Field Operations Map - TECHNICIAN WORKSTATION */}
      {!isHistoryView && (
        <div className="mb-8">
          <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Map size={24} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-blue-950">Field Operations Map</h2>
                  <p className="text-sm text-slate-500">Locate and respond to water system issues</p>
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
                  <span className="text-xs font-medium text-red-700">Urgent</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Map Container */}
              <div className="lg:col-span-3">
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200" style={{ height: '450px' }}>
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
                  <MapContainer center={[-1.2864, 36.8172]} zoom={10} style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }} className="rounded-lg" whenReady={() => setMapLoading(false)} onError={() => { setMapLoading(false); setMapError('Failed to load map'); }}>
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
                          <div className="p-3 min-w-[220px]">
                            <h3 className="font-bold text-lg text-blue-950 mb-2">{zone.name}</h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${zone.status === 'good' ? 'bg-green-500' : zone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                <span className="font-medium">{getZoneStatusText(zone.status)}</span>
                              </div>
                              <p className="text-sm text-gray-600"><strong>Region:</strong> {zone.region}</p>
                              <p className="text-sm text-gray-600"><strong>Pressure:</strong> {zone.waterPressure}%</p>
                              <p className="text-sm text-gray-600"><strong>Schedule:</strong> {zone.nextSupply}</p>
                              {zone.lastOutage && (
                                <p className="text-sm text-red-600"><strong>Last Outage:</strong> {zone.lastOutage}</p>
                              )}
                              <div className="mt-3 pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-500">Click to view work orders</p>
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

              {/* Technician Action Panel */}
              <div className="space-y-4">
                {selectedZone ? (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-blue-950 mb-3">Work Zone</h3>
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
                        <p><strong>Pressure:</strong> {selectedZone.waterPressure}%</p>
                        <p><strong>Schedule:</strong> {selectedZone.nextSupply}</p>
                      </div>
                      <div className="pt-2 space-y-2">
                        <button className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                          View Work Orders
                        </button>
                        <button className="w-full px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
                          Report Issue
                        </button>
                        <button className="w-full px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100">
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-center">
                      <MapPin className="mx-auto text-orange-500 mb-2" size={24} />
                      <p className="text-sm font-medium text-orange-900">Select a zone</p>
                      <p className="text-xs text-orange-700">to view field operations</p>
                    </div>
                  </div>
                )}

                {/* Priority Alerts */}
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Priority Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                      <AlertTriangle className="text-red-500" size={16} />
                      <span className="text-sm text-red-700">Mombasa Central - Critical</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                      <Clock className="text-yellow-500" size={16} />
                      <span className="text-sm text-yellow-700">Westlands - Maintenance</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                      <AlertTriangle className="text-red-500" size={16} />
                      <span className="text-sm text-red-700">Koinange St - Urgent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isHistoryView && (
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {mainStats.map((stat, index) => (
            <div key={index} className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
              <div className={`flex items-center justify-center w-12 h-12 mb-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
              <div className="text-3xl font-black text-blue-950">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="p-6 bg-white shadow-sm border border-slate-100 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isHistoryView ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isHistoryView ? <History size={24} /> : <ClipboardList size={24} />}
            </div>
            <h2 className="text-2xl font-black text-blue-950">
              {isHistoryView ? 'Completed Jobs' : 'Active Work Orders'}
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              {isHistoryView ? (
                <>
                  <History className="mx-auto text-slate-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-blue-950">No History</h3>
                  <p className="text-slate-500">You haven't completed any work orders yet.</p>
                </>
              ) : (
                <>
                  <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-blue-950">No Active Tasks</h3>
                  <p className="text-slate-500">All your assigned work orders are currently completed.</p>
                </>
              )}
            </div>
          ) : (
            filteredReports.map((report) => (
              <div 
                key={report._id}
                onClick={() => navigate(`/reports/${report._id}`)}
                className="group flex flex-col md:flex-row md:items-center gap-4 p-5 transition-all border border-slate-100 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-slate-50/50"
              >
                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl flex-shrink-0 border ${getSeverityColor(report.severity)}`}>
                  <Zap size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-blue-950 truncate group-hover:text-emerald-600 transition-colors">{report.title}</h3>
                    {report.issueImage && (
                      <span title="Image Evidence Attached">
                        <Droplets size={12} className="text-sky-500 animate-pulse" />
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{report.location} • {getRelativeTime(report.createdAt)}</p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-1">{report.description}</p>
                </div>
                {!isHistoryView && (
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2">
                    <button 
                      onClick={(e) => handleOpenUpdate(report, e)}
                      className="px-6 py-2.5 text-xs font-black text-white bg-blue-950 rounded-xl hover:bg-blue-900 transition-all shadow-lg flex items-center gap-2"
                    >
                      <Wrench size={14} />
                      UPDATE LOG
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== UPDATE PROGRESS MODAL ===== */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Update Work Order</h2>
              <button onClick={() => setShowUpdateModal(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Task Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {['In Progress', 'Fixed', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => setUpdateForm({...updateForm, status})}
                      className={`p-3 rounded-xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${
                        updateForm.status === status ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-emerald-600/20'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Technical Findings / Notes</label>
                <textarea
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                  className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-blue-950 focus:border-emerald-600 focus:ring-0 outline-none transition-all resize-none"
                  placeholder="Describe the repair work performed..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-6 py-4 font-black text-slate-400 hover:text-blue-950 transition-colors uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  <Save size={18} />
                  Save Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default TechnicianDashboard

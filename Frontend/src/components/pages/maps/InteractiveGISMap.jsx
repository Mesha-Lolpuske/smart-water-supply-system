import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Polygon, Popup, Marker } from 'react-leaflet'
import DashboardLayout from '../../layout/DashboardLayout'
import { useSearch } from '../../context/SearchContext'
import { ArrowLeft, MapPin, Droplets, AlertTriangle, CheckCircle, Download, RefreshCw, Map as MapIcon } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

function InteractiveGISMap() {
  const navigate = useNavigate()
  useSearch()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null)

  // Mock neighborhood data with coordinates and water status
  const neighborhoods = [
    {
      id: 1,
      name: 'Downtown District',
      status: 'good',
      waterPressure: 85,
      lastMaintenance: '2024-01-15',
      coordinates: [[40.7128, -74.0060], [40.7138, -74.0050], [40.7128, -74.0040], [40.7118, -74.0050]]
    },
    {
      id: 2,
      name: 'Residential North',
      status: 'critical',
      waterPressure: 45,
      lastMaintenance: '2024-01-10',
      coordinates: [[40.7150, -74.0080], [40.7160, -74.0070], [40.7150, -74.0060], [40.7140, -74.0070]]
    },
    {
      id: 3,
      name: 'Industrial Zone',
      status: 'warning',
      waterPressure: 65,
      lastMaintenance: '2024-01-12',
      coordinates: [[40.7100, -74.0030], [40.7110, -74.0020], [40.7100, -74.0010], [40.7090, -74.0020]]
    },
    {
      id: 4,
      name: 'Suburban East',
      status: 'good',
      waterPressure: 78,
      lastMaintenance: '2024-01-18',
      coordinates: [[40.7140, -74.0000], [40.7150, -73.9990], [40.7140, -73.9980], [40.7130, -73.9990]]
    },
    {
      id: 5,
      name: 'Commercial Center',
      status: 'critical',
      waterPressure: 38,
      lastMaintenance: '2024-01-08',
      coordinates: [[40.7080, -74.0050], [40.7090, -74.0040], [40.7080, -74.0030], [40.7070, -74.0040]]
    }
  ]

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // For now, we'll use mock data. In production, this would fetch from analyticsService
      setData({
        totalNeighborhoods: neighborhoods.length,
        goodZones: neighborhoods.filter(n => n.status === 'good').length,
        warningZones: neighborhoods.filter(n => n.status === 'warning').length,
        criticalZones: neighborhoods.filter(n => n.status === 'critical').length,
        averagePressure: Math.round(neighborhoods.reduce((sum, n) => sum + n.waterPressure, 0) / neighborhoods.length)
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10b981' // green
      case 'warning': return '#f59e0b' // yellow
      case 'critical': return '#ef4444' // red
      default: return '#6b7280' // gray
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return CheckCircle
      case 'warning': return AlertTriangle
      case 'critical': return AlertTriangle
      default: return MapPin
    }
  }

  const exportCSV = () => {
    const rows = [
      ['Neighborhood', 'Status', 'Water Pressure', 'Last Maintenance'],
      ...neighborhoods.map(n => [n.name, n.status, n.waterPressure, n.lastMaintenance])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.href = 'data:text/csv,' + encodeURIComponent(csv)
    link.download = 'gis-mapping-data.csv'
    link.click()
  }

  if (loading) return <DashboardLayout isAdmin={true}><div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-900 animate-spin"></div></div></DashboardLayout>

  const Metric = ({ icon, label, val, sub, bg }) => (
    <div className="p-6 bg-white border-2 border-transparent shadow-sm rounded-2xl hover:shadow-lg hover:border-sky-200">
      <div className="flex items-center gap-2 mb-3"><div className={`p-2 rounded-lg ${bg}`}>{React.createElement(icon, { size: 24 })}</div></div>
      <div className="text-3xl font-black text-blue-950">{val}</div>
      <div className="text-xs font-bold uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-xs text-slate-400">{sub}</div>
    </div>
  )

  const Chart = ({ icon, title, sub, children }) => (
    <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
      <div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-lg bg-blue-50">{React.createElement(icon, { size: 20 })}</div><div><h3 className="font-bold text-blue-950">{title}</h3><p className="text-xs text-slate-500">{sub}</p></div></div>
      <div className="w-full h-64">{children}</div>
    </div>
  )

  return (
    <DashboardLayout isAdmin={true}>
      <div className="relative p-8 mb-8 overflow-hidden shadow-lg rounded-2xl bg-blue-950">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded-lg text-sky-400 hover:bg-blue-900"><ArrowLeft size={24} /></button>
            <div><h1 className="text-3xl font-black text-white">Interactive GIS Mapping</h1><p className="text-xs text-slate-400">Location-based water supply status</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><RefreshCw size={16} /></button>
            <button onClick={exportCSV} className="px-4 py-2 text-sm font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50"><Download size={16} /></button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-32 -mr-32 rounded-full w-96 h-96 bg-sky-500/10 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={MapPin} label="Total Zones" val={data?.totalNeighborhoods || 0} sub="Monitored areas" bg="bg-blue-50" />
        <Metric icon={CheckCircle} label="Good Zones" val={data?.goodZones || 0} sub="Optimal status" bg="bg-emerald-50" />
        <Metric icon={AlertTriangle} label="Warning Zones" val={data?.warningZones || 0} sub="Needs attention" bg="bg-yellow-50" />
        <Metric icon={Droplets} label="Avg Pressure" val={`${data?.averagePressure || 0}%`} sub="System average" bg="bg-indigo-50" />
      </div>

      <div className="grid gap-8 mb-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Chart icon={MapIcon} title="Interactive Map" sub="Click neighborhoods for details">
            <div style={{ height: '400px', width: '100%' }}>
              <MapContainer center={[40.7128, -74.0040]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {neighborhoods.map((neighborhood) => (
                  <Polygon
                    key={neighborhood.id}
                    positions={neighborhood.coordinates}
                    pathOptions={{
                      color: getStatusColor(neighborhood.status),
                      fillColor: getStatusColor(neighborhood.status),
                      fillOpacity: 0.6,
                      weight: 2
                    }}
                    eventHandlers={{
                      click: () => setSelectedNeighborhood(neighborhood)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg">{neighborhood.name}</h3>
                        <p className="text-sm">Status: <span className={`font-semibold ${neighborhood.status === 'good' ? 'text-green-600' : neighborhood.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>{neighborhood.status.toUpperCase()}</span></p>
                        <p className="text-sm">Water Pressure: {neighborhood.waterPressure}%</p>
                        <p className="text-sm">Last Maintenance: {neighborhood.lastMaintenance}</p>
                      </div>
                    </Popup>
                  </Polygon>
                ))}
              </MapContainer>
            </div>
          </Chart>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
            <h3 className="mb-4 font-bold text-blue-950">Zone Status Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Good - Optimal water supply</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Warning - Monitor closely</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Critical - Immediate action needed</span>
              </div>
            </div>
          </div>

          {selectedNeighborhood && (
            <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100">
              <h3 className="mb-4 font-bold text-blue-950">Selected Zone Details</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-semibold">Name:</span> {selectedNeighborhood.name}</p>
                <p className="text-sm"><span className="font-semibold">Status:</span> <span className={`font-semibold ${selectedNeighborhood.status === 'good' ? 'text-green-600' : selectedNeighborhood.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>{selectedNeighborhood.status.toUpperCase()}</span></p>
                <p className="text-sm"><span className="font-semibold">Pressure:</span> {selectedNeighborhood.waterPressure}%</p>
                <p className="text-sm"><span className="font-semibold">Last Maintenance:</span> {selectedNeighborhood.lastMaintenance}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Chart icon={MapPin} title="Zone Distribution" sub="By status">
          <div className="flex flex-col justify-center h-full space-y-4">
            {neighborhoods.map((neighborhood) => {
              const StatusIcon = getStatusIcon(neighborhood.status)
              return (
                <div key={neighborhood.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <StatusIcon size={20} className={neighborhood.status === 'good' ? 'text-green-600' : neighborhood.status === 'warning' ? 'text-yellow-600' : 'text-red-600'} />
                    <span className="font-medium">{neighborhood.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{neighborhood.waterPressure}%</div>
                    <div className="text-xs text-gray-500">{neighborhood.status}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </Chart>

        <Chart icon={Droplets} title="Pressure Overview" sub="All zones">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl font-black text-blue-600 mb-2">{data?.averagePressure || 0}%</div>
              <div className="text-lg text-gray-600">Average Pressure</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Lowest:</span>
                  <span className="font-semibold">{Math.min(...neighborhoods.map(n => n.waterPressure))}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Highest:</span>
                  <span className="font-semibold">{Math.max(...neighborhoods.map(n => n.waterPressure))}%</span>
                </div>
              </div>
            </div>
          </div>
        </Chart>
      </div>
    </DashboardLayout>
  )
}

export default InteractiveGISMap
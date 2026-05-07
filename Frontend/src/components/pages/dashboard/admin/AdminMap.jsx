import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, ZoomControl, ScaleControl, LayersControl, Marker } from 'react-leaflet';
import { Map, MapPin, RefreshCw } from 'lucide-react';
import { njoroAreas, infrastructure } from "../../../utils/njoroData";
import { analyticsService } from '../../../services/analyticsService';
import 'leaflet/dist/leaflet.css';

export default function AdminMap({ reports = [], onRefresh }) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [dynamicStatuses, setDynamicStatuses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchZoneStatus();
  }, []);

  useEffect(() => {
    const handleReportStatusChange = (event) => {
      console.log('Report status changed, refreshing map...', event.detail);
      fetchZoneStatus();
    };
    
    window.addEventListener('reportStatusChanged', handleReportStatusChange);
    
    return () => {
      window.removeEventListener('reportStatusChanged', handleReportStatusChange);
    };
  }, []);

  const fetchZoneStatus = async () => {
    try {
      setRefreshing(true);
      const res = await analyticsService.getZoneStatus();
      if (res.success) {
        setDynamicStatuses(res.data);
      }
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error fetching zone status:', error);
      setMapError('Failed to sync live status');
    } finally {
      setRefreshing(false);
      setMapLoading(false);
    }
  };

  // ✅ FIXED: Use dynamicStatuses from API directly instead of recalculating
  const mergedZones = useMemo(() => {
    return njoroAreas.map(area => {
      const dynamic = dynamicStatuses.find(d => d.name === area.name);
      
      return {
        ...area,
        status: dynamic ? dynamic.status : 'good',
        reason: dynamic ? dynamic.reason : 'Operational - All clear',
        reportCount: dynamic ? dynamic.reportCount : 0,
        criticalCount: dynamic ? dynamic.criticalCount : 0,
        warningCount: dynamic ? dynamic.warningCount : 0,
        activeSchedules: dynamic ? dynamic.activeSchedules : 0
      };
    });
  }, [dynamicStatuses]);

  // ✅ FIXED: Updated color mapping
  const getZoneStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10b981'; // Green
      case 'warning': return '#f59e0b'; // Yellow
      case 'critical': return '#ef4444'; // Red
      default: return '#6b7280';
    }
  };

  // ✅ FIXED: Updated text mapping to match your requirements
  const getZoneStatusText = (status) => {
    switch (status) {
      case 'good': return 'Normal Supply';
      case 'warning': return 'Low Pressure / Leak / Rationing';
      case 'critical': return 'No Water / Contamination / Emergency';
      default: return 'Unknown';
    }
  };

  const getInfrastructureIcon = (type) => {
    switch (type) {
      case 'treatment': return '🏭';
      case 'pump': return '⚙️';
      case 'reservoir': return '💧';
      default: return '📍';
    }
  };

  // ✅ FIXED: Updated legend to match new logic
  const legendItems = [
    { color: '#10b981', label: 'Normal Supply', description: 'No active issues or rationing' },
    { color: '#f59e0b', label: 'Warning', description: 'Pipe Leak / Low Pressure / Rationing' },
    { color: '#ef4444', label: 'Critical', description: 'No Water Supply / Contamination / Emergency' }
  ];

  return (
    <div className="mb-8">
      <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50">
              <Map size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-blue-950">Water Supply Control Center</h2>
              <p className="text-sm text-slate-500">Monitor and manage all water zones in Njoro</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchZoneStatus}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-1 mr-4 text-xs font-bold text-blue-600 transition-all bg-blue-50 rounded-xl hover:bg-blue-100 disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              SYNC LIVE
            </button>
            {legendItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${item.color}20` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs font-medium" style={{ color: item.color }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="relative w-full overflow-hidden bg-gray-100 border border-gray-200 rounded-lg" style={{ height: '500px' }}>
              {mapLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
                  <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              {mapError && (
                <div className="absolute inset-0 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center z-[1000]">
                  <div className="text-center">
                    <div className="mb-2 text-2xl text-red-500">⚠️</div>
                    <p className="font-medium text-red-700">Map failed to load</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-3 py-1 mt-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
              <MapContainer 
                center={[-0.3384, 35.9376]} 
                zoom={12} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }} 
                className="rounded-lg" 
                whenReady={() => setMapLoading(false)}
              >
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
                      attribution='&copy; <a href="https://www.arcgis.com/">Esri</a>'
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>
                
                <ZoomControl position="topright" />
                <ScaleControl position="bottomleft" />
                
                {mergedZones.map((zone) => (
                  <Polygon
                    key={zone.id}
                    positions={zone.coordinates}
                    pathOptions={{
                      color: getZoneStatusColor(zone.status),
                      fillColor: getZoneStatusColor(zone.status),
                      fillOpacity: 0.6,
                      weight: 3
                    }}
                    eventHandlers={{
                      click: () => setSelectedZone(zone)
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[220px]">
                        <h3 className="font-bold text-blue-950">{zone.name}</h3>
                        <div className="my-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            zone.status === 'good' ? 'bg-green-100 text-green-700' : 
                            zone.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {getZoneStatusText(zone.status)}
                          </span>
                        </div>
                        <p className="mb-2 text-xs italic font-bold text-slate-500">"{zone.reason}"</p>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p><strong>Critical Issues:</strong> {zone.criticalCount || 0}</p>
                          <p><strong>Warning Issues:</strong> {zone.warningCount || 0}</p>
                          <p><strong>Active Schedules:</strong> {zone.activeSchedules}</p>
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
                      <div className="p-2 min-w-[150px]">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{getInfrastructureIcon(item.type)}</span>
                          <h3 className="font-bold text-blue-950">{item.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 capitalize">Status: {item.status}</p>
                        <p className="text-sm text-gray-600">Capacity: {item.capacity}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="space-y-4">
            {selectedZone ? (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="mb-3 text-lg font-bold text-blue-950">Zone Management</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">{selectedZone.name}</p>
                    <p className="text-sm text-gray-600">{selectedZone.region}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedZone.status === 'good' ? 'bg-green-500' : selectedZone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">{getZoneStatusText(selectedZone.status)}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Population:</strong> {selectedZone.population?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Pressure:</strong> {selectedZone.waterPressure || 'N/A'}%</p>
                    <p><strong>Schedule:</strong> {selectedZone.nextSupply || 'N/A'}</p>
                  </div>
                  <div className="pt-2 space-y-2">
                    <button className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Update Status</button>
                    <button className="w-full px-3 py-2 text-sm font-medium text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100">Schedule Maintenance</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center border border-blue-200 rounded-lg bg-blue-50">
                <MapPin className="mx-auto mb-2 text-blue-500" size={24} />
                <p className="text-sm font-medium text-blue-900">Select a zone to manage</p>
              </div>
            )}

            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <h4 className="mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">System Overview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Zones:</span>
                  <span className="font-medium">{mergedZones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Normal:</span>
                  <span className="font-medium text-green-600">{mergedZones.filter(z => z.status === 'good').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Warning:</span>
                  <span className="font-medium text-yellow-600">{mergedZones.filter(z => z.status === 'warning').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Critical:</span>
                  <span className="font-medium text-red-600">{mergedZones.filter(z => z.status === 'critical').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
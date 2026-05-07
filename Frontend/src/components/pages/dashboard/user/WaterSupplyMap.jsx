import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, ZoomControl, ScaleControl, LayersControl, Marker } from 'react-leaflet';
import { MapPin, Map, RefreshCw, AlertTriangle, Droplets, Wrench, Users } from 'lucide-react';
import { njoroAreas, infrastructure } from '../../../utils/njoroData'; 
import { analyticsService } from '../../../services/analyticsService';

export default function WaterSupplyMap() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [dynamicStatuses, setDynamicStatuses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchZoneStatus();
  }, []);

  // Listen for report status changes
  useEffect(() => {
    const handleReportStatusChange = (event) => {
      console.log('Report status changed, refreshing user map...', event.detail);
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
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching zone status:', error);
      setMapError('Failed to sync live status');
    } finally {
      setRefreshing(false);
      setMapLoading(false);
    }
  };

  const mergedZones = useMemo(() => {
    return njoroAreas.map(area => {
      const dynamic = dynamicStatuses.find(d => d.name === area.name);
      return {
        ...area,
        status: dynamic ? dynamic.status : 'good',
        reason: dynamic ? dynamic.reason : 'System operational - All clear',
        reportCount: dynamic ? dynamic.reportCount : 0,
        criticalCount: dynamic ? dynamic.criticalCount : 0,
        warningCount: dynamic ? dynamic.warningCount : 0,
        activeSchedules: dynamic ? dynamic.activeSchedules : 0,
        lastUpdated: dynamic ? dynamic.lastUpdated : null
      };
    });
  }, [dynamicStatuses]);

  // ✅ UPDATED: New color mapping logic
  const getZoneStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10b981'; // Green - Normal
      case 'warning': return '#f59e0b'; // Yellow - Leak/Low Pressure/Rationing
      case 'critical': return '#ef4444'; // Red - No Water/Contamination
      default: return '#6b7280';
    }
  };

  // ✅ UPDATED: New text mapping with detailed descriptions
  const getZoneStatusText = (status) => {
    switch (status) {
      case 'good': return 'Water Available';
      case 'warning': return 'Low Pressure / Leak / Rationing';
      case 'critical': return 'No Water / Contamination';
      default: return 'Unknown';
    }
  };

  // Get icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <Droplets size={16} className="text-green-600" />;
      case 'warning': return <Wrench size={16} className="text-yellow-600" />;
      case 'critical': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <MapPin size={16} />;
    }
  };

  // Get status details for popup
  const getStatusDetails = (zone) => {
    if (zone.status === 'critical') {
      if (zone.criticalCount > 0) {
        return `${zone.criticalCount} critical issue(s): No water supply or contamination`;
      }
      return 'Emergency situation - Immediate attention required';
    }
    if (zone.status === 'warning') {
      if (zone.warningCount > 0) {
        return `${zone.warningCount} issue(s): Pipe leak or low pressure`;
      }
      if (zone.activeSchedules > 0) {
        return `Active rationing/maintenance schedule in effect`;
      }
      return 'Service advisory in effect';
    }
    return 'All systems operational';
  };

  return (
    <div className="p-6 mb-8 bg-white border shadow-sm border-slate-100 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50">
            <Map size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-blue-950">Water Supply Status Map</h2>
            <p className="text-sm text-slate-500">Click on your area to check water availability</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={fetchZoneStatus}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-600 transition-all rounded-full bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Updating...' : 'Refresh'}
          </button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-green-700">Normal Supply</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs font-medium text-yellow-700">Low Pressure/Leak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs font-medium text-red-700">No Water/Contamination</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative w-full overflow-hidden bg-gray-100 border border-gray-200 rounded-lg" style={{ height: '450px' }}>
            {mapLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75">
                <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            {mapError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center border border-red-200 rounded-lg bg-red-50">
                <div className="text-center">
                  <div className="mb-2 text-2xl text-red-500">⚠️</div>
                  <p className="font-medium text-red-700">{mapError}</p>
                  <button onClick={fetchZoneStatus} className="px-3 py-1 mt-2 text-sm text-white bg-red-600 rounded hover:bg-red-700">Retry</button>
                </div>
              </div>
            )}
            <MapContainer 
              center={[-0.3384, 35.9376]} 
              zoom={12} 
              style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}
              className="rounded-lg"
              whenReady={() => setMapLoading(false)}
              onError={() => { setMapLoading(false); setMapError('Failed to load map'); }}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
              
              {mergedZones.map((area) => (
                <Polygon
                  key={area.id}
                  positions={area.coordinates}
                  pathOptions={{
                    color: getZoneStatusColor(area.status),
                    fillColor: getZoneStatusColor(area.status),
                    fillOpacity: 0.5,
                    weight: 2
                  }}
                  eventHandlers={{ click: () => setSelectedArea(area) }}
                >
                  <Popup>
                    <div className="p-3 min-w-[220px]">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(area.status)}
                        <h3 className="font-bold text-blue-950">{area.name}</h3>
                      </div>
                      <div className="my-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          area.status === 'good' ? 'bg-green-100 text-green-700' : 
                          area.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {getZoneStatusText(area.status)}
                        </span>
                      </div>
                      <p className="mb-2 text-xs font-medium text-slate-600">📢 {area.reason}</p>
                      <div className="pt-2 space-y-1 text-xs text-gray-600 border-t border-gray-100">
                        {area.criticalCount > 0 && (
                          <p className="text-red-600">🔴 {area.criticalCount} critical issue(s)</p>
                        )}
                        {area.warningCount > 0 && (
                          <p className="text-yellow-600">🟡 {area.warningCount} pending issue(s)</p>
                        )}
                        {area.activeSchedules > 0 && (
                          <p className="text-blue-600">📅 {area.activeSchedules} active schedule(s)</p>
                        )}
                        {area.reportCount === 0 && area.activeSchedules === 0 && (
                          <p className="text-green-600">✅ No active issues</p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              ))}
              {infrastructure.map((item) => (
                <Marker key={item.id} position={[item.lat, item.lng]}>
                  <Popup>
                    <div className="p-2 min-w-[150px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{item.type === 'treatment' ? '🏭' : item.type === 'pump' ? '⚙️' : '💧'}</span>
                        <h3 className="font-bold text-blue-950">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-600 capitalize">Status: {item.status}</p>
                      <p className="text-xs text-gray-600">Capacity: {item.capacity}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          {lastUpdated && (
            <p className="mt-2 text-xs text-right text-slate-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Area Details Panel */}
        <div className="space-y-4">
          {selectedArea ? (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon(selectedArea.status)}
                <h3 className="text-lg font-bold text-blue-950">{selectedArea.name}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${selectedArea.status === 'good' ? 'bg-green-500' : selectedArea.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">{getZoneStatusText(selectedArea.status)}</span>
                </div>
                <p className="text-sm italic text-gray-600">"{selectedArea.reason}"</p>
                <div className="pt-2 space-y-2 text-sm border-t border-gray-200">
                  <p><strong>Region:</strong> {selectedArea.region}</p>
                  <p><strong>Population Served:</strong> {selectedArea.population?.toLocaleString() || 'N/A'}</p>
                  <p><strong>Current Pressure:</strong> {selectedArea.waterPressure || 'N/A'}%</p>
                  <p><strong>Next Supply:</strong> {selectedArea.nextSupply || 'Check schedule'}</p>
                </div>
                <div className="pt-2">
                  {selectedArea.status === 'critical' && (
                    <div className="p-2 bg-red-100 rounded-lg">
                      <p className="text-xs font-medium text-red-700">⚠️ Please report this issue to our customer service hotline immediately.</p>
                    </div>
                  )}
                  {selectedArea.status === 'warning' && (
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <p className="text-xs font-medium text-yellow-700">📢 Our team is aware of the issue and working on a resolution.</p>
                    </div>
                  )}
                  {selectedArea.status === 'good' && (
                    <div className="p-2 bg-green-100 rounded-lg">
                      <p className="text-xs font-medium text-green-700">✅ Water supply is normal. Report any issues through the report form.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border border-blue-200 rounded-lg bg-blue-50">
              <MapPin className="mx-auto mb-3 text-blue-500" size={32} />
              <p className="text-sm font-medium text-blue-900">Click on any area to view details</p>
              <p className="mt-1 text-xs text-blue-700">See water availability status for your location</p>
            </div>
          )}

          {/* Quick Info Cards */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="flex items-center gap-2 mb-3 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              <Users size={14} />
              Community Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Areas with Normal Supply:</span>
                <span className="font-medium text-green-600">{mergedZones.filter(z => z.status === 'good').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Areas with Issues:</span>
                <span className="font-medium text-yellow-600">{mergedZones.filter(z => z.status === 'warning').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Critical Areas:</span>
                <span className="font-medium text-red-600">{mergedZones.filter(z => z.status === 'critical').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, ZoomControl, ScaleControl, LayersControl, Marker } from 'react-leaflet';
import { MapPin, Map, RefreshCw } from 'lucide-react';
import { njoroAreas, infrastructure } from '../../../utils/njoroData'; 
import { analyticsService } from '../../../services/analyticsService';

export default function WaterSupplyMap() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [dynamicStatuses, setDynamicStatuses] = useState([]);
  const [, setRefreshing] = useState(false);

  useEffect(() => {
    fetchZoneStatus();
  }, []);

  const fetchZoneStatus = async () => {
    try {
      setRefreshing(true);
      const res = await analyticsService.getZoneStatus();
      if (res.success) {
        setDynamicStatuses(res.data);
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
        status: dynamic ? dynamic.status : area.status,
        reason: dynamic ? dynamic.reason : 'No data',
        reportCount: dynamic ? dynamic.reportCount : 0,
        activeSchedules: dynamic ? dynamic.activeSchedules : 0
      };
    });
  }, [dynamicStatuses]);

  // Helper functions scoped to the map
  const getZoneStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getZoneStatusText = (status) => {
    switch (status) {
      case 'good': return 'Water Available';
      case 'warning': return 'Limited Supply';
      case 'critical': return 'Supply Cut';
      default: return 'Unknown';
    }
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
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-green-700">Available</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs font-medium text-yellow-700">Limited</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs font-medium text-red-700">Cut Off</span>
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
                  <p className="font-medium text-red-700">Map failed to load</p>
                  <button onClick={() => window.location.reload()} className="px-3 py-1 mt-2 text-sm text-white bg-red-600 rounded hover:bg-red-700">Retry</button>
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
                    <div className="p-2 min-w-[180px]">
                      <h3 className="font-bold text-blue-950">{area.name}</h3>
                      <div className="my-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          area.status === 'good' ? 'bg-green-100 text-green-700' : 
                          area.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {getZoneStatusText(area.status)}
                        </span>
                      </div>
                      <p className="text-[10px] italic text-slate-500 mb-2">"{area.reason}"</p>
                      <div className="text-[10px] text-gray-600 space-y-1">
                        <p><strong>Reports:</strong> {area.reportCount} active</p>
                        <p><strong>Schedules:</strong> {area.activeSchedules} today</p>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              ))}
              {infrastructure.map((item) => (
                <Marker key={item.id} position={[item.lat, item.lng]} />
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Area Details Panel */}
        <div className="space-y-4">
          {selectedArea ? (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="mb-3 text-lg font-bold text-blue-950">Selected Area</h3>
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">{selectedArea.name}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${selectedArea.status === 'good' ? 'bg-green-500' : selectedArea.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">{getZoneStatusText(selectedArea.status)}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p><strong>Supply:</strong> {selectedArea.nextSupply}</p>
                  <p><strong>Pressure:</strong> {selectedArea.waterPressure}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center border border-blue-200 rounded-lg bg-blue-50">
              <MapPin className="mx-auto mb-2 text-blue-500" size={24} />
              <p className="text-sm font-medium text-blue-900">Click on any area to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
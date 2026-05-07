import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup, ZoomControl, ScaleControl, LayersControl, Marker } from 'react-leaflet';
import { Map, MapPin, AlertTriangle, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function TechnicianMap({ 
  mapLoading, 
  mapError, 
  mergedZones, 
  infrastructure, 
  selectedZone, 
  setSelectedZone,
  getInfrastructureIcon,
  getInfrastructureColor,
  setMapLoading
}) {
  // Updated color functions
  const getZoneStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10b981'; // Green
      case 'warning': return '#f59e0b'; // Yellow
      case 'critical': return '#ef4444'; // Red
      default: return '#6b7280';
    }
  };

  const getZoneStatusText = (status) => {
    switch (status) {
      case 'good': return 'Normal Supply';
      case 'warning': return 'Low Pressure / Leak / Rationing';
      case 'critical': return 'No Water / Contamination / Emergency';
      default: return 'Unknown';
    }
  };

  return (
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
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-700">Operational</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs font-medium text-yellow-700">Maintenance</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs font-medium text-red-700">Urgent</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
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
                    <button onClick={() => window.location.reload()} className="px-3 py-1 mt-2 text-sm text-white bg-red-600 rounded hover:bg-red-700">Retry</button>
                  </div>
                </div>
              )}
              <MapContainer 
                center={[-0.3384, 35.9376]} 
                zoom={12} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }} 
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
                        <h3 className="mb-2 text-lg font-bold text-blue-950">{zone.name}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${zone.status === 'good' ? 'bg-green-500' : zone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">{getZoneStatusText(zone.status)}</span>
                          </div>
                          <p className="text-xs italic font-bold text-slate-500">"{zone.reason}"</p>
                          <p className="text-sm text-gray-600"><strong>Region:</strong> {zone.region}</p>
                          <div className="pt-2 mt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Active Issues: {zone.reportCount || 0}</p>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Polygon>
                ))}
                
                {infrastructure && infrastructure.map((item) => (
                  <Marker key={item.id} position={[item.lat, item.lng]}>
                    <Popup>
                      <div className="p-3 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getInfrastructureIcon(item.type)}</span>
                          <h3 className="text-lg font-bold text-blue-950">{item.name}</h3>
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

          <div className="space-y-4">
            {selectedZone ? (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="mb-3 text-lg font-bold text-blue-950">Work Zone</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">{selectedZone.name}</p>
                    <p className="text-sm text-gray-600">{selectedZone.region}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedZone.status === 'good' ? 'bg-green-500' : selectedZone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">{getZoneStatusText(selectedZone.status)}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><strong>Pressure:</strong> {selectedZone.waterPressure}%</p>
                    <p><strong>Schedule:</strong> {selectedZone.nextSupply}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 text-orange-500" size={24} />
                  <p className="text-sm font-medium text-orange-900">Select a zone</p>
                  <p className="text-xs text-orange-700">to view field operations</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <h4 className="mb-3 font-semibold text-gray-900">Priority Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded bg-red-50">
                  <AlertTriangle className="text-red-500" size={16} />
                  <span className="text-sm text-red-700">Critical areas need immediate attention</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-yellow-50">
                  <Clock className="text-yellow-500" size={16} />
                  <span className="text-sm text-yellow-700">Maintenance schedules active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
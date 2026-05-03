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
  getZoneStatusColor,
  getZoneStatusText,
  getInfrastructureIcon,
  getInfrastructureColor,
  setMapLoading
}) {
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
                    <p className="text-red-700 font-medium">{mapError}</p>
                    <button onClick={() => window.location.reload()} className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">Retry</button>
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
                        <h3 className="font-bold text-lg text-blue-950 mb-2">{zone.name}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${zone.status === 'good' ? 'bg-green-500' : zone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium">{getZoneStatusText(zone.status)}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-500 italic">"{zone.reason}"</p>
                          <p className="text-sm text-gray-600"><strong>Region:</strong> {zone.region}</p>
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Live Status: {zone.reportCount} issues detected</p>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Polygon>
                ))}
                
                {infrastructure.map((item) => (
                  <Marker key={item.id} position={[item.lat, item.lng]}>
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

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Priority Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                  <AlertTriangle className="text-red-500" size={16} />
                  <span className="text-sm text-red-700">Lare Ward - Critical</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                  <Clock className="text-yellow-500" size={16} />
                  <span className="text-sm text-yellow-700">Egerton Area - Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

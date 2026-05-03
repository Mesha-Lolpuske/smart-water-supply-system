// Map coordinates for Njoro Wards/Areas
export const njoroAreas = [
  {
    id: 1, name: 'Njoro Center', region: 'Njoro Sub-County', status: 'good',
    waterPressure: 85, population: 45000,
    coordinates: [[-0.3200, 35.9200], [-0.3200, 35.9500], [-0.3500, 35.9500], [-0.3500, 35.9200]],
    nextSupply: '24/7', lastOutage: null
  },
  {
    id: 2, name: 'Egerton University Area', region: 'Njoro Sub-County', status: 'warning',
    waterPressure: 65, population: 15000,
    coordinates: [[-0.3600, 35.9200], [-0.3600, 35.9400], [-0.3800, 35.9400], [-0.3800, 35.9200]],
    nextSupply: '6AM-10PM', lastOutage: '2024-05-01'
  },
  {
    id: 3, name: 'Kihingo Ward', region: 'Njoro Sub-County', status: 'good',
    waterPressure: 78, population: 25000,
    coordinates: [[-0.3000, 35.9000], [-0.3000, 35.9200], [-0.3200, 35.9200], [-0.3200, 35.9000]],
    nextSupply: '24/7', lastOutage: null
  },
  {
    id: 4, name: 'Lare Ward', region: 'Njoro Sub-County', status: 'critical',
    waterPressure: 35, population: 30000,
    coordinates: [[-0.3500, 35.9500], [-0.3500, 35.9800], [-0.3800, 35.9800], [-0.3800, 35.9500]],
    nextSupply: '8AM-2PM', lastOutage: '2024-05-02'
  },
  {
    id: 5, name: 'Nesuit', region: 'Njoro Sub-County', status: 'warning',
    waterPressure: 55, population: 20000,
    coordinates: [[-0.3800, 35.8800], [-0.3800, 35.9100], [-0.4100, 35.9100], [-0.4100, 35.8800]],
    nextSupply: '10AM-4PM', lastOutage: '2024-04-28'
  },
  {
    id: 6, name: 'Mau Narok', region: 'Njoro Sub-County', status: 'good',
    waterPressure: 82, population: 35000,
    coordinates: [[-0.4200, 35.9200], [-0.4200, 35.9600], [-0.4500, 35.9600], [-0.4500, 35.9200]],
    nextSupply: '24/7', lastOutage: null
  }
];

// Physical infrastructure locations
export const infrastructure = [
  { id: 1, type: 'treatment', name: 'Njoro River Treatment Plant', lat: -0.3350, lng: 35.9350, capacity: '15,000 m³/day', status: 'operational' },
  { id: 2, type: 'reservoir', name: 'Egerton Main Tank', lat: -0.3650, lng: 35.9350, capacity: '5,000 m³', status: 'maintenance' },
  { id: 3, type: 'pump', name: 'Nesuit Borehole Station', lat: -0.3950, lng: 35.8950, capacity: '2,000 m³/day', status: 'operational' },
  { id: 4, type: 'pump', name: 'Lare Distribution Pump', lat: -0.3650, lng: 35.9650, capacity: '3,000 m³/day', status: 'offline' }
];
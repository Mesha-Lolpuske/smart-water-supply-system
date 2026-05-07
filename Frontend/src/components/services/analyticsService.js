import api from './api'

export const analyticsService = {
  // Report 1: User Analytics
  getUserAnalytics: async (filter) => {
    const days = filter === 'all' ? 'all' : filter.replace('d', '');
    const response = await api.get(`/analytics/user-analytics?days=${days}`);
    return response.data;
  },

  // Report 2: Incident Analytics
  getIncidentAnalytics: async (filter) => {
    const days = filter === 'all' ? 'all' : filter.replace('d', '');
    const response = await api.get(`/analytics/incident-analytics?days=${days}`);
    return response.data;
  },

  // Report 3: Activity Analytics
  getActivityAnalytics: async (filter) => {
    const days = filter === 'all' ? 'all' : filter.replace('d', '');
    const response = await api.get(`/analytics/activity-analytics?days=${days}`);
    return response.data;
  },

  // Report 4: Detailed Reports for Tables
  getDetailedReports: async (filter) => {
    const days = filter === 'all' ? 'all' : filter.replace('d', '');
    const response = await api.get(`/analytics/detailed-reports?days=${days}`);
    return response.data;
  },

  // Report 5: Real-time Zone Status
  getZoneStatus: async () => {
    const response = await api.get('/analytics/zones/status');
    return response.data;
  },
  
  // ✅ Add method to manually refresh zone status
  refreshZoneStatus: async () => {
    const response = await api.post('/analytics/zones/refresh');
    return response.data;
  }
}

export default analyticsService;
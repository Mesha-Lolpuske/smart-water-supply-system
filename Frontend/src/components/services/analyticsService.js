import api from './api'

export const analyticsService = {
  // Report 1: User Analytics
  getUserAnalytics: async () => {
    const response = await api.get('/analytics/user-analytics');
    return response.data;
  },

  // Report 2: Incident Analytics
  getIncidentAnalytics: async () => {
    const response = await api.get('/analytics/incident-analytics');
    return response.data;
  },

  // Report 3: Activity Analytics
  getActivityAnalytics: async () => {
    const response = await api.get('/analytics/activity-analytics');
    return response.data;
  }
}

export default analyticsService;

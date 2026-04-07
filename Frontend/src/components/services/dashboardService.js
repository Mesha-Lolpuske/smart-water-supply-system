import api from './api';

export const dashboardService = {
  // Get user dashboard statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/dashboard/user-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Get admin dashboard statistics
  getAdminStats: async () => {
    try {
      const response = await api.get('/dashboard/admin-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  },

  // Get public system overview
  getSystemOverview: async () => {
    try {
      const response = await api.get('/dashboard/system-overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching system overview:', error);
      throw error;
    }
  }
};

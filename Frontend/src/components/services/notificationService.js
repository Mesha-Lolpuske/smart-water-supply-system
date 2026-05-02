import api from './api';

export const notificationService = {
  // Get user notifications
  getMyNotifications: async () => {
    try {
      const response = await api.get('/notifications/my-notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching my notifications:', error);
      throw error;
    }
  },

  // Get all notifications (Admin)
  getAllNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      throw error;
    }
  },

  // Mark a single notification as read
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllRead: async () => {
    try {
      const response = await api.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Broadcast notification to all users (Admin)
  broadcastNotification: async (data) => {
    try {
      const response = await api.post('/notifications/broadcast', data);
      return response.data;
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      throw error;
    }
  },

  // Create individual notification (Admin)
  createNotification: async (data) => {
    try {
      const response = await api.post('/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
};

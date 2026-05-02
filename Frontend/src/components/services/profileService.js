import api from './api'

export const profileService = {
  // Get user profile
  getProfile: () => api.get('/profile'),
  
  // Update profile
  updateProfile: (profileData) => api.put('/profile', profileData),
  
  // Change password
  changePassword: (currentPassword, newPassword) => api.put('/profile/change-password', { currentPassword, newPassword }),
  
  // Get user's reports
  getUserReports: () => api.get('/profile/reports'),
  
  // Get user's notifications
  getUserNotifications: () => api.get('/profile/notifications'),
  
  // Mark notification as read
  markNotificationAsRead: (notificationId) => api.patch(`/profile/notifications/${notificationId}/read`),
  
  // Delete notification
  deleteNotification: (notificationId) => api.delete(`/profile/notifications/${notificationId}`),
  
  // Get user statistics
  getUserStats: () => api.get('/profile/stats'),
}

export default profileService

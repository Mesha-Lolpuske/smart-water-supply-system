import api from './api'

export const analyticsService = {
  // Report 1: User Analytics
  getUserAnalytics: (startDate, endDate) =>
    api.get('/analytics/user-analytics', {
      params: { startDate, endDate }
    }),

  // Report 2: Incident Resolution
  getIncidentResolution: (startDate, endDate) =>
    api.get('/analytics/incident-resolution', {
      params: { startDate, endDate }
    }),

  // Report 3: Schedule Management
  getScheduleManagement: (startDate, endDate) =>
    api.get('/analytics/schedule-management', {
      params: { startDate, endDate }
    }),

  // Report 4: Announcement Engagement
  getAnnouncementEngagement: (startDate, endDate) =>
    api.get('/analytics/announcement-engagement', {
      params: { startDate, endDate }
    }),

  // Report 5: Notification Effectiveness
  getNotificationEffectiveness: (startDate, endDate) =>
    api.get('/analytics/notification-effectiveness', {
      params: { startDate, endDate }
    }),
}

export default analyticsService
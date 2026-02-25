import api from './api'

export const announcementService = {
  // Get all announcements
  getAllAnnouncements: (filters = {}) => api.get('/announcements', { params: filters }),
  
  // Get single announcement
  getAnnouncementById: (id) => api.get(`/announcements/${id}`),
  
  // Create announcement
  createAnnouncement: (announcementData) => api.post('/announcements', announcementData),
  
  // Update announcement
  updateAnnouncement: (id, announcementData) => api.put(`/announcements/${id}`, announcementData),
  
  // Delete announcement
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
  
  // Get urgent announcements
  getUrgentAnnouncements: () => api.get('/announcements/urgent'),
  
  // Publish announcement
  publishAnnouncement: (id) => api.patch(`/announcements/${id}/publish`),
  
  // Get announcements by type
  getAnnouncementsByType: (type) => api.get(`/announcements/type/${type}`),
}

export default announcementService

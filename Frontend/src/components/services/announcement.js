import api from './api'

export const announcementService = {
  // Get all announcements
  getAllAnnouncements: async (filters = {}) => {
    const response = await api.get('/announcements', { params: filters });
    return response.data;
  },
  
  // Get single announcement
  getAnnouncementById: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },
  
  // Create announcement
  createAnnouncement: async (announcementData) => {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  },
  
  // Update announcement
  updateAnnouncement: async (id, announcementData) => {
    const response = await api.put(`/announcements/${id}`, announcementData);
    return response.data;
  },
  
  // Delete announcement
  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
  
  // Get urgent announcements
  getUrgentAnnouncements: async () => {
    const response = await api.get('/announcements/urgent');
    return response.data;
  },
  
  // Publish announcement
  publishAnnouncement: async (id) => {
    const response = await api.patch(`/announcements/${id}/publish`);
    return response.data;
  },
  
  // Get announcements by type
  getAnnouncementsByType: async (type) => {
    const response = await api.get(`/announcements/type/${type}`);
    return response.data;
  },
}

export default announcementService

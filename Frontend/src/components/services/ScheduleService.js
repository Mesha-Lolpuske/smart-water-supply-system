import api from './api'

export const scheduleService = {
  // Get all schedules
  getAllSchedules: async (filters = {}) => {
    const response = await api.get('/schedules', { params: filters });
    return response.data;
  },
  
  // Get single schedule
  getScheduleById: async (id) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },
  
  // Create schedule
  createSchedule: async (scheduleData) => {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },
  
  // Update schedule
  updateSchedule: async (id, scheduleData) => {
    const response = await api.put(`/schedules/${id}`, scheduleData);
    return response.data;
  },
  
  // Delete schedule
  deleteSchedule: async (id) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },
  
  // Get schedules by zone
  getSchedulesByZone: async (zone) => {
    const response = await api.get(`/schedules/zone/${zone}`);
    return response.data;
  },
  
  // Publish schedule
  publishSchedule: async (id) => {
    const response = await api.patch(`/schedules/${id}/publish`);
    return response.data;
  },
  
  // Get active schedules
  getActiveSchedules: async () => {
    const response = await api.get('/schedules/active');
    return response.data;
  },
}

export default scheduleService

import api from './api'

export const scheduleService = {
  // Get all schedules
  getAllSchedules: (filters = {}) => api.get('/schedules', { params: filters }),
  
  // Get single schedule
  getScheduleById: (id) => api.get(`/schedules/${id}`),
  
  // Create schedule
  createSchedule: (scheduleData) => api.post('/schedules', scheduleData),
  
  // Update schedule
  updateSchedule: (id, scheduleData) => api.put(`/schedules/${id}`, scheduleData),
  
  // Delete schedule
  deleteSchedule: (id) => api.delete(`/schedules/${id}`),
  
  // Get schedules by zone
  getSchedulesByZone: (zone) => api.get(`/schedules/zone/${zone}`),
  
  // Publish schedule
  publishSchedule: (id) => api.patch(`/schedules/${id}/publish`),
  
  // Get active schedules
  getActiveSchedules: () => api.get('/schedules/active'),
}

export default scheduleService

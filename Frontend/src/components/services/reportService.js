import api from './api'

export const reportService = {
  // Get all reports
  getAllReports: async (filters = {}) => {
    const response = await api.get('/reports', { params: filters });
    return response.data;
  },
  
  // Get user's reports
  getMyReports: async (filters = {}) => {
    const response = await api.get('/reports/my-reports', { params: filters });
    return response.data;
  },
  
  // Get single report
  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },
  
  // Create report
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },
  
  // Update report
  updateReport: async (id, reportData) => {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  },
  
  // Delete report
  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
  
  // Add comment to report
  addComment: async (reportId, comment) => {
    const response = await api.post(`/reports/${reportId}/comments`, { comment });
    return response.data;
  },
  
  // Change report status
  updateStatus: async (id, status, notes = {}) => {
    const response = await api.patch(`/reports/${id}/status`, { status, ...notes });
    return response.data;
  },

  // Assign technician (Admin only)
  assignTechnician: async (id, technicianId) => {
    const response = await api.patch(`/reports/${id}/assign`, { technicianId });
    return response.data;
  },
}

export default reportService

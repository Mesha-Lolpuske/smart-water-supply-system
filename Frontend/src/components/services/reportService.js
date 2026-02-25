import api from './api'

export const reportService = {
  // Get all reports
  getAllReports: (filters = {}) => api.get('/reports', { params: filters }),
  
  // Get user's reports
  getMyReports: (filters = {}) => api.get('/reports/my-reports', { params: filters }),
  
  // Get single report
  getReportById: (id) => api.get(`/reports/${id}`),
  
  // Create report
  createReport: (reportData) => api.post('/reports', reportData),
  
  // Update report
  updateReport: (id, reportData) => api.put(`/reports/${id}`, reportData),
  
  // Delete report
  deleteReport: (id) => api.delete(`/reports/${id}`),
  
  // Add comment to report
  addComment: (reportId, comment) => api.post(`/reports/${reportId}/comments`, { comment }),
  
  // Change report status
  updateStatus: (id, status) => api.patch(`/reports/${id}/status`, { status }),
}

export default reportService

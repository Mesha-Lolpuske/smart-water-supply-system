import api from './api';

const technicianService = {
  getAssignedReports: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.get('/reports/assigned/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateReportStatus: async (reportId, status, technicianNotes) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.patch(`/reports/${reportId}/status`, {
        status,
        technicianNotes
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default technicianService;

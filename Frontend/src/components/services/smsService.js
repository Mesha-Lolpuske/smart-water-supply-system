import api from './api';

export const smsService = {
  // Send SMS alert to all users
  sendBulkSMSAlert: async (alertData) => {
    try {
      const response = await api.post('/notifications/broadcast', {
        ...alertData,
        sendSMS: true
      });
      return response.data;
    } catch (error) {
      console.error('Error sending bulk SMS alert:', error);
      throw error;
    }
  },

  // Send SMS alert to specific user
  sendSMSAlert: async (userId, alertData) => {
    try {
      const response = await api.post('/notifications', {
        ...alertData,
        recipient: userId,
        sendSMS: true
      });
      return response.data;
    } catch (error) {
      console.error('Error sending SMS alert:', error);
      throw error;
    }
  },

  // Get SMS delivery status (if implemented)
  getSMSDeliveryStatus: async (messageId) => {
    try {
      const response = await api.get(`/sms/status/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SMS status:', error);
      throw error;
    }
  }
};
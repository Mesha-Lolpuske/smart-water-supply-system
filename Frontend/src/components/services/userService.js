import api from './api'

export const userService = {
  // Get all users (Admin only)
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get all technicians (Admin only)
  getTechnicians: async () => {
    const response = await api.get('/admin/technicians');
    return response.data;
  },

  // Update user role (Admin only)
  updateUserRole: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  }
}

export default userService

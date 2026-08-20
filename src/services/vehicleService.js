import api from './api';

const vehicleService = {
  // Get all vehicles with filters
  getAll: async (params = {}) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },
  
  // Get single vehicle
  getById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },
  
  // Get my vehicles (owner)
  getMyVehicles: async () => {
    const response = await api.get('/vehicles/my');
    return response.data;
  },
  
  // Create vehicle (owner)
  createVehicle: async (data) => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },
  
  // Update vehicle (owner)
  updateVehicle: async (id, data) => {
    const response = await api.patch(`/vehicles/${id}`, data);
    return response.data;
  },
  
  // Delete vehicle (owner)
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
  
  // Upload images
  uploadImages: async (id, formData) => {
    const response = await api.post(`/vehicles/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default vehicleService;
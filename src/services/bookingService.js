import api from './api';

const bookingService = {
  // Create booking
  create: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },
  
  // Get my bookings (customer)
  getMyBookings: async (params = {}) => {
    const response = await api.get('/bookings/my', { params });
    return response.data;
  },
  
  // Get booking by ID
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  // Cancel booking
  cancel: async (id, reason = '') => {
    const response = await api.post(`/bookings/${id}/cancel`, {
      cancel_reason: reason,
    });
    return response.data;
  },
  
  // Get owner bookings
  getOwnerBookings: async () => {
    const response = await api.get('/bookings/owner/all');
    return response.data;
  },
};

export default bookingService;
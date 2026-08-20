import api from './api';

const paymentService = {
  // Initiate payment
  initiate: async (bookingId) => {
    const response = await api.post('/payments/initiate', {
      booking_id: bookingId,
    });
    return response.data;
  },
  
  // Get payment status
  getStatus: async (bookingId) => {
    const response = await api.get(`/payments/status/${bookingId}`);
    return response.data;
  },
};

export default paymentService;
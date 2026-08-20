import api from './api';

const walletService = {
  // Get wallet balance
  getBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  },
  
  // Get transactions
  getTransactions: async (params = {}) => {
    const response = await api.get('/wallet/transactions', { params });
    return response.data;
  },
};

export default walletService;
import axios from 'axios';
import { toast } from 'react-toastify';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'https://marmatocakes.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Error handler helper function
const handleApiError = (error, customMessage) => {
  const errorMessage = error.response?.data?.error ||
                      error.message ||
                      customMessage ||
                      'An unexpected error occurred';

  toast.error(errorMessage);
  console.error(errorMessage, error);
  throw error;
};

// Success handler helper function
const handleApiSuccess = (data, message) => {
  if (message) {
    toast.success(message);
  }
  return data;
};

// API service functions
export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await api.get('/order');
      return handleApiSuccess(response.data, null); // No toast for fetching
    } catch (error) {
      return handleApiError(error, 'Failed to fetch orders');
    }
  },

  // Create a new order
  createOrder: async (formData) => {
    try {
      const response = await api.post('/order', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiSuccess(response.data, 'Order created successfully!');
    } catch (error) {
      return handleApiError(error, 'Failed to create order');
    }
  },

  // Update an existing order
  updateOrder: async (formData) => {
    try {
      const response = await api.put('/order', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiSuccess(response.data, 'Order updated successfully!');
    } catch (error) {
      return handleApiError(error, 'Failed to update order');
    }
  },

  // Delete an order
  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete('/order', { data: { _id: orderId } });
      return handleApiSuccess(response.data, 'Order deleted successfully!');
    } catch (error) {
      return handleApiError(error, 'Failed to delete order');
    }
  }
};

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    // Handle server errors (500+)
    else if (error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;

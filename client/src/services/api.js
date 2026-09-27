import axios from 'axios';

// Create base Axios instance configured for Vite proxy or direct backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to simplify data unwrapping and handle network errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      success: false,
      message: error.response?.data?.message || error.message || 'Network communication error',
      status: error.response?.status || 500,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

/**
 * Check backend health status
 */
export const checkHealth = async () => {
  return await api.get('/health');
};

export default api;

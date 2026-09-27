import axios from "axios";

// Create base Axios instance configured for Vite proxy or direct backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enables sending and receiving HTTP-only cookies
  timeout: 10000,
});

// Request interceptor: Attach Bearer token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("haqdwaar_token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwraps data and extracts readable errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      success: false,
      message: error.response?.data?.message || error.message || "Network communication error",
      code: error.response?.data?.code || "NETWORK_ERROR",
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
  return await api.get("/health");
};

export default api;

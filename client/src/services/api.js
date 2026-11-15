import axios from "axios";
import { formatUserError } from "../utils/formatUserError";

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

// Response interceptor: unwraps data and sanitizes errors into user-centric messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const sanitized = formatUserError(error);
    const customError = {
      success: false,
      title: sanitized.title,
      message: sanitized.message,
      actionLabel: sanitized.actionLabel,
      actionRoute: sanitized.actionRoute,
      status: error.response?.status || 500,
      code: error.code || "USER_ACTION_REQUIRED",
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

import api from "./api";

/**
 * Register a new citizen account
 */
export const registerUser = async (userData) => {
  return await api.post("/auth/register", userData);
};

/**
 * Log in an existing user
 */
export const loginUser = async (credentials) => {
  return await api.post("/auth/login", credentials);
};

/**
 * Fetch current authenticated user session
 */
export const getMe = async () => {
  return await api.get("/auth/me");
};

/**
 * Log out and clear session
 */
export const logoutUser = async () => {
  return await api.post("/auth/logout");
};

/**
 * Test admin authorization route
 */
export const testAdminRoute = async () => {
  return await api.get("/auth/admin-test");
};

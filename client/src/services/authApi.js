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

/**
 * Update user profile details and avatar (with offline localStorage persistence)
 */
export const updateUserProfile = async (profileData) => {
  try {
    return await api.put("/auth/profile", profileData);
  } catch (err) {
    console.warn("Backend unavailable, persisting user profile update to localStorage:", err.message);
    const activeRaw = localStorage.getItem("haqdwaar_active_user");
    const active = activeRaw ? JSON.parse(activeRaw) : {};
    const updated = { ...active, ...profileData };
    localStorage.setItem("haqdwaar_active_user", JSON.stringify(updated));

    // Also update in registered users database
    try {
      const rawUsers = localStorage.getItem("lok_samarth_users");
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        const updatedUsers = users.map((u) =>
          u.email === updated.email ? { ...u, ...profileData } : u
        );
        localStorage.setItem("lok_samarth_users", JSON.stringify(updatedUsers));
      }
    } catch (e) {
      console.warn("Could not sync to lok_samarth_users:", e);
    }

    return {
      success: true,
      data: { user: updated },
      user: updated,
      message: "Profile and avatar updated successfully (saved locally).",
    };
  }
};

/**
 * Change account password
 */
export const changePassword = async (passwordData) => {
  return await api.put("/auth/change-password", passwordData);
};

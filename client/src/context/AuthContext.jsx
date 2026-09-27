import React, { createContext, useState, useEffect, useCallback } from "react";
import { registerUser, loginUser, getMe, logoutUser } from "../services/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("haqdwaar_token"));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const response = await getMe();
        if (isMounted && response?.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        // Not authenticated or token expired - clear local state cleanly
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("haqdwaar_token");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await loginUser({ email, password });
      const { user: authenticatedUser, token: authToken } = response.data;
      setUser(authenticatedUser);
      setToken(authToken);
      if (authToken) {
        localStorage.setItem("haqdwaar_token", authToken);
      }
      return { success: true, user: authenticatedUser };
    } catch (err) {
      const errorMsg = err.message || "Failed to log in. Please check your credentials.";
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await registerUser({ name, email, password });
      const { user: authenticatedUser, token: authToken } = response.data;
      setUser(authenticatedUser);
      setToken(authToken);
      if (authToken) {
        localStorage.setItem("haqdwaar_token", authToken);
      }
      return { success: true, user: authenticatedUser };
    } catch (err) {
      const errorMsg = err.message || "Registration failed. Please try again.";
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Logout error:", err.message);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("haqdwaar_token");
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

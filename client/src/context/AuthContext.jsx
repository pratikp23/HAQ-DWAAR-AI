import React, { createContext, useState, useEffect, useCallback } from "react";
import { registerUser, loginUser, getMe, logoutUser } from "../services/authApi";

export const AuthContext = createContext(null);

// Master Platform Administrator Record (Pratik Pathak)
const MASTER_ADMIN_RECORD = {
  _id: "admin-pratik-pathak-001",
  name: "Pratik Pathak",
  email: "admin@loksamarth.in",
  role: "super_admin",
  designation: "Platform Creator & Principal Architect",
  officerStatus: "ACTIVE_VERIFIED",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
};

/**
 * Retrieve local registered users database from localStorage
 */
const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem("lok_samarth_users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Save users list to localStorage
 */
const saveStoredUsers = (users) => {
  try {
    localStorage.setItem("lok_samarth_users", JSON.stringify(users));
  } catch (err) {
    console.warn("Could not save to localStorage:", err);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("haqdwaar_token"));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("haqdwaar_token");
      const activeUserRaw = localStorage.getItem("haqdwaar_active_user");

      if (!storedToken && !activeUserRaw) {
        if (isMounted) setLoading(false);
        return;
      }

      // Check if we have an active user cached in localStorage
      if (activeUserRaw) {
        try {
          const cachedUser = JSON.parse(activeUserRaw);
          if (isMounted) {
            setUser(cachedUser);
            setLoading(false);
            return;
          }
        } catch {
          // ignore parsing error and continue
        }
      }

      // Check for master admin token
      if (storedToken && storedToken.startsWith("admin-token-")) {
        if (isMounted) {
          setUser(MASTER_ADMIN_RECORD);
          setLoading(false);
        }
        return;
      }

      // If remote API is available, try syncing
      try {
        const response = await getMe();
        const payload = response?.data || response;
        if (isMounted && payload?.user) {
          setUser(payload.user);
          localStorage.setItem("haqdwaar_active_user", JSON.stringify(payload.user));
        }
      } catch {
        // If network error, retain local active session
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

  /**
   * User Sign In (Supports Citizens & Master Admin)
   */
  const login = useCallback(async (email, password, roleHint = "citizen") => {
    setLoading(true);
    setAuthError(null);

    const normEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    try {
      // 1. Check Master Admin Credentials (For Pratik Pathak)
      const isMasterAdminEmail =
        normEmail === "admin@loksamarth.in" ||
        normEmail === "pratikpathak343@gmail.com" ||
        normEmail === "admin@haqdwaar.gov.in";

      if (isMasterAdminEmail && (cleanPassword === "Admin@123" || cleanPassword === "Admin@Lok2026")) {
        const adminSession = {
          ...MASTER_ADMIN_RECORD,
          email: normEmail,
        };
        const adminToken = "admin-token-pratik-" + Date.now();
        setUser(adminSession);
        setToken(adminToken);
        localStorage.setItem("haqdwaar_token", adminToken);
        localStorage.setItem("haqdwaar_active_user", JSON.stringify(adminSession));
        return { success: true, user: adminSession };
      }

      // 2. Check Local Registered Users Database
      const localUsers = getStoredUsers();
      const matchedUser = localUsers.find(
        (u) => u.email.toLowerCase() === normEmail && u.password === cleanPassword
      );

      if (matchedUser) {
        // Exclude password from active session
        const { password: _, ...userSession } = matchedUser;
        const sessionToken = "session-" + matchedUser._id + "-" + Date.now();
        setUser(userSession);
        setToken(sessionToken);
        localStorage.setItem("haqdwaar_token", sessionToken);
        localStorage.setItem("haqdwaar_active_user", JSON.stringify(userSession));
        return { success: true, user: userSession };
      }

      // 3. Try Remote Backend API if available
      try {
        const response = await loginUser({ email: normEmail, password: cleanPassword });
        const payload = response?.data || response;
        const authenticatedUser = payload?.user || payload;
        const authToken = payload?.token || response?.token || "remote-token-" + Date.now();

        if (authenticatedUser && typeof authenticatedUser === "object") {
          setUser(authenticatedUser);
          setToken(authToken);
          localStorage.setItem("haqdwaar_token", authToken);
          localStorage.setItem("haqdwaar_active_user", JSON.stringify(authenticatedUser));
          return { success: true, user: authenticatedUser };
        }
      } catch (remoteErr) {
        console.warn("Remote backend login error:", remoteErr?.message);
      }

      throw new Error("Invalid email or password. Please check your credentials.");
    } catch (err) {
      const errorMsg = err.message || "Failed to log in. Please check your credentials.";
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * User Registration (Option A: Persistent storage in localStorage + Instant Auto-Login)
   */
  const register = useCallback(async (name, email, password, role = "citizen", extraData = {}) => {
    setLoading(true);
    setAuthError(null);

    const normName = (name || "").trim();
    const normEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    try {
      // Validate inputs
      if (!normName) throw new Error("Please enter your full name.");
      if (!normEmail) throw new Error("Please enter a valid email address.");
      if (cleanPassword.length < 6) throw new Error("Password must be at least 6 characters long.");

      // Check if user already exists
      const localUsers = getStoredUsers();
      const existingUser = localUsers.find((u) => u.email.toLowerCase() === normEmail);
      if (existingUser) {
        throw new Error("An account with this email address already exists. Please sign in instead.");
      }

      // Check if Admin Passcode was provided
      let finalRole = role;
      if (extraData.adminPasscode === "LOK-ADMIN-2026") {
        finalRole = "super_admin";
      }

      // Create new user record
      const newUser = {
        _id: "user-" + Date.now(),
        name: normName,
        email: normEmail,
        password: cleanPassword,
        role: finalRole,
        district: extraData.district || "Jabalpur",
        state: extraData.state || "Madhya Pradesh",
        category: extraData.category || "Student / Youth Scholar",
        institution: extraData.institution || "Shri Ram Institute of Technology (SRIT), Jabalpur",
        phone: extraData.phone || "",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        createdAt: new Date().toISOString(),
      };

      // Save to local user database
      localUsers.push(newUser);
      saveStoredUsers(localUsers);

      // Try syncing to remote backend in background
      try {
        await registerUser({
          name: normName,
          email: normEmail,
          password: cleanPassword,
          role: finalRole,
        });
      } catch {
        // Backend offline / sandbox fallback is handled seamlessly
      }

      // Option A: Instant Auto-Login
      const { password: _, ...userSession } = newUser;
      const sessionToken = "session-" + newUser._id + "-" + Date.now();
      setUser(userSession);
      setToken(sessionToken);
      localStorage.setItem("haqdwaar_token", sessionToken);
      localStorage.setItem("haqdwaar_active_user", JSON.stringify(userSession));

      return { success: true, user: userSession };
    } catch (err) {
      const errorMsg = err.message || "Registration failed. Please try again.";
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * User Sign Out
   */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch {
      // ignore network errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("haqdwaar_token");
      localStorage.removeItem("haqdwaar_active_user");
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const nextUser = prev ? { ...prev, ...updatedUserData } : updatedUserData;
      localStorage.setItem("haqdwaar_active_user", JSON.stringify(nextUser));
      
      // Update in stored users list as well
      const localUsers = getStoredUsers();
      const updatedList = localUsers.map((u) =>
        u.email === nextUser.email ? { ...u, ...updatedUserData } : u
      );
      saveStoredUsers(updatedList);

      return nextUser;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin" || user?.role === "super_admin",
    login,
    register,
    logout,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

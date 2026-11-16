import api from "./api";
import { STATUTORY_SCHEMES } from "../data/statutorySchemes";

/**
 * Fetch schemes with optional filters (category, state, search, status)
 */
export const getSchemes = async (params = {}) => {
  try {
    const res = await api.get("/schemes", { params });
    const list = res?.data?.schemes || res?.schemes || (Array.isArray(res) ? res : null);
    if (list && list.length > 0) return res;
    return { data: { schemes: STATUTORY_SCHEMES } };
  } catch (err) {
    console.warn("Could not load schemes from API, falling back to statutory schemes:", err.message);
    let filtered = [...STATUTORY_SCHEMES];
    if (params.category && params.category !== "ALL") {
      filtered = filtered.filter((s) => s.category?.toUpperCase() === params.category.toUpperCase());
    }
    if (params.state && params.state !== "All-India") {
      filtered = filtered.filter((s) => s.state === params.state || s.state === "All-India");
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((s) => s.name?.toLowerCase().includes(q) || s.shortDescription?.toLowerCase().includes(q));
    }
    return { data: { schemes: filtered } };
  }
};

/**
 * Fetch detailed scheme by ID
 */
export const getSchemeById = async (id) => {
  try {
    const res = await api.get(`/schemes/${id}`);
    const data = res?.data?.scheme || res?.scheme || res?.data;
    if (data) return res;
    const fallback = STATUTORY_SCHEMES.find((s) => s._id === id || s.id === id);
    if (fallback) return { data: { scheme: fallback } };
    return res;
  } catch (err) {
    const fallback = STATUTORY_SCHEMES.find((s) => s._id === id || s.id === id);
    if (fallback) return { data: { scheme: fallback } };
    throw err;
  }
};

/**
 * Admin: Create a new draft scheme
 */
export const createScheme = async (schemeData) => {
  return await api.post("/schemes", schemeData);
};

/**
 * Admin: Update an existing scheme
 */
export const updateScheme = async (id, schemeData) => {
  return await api.put(`/schemes/${id}`, schemeData);
};

/**
 * Admin: Archive a scheme (soft delete)
 */
export const archiveScheme = async (id) => {
  return await api.delete(`/schemes/${id}`);
};

/**
 * Admin: Verify and publish scheme to citizen catalog
 */
export const verifyScheme = async (id) => {
  return await api.put(`/admin/schemes/${id}/verify`);
};

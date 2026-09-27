import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPlaceholder from "./pages/citizen/DashboardPlaceholder";
import BenefitPassport from "./pages/citizen/BenefitPassport";
import Schemes from "./pages/citizen/Schemes";
import SchemeDetails from "./pages/citizen/SchemeDetails";
import Recommendations from "./pages/citizen/Recommendations";
import LifeSituation from "./pages/citizen/LifeSituation";
import AdminSchemes from "./pages/admin/AdminSchemes";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Citizen Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/benefit-passport"
            element={
              <ProtectedRoute>
                <BenefitPassport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/life-situation"
            element={
              <ProtectedRoute>
                <LifeSituation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/recommendations"
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/schemes"
            element={
              <ProtectedRoute>
                <Schemes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/schemes/:id"
            element={
              <ProtectedRoute>
                <SchemeDetails />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Admin Routes */}
          <Route
            path="/admin/schemes"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSchemes />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Layout Shells
import PublicLayout from "./layouts/PublicLayout";
import CitizenLayout from "./layouts/CitizenLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import HomePage from "./pages/HomePage";
import BrowseSchemes from "./pages/public/BrowseSchemes";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/public/NotFoundPage";

// Citizen Pages
import DashboardPlaceholder from "./pages/citizen/DashboardPlaceholder";
import BenefitPassport from "./pages/citizen/BenefitPassport";
import Schemes from "./pages/citizen/Schemes";
import SchemeDetails from "./pages/citizen/SchemeDetails";
import Recommendations from "./pages/citizen/Recommendations";
import LifeSituation from "./pages/citizen/LifeSituation";
import Documents from "./pages/citizen/Documents";
import Readiness from "./pages/citizen/Readiness";
import Applications from "./pages/citizen/Applications";
import ApplicationDetails from "./pages/citizen/ApplicationDetails";
import Notifications from "./pages/citizen/Notifications";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSchemes from "./pages/admin/AdminSchemes";
import AdminNotifications from "./pages/admin/AdminNotifications";
import NotificationReview from "./pages/admin/NotificationReview";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {/* ======================================================== */}
              {/* 1. PUBLIC SHELL (Unauthenticated & Information Discovery) */}
              {/* ======================================================== */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse-schemes" element={<BrowseSchemes />} />
                <Route path="/schemes/:id" element={<SchemeDetails />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Anchor Redirects for landing page sections */}
                <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace />} />
                <Route path="/features" element={<Navigate to="/#features" replace />} />
                <Route path="/about" element={<Navigate to="/#about" replace />} />
                <Route path="/faq" element={<Navigate to="/#faq" replace />} />

                {/* 404 Catch-all */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* ======================================================== */}
              {/* 2. CITIZEN SHELL (Authenticated Citizen Preparation)    */}
              {/* ======================================================== */}
              <Route
                element={
                  <ProtectedRoute>
                    <CitizenLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPlaceholder />} />
                <Route path="/dashboard/benefit-passport" element={<BenefitPassport />} />
                <Route path="/dashboard/life-situation" element={<LifeSituation />} />
                <Route path="/dashboard/recommendations" element={<Recommendations />} />
                <Route path="/dashboard/documents" element={<Documents />} />
                <Route path="/dashboard/schemes" element={<Schemes />} />
                <Route path="/dashboard/schemes/:id" element={<SchemeDetails />} />
                <Route path="/dashboard/readiness/:schemeId" element={<Readiness />} />
                <Route path="/dashboard/applications" element={<Applications />} />
                <Route path="/dashboard/applications/:id" element={<ApplicationDetails />} />
                <Route path="/dashboard/notifications" element={<Notifications />} />
              </Route>

              {/* ======================================================== */}
              {/* 3. ADMIN SHELL (Authorized Operational Analytics & Ops)  */}
              {/* ======================================================== */}
              <Route
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/schemes" element={<AdminSchemes />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/notifications/:id" element={<NotificationReview />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

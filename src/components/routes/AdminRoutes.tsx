import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[70vh]">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy load admin components
const AdminLogin = lazy(() => import("@/pages/AdminLoginPage"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminMessages = lazy(() => import("@/pages/AdminMessages"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminSettings = lazy(() => import("@/pages/AdminSettings"));
const AdminSetup = lazy(() => import("@/pages/AdminSetup"));
const AdminPartnershipRequests = lazy(() => import("@/pages/AdminPartnershipRequests"));


// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAdminAuthenticated } = useAuth();
  const isAuthenticated = isAdminAuthenticated();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

const AdminRoutes = () => {
  console.log("AdminRoutes component rendered");

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="admin-routes-wrapper bg-gray-100 min-h-screen">
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="messages"
            element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="partnership-requests"
            element={
              <ProtectedRoute>
                <AdminPartnershipRequests />
              </ProtectedRoute>
            }
          />
          <Route path="setup" element={<AdminSetup />} />
          <Route path="" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </Suspense>
  );
};

export default AdminRoutes;

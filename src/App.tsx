import { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import AppRoutes from '@/components/routes/Index';
import AdminRoutes from '@/components/routes/AdminRoutes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import initializeGlobalLinkTracking from '@/utils/globalLinkTracking';
import { TrackableLinksProvider } from '@/utils/replaceAnchorsWithTrackableLinks';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
//update
  useEffect(() => {
    // Simulate loading of resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-brand-blue">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-brand-orange rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading BOH Concepts</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

// Separate component to access route information
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const currentPath = location.pathname;
  
  // Initialize global link tracking
  useEffect(() => {
    // Set up global link tracking to catch any links that might be missed
    const cleanup = initializeGlobalLinkTracking();
    return cleanup;
  }, []);
  
  console.log('AppContent rendered, current path:', currentPath);
  console.log('Is admin route:', isAdminRoute);

  // For admin routes, don't use the main Layout
  if (isAdminRoute) {
    console.log('Rendering admin routes');
    return (
      // We don't need TrackableLinksProvider here as AdminLayout already has it
      <div className="admin-routes-container">
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </div>
    );
  }

  // For regular routes, use the main Layout
  // Layout already has TrackableLinksProvider, but we add a fallback here
  // to catch any links that might be rendered outside of Layout
  return (
    <TrackableLinksProvider pageSource={`global-${currentPath}`}>
      <Layout>
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Layout>
    </TrackableLinksProvider>
  );
};

export default App;
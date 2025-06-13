import { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import AppRoutes from '@/components/routes/Index';
import AdminRoutes from '@/components/routes/AdminRoutes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

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
  
  console.log('AppContent rendered, current path:', location.pathname);
  console.log('Is admin route:', isAdminRoute);

  // For admin routes, don't use the main Layout
  if (isAdminRoute) {
    console.log('Rendering admin routes');
    return (
      <div className="admin-routes-container">
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </div>
    );
  }

  // For regular routes, use the main Layout
  return (
    <Layout>
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Layout>
  );
};

export default App;
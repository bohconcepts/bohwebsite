import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Lazy load components for better performance
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const OurApproach = lazy(() => import("@/pages/OurApproach"));
const OurClients = lazy(() => import("@/pages/OurClientsPage"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const OurProcess = lazy(() => import("@/pages/OurProcess"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Sitemap = lazy(() => import("@/pages/Sitemap"));
const WhyChooseUsPage = lazy(() => import("@/pages/WhyChooseUsPage"));
const MarketsPage = lazy(() => import("@/pages/MarketsPage"));
const Partnership = lazy(() => import("@/pages/Partnership"));
const Auth = lazy(() => import("@/pages/Auth"));


// About section pages
const TeamsPage = lazy(() => import("@/pages/TeamsPage"));
const MissionPage = lazy(() => import("@/pages/MissionPage"));
const ValuesPage = lazy(() => import("@/pages/ValuesPage"));
const WhoWeArePage = lazy(() => import("@/pages/WhoWeArePage"));

// Main site routes only

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[70vh]">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// ScrollToTop component to handle scrolling to top on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {/* Add ScrollToTop component to handle scroll behavior */}
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/teams" element={<TeamsPage />} />
        <Route path="/about/mission" element={<MissionPage />} />
        <Route path="/about/values" element={<ValuesPage />} />
        <Route path="/about/who-we-are" element={<WhoWeArePage />} />
        <Route path="/our-approach" element={<OurApproach />} />
        <Route path="/our-clients" element={<OurClients />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/our-process" element={<OurProcess />} />
        {/* Keep old route for backward compatibility */}
        <Route
          path="/services"
          element={<Navigate to="/our-approach" replace />}
        />
        <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/partnership" element={<Partnership />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/auth" element={<Auth />} />

        {/* Supabase authentication redirect routes */}
        <Route path="/confirm-password" element={<Auth />} />
        <Route path="/reset-password" element={<Auth />} />
        <Route path="/accept-invite" element={<Auth />} />

        {/* Admin routes are handled separately */}

        {/* Fallback route - redirect to home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

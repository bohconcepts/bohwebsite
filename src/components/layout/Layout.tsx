
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { TrackableLinksProvider } from "@/utils/replaceAnchorsWithTrackableLinks";


interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Get current page path for tracking purposes
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  
  return (
    <div className="flex flex-col min-h-screen">
      <TrackableLinksProvider pageSource={currentPath}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </TrackableLinksProvider>
    </div>
  );
};

export default Layout;

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import DocumentChat from '../ui/document-chat';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <DocumentChat />
    </div>
  );
};

export default Layout;
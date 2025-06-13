import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppChat from '../ui/whatsapp-chat';

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
      <WhatsAppChat phoneNumber="14252790173" />
    </div>
  );
};

export default Layout;
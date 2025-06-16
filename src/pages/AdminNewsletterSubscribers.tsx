import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import NewsletterSubscribersManager from '@/components/admin/NewsletterSubscribersManager';
import { Loader2 } from 'lucide-react';

const AdminNewsletterSubscribers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }
      
      // Check if user has admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        navigate('/');
        return;
      }
      
      setIsAdmin(true);
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout title="Newsletter Subscribers">
      <div className="container mx-auto py-8 px-4">
        <NewsletterSubscribersManager />
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletterSubscribers;

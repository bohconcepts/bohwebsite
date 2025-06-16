import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { unsubscribeFromNewsletter } from '@/integrations/supabase/services/newsletterService';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processUnsubscribe = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Invalid unsubscribe link. No token provided.');
        return;
      }

      try {
        const result = await unsubscribeFromNewsletter(token);
        
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(result.error || 'Failed to unsubscribe. Please try again later.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again later.');
        console.error('Unsubscribe error:', error);
      }
    };

    processUnsubscribe();
  }, [token]);

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-16 w-16 text-brand-blue animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Processing your request...</h2>
              <p className="text-gray-600 mt-2">Please wait while we unsubscribe your email.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Successfully Unsubscribed</h2>
              <p className="text-gray-600 mt-2 text-center">
                You have been successfully unsubscribed from our newsletter.
                We're sorry to see you go!
              </p>
              <p className="text-gray-600 mt-4 text-center">
                If you change your mind, you can always subscribe again from our website.
              </p>
              <Button className="mt-6" onClick={() => window.location.href = '/'}>
                Return to Homepage
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Unsubscribe Failed</h2>
              <p className="text-gray-600 mt-2 text-center">
                {errorMessage}
              </p>
              <Button className="mt-6" onClick={() => window.location.href = '/'}>
                Return to Homepage
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Unsubscribe;

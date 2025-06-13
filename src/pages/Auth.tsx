import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'success' | 'error' | 'processing' | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  // Check URL query parameters and hash on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const path = location.pathname;
    
    console.log('Auth component mounted with:', { 
      path, 
      mode, 
      hash: location.hash,
      search: location.search,
      fullUrl: window.location.href
    });
    
    if (mode === 'signup') {
      setIsLogin(false);
    }

    // Handle authentication redirects
    const handleAuthRedirect = async () => {
      setAuthStatus('processing');
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('Auth processing timed out after 10 seconds');
        setAuthMessage('Authentication process is taking longer than expected. Please try again.');
        setAuthStatus('error');
      }, 10000); // 10 second timeout
      
      try {
        // Check if we're on a Supabase auth redirect page
        if (path === '/confirm-password' || path === '/reset-password' || path === '/accept-invite' || location.hash) {
          setAuthMessage('Processing your authentication request...');
          console.log('Auth redirect detected:', { path, hash: location.hash });
          
          // Extract email from the URL if available
          const hashParams = new URLSearchParams(location.hash.replace('#', '?'));
          
          // Try multiple ways to get the email
          let email = hashParams.get('email') || params.get('email');
          
          // If we don't have an email yet, try to parse it from the fragment
          if (!email && location.hash) {
            // Sometimes Supabase includes the email in a different format
            const hashString = decodeURIComponent(location.hash);
            console.log('Decoded hash string:', hashString);
            
            // Try to extract email using regex
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
            const match = hashString.match(emailRegex);
            if (match) {
              email = match[0];
              console.log('Email extracted from hash using regex:', email);
            }
          }
          
          if (email) {
            console.log('Email found:', email);
            setVerifiedEmail(email);
          } else {
            console.log('No email found in URL parameters');
          }
          
          // Extract type and access_token if available
          const type = hashParams.get('type');
          const accessToken = hashParams.get('access_token');
          console.log('Auth parameters:', { type, hasAccessToken: !!accessToken });
          
          // Let Supabase handle the auth redirect
          console.log('Handling auth redirect...');
          
          // First, try to get the token from the URL
          const token = hashParams.get('token') || hashParams.get('access_token');
          
          let authResult;
          
          // If we have a token and this is a verification flow
          if (token && (type === 'signup' || type === 'recovery' || !type)) {
            console.log('Found token in URL, attempting to verify directly...');
            // Try to verify the email directly with the token
            authResult = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'email',
            });
          } else {
            // Otherwise just refresh the session
            console.log('No token found or not a verification flow, refreshing session...');
            authResult = await supabase.auth.refreshSession();
          }
          
          const { data, error } = authResult;
          
          // Clear the timeout since we got a response
          clearTimeout(timeoutId);
          
          if (error) {
            console.error('Auth error:', error);
            setAuthMessage('Authentication failed: ' + error.message);
            setAuthStatus('error');
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive"
            });
          } else {
            // Success
            console.log('Auth successful:', { user: data?.user?.email });
            setAuthStatus('success');
            
            // If we have user data, get their email
            if (data?.user?.email && !verifiedEmail) {
              setVerifiedEmail(data.user.email);
            }
            
            const successMessage = path === '/reset-password' 
              ? "Password has been reset successfully." 
              : path === '/accept-invite'
              ? "Invitation accepted successfully."
              : "Email verified successfully.";
              
            setAuthMessage(successMessage);
            
            toast({
              title: "Success",
              description: successMessage
            });
          }
        } else {
          // Not a redirect page, clear the timeout and reset state
          clearTimeout(timeoutId);
          setAuthStatus(null);
        }
      } catch (err) {
        console.error('Error processing auth redirect:', err);
        setAuthMessage('An unexpected error occurred.');
        toast({
          title: "Error",
          description: "An unexpected error occurred during authentication.",
          variant: "destructive"
        });
        clearTimeout(timeoutId);
      }
    };
    
    handleAuthRedirect();
  }, [location, navigate, toast]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Show processing message when handling auth redirects
  if (authStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {authStatus === 'processing' ? "Processing" : 
               authStatus === 'success' ? "Success" : "Authentication Error"}
            </CardTitle>
            {verifiedEmail && authStatus === 'success' && (
              <CardDescription className="text-center mt-2">
                {verifiedEmail}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            {authStatus === 'processing' && (
              <Loader2 className="h-16 w-16 text-brand-blue animate-spin mb-6" />
            )}
            {authStatus === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
            )}
            {authStatus === 'error' && (
              <XCircle className="h-16 w-16 text-red-500 mb-6" />
            )}
            
            <p className="text-center text-lg mb-6">{authMessage}</p>
            
            {authStatus === 'success' && (
              <div className="space-y-4 w-full">
                <Button 
                  onClick={() => navigate('/admin/dashboard')} 
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  onClick={() => {
                    setAuthStatus(null);
                    setAuthMessage(null);
                    setIsLogin(true);
                  }} 
                  variant="outline"
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            )}
            
            {authStatus === 'error' && (
              <div className="space-y-4 w-full">
                <Button 
                  onClick={() => {
                    setAuthStatus(null);
                    setAuthMessage(null);
                  }} 
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => navigate('/')} 
                  variant="outline"
                  className="w-full"
                >
                  Return to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {isLogin ? (
        <LoginForm onToggleMode={toggleMode} />
      ) : (
        <SignUpForm onToggleMode={toggleMode} />
      )}
    </div>
  );
};

export default Auth;

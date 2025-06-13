import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const TestAdminLogin = () => {
  const { adminLogin } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setLoginError('');
    setLoginSuccess(false);
    
    // Simulate network delay
    setTimeout(async () => {
      try {
        const success = await adminLogin(credentials.username, credentials.password);
        
        if (success) {
          setLoginSuccess(true);
          console.log('Login successful, redirecting...');
          // Redirect after a short delay to show success message
          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 1000);
        } else {
          setLoginError('Invalid username or password');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError('An error occurred during login');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-center">Admin Login Test</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="test-username" className="block text-sm font-medium mb-1">Username</label>
          <Input 
            id="test-username" 
            type="text" 
            placeholder="admin" 
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="test-password" className="block text-sm font-medium mb-1">Password</label>
          <Input 
            id="test-password" 
            type="password" 
            placeholder="admin123" 
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
          />
        </div>
        
        {loginError && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
            {loginError}
          </div>
        )}
        
        {loginSuccess && (
          <div className="bg-green-100 text-green-700 p-2 rounded text-sm">
            Login successful! Redirecting to dashboard...
          </div>
        )}
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
          onClick={handleLogin}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        
        <p className="text-gray-500 text-sm text-center mt-2">
          Default credentials: admin / admin123
        </p>
      </div>
    </div>
  );
};

export default TestAdminLogin;

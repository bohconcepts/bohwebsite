import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { PolarBearAnimation } from '@/components/auth/PolarBearAnimation';
import { Link } from 'react-router-dom';

const AdminLoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);
  const { adminLogin, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    console.log('=== ADMIN LOGIN ATTEMPT ===');
    console.log('Admin login credentials:', { 
      username: credentials.username,
      passwordLength: credentials.password?.length || 0 
    });
    
    try {
      // Check if we're using email login or username login
      const isEmail = credentials.username.includes('@');
      console.log('Login type:', isEmail ? 'Email-based' : 'Username-based');
      
      // If it's an email, try to use the regular signIn function
      if (isEmail) {
        console.log('Attempting email-based login with Supabase...');
        const { error } = await signIn(credentials.username, credentials.password);
        
        if (error) {
          console.log('Email-based login failed:', error);
          setLoginError('Invalid username or password');
        } else {
          console.log('Email-based admin login successful');
          
          // Manually set localStorage for admin authentication
          localStorage.setItem('boh_admin_auth', 'true');
          
          // Store current user info
          localStorage.setItem('boh_admin_current_user', JSON.stringify({
            username: credentials.username,
            fullName: 'Admin User',
            email: credentials.username,
            role: 'Administrator'
          }));
          
          console.log('Admin authentication set in localStorage');
          console.log('Redirecting to dashboard...');
          
          // Force a page reload to ensure all auth states are updated
          window.location.href = '/admin/dashboard';
        }
      } else {
        // Use the adminLogin function for username-based login
        console.log('Attempting username-based login...');
        const success = await adminLogin(credentials.username, credentials.password);
        
        if (success) {
          console.log('Username-based admin login successful');
          console.log('Redirecting to dashboard...');
          
          // Force a page reload to ensure all auth states are updated
          window.location.href = '/admin/dashboard';
        } else {
          console.log('Username-based admin login failed');
          setLoginError('Invalid username or password');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Back to Home</span>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Admin Panel</CardTitle>
        <CardDescription className="text-center">
          Sign in to access the admin dashboard
        </CardDescription>
        <PolarBearAnimation
          isPasswordField={focusedField === 'password'}
          isFocused={focusedField !== null}
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              className="pl-3"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="pl-3"
              required
            />
          </div>

          {loginError && (
            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
              {loginError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-2 text-muted-foreground">
            Default credentials: admin / admin123
          </p>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/auth?mode=signup" className="underline hover:text-primary">
              Sign up here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminLoginForm;

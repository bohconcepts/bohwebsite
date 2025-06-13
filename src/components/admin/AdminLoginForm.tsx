import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Auth context no longer needed as we use adminService directly
import { ArrowLeft } from 'lucide-react';
import { PolarBearAnimation } from '@/components/auth/PolarBearAnimation';
import { Link } from 'react-router-dom';
import { adminService } from '@/integrations/supabase/services/adminService';
import { toast } from '@/components/ui/use-toast';

const AdminLoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);
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
      // Use adminService directly to bypass AuthContext
      console.log('Attempting direct admin service login...');
      const success = await adminService.login(credentials.username, credentials.password);
      
      if (success) {
        console.log('Admin login successful');
        toast({
          title: "Login Successful",
          description: "Welcome back, admin!",
        });
        
        // Redirect to dashboard
        console.log('Redirecting to dashboard...');
        window.location.href = '/admin/dashboard';
      } else {
        console.log('Admin login failed');
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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

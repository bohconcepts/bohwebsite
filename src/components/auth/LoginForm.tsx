
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { PolarBearAnimation } from './PolarBearAnimation';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNeedsVerification(false);

    const { error } = await signIn(email, password);
    
    if (error) {
      // Check if the error is due to unverified email
      if (error.message?.includes('Email not confirmed')) {
        setNeedsVerification(true);
      }
      setLoading(false);
      return;
    }
    
    // After successful login, check the user's role from Supabase directly
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userData.user.id)
        .single();
      
      if (profileData) {
        // Route users based on their role
        if (profileData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (profileData.role === 'operator') {
          navigate('/operator-dashboard');
        } else {
          navigate('/staff-dashboard'); // Staff users go to staff dashboard
        }
      } else {
        navigate('/admin/dashboard'); // Default route if no profile found
      }
    }
    
    setLoading(false);
  };
  
  const handleResendVerification = async () => {
    if (!email) {
      return;
    }
    
    setResendingEmail(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm-password`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Show success message
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox and follow the link to verify your email.",
      });
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendingEmail(false);
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
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your CanteenNexus account
        </CardDescription>
        <PolarBearAnimation 
          isPasswordField={focusedField === 'password'}
          isFocused={focusedField !== null}
        />
      </CardHeader>
      <CardContent>
        {needsVerification ? (
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your email address has not been verified. Please check your inbox for a verification link.
                </p>
              </div>
            </div>
          </div>
          <Button 
            type="button" 
            onClick={handleResendVerification} 
            disabled={resendingEmail} 
            className="w-full"
            variant="outline"
          >
            {resendingEmail ? (
              <>
                <span className="mr-2">Sending...</span>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </>
            ) : (
              'Resend Verification Email'
            )}
          </Button>
          <Button 
            type="button" 
            onClick={() => setNeedsVerification(false)} 
            className="w-full mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>)}

        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Button variant="link" className="p-0 h-auto" onClick={onToggleMode}>
            Sign up here
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

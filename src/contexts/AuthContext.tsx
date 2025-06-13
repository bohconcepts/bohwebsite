import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/integrations/supabase/services/adminService";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: "admin" | "operator" | "staff";
  employee_id?: string;
  phone_number?: string;
  avatar_url?: string;
  is_active: boolean;
  // Additional fields from the database
  address?: string;
  bio?: string;
  department_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: string
  ) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isOperator: () => boolean;
  isStaff: () => boolean;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  isAdminAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for user ID:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        console.log('Profile query details:', {
          userId: userId,
          query: `SELECT * FROM profiles WHERE user_id = '${userId}'`,
          error: profileError
        });
      } else if (profileData) {
        console.log('Profile found:', {
          id: profileData.id,
          email: profileData.email,
          fullName: profileData.full_name,
          role: profileData.role
        });
        setProfile(profileData);
      } else {
        console.log('No profile found for user ID:', userId);
      }
    } catch (profileFetchError) {
      console.error('Error in profile fetch:', profileFetchError);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer profile fetch to avoid potential issues
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        }

        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: string = "staff"
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account.",
      });

      return {};
    } catch (error) {
      console.error("Sign up error:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('=== SIGN IN ATTEMPT ===');
      console.log('Attempting to sign in with:', { email, passwordLength: password?.length || 0 });
      
      // Check if email and password are provided
      if (!email || !password) {
        const errorMessage = !email ? 'Email is required' : 'Password is required';
        console.log('Sign in validation error:', errorMessage);
        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: new Error(errorMessage) };
      }
      
      // Check if the user exists before attempting to sign in
      console.log('Checking if user exists...');
      const { data: userExists, error: userCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      console.log('User check result:', { exists: !!userExists, error: userCheckError });
      
      // Attempt to sign in
      console.log('Calling supabase.auth.signInWithPassword...');
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Raw sign in response:', response);
      console.log('Sign in response details:', { 
        success: !response.error, 
        user: response.data?.user ? { 
          id: response.data.user.id,
          email: response.data.user.email,
          emailConfirmed: response.data.user.email_confirmed_at ? 'Yes' : 'No',
          lastSignIn: response.data.user.last_sign_in_at
        } : null,
        errorCode: response.error?.status, 
        errorMessage: response.error?.message,
        errorDetails: response.error?.name
      });

      if (response.error) {
        let errorMessage = response.error.message;
        
        // Provide more user-friendly error messages
        if (response.error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
          console.log('Authentication failed: Invalid login credentials');
          
          // Additional debugging for invalid credentials
          console.log('Debug info for invalid credentials:', {
            errorName: response.error.name,
            statusCode: response.error.status,
            details: response.error
          });
        } else if (response.error.message.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email before signing in.';
          console.log('Authentication failed: Email not confirmed');
        } else {
          console.log('Authentication failed with error:', response.error);
        }
        
        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        return { error: response.error };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return {};
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Add logout as an alias to signOut for backward compatibility
  const logout = signOut;

  const isAdmin = () => profile?.role === "admin";
  const isOperator = () => profile?.role === "operator";
  const isStaff = () => profile?.role === "staff";

  // Admin panel authentication methods
  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    const success = await adminService.login(username, password);
    if (success) {
      toast({
        title: "Admin Login Successful",
        description: "You have successfully logged in to the admin panel.",
      });
    } else {
      toast({
        title: "Admin Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
    return success;
  };

  const adminLogout = (): void => {
    adminService.logout();
    toast({
      title: "Admin Logout",
      description: "You have been logged out from the admin panel.",
    });
  };

  const isAdminAuthenticated = (): boolean => {
    return adminService.isAuthenticated();
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    logout,
    isAdmin,
    isOperator,
    isStaff,
    adminLogin,
    adminLogout,
    isAdminAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

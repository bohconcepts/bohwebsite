import { supabase } from '../client';
import { supabaseAdmin } from '../adminClient';

// Local storage keys
const ADMIN_AUTH_KEY = 'boh_admin_auth';
const CURRENT_USER_KEY = 'boh_admin_current_user';
const SETTINGS_STORAGE_KEY = 'boh_admin_settings';

// Interfaces
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  read: boolean;
  archived: boolean;
}

// User interface
export interface User {
  id: string;
  username: string;
  password?: string; // Not stored or retrieved
  fullName: string;
  email: string;
  role: 'Administrator' | 'Editor' | 'Viewer';
  active: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// Settings interface
export interface Settings {
  siteName: string;
  contactEmail: string;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es';
  autoArchiveMessages: boolean;
  messageRetentionDays: number;
}

// Default settings
const defaultSettings: Settings = {
  siteName: 'BOH Concepts Admin',
  contactEmail: 'admin@bohconcepts.com',
  notificationsEnabled: true,
  theme: 'light',
  language: 'en',
  autoArchiveMessages: false,
  messageRetentionDays: 30
};

// Fetch messages from Supabase
const fetchMessages = async (): Promise<Message[]> => {
  try {
    // Fetch messages from the contact_messages table or equivalent
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      createdAt: new Date(item.created_at),
      read: item.read || false,
      archived: item.archived || false
    }));
  } catch (error) {
    console.error('Error in fetchMessages:', error);
    return [];
  }
};

// Fetch users from Supabase
const fetchUsers = async (): Promise<User[]> => {
  try {
    console.log('Fetching users with admin client to bypass RLS');
    
    // Use admin client to bypass RLS and fetch all profiles
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, user_id, email, full_name, role, is_active, created_at, updated_at');
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} users`);
    
    return data.map(profile => ({
      id: profile.id,
      username: profile.email,
      fullName: profile.full_name,
      email: profile.email,
      role: profile.role || 'Viewer',
      active: profile.is_active !== false, // Default to true if undefined
      lastLogin: undefined, // No last_login field in the database
      createdAt: new Date(profile.created_at)
    }));
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    return [];
  }
};

// Initialize settings from localStorage or defaults
const initializeSettings = (): Settings => {
  const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!storedSettings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
  return JSON.parse(storedSettings);
};

// Admin service functions
export const adminService = {
  // Create admin user
  createAdminUser: async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      console.log('Creating admin user:', { email, passwordLength: password?.length || 0 });
      
      // Create user with admin client
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: 'admin'
        }
      });
      
      if (authError) {
        console.error('Error creating admin user:', authError);
        return false;
      }
      
      if (!authData?.user) {
        console.error('No user returned from creation');
        return false;
      }
      
      // Create profile for the user
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: email,
          full_name: fullName,
          role: 'admin',
          active: true
        });
      
      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        return false;
      }
      
      console.log('Admin user created successfully');
      return true;
    } catch (error) {
      console.error('Error in createAdminUser:', error);
      return false;
    }
  },
  
  // Authentication
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Admin service login attempt:', { email, passwordLength: password?.length || 0 });
      
      // First, verify the password by attempting a sign-in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error('Password verification failed:', signInError);
        return false;
      }
      
      if (!signInData?.user) {
        console.error('No user returned from sign-in');
        return false;
      }
      
      console.log('Sign-in successful, checking if user is admin');
      
      // Use the admin client to bypass RLS and check if the user has admin role
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, user_id, role, full_name, email')
        .eq('user_id', signInData.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile with admin client:', profileError);
        return false;
      }
      
      if (!profile) {
        console.error('No profile found for user');
        return false;
      }
      
      // Check if the user has admin role
      if (profile.role !== 'admin') {
        console.error('User does not have admin role:', profile.role);
        return false;
      }
      
      console.log('Confirmed user has admin role:', { userId: profile.user_id, role: profile.role });
      
      // Store admin authentication status in localStorage
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        id: profile.id,
        username: profile.email,
        fullName: profile.full_name,
        email: profile.email,
        role: profile.role
      }));
      
      console.log('Admin authentication successful');
      return true;
    } catch (error) {
      console.error('Error in admin login:', error);
      return false;
    }
  },
  
  logout: (): void => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },
  
  isAuthenticated: (): boolean => {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  },
  
  getCurrentUser: (): User | null => {
    try {
      // Check if we're authenticated first
      if (!localStorage.getItem(ADMIN_AUTH_KEY)) {
        console.log('Not authenticated, no current user');
        return null;
      }
      
      const userJson = localStorage.getItem(CURRENT_USER_KEY);
      if (!userJson) {
        console.log('No user data in localStorage');
        
        // Fallback: Try to get the current authenticated user from Supabase
        // This is async but we can't make this function async without breaking the interface
        // So we'll return null for now and the UI should handle refreshing
        return null;
      }
      
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Message management
  getMessages: async (): Promise<Message[]> => {
    return await fetchMessages();
  },
  
  getMessageById: async (id: string): Promise<Message | null> => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        console.error('Error fetching message by ID:', error);
        return null;
      }
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        createdAt: new Date(data.created_at),
        read: data.read || false,
        archived: data.archived || false
      };
    } catch (error) {
      console.error('Error in getMessageById:', error);
      return null;
    }
  },
  
  markMessageAsRead: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ read: true })
        .eq('id', id);
      
      if (error) {
        console.error('Error marking message as read:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in markMessageAsRead:', error);
      return false;
    }
  },
  
  archiveMessage: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ archived: true })
        .eq('id', id);
      
      if (error) {
        console.error('Error archiving message:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in archiveMessage:', error);
      return false;
    }
  },
  
  deleteMessage: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting message:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      return false;
    }
  },
  
  restoreMessage: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ archived: false })
        .eq('id', id);
      
      if (error) {
        console.error('Error restoring message:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in restoreMessage:', error);
      return false;
    }
  },
  
  // Stats and analytics
  getStats: async (): Promise<any> => {
    try {
      const messages = await fetchMessages();
      
      return {
        totalMessages: messages.length,
        unreadMessages: messages.filter(m => !m.read).length,
        archivedMessages: messages.filter(m => m.archived).length
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      return {
        totalMessages: 0,
        unreadMessages: 0,
        archivedMessages: 0
      };
    }
  },
  
  // User management
  getUsers: async (): Promise<User[]> => {
    return await fetchUsers();
  },
  
  // Reset user password
  resetUserPassword: async (userId: string, newPassword: string): Promise<boolean> => {
    try {
      console.log('Resetting password for user ID:', userId);
      
      // Get user_id from profiles
      const { data, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('id', userId)
        .single();
      
      if (fetchError || !data) {
        console.error('Error fetching user_id for password reset:', fetchError);
        return false;
      }
      
      console.log('Found user_id for password reset:', data.user_id);
      
      // Reset password using admin API
      const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(
        data.user_id,
        { password: newPassword }
      );
      
      if (resetError) {
        console.error('Error resetting user password:', resetError);
        return false;
      }
      
      console.log('Password reset successful');
      return true;
    } catch (error) {
      console.error('Error in resetUserPassword:', error);
      return false;
    }
  },
  
  getUserById: async (id: string): Promise<User | null> => {
    try {
      // Use admin client to bypass RLS
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, user_id, email, full_name, role, is_active, created_at, updated_at')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        console.error('Error fetching user by ID:', error);
        return null;
      }
      
      return {
        id: data.id,
        username: data.email,
        fullName: data.full_name,
        email: data.email,
        role: data.role || 'Viewer',
        active: data.is_active !== false, // Default to true if undefined,
        lastLogin: undefined, // No last_login field in the database
        createdAt: new Date(data.created_at)
      };
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  },
  
  addUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      console.log('Creating new user with admin client:', { email: user.email, fullName: user.fullName, role: user.role });
      
      // Generate a secure random password if not provided
      const password = user.password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + '!';
      
      // Map role from UI format to database format
      let mappedRole = 'viewer';
      if (user.role === 'Administrator') mappedRole = 'admin';
      else if (user.role === 'Editor') mappedRole = 'editor';
      
      // Create user with admin client
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: user.fullName, role: mappedRole }
      });
      
      if (authError) {
        console.error('Error creating user:', authError);
        return false;
      }
      
      if (!authData?.user) {
        console.error('No user returned from creation');
        return false;
      }
      
      console.log('Auth user created successfully, creating profile');
      
      // Create profile for the user
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: user.email,
          full_name: user.fullName,
          role: mappedRole,
          is_active: user.active
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Check if profile already exists (could happen if trigger created it)
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('user_id', authData.user.id)
          .single();
          
        if (!existingProfile) {
          return false;
        }
      }
      
      console.log('User created successfully');
      return true;
    } catch (error) {
      console.error('Error in addUser:', error);
      return false;
    }
  },
  
  updateUser: async (id: string, updates: Partial<User>): Promise<boolean> => {
    try {
      console.log('Updating user with ID:', id, 'Updates:', JSON.stringify(updates, null, 2));
      
      // Map role from UI format to database format
      let mappedRole = undefined;
      if (updates.role) {
        if (updates.role === 'Administrator') mappedRole = 'admin';
        else if (updates.role === 'Editor') mappedRole = 'editor';
        else mappedRole = 'viewer';
        console.log(`Mapping role ${updates.role} to ${mappedRole}`);
      }
      
      // Get user_id from profiles first
      const { data: profileData, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('id', id)
        .single();
      
      if (fetchError || !profileData) {
        console.error('Error fetching user_id for update:', fetchError);
        return false;
      }
      
      console.log('Found user_id:', profileData.user_id);
      
      // Prepare profile updates
      const profileUpdates: Record<string, any> = {};
      
      if (updates.fullName !== undefined) profileUpdates.full_name = updates.fullName;
      if (updates.email !== undefined) profileUpdates.email = updates.email;
      if (mappedRole !== undefined) profileUpdates.role = mappedRole;
      if (updates.active !== undefined) profileUpdates.is_active = updates.active;
      
      console.log('Profile updates to apply:', profileUpdates);
      
      // Only update if there are changes to make
      if (Object.keys(profileUpdates).length > 0) {
        // Update profile with admin client to bypass RLS
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update(profileUpdates)
          .eq('id', id);
        
        if (profileError) {
          console.error('Error updating user profile:', profileError);
          return false;
        }
        
        console.log('Profile updated successfully');
      } else {
        console.log('No profile updates to apply');
      }
      
      // Update auth user if email changed
      if (updates.email) {
        console.log('Updating user email to:', updates.email);
        
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
          profileData.user_id,
          { email: updates.email }
        );
        
        if (authError) {
          console.error('Error updating auth user email:', authError);
          return false;
        }
        
        console.log('User email updated successfully');
      }
      
      // Update password if provided
      if (updates.password) {
        console.log('Updating user password');
        
        const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
          profileData.user_id,
          { password: updates.password }
        );
        
        if (passwordError) {
          console.error('Error updating user password:', passwordError);
          return false;
        }
        
        console.log('User password updated successfully');
      }
      
      // Update user metadata with role if changed
      if (mappedRole) {
        console.log('Updating user metadata with role:', mappedRole);
        
        const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(
          profileData.user_id,
          { 
            user_metadata: { 
              role: mappedRole 
            } 
          }
        );
        
        if (metadataError) {
          console.error('Error updating user metadata:', metadataError);
          // Continue anyway as this is not critical
        } else {
          console.log('User metadata updated successfully');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateUser:', error);
      return false;
    }
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      // Get user_id from profiles
      const { data, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('id', id)
        .single();
      
      if (fetchError || !data) {
        console.error('Error fetching user for deletion:', fetchError);
        return false;
      }
      
      // Delete the auth user
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
      
      if (authError) {
        console.error('Error deleting auth user:', authError);
        return false;
      }
      
      // Profile should be deleted by cascade, but just in case
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return false;
    }
  },
  
  // Change user password
  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      console.log('Changing password for user ID:', userId);
      
      // Get user_id from profiles
      const { data: profileData, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('user_id, email')
        .eq('id', userId)
        .single();
      
      if (fetchError || !profileData) {
        console.error('Error fetching user_id for password change:', fetchError);
        return false;
      }
      
      console.log('Found user_id for password change:', profileData.user_id);
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password: currentPassword,
      });
      
      if (signInError) {
        console.error('Current password verification failed:', signInError);
        return false;
      }
      
      console.log('Current password verified successfully');
      
      // Update the password using admin API
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        profileData.user_id,
        { password: newPassword }
      );
      
      if (updateError) {
        console.error('Error updating password:', updateError);
        return false;
      }
      
      console.log('Password changed successfully');
      return true;
    } catch (error) {
      console.error('Error in changePassword:', error);
      return false;
    }
  },
  
  // Update the Contact form submission to save messages directly to Supabase
  saveContactMessage: async (formData: { name: string; email: string; subject: string; message: string }): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          read: false,
          archived: false
        });
      
      if (error) {
        console.error('Error saving contact message:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveContactMessage:', error);
      return false;
    }
  }
};

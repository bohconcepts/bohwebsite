import { supabase } from '../client';

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

// Local storage keys
const ADMIN_AUTH_KEY = 'boh_admin_auth';
const CURRENT_USER_KEY = 'boh_admin_current_user';
const SETTINGS_STORAGE_KEY = 'boh_admin_settings';

// Fetch real data from Supabase
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
    
    if (!data) return [];
    
    // Transform to match our Message interface
    return data.map(msg => ({
      id: msg.id,
      name: msg.name || '',
      email: msg.email || '',
      subject: msg.subject || 'No Subject',
      message: msg.message || '',
      createdAt: new Date(msg.created_at),
      read: msg.read || false,
      archived: msg.archived || false
    }));
  } catch (error) {
    console.error('Error in fetchMessages:', error);
    return [];
  }
};

const fetchUsers = async (): Promise<User[]> => {
  try {
    // Fetch users from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    if (!data) return [];
    
    // Transform to match our User interface
    return data.map(user => ({
      id: user.id,
      username: user.email || '',
      fullName: user.full_name || '',
      email: user.email || '',
      role: user.role === 'admin' ? 'Administrator' : 
            user.role === 'operator' ? 'Editor' : 'Viewer',
      active: user.is_active !== false, // Default to true if not specified
      lastLogin: user.last_login ? new Date(user.last_login) : undefined,
      createdAt: user.created_at ? new Date(user.created_at) : new Date()
    }));
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    return [];
  }
};

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
  // Authentication
  login: async (username: string, password: string): Promise<boolean> => {
    console.log('Attempting admin login with:', { username, passwordLength: password?.length || 0 });
    
    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        return false;
      }
      
      if (data.user) {
        // Check if the user has admin role in profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return false;
        }
        
        if (profileData && profileData.role === 'admin') {
          // Update last login in the profiles table
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('user_id', data.user.id);
          
          if (updateError) {
            console.error('Error updating last login:', updateError);
          }
          
          // Set auth status and current user
          localStorage.setItem(ADMIN_AUTH_KEY, 'true');
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
            id: profileData.id,
            username: profileData.email,
            fullName: profileData.full_name,
            email: profileData.email,
            role: profileData.role
          }));
          return true;
        } else {
          console.log('User does not have admin role:', profileData?.role);
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
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
  
  // Message management
  getMessages: async (): Promise<Message[]> => {
    return await fetchMessages();
  },
  
  getMessageById: async (id: string): Promise<Message | undefined> => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) {
        console.error('Error fetching message by ID:', error);
        return undefined;
      }
      
      return {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        subject: data.subject || 'No Subject',
        message: data.message || '',
        createdAt: new Date(data.created_at),
        read: data.read || false,
        archived: data.archived || false
      };
    } catch (error) {
      console.error('Error in getMessageById:', error);
      return undefined;
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
  
  getStats: async (): Promise<{total: number; unread: number; archived: number; activeUsers: number; totalUsers: number}> => {
    try {
      const messages = await fetchMessages();
      const users = await fetchUsers();
      
      return {
        total: messages.length,
        unread: messages.filter(m => !m.read).length,
        archived: messages.filter(m => m.archived).length,
        activeUsers: users.filter(u => u.active).length,
        totalUsers: users.length
      };
    } catch (error: any) {
      console.error('Error getting stats:', error);
      return {
        total: 0,
        unread: 0,
        archived: 0,
        activeUsers: 0,
        totalUsers: 0
      };
    }
  },
  
  // User management
  getUsers: async (): Promise<User[]> => {
    try {
      const users = await fetchUsers();
      console.log('Fetched users:', users); // Debug log
      return Array.isArray(users) ? users : [];
    } catch (error: any) {
      console.error('Error in getUsers:', error);
      return [];
    }
  },
  
  getUser: async (id: string): Promise<User | undefined> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) {
        console.error('Error fetching user by ID:', error);
        return undefined;
      }
      
      return {
        id: data.id,
        username: data.email || '',
        fullName: data.full_name || '',
        email: data.email || '',
        role: data.role === 'admin' ? 'Administrator' : 
              data.role === 'operator' ? 'Editor' : 'Viewer',
        active: data.is_active !== false,
        lastLogin: data.last_login ? new Date(data.last_login) : undefined,
        createdAt: data.created_at ? new Date(data.created_at) : new Date()
      };
    } catch (error) {
      console.error('Error in getUser:', error);
      return undefined;
    }
  },
  
  addUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password || Math.random().toString(36).slice(-8),
        email_confirm: true
      });
      
      if (authError || !authData.user) {
        console.error('Error creating auth user:', authError);
        return false;
      }
      
      // Then create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: user.email,
          full_name: user.fullName,
          role: user.role === 'Administrator' ? 'admin' : 
                user.role === 'Editor' ? 'operator' : 'viewer',
          is_active: user.active,
          created_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in addUser:', error);
      return false;
    }
  },
  
  updateUser: async (id: string, updates: Partial<User>): Promise<boolean> => {
    try {
      // Get the profile first
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError || !data) {
        console.error('Error fetching user for update:', fetchError);
        return false;
      }
      
      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName || data.full_name,
          role: updates.role === 'Administrator' ? 'admin' : 
                updates.role === 'Editor' ? 'operator' : 'viewer',
          is_active: updates.active !== undefined ? updates.active : data.is_active
        })
        .eq('id', id);
      
      if (updateError) {
        console.error('Error updating user:', updateError);
        return false;
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
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', id)
        .single();
      
      if (fetchError || !data) {
        console.error('Error fetching user for deletion:', fetchError);
        return false;
      }
      
      // Delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(data.user_id);
      
      if (authError) {
        console.error('Error deleting auth user:', authError);
        return false;
      }
      
      // Profile should be deleted by cascade, but just in case
      const { error: profileError } = await supabase
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
  
  // Settings management
  getSettings: (): Settings => {
    return initializeSettings();
  },
  
  updateSettings: (updates: Partial<Settings>): Settings => {
    const currentSettings = initializeSettings();
    const updatedSettings = { ...currentSettings, ...updates };
    
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    return updatedSettings;
  }
};

// Update the Contact form submission to save messages directly to Supabase
export const saveContactMessage = async (formData: { name: string; email: string; subject: string; message: string }): Promise<boolean> => {
  try {
    const { error } = await supabase.from('contacts').insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      created_at: new Date().toISOString(),
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
};

import { supabaseAdmin } from '../adminClient';

// Dashboard statistics interface
export interface DashboardStats {
  // Message stats
  totalMessages: number;
  unreadMessages: number;
  archivedMessages: number;
  
  // User stats
  totalUsers: number;
  activeUsers: number;
  
  // Activity stats
  recentActivities: Activity[];
  
  // Performance metrics
  conversionRate: number;
  averageResponseTime: number;
}

// Activity interface for tracking recent actions
export interface Activity {
  id: string;
  type: 'user_created' | 'user_updated' | 'message_received' | 'message_read' | 'message_archived' | 'settings_updated';
  description: string;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Time periods for analytics
export type TimePeriod = 'day' | 'week' | 'month' | 'year';

// Dashboard service for admin analytics and statistics
export const dashboardService = {
  // Get comprehensive dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    try {
      console.log('Fetching dashboard statistics');
      
      // Fetch message stats
      const { data: messages, error: messagesError } = await supabaseAdmin
        .from('contacts')
        .select('*');
      
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }
      
      // Fetch user stats
      const { data: users, error: usersError } = await supabaseAdmin
        .from('profiles')
        .select('*');
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }
      
      // Fetch recent activities - we now have a proper activities table
      const { data: activities, error: activitiesError } = await supabaseAdmin
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
        // Continue execution even if activities fetch fails
      }
      
      console.log('Activities data:', activities);
      
      // Calculate message stats
      const totalMessages = messages?.length || 0;
      const unreadMessages = messages?.filter(m => !m.read).length || 0;
      const archivedMessages = messages?.filter(m => m.archived).length || 0;
      
      // Calculate user stats
      const totalUsers = users?.length || 0;
      const activeUsers = users?.filter(u => u.is_active).length || 0;
      
      // Map activities to our format
      const recentActivities: Activity[] = activities?.map((activity: any) => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        userId: activity.user_id,
        timestamp: activity.created_at,
        metadata: activity.metadata
      })) || [];
      
      // If no activities table exists, create some mock activities based on messages and users
      if (recentActivities.length === 0) {
        // Add recent message activities
        messages?.slice(0, 5).forEach(message => {
          recentActivities.push({
            id: `msg-${message.id}`,
            type: 'message_received',
            description: `New message from ${message.name}: ${message.subject}`,
            timestamp: message.created_at,
            metadata: { messageId: message.id }
          });
        });
        
        // Add recent user activities if any
        users?.slice(0, 5).forEach(user => {
          recentActivities.push({
            id: `user-${user.id}`,
            type: 'user_created',
            description: `User account created: ${user.full_name || user.email}`,
            userId: user.id,
            timestamp: user.created_at,
            metadata: { userId: user.id }
          });
        });
        
        // Sort activities by timestamp
        recentActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }
      
      // Calculate mock performance metrics
      // In a real app, these would come from actual analytics
      const conversionRate = Math.round(Math.random() * 10 + 5); // 5-15%
      const averageResponseTime = Math.round(Math.random() * 20 + 10); // 10-30 hours
      
      return {
        totalMessages,
        unreadMessages,
        archivedMessages,
        totalUsers,
        activeUsers,
        recentActivities: recentActivities.slice(0, 10),
        conversionRate,
        averageResponseTime
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      // Return default values in case of error
      return {
        totalMessages: 0,
        unreadMessages: 0,
        archivedMessages: 0,
        totalUsers: 0,
        activeUsers: 0,
        recentActivities: [],
        conversionRate: 0,
        averageResponseTime: 0
      };
    }
  },
  
  // Get user growth over time
  getUserGrowth: async (period: TimePeriod = 'month'): Promise<{ date: string; count: number }[]> => {
    try {
      // In a real implementation, this would query the database with proper date filtering
      // For now, we'll generate mock data
      const today = new Date();
      const result: { date: string; count: number }[] = [];
      
      let days = 30;
      if (period === 'day') days = 24; // Hours in a day
      else if (period === 'week') days = 7;
      else if (period === 'year') days = 12; // Months in a year
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        if (period === 'day') {
          date.setHours(today.getHours() - (days - i - 1));
          result.push({
            date: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            count: Math.floor(Math.random() * 5) + 1
          });
        } else if (period === 'week') {
          date.setDate(today.getDate() - (days - i - 1));
          result.push({
            date: date.toLocaleDateString([], { weekday: 'short' }),
            count: Math.floor(Math.random() * 10) + 5
          });
        } else if (period === 'month') {
          date.setDate(today.getDate() - (days - i - 1));
          result.push({
            date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
            count: Math.floor(Math.random() * 8) + 2
          });
        } else if (period === 'year') {
          date.setMonth(today.getMonth() - (days - i - 1));
          result.push({
            date: date.toLocaleDateString([], { month: 'short' }),
            count: Math.floor(Math.random() * 30) + 10
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error in getUserGrowth:', error);
      return [];
    }
  },
  
  // Get message statistics over time
  getMessageStats: async (period: TimePeriod = 'month'): Promise<{ date: string; received: number; read: number }[]> => {
    try {
      // In a real implementation, this would query the database with proper date filtering
      // For now, we'll generate mock data
      const today = new Date();
      const result: { date: string; received: number; read: number }[] = [];
      
      let days = 30;
      if (period === 'day') days = 24; // Hours in a day
      else if (period === 'week') days = 7;
      else if (period === 'year') days = 12; // Months in a year
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        const received = Math.floor(Math.random() * 15) + 5;
        const read = Math.floor(received * (0.5 + Math.random() * 0.5)); // 50-100% of received
        
        if (period === 'day') {
          date.setHours(today.getHours() - (days - i - 1));
          result.push({
            date: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            received,
            read
          });
        } else if (period === 'week') {
          date.setDate(today.getDate() - (days - i - 1));
          result.push({
            date: date.toLocaleDateString([], { weekday: 'short' }),
            received,
            read
          });
        } else if (period === 'month') {
          date.setDate(today.getDate() - (days - i - 1));
          result.push({
            date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
            received,
            read
          });
        } else if (period === 'year') {
          date.setMonth(today.getMonth() - (days - i - 1));
          result.push({
            date: date.toLocaleDateString([], { month: 'short' }),
            received: received * 10,
            read: read * 10
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error in getMessageStats:', error);
      return [];
    }
  },
  
  // Log a new activity
  logActivity: async (activity: Omit<Activity, 'id' | 'timestamp'>): Promise<boolean> => {
    try {
      console.log('Logging activity:', activity);
      
      // Insert into activities table
      const { error } = await supabaseAdmin
        .from('activities')
        .insert({
          type: activity.type,
          description: activity.description,
          user_id: activity.userId,
          metadata: activity.metadata,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error logging activity:', error);
        return false;
      }
      
      console.log('Activity logged successfully');
      return true;
    } catch (error) {
      console.error('Error in logActivity:', error);
      return false;
    }
  }
};

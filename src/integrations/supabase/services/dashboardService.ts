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

  // Link tracking stats
  totalLinkClicks: number;
  uniqueLinksClicked: number;
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

// Link click analytics interface
export interface LinkClickStats {
  url: string;
  clicks: number;
  uniqueUsers: number;
  pageSources: { source: string; count: number }[];
}

// Dashboard service for admin analytics and statistics
// Import types
import { LinkClick } from '../types/link-clicks';

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
      
      // Try to fetch link click stats from the view if it exists
      let totalLinkClicks = 0;
      let uniqueLinksClicked = 0;
      
      try {
        // First try to get stats from the view (if migration has been applied)
        const { data: linkClickStats, error: viewError } = await supabaseAdmin
          .from('link_click_stats')
          .select('*')
          .single();
        
        if (!viewError && linkClickStats) {
          totalLinkClicks = linkClickStats.total_link_clicks || 0;
          uniqueLinksClicked = linkClickStats.unique_links_clicked || 0;
        } else {
          // Fallback: Calculate stats directly from link_clicks table
          console.log('Falling back to direct calculation of link click stats');
          
          const { data: linkClicks, error: linkClicksError } = await supabaseAdmin
            .from('link_clicks')
            .select('url');
          
          if (linkClicksError) {
            console.error('Error fetching link clicks:', linkClicksError);
          } else if (linkClicks) {
            totalLinkClicks = linkClicks.length;
            uniqueLinksClicked = new Set(linkClicks.map(click => click.url)).size;
          }
        }
      } catch (error) {
        console.error('Error calculating link click stats:', error);
        // Continue execution even if link clicks fetch fails
      }
      
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
        averageResponseTime,
        totalLinkClicks,
        uniqueLinksClicked
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
        conversionRate: 0, // Placeholder for now
        averageResponseTime: 0, // Placeholder for now
        totalLinkClicks: 0,
        uniqueLinksClicked: 0
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
  },

  // Get link click statistics
  getLinkClickStats: async (period: TimePeriod = 'month'): Promise<LinkClickStats[]> => {
    try {
      console.log('Fetching link click statistics for period:', period);
      
      // Calculate the start date based on the period
      const now = new Date();
      let startDate = new Date();
      
      switch(period) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      // Format the date for SQL query
      const startDateStr = startDate.toISOString();
      
      // Fetch link clicks within the period
      const { data: linkClicks, error } = await supabaseAdmin
        .from('link_clicks')
        .select('*')
        .gte('clicked_at', startDateStr);
      
      if (error) {
        console.error('Error fetching link clicks:', error);
        throw error;
      }
      
      // Process the data to get statistics
      const clicksByUrl = new Map<string, LinkClick[]>();
      
      // Group clicks by URL
      linkClicks?.forEach((click: LinkClick) => {
        if (!clicksByUrl.has(click.url)) {
          clicksByUrl.set(click.url, []);
        }
        clicksByUrl.get(click.url)?.push(click);
      });
      
      // Calculate statistics for each URL
      const stats: LinkClickStats[] = [];
      
      clicksByUrl.forEach((clicks, url) => {
        // Count unique users
        const uniqueUsers = new Set(clicks.map(c => c.user_id || c.ip_address || 'anonymous')).size;
        
        // Count clicks by page source
        const sourceMap = new Map<string, number>();
        clicks.forEach(click => {
          const source = click.page_source || 'unknown';
          sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
        });
        
        // Convert source map to array
        const pageSources = Array.from(sourceMap.entries()).map(([source, count]) => ({
          source,
          count
        }));
        
        // Sort by count descending
        pageSources.sort((a, b) => b.count - a.count);
        
        stats.push({
          url,
          clicks: clicks.length,
          uniqueUsers,
          pageSources
        });
      });
      
      // Sort by total clicks descending
      stats.sort((a, b) => b.clicks - a.clicks);
      
      return stats;
    } catch (error) {
      console.error('Error in getLinkClickStats:', error);
      return [];
    }
  },

  // Get link click timeline data
  getLinkClickTimeline: async (period: TimePeriod = 'month'): Promise<{ date: string; clicks: number }[]> => {
    try {
      console.log('Fetching link click timeline for period:', period);
      
      // Calculate the start date based on the period
      const now = new Date();
      let startDate = new Date();
      let format: string = 'YYYY-MM-DD'; // Default format
      let groupBy: string = 'day'; // Default grouping
      
      switch(period) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          format = 'HH24';
          groupBy = 'hour';
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          format = 'YYYY-MM-DD';
          groupBy = 'day';
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          format = 'YYYY-MM-DD';
          groupBy = 'day';
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          format = 'YYYY-MM';
          groupBy = 'month';
          break;
      }
      
      // Format the date for SQL query
      const startDateStr = startDate.toISOString();
      
      // Try to fetch link clicks grouped by date using the RPC function
      try {
        const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('group_link_clicks_by_date', {
          start_date: startDateStr,
          date_format: format
        });
        
        if (!rpcError && rpcData) {
          // If RPC function worked, format the result
          return rpcData.map((item: any) => ({
            date: item.date_group,
            clicks: item.click_count
          }));
        }
      } catch (rpcError) {
        console.error('RPC function not available:', rpcError);
      }
      
      // Fallback if the RPC function doesn't exist or fails
      console.log('Falling back to manual grouping of link clicks');
      
      // Fetch all link clicks and group them manually
      const { data: linkClicks, error: fallbackError } = await supabaseAdmin
        .from('link_clicks')
        .select('clicked_at')
        .gte('clicked_at', startDateStr);
        
      if (fallbackError) {
        console.error('Error in fallback link click fetch:', fallbackError);
        return []; // Return empty array instead of throwing
      }
      
      // Manually group by date
      const clicksByDate = new Map<string, number>();
      
      linkClicks?.forEach((click: { clicked_at: string }) => {
        let dateKey: string;
        const date = new Date(click.clicked_at);
        
        switch(groupBy) {
          case 'hour':
            dateKey = date.getHours().toString().padStart(2, '0');
            break;
          case 'day':
            dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
            break;
          case 'month':
          default:
            dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // YYYY-MM
            break;
        }
        
        clicksByDate.set(dateKey, (clicksByDate.get(dateKey) || 0) + 1);
      });
      
      // Convert to array and sort by date
      const result = Array.from(clicksByDate.entries()).map(([date, clicks]) => ({
        date,
        clicks
      }));
      
      result.sort((a, b) => a.date.localeCompare(b.date));
      return result;
    } catch (error) {
      console.error('Error in getLinkClickTimeline:', error);
      return [];
    }
  }
};

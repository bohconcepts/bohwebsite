import { createAnonymousClient, supabase } from "../client";
import { LinkClickInsert } from "../types/link-clicks";

// Enable debug mode for development and production
const DEBUG = true;

// Log environment information
console.log('Environment:', {
  isProduction: typeof window !== 'undefined' ? window.location.hostname !== 'localhost' : 'unknown',
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
  origin: typeof window !== 'undefined' ? window.location.origin : 'unknown'
});

/**
 * Service for tracking link clicks
 */
export const linkTrackingService = {
  /**
   * Track a link click
   * @param linkData Information about the clicked link
   * @returns The result of the insert operation
   */
  async trackLinkClick(linkData: LinkClickInsert) {
    try {
      // Log tracking attempt if debug mode is enabled
      if (DEBUG) {
        console.log('📊 Tracking link click:', { url: linkData.url, source: linkData.page_source });
      }

      // Use anonymous client to ensure tracking works for non-authenticated users
      const client = createAnonymousClient();
      
      // Set clicked_at if not provided
      if (!linkData.clicked_at) {
        linkData.clicked_at = new Date().toISOString();
      }
      
      // Add IP address if not provided (will be anonymized by Supabase RLS)
      if (!linkData.ip_address) {
        // We'll let the server determine this
        linkData.ip_address = '0.0.0.0'; // Placeholder
      }
      
      if (DEBUG) {
        console.log('📊 Link data being sent:', linkData);
      }
      
      const { data, error } = await client
        .from("link_clicks")
        .insert(linkData)
        .select()
        .single();
        
      if (error) {
        console.error("❌ Error tracking link click:", error);
        return { data: null, error };
      }
      
      if (DEBUG) {
        console.log('✅ Link click tracked successfully:', data);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("❌ Exception tracking link click:", error);
      return { data: null, error };
    }
  },

  /**
   * Get link click analytics for a specific time period
   * @param startDate Start date for the analytics period
   * @param endDate End date for the analytics period
   * @returns Link click data for the specified period
   */
  async getLinkClickAnalytics(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from("link_clicks")
        .select("*")
        .gte("clicked_at", startDate)
        .lte("clicked_at", endDate)
        .order("clicked_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching link click analytics:", error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Exception fetching link click analytics:", error);
      return { data: null, error };
    }
  },

  /**
   * Get most clicked links
   * @param limit Maximum number of results to return
   * @param startDate Optional start date for filtering (ISO string)
   * @param endDate Optional end date for filtering (ISO string)
   * @returns Most clicked links with counts
   */
  async getMostClickedLinks(limit: number = 10, startDate?: string, endDate?: string) {
    try {
      if (DEBUG) {
        console.log('📊 Fetching most clicked links:', { limit, startDate, endDate });
      }
      
      // Build the query
      let query = supabase
        .from("link_clicks")
        .select("url");
      
      // Apply date filters if provided
      if (startDate) {
        query = query.gte('clicked_at', startDate);
      }
      
      if (endDate) {
        query = query.lte('clicked_at', endDate);
      }
      
      // Execute the query
      const { data, error } = await query;
        
      if (error) {
        console.error("Error fetching most clicked links:", error);
        return { data: null, error };
      }
      
      // Aggregate the data
      const urlCounts: Record<string, number> = {};
      data.forEach(item => {
        urlCounts[item.url] = (urlCounts[item.url] || 0) + 1;
      });
      
      // Sort and limit
      const sortedUrls = Object.entries(urlCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, limit)
        .map(([url, count]) => ({ url, count }));
      
      if (DEBUG) {
        console.log(`📊 Found ${sortedUrls.length} most clicked links`);
      }
      
      return { data: sortedUrls, error: null };
    } catch (error) {
      console.error("Exception fetching most clicked links:", error);
      return { data: null, error };
    }
  }
};

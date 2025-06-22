import { useCallback } from 'react';
import { linkTrackingService } from '@/integrations/supabase/services/linkTrackingService';
import { LinkClickInsert } from '@/integrations/supabase/types/link-clicks';
import type { MouseEvent } from 'react';

// Enable debug mode for development
const DEBUG = true;

/**
 * Hook for tracking link clicks throughout the application
 */
export function useTrackLinks() {
  /**
   * Track a link click
   * @param url The URL that was clicked
   * @param pageSource The page where the link was clicked
   * @param additionalData Any additional tracking data
   */
  const trackLinkClick = useCallback(async (
    url: string,
    pageSource?: string,
    additionalData?: Partial<Omit<LinkClickInsert, 'url' | 'page_source'>>
  ) => {
    try {
      if (DEBUG) {
        console.log('🔍 useTrackLinks.trackLinkClick called:', { url, pageSource });
      }

      // Validate URL
      if (!url) {
        console.error('❌ Cannot track link click: URL is empty');
        return;
      }

      // Get referrer and UTM parameters from the current URL if available
      const urlObj = typeof window !== 'undefined' ? new URL(window.location.href) : null;
      
      const linkData: LinkClickInsert = {
        url,
        page_source: pageSource || (typeof window !== 'undefined' ? window.location.pathname : null),
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        referrer: typeof document !== 'undefined' ? document.referrer : null,
        utm_source: urlObj?.searchParams.get('utm_source') || null,
        utm_medium: urlObj?.searchParams.get('utm_medium') || null,
        utm_campaign: urlObj?.searchParams.get('utm_campaign') || null,
        ...additionalData
      };
      
      if (DEBUG) {
        console.log('📝 Prepared link data:', linkData);
      }
      
      // Track the link click asynchronously
      const result = await linkTrackingService.trackLinkClick(linkData);
      
      if (DEBUG) {
        if (result.error) {
          console.error('❌ Link tracking service returned error:', result.error);
        } else {
          console.log('✅ Link tracking completed successfully');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error in useTrackLinks.trackLinkClick:', error);
    }
  }, []);

  /**
   * Create a tracking click handler for a link
   * @param url The URL to track
   * @param pageSource The page where the link is located
   * @param onClick Optional original onClick handler
   * @returns A new click handler that tracks the click and calls the original handler
   */
  const createTrackingClickHandler = useCallback((
    url: string,
    pageSource?: string,
    onClick?: (event: MouseEvent<HTMLElement>) => void
  ) => {
    return (event: MouseEvent<HTMLElement>) => {
      // Track the click
      trackLinkClick(url, pageSource);
      
      // Call the original onClick handler if provided
      if (onClick) {
        onClick(event);
      }
    };
  }, [trackLinkClick]);

  return {
    trackLinkClick,
    createTrackingClickHandler
  };
}

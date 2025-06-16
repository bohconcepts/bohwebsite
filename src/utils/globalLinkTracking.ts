/**
 * Global link tracking implementation
 * This module provides functions to track all link clicks globally
 */

import { linkTrackingService } from '@/integrations/supabase/services/linkTrackingService';
import { findElementWithTrackingData } from './trackingHelpers';

// Enable debug mode for development
const DEBUG = true;

/**
 * Initialize global link click tracking
 * This adds a global click event listener to track all link clicks
 */
export function initializeGlobalLinkTracking(): () => void {
  if (DEBUG) {
    console.log('🌐 Initializing global link tracking');
  }

  // Function to handle clicks anywhere in the document
  const handleDocumentClick = (event: MouseEvent) => {
    // Try to find the clicked element
    const target = event.target as HTMLElement;
    if (!target) return;
    
    // Check if the click was on a link or a child of a link
    const linkElement = findLinkElement(target);
    if (!linkElement) return;
    
    // Get the URL from the link
    const url = linkElement.href;
    if (!url) return;
    
    if (DEBUG) {
      console.log('🔍 Global link tracking detected click:', { url, element: linkElement });
    }
    
    // Check if this link already has tracking data
    // If it does, it will be handled by the TrackableLink component
    const trackingElement = findElementWithTrackingData(target);
    if (trackingElement) {
      if (DEBUG) {
        console.log('⏭️ Link already has tracking data, skipping global tracking');
      }
      return;
    }
    
    // Get the current page path for tracking source
    const pageSource = window.location.pathname;
    
    if (DEBUG) {
      console.log('🔄 Global tracking for link:', { url, pageSource });
    }
    
    // Track the link click
    trackLinkClick(url, pageSource);
  };
  
  // Add the global event listener
  document.addEventListener('click', handleDocumentClick);
  
  // Return a cleanup function
  return () => {
    document.removeEventListener('click', handleDocumentClick);
  };
}

/**
 * Find the closest link element from a given element or its parents
 */
function findLinkElement(element: HTMLElement | null): HTMLAnchorElement | null {
  if (!element) return null;
  
  // Check if the element is a link
  if (element.tagName === 'A') {
    return element as HTMLAnchorElement;
  }
  
  // Check parent elements
  if (element.parentElement) {
    return findLinkElement(element.parentElement);
  }
  
  return null;
}

/**
 * Track a link click
 */
function trackLinkClick(url: string, pageSource: string) {
  if (DEBUG) {
    console.log('🔗 Global trackLinkClick called:', { url, pageSource });
  }
  
  try {
    // Get UTM parameters from the URL
    const urlObj = new URL(window.location.href);
    const utmSource = urlObj.searchParams.get('utm_source') || null;
    const utmMedium = urlObj.searchParams.get('utm_medium') || null;
    const utmCampaign = urlObj.searchParams.get('utm_campaign') || null;
    
    // Prepare tracking data
    const trackingData = {
      url,
      page_source: pageSource,
      referrer: document.referrer || null,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      user_agent: navigator.userAgent,
      // Only add UTM parameters that are defined in the LinkClickInsert type
      // utm_term and utm_content are not in the type definition
    };
    
    if (DEBUG) {
      console.log('📊 Global tracking data:', trackingData);
    }
    
    // Track the link click
    linkTrackingService.trackLinkClick(trackingData)
      .then(result => {
        if (DEBUG) {
          if (result.error) {
            console.error('❌ Global link tracking error:', result.error);
          } else {
            console.log('✅ Global link tracking success:', result.data);
          }
        }
      })
      .catch(error => {
        console.error('❌ Global link tracking exception:', error);
      });
  } catch (error) {
    console.error('❌ Error in global trackLinkClick:', error);
  }
}

export default initializeGlobalLinkTracking;

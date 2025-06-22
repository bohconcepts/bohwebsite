/**
 * Utility functions for link tracking
 */

/**
 * Creates a data attribute object that can be spread into any component to track link clicks
 * This is useful for components that don't use anchor tags directly
 * 
 * @param url The URL to track
 * @param pageSource Optional page source identifier
 * @returns An object with data attributes for tracking
 * 
 * @example
 * // In a component:
 * import { createTrackingAttributes } from '@/utils/trackingHelpers';
 * 
 * <Button 
 *   onClick={handleClick} 
 *   {...createTrackingAttributes('https://example.com', 'homepage')}
 * >
 *   Click me
 * </Button>
 */
export function createTrackingAttributes(url: string, pageSource?: string) {
  return {
    'data-track-url': url,
    'data-track-source': pageSource || '',
  };
}

/**
 * Extracts tracking data from an element's data attributes
 * 
 * @param element The DOM element to extract tracking data from
 * @returns An object with tracking data or null if no tracking data is found
 */
export function extractTrackingData(element: HTMLElement): { url: string; pageSource?: string } | null {
  const url = element.getAttribute('data-track-url');
  if (!url) return null;
  
  return {
    url,
    pageSource: element.getAttribute('data-track-source') || undefined,
  };
}

/**
 * Checks if an element or any of its parents has tracking data
 * 
 * @param element The DOM element to check
 * @returns The element with tracking data or null if none is found
 */
export function findElementWithTrackingData(element: HTMLElement | null): HTMLElement | null {
  if (!element) return null;
  
  if (element.hasAttribute('data-track-url')) {
    return element;
  }
  
  if (element.parentElement) {
    return findElementWithTrackingData(element.parentElement);
  }
  
  return null;
}

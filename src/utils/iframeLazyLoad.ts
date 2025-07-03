/**
 * Utility to handle iframe lazy loading in a cross-browser compatible way
 * This addresses the Safari iOS < 16.4 compatibility issue with the loading="lazy" attribute
 */

export const setupIframeLazyLoading = (): void => {
  // Check if browser supports loading="lazy" for iframes
  const isBrowserSupported = 'loading' in HTMLIFrameElement.prototype;
  
  // Find all iframes with data-loading="lazy"
  const lazyIframes = document.querySelectorAll('iframe[data-loading="lazy"]');
  
  lazyIframes.forEach(iframe => {
    if (isBrowserSupported) {
      // For supported browsers, set the loading attribute
      iframe.setAttribute('loading', 'lazy');
    } else {
      // For unsupported browsers, we could implement a custom lazy loading solution
      // using Intersection Observer API if needed
      // This is a simple implementation - could be enhanced with more features
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // If iframe is in viewport and has a data-src attribute
                const iframe = entry.target as HTMLIFrameElement;
                if (iframe.dataset.src) {
                  iframe.src = iframe.dataset.src;
                  iframe.removeAttribute('data-src');
                }
                // Stop observing once loaded
                observer.unobserve(iframe);
              }
            });
          },
          { rootMargin: '200px' } // Start loading when iframe is within 200px of viewport
        );
        
        observer.observe(iframe);
      }
    }
  });
};

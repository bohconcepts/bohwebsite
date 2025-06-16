import React, { useCallback } from 'react';
import { useTrackLinks } from '@/hooks/useTrackLinks';

// Enable debug mode for development
const DEBUG = true;

interface TrackableLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  pageSource?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A link component that automatically tracks clicks in Supabase
 */
export const TrackableLink: React.FC<TrackableLinkProps> = ({
  href,
  children,
  className,
  pageSource,
  target,
  rel,
  onClick,
  ...props
}) => {
  const { trackLinkClick } = useTrackLinks();
  
  // Create a click handler that tracks the click and calls the original handler
  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (DEBUG) {
      console.log('🔗 TrackableLink clicked:', { href, pageSource });
    }
    
    // Track the click
    trackLinkClick(href, pageSource);
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(event);
    }
  }, [href, pageSource, onClick, trackLinkClick]);

  // Add noopener and noreferrer for security when target is _blank
  const safeRel = target === '_blank' 
    ? `${rel || ''} noopener noreferrer`.trim()
    : rel;
  
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={safeRel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default TrackableLink;

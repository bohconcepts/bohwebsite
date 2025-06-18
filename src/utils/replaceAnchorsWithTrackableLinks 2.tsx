import React, { ReactElement, ReactNode } from 'react';
import TrackableLink from '@/components/common/TrackableLink';

/**
 * Recursively traverses React elements and replaces <a> tags with <TrackableLink> components
 * @param children React children to process
 * @param pageSource The source page for tracking purposes
 * @returns Processed React children with replaced links
 */
export function replaceAnchorsWithTrackableLinks(
  children: ReactNode,
  pageSource?: string
): ReactNode {
  // If the children is an array, process each child
  if (Array.isArray(children)) {
    return React.Children.map(children, (child) =>
      replaceAnchorsWithTrackableLinks(child, pageSource)
    );
  }

  // If the child is a React element
  if (React.isValidElement(children)) {
    const child = children as ReactElement;
    
    // If it's an anchor tag, replace it with TrackableLink
    if (child.type === 'a') {
      const { href, onClick, target, rel, className, children: anchorChildren, ...rest } = child.props;
      
      // Skip replacement if no href (anchor might be used for other purposes)
      if (!href) {
        return child;
      }
      
      return (
        <TrackableLink
          href={href}
          pageSource={pageSource}
          onClick={onClick}
          target={target}
          rel={rel}
          className={className}
          {...rest}
        >
          {replaceAnchorsWithTrackableLinks(anchorChildren, pageSource)}
        </TrackableLink>
      );
    }
    
    // If it has children, process them recursively
    if (child.props && child.props.children) {
      return React.cloneElement(child, {
        ...child.props,
        children: replaceAnchorsWithTrackableLinks(child.props.children, pageSource),
      });
    }
    
    // Otherwise, return the element as is
    return child;
  }
  
  // For non-element children (text, etc.), return as is
  return children;
}

/**
 * Higher-order component that replaces all <a> tags with <TrackableLink> components
 * @param Component The component to wrap
 * @param pageSource Optional page source identifier for tracking
 * @returns A wrapped component with all anchor tags replaced
 */
export function withTrackableLinks<P extends object>(
  Component: React.ComponentType<P>,
  pageSource?: string
): React.FC<P> {
  return (props: P) => {
    return React.createElement(Component, {
      ...props,
      children: replaceAnchorsWithTrackableLinks(
        // @ts-ignore - children might not be in props but we handle that case
        props.children,
        pageSource || typeof window !== 'undefined' ? window.location.pathname : undefined
      ),
    });
  };
}

/**
 * Component that wraps its children and replaces all <a> tags with <TrackableLink> components
 */
export const TrackableLinksProvider: React.FC<{
  children: ReactNode;
  pageSource?: string;
}> = ({ children, pageSource }) => {
  return <>{replaceAnchorsWithTrackableLinks(children, pageSource)}</>;
};

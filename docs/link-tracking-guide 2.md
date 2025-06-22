# Link Tracking Implementation Guide

This guide explains how to track link clicks throughout the BOH Concepts website using the Supabase link tracking system.

## Overview

We've implemented a comprehensive link tracking system that records when users click on links throughout the website. This data is stored in a Supabase table called `link_clicks` and can be used for analytics purposes.

The tracking system captures:
- The URL that was clicked
- The page where the link was clicked
- User information (if available)
- Timestamp
- Device information
- Referrer information
- UTM parameters

## Implementation Options

There are several ways to implement link tracking in your components:

### Option 1: Use the TrackableLink Component

Replace standard `<a>` tags with the `<TrackableLink>` component:

```tsx
import { TrackableLink } from '@/components/common/TrackableLink';

// Instead of:
// <a href="https://example.com">Click me</a>

// Use:
<TrackableLink href="https://example.com">Click me</TrackableLink>

// With additional props:
<TrackableLink 
  href="https://example.com" 
  pageSource="homepage-hero" 
  className="btn btn-primary"
  target="_blank"
>
  Click me
</TrackableLink>
```

### Option 2: Use the TrackableLinksProvider

Wrap sections of your component with the `TrackableLinksProvider` to automatically track all links within that section:

```tsx
import { TrackableLinksProvider } from '@/utils/replaceAnchorsWithTrackableLinks';

// Wrap a section with multiple links
<TrackableLinksProvider pageSource="product-section">
  <div>
    <h2>Our Products</h2>
    <p>Check out our <a href="/product1">first product</a> and our <a href="/product2">second product</a>.</p>
  </div>
</TrackableLinksProvider>
```

### Option 3: Use the Higher-Order Component

Wrap entire components with the `withTrackableLinks` HOC:

```tsx
import { withTrackableLinks } from '@/utils/replaceAnchorsWithTrackableLinks';

// Define your component with regular anchor tags
const ProductList = () => (
  <div>
    <h2>Products</h2>
    <ul>
      <li><a href="/product1">Product 1</a></li>
      <li><a href="/product2">Product 2</a></li>
    </ul>
  </div>
);

// Export the wrapped component
export default withTrackableLinks(ProductList, 'product-list');
```

### Option 4: Use the useTrackLinks Hook

For custom tracking scenarios or non-anchor elements:

```tsx
import { useTrackLinks } from '@/hooks/useTrackLinks';

const MyComponent = () => {
  const { trackLinkClick } = useTrackLinks();
  
  const handleButtonClick = () => {
    // Track the click
    trackLinkClick('https://example.com', 'custom-button');
    
    // Perform other actions
    window.open('https://example.com', '_blank');
  };
  
  return (
    <button onClick={handleButtonClick}>
      Visit Website
    </button>
  );
};
```

### Option 5: Use Data Attributes

For components that don't use anchor tags directly:

```tsx
import { createTrackingAttributes } from '@/utils/trackingHelpers';

// In a component:
<Button 
  onClick={handleClick} 
  {...createTrackingAttributes('https://example.com', 'homepage')}
>
  Click me
</Button>
```

## Application-Wide Implementation

We've already implemented link tracking at the application level by wrapping the main layout components with `TrackableLinksProvider`. This means that most links in the application will be tracked automatically.

The following components have been updated to track links:
- `Layout.tsx` - Tracks all links in the main layout
- `AdminLayout.tsx` - Tracks all links in the admin layout

## Viewing Link Click Data

Administrators can view link click data in the Supabase dashboard or by creating a dedicated analytics page in the admin panel.

## Technical Implementation

The link tracking system consists of:

1. **Database Table**: `link_clicks` in Supabase
2. **Type Definitions**: `src/integrations/supabase/types/link-clicks.ts`
3. **Service**: `src/integrations/supabase/services/linkTrackingService.ts`
4. **React Hook**: `src/hooks/useTrackLinks.ts`
5. **Components**: `src/components/common/TrackableLink.tsx`
6. **Utilities**: 
   - `src/utils/replaceAnchorsWithTrackableLinks.tsx`
   - `src/utils/trackingHelpers.ts`

## Security Considerations

- The link tracking system uses Row Level Security (RLS) to ensure that only administrators can view the tracking data
- Anyone can insert link click data (for anonymous tracking)
- User IDs are only stored for authenticated users

## Next Steps

Consider implementing:

1. A dedicated analytics dashboard for link clicks
2. Integration with other analytics systems
3. Enhanced tracking for specific user segments
4. A/B testing capabilities using the tracking data

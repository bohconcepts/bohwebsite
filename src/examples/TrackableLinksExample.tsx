import { TrackableLinksProvider, withTrackableLinks } from '@/utils/replaceAnchorsWithTrackableLinks';

// Example component with regular anchor tags
const ExampleComponent = () => (
  <div className="example-component">
    <h3>Regular Links</h3>
    <p>
      This is a <a href="https://example.com/page1">regular link</a> that will be tracked.
      And here's <a href="https://example.com/page2" target="_blank" rel="noopener noreferrer">another link</a> with target blank.
    </p>
  </div>
);

// The same component wrapped with the HOC
const TrackedExampleComponent = withTrackableLinks(ExampleComponent, 'example-page');

// Example page showing different ways to use trackable links
const TrackableLinksExample = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trackable Links Examples</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Method 1: Using TrackableLink Component Directly</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p className="mb-2">
            This is a{' '}
            <TrackableLink href="https://example.com/direct" pageSource="example-page">
              directly tracked link
            </TrackableLink>{' '}
            using the TrackableLink component.
          </p>
        </div>
        <pre className="bg-gray-800 text-white p-4 rounded mt-2 text-sm">
          {`<TrackableLink href="https://example.com/direct" pageSource="example-page">
  directly tracked link
</TrackableLink>`}
        </pre>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Method 2: Using TrackableLinksProvider</h2>
        <div className="bg-gray-100 p-4 rounded">
          <TrackableLinksProvider pageSource="example-page-provider">
            <p className="mb-2">
              This paragraph has a <a href="https://example.com/provider1">regular link</a> that 
              will be automatically converted to a trackable link. And here's 
              <a href="https://example.com/provider2" target="_blank" rel="noopener noreferrer" className="ml-1">another one</a>.
            </p>
            <div>
              <p>Nested elements work too:</p>
              <ul className="list-disc pl-5">
                <li><a href="https://example.com/list1">List item link 1</a></li>
                <li><a href="https://example.com/list2">List item link 2</a></li>
              </ul>
            </div>
          </TrackableLinksProvider>
        </div>
        <pre className="bg-gray-800 text-white p-4 rounded mt-2 text-sm">
          {`<TrackableLinksProvider pageSource="example-page-provider">
  <p>
    This paragraph has a <a href="https://example.com/provider1">regular link</a> that 
    will be automatically converted to a trackable link.
  </p>
  {/* All nested anchor tags will be converted */}
</TrackableLinksProvider>`}
        </pre>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Method 3: Using Higher-Order Component</h2>
        <div className="bg-gray-100 p-4 rounded">
          <TrackedExampleComponent />
        </div>
        <pre className="bg-gray-800 text-white p-4 rounded mt-2 text-sm">
          {`// Define your component with regular anchor tags
const ExampleComponent = () => (
  <div>
    <p>This is a <a href="https://example.com/page1">regular link</a> that will be tracked.</p>
  </div>
);

// Wrap it with the HOC
const TrackedExampleComponent = withTrackableLinks(ExampleComponent, 'example-page');

// Use it in your application
<TrackedExampleComponent />`}
        </pre>
      </section>
      
      <div className="bg-blue-100 p-4 rounded border border-blue-300">
        <h3 className="font-semibold text-blue-800">Implementation Tips:</h3>
        <ul className="list-disc pl-5 mt-2">
          <li>Use Method 1 for individual links when you need specific control</li>
          <li>Use Method 2 for sections of content with multiple links</li>
          <li>Use Method 3 for entire components or pages</li>
          <li>For app-wide implementation, wrap your main layout component with TrackableLinksProvider</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackableLinksExample;

// Import at the top of the file
import { TrackableLink } from '@/components/common/TrackableLink';

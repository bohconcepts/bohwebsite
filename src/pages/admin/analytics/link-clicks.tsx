import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import LinkClicksAnalytics from '@/components/admin/dashboard/LinkClicksAnalytics';

const LinkClicksAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<number>(7);
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Link Clicks Analytics</h1>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="timeRange" className="text-sm font-medium text-gray-700">
              Time Range:
            </label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
        
        <LinkClicksAnalytics days={timeRange} />
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">About Link Tracking</h2>
          <p className="mb-4">
            This page displays analytics for link clicks throughout your website. The data is collected using the link tracking system
            implemented in your application.
          </p>
          <p className="mb-4">
            The system automatically tracks clicks on all links in your website by replacing standard anchor tags with trackable components.
            This is done using the <code className="bg-gray-100 px-1 py-0.5 rounded">TrackableLinksProvider</code> in your layout components.
          </p>
          <p>
            For more information on how the link tracking system works and how to customize it, please refer to the 
            <a href="/docs/link-tracking-guide.md" className="text-blue-600 hover:underline ml-1">Link Tracking Implementation Guide</a>.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LinkClicksAnalyticsPage;

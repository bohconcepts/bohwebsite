import { useState, useEffect } from 'react';
import { linkTrackingService } from '@/integrations/supabase/services/linkTrackingService';
import { LinkClick } from '@/integrations/supabase/types/link-clicks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface LinkClicksAnalyticsProps {
  days?: number;
}

export const LinkClicksAnalytics = ({ days = 7 }: LinkClicksAnalyticsProps) => {
  const [linkClicks, setLinkClicks] = useState<LinkClick[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topLinks, setTopLinks] = useState<{ url: string; count: number }[]>([]);

  useEffect(() => {
    const fetchLinkClicks = async () => {
      try {
        setLoading(true);
        
        // Calculate date range
        const endDate = new Date().toISOString();
        const startDate = subDays(new Date(), days).toISOString();
        
        // Fetch link clicks for the date range
        const { data, error } = await linkTrackingService.getLinkClickAnalytics(startDate, endDate);
        
        if (error) {
          setError('Failed to load link click data');
          return;
        }
        
        setLinkClicks(data || []);
        
        // Get top clicked links
        const { data: topLinksData } = await linkTrackingService.getMostClickedLinks(10);
        if (topLinksData) {
          setTopLinks(topLinksData);
        }
      } catch (err) {
        setError('An error occurred while fetching link click data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLinkClicks();
  }, [days]);
  
  // Prepare chart data - group by day
  const chartData = linkClicks.reduce((acc, click) => {
    const day = format(new Date(click.clicked_at), 'MMM dd');
    
    const existingDay = acc.find(item => item.day === day);
    if (existingDay) {
      existingDay.clicks += 1;
    } else {
      acc.push({ day, clicks: 1 });
    }
    
    return acc;
  }, [] as { day: string; clicks: number }[]);
  
  // Sort chart data by date
  chartData.sort((a, b) => {
    return new Date(a.day).getTime() - new Date(b.day).getTime();
  });
  
  // Format URLs for display
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname}`;
    } catch (e) {
      return url;
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Link Clicks Analytics</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Link Clicks Analytics</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Link Clicks Analytics</h2>
      
      {linkClicks.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p>No link click data available for the selected period. Once users start clicking on links, data will appear here.</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Clicks Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicks" fill="#3B82F6" name="Link Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Top Clicked Links</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topLinks.map((link, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          title={link.url}
                        >
                          {formatUrl(link.url)}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Total clicks in the last {days} days: {linkClicks.length}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default LinkClicksAnalytics;

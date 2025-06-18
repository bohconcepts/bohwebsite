import { useState, useEffect } from 'react';
import { linkTrackingService } from '@/integrations/supabase/services/linkTrackingService';
import { LinkClick } from '@/integrations/supabase/types/link-clicks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface LinkClicksAnalyticsProps {
  days?: number;
}

type FilterPeriod = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export const LinkClicksAnalytics = ({ days = 30 }: LinkClicksAnalyticsProps) => {
  const [linkClicks, setLinkClicks] = useState<LinkClick[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topLinks, setTopLinks] = useState<{ url: string; count: number }[]>([]);
  
  // Filter state
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('month');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), days));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Update date range when filter changes
  useEffect(() => {
    let start: Date;
    let end = new Date();
    
    switch (filterPeriod) {
      case 'week':
        start = subDays(new Date(), 7);
        break;
      case 'month':
        start = subDays(new Date(), 30);
        break;
      case 'quarter':
        start = subMonths(new Date(), 3);
        break;
      case 'year':
        start = subMonths(new Date(), 12);
        break;
      case 'custom':
        // Use the selected month and year
        start = startOfMonth(new Date(selectedYear, selectedMonth));
        end = endOfMonth(new Date(selectedYear, selectedMonth));
        break;
      default:
        start = subDays(new Date(), 30);
    }
    
    setStartDate(start);
    setEndDate(end);
  }, [filterPeriod, selectedMonth, selectedYear]);
  
  // Fetch data when date range changes
  useEffect(() => {
    const fetchLinkClicks = async () => {
      try {
        setLoading(true);
        
        // Convert dates to ISO strings
        const endDateStr = endDate.toISOString();
        const startDateStr = startDate.toISOString();
        
        // Fetch link clicks for the date range
        const { data, error } = await linkTrackingService.getLinkClickAnalytics(startDateStr, endDateStr);
        
        if (error) {
          setError('Failed to load link click data');
          return;
        }
        
        setLinkClicks(data || []);
        
        // Get top clicked links for the date range
        const { data: topLinksData } = await linkTrackingService.getMostClickedLinks(10, startDateStr, endDateStr);
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
  }, [startDate, endDate]);
  
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
  
  // Generate months for dropdown
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate years for dropdown (last 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  // Format the date range for display
  const formatDateRange = () => {
    if (filterPeriod === 'custom') {
      return `${months[selectedMonth]} ${selectedYear}`;
    } else {
      return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
    }
  };
  
  // Prepare data for top links bar chart
  const topLinksChartData = topLinks.slice(0, 10).map(link => ({
    url: formatUrl(link.url),
    clicks: link.count,
    fullUrl: link.url
  }));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold">Link Clicks Analytics</h2>
        
        <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
          {/* Time period filters */}
          <div className="flex space-x-1">
            <button 
              onClick={() => setFilterPeriod('week')} 
              className={`px-3 py-1 text-sm rounded-md ${filterPeriod === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setFilterPeriod('month')} 
              className={`px-3 py-1 text-sm rounded-md ${filterPeriod === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setFilterPeriod('quarter')} 
              className={`px-3 py-1 text-sm rounded-md ${filterPeriod === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Quarter
            </button>
            <button 
              onClick={() => setFilterPeriod('year')} 
              className={`px-3 py-1 text-sm rounded-md ${filterPeriod === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Year
            </button>
            <button 
              onClick={() => setFilterPeriod('custom')} 
              className={`px-3 py-1 text-sm rounded-md ${filterPeriod === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Custom
            </button>
          </div>
          
          {/* Custom date selectors */}
          {filterPeriod === 'custom' && (
            <div className="flex space-x-2 mt-2 md:mt-0">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
                aria-label="Select month"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
                aria-label="Select year"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        Showing data for: <span className="font-medium">{formatDateRange()}</span>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : linkClicks.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p>No link click data available for the selected period. Once users start clicking on links, data will appear here.</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
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
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Top Clicked Links</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topLinksChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="url" 
                    width={90}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value} clicks`, 'Clicks']}
                    labelFormatter={(label: string) => `URL: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="clicks" 
                    fill="#4F46E5" 
                    name="Clicks"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Detailed Link Click Data</h3>
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
            <p>Total clicks in selected period: {linkClicks.length}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default LinkClicksAnalytics;

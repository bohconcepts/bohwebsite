import { useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimePeriod } from '@/integrations/supabase/services/dashboardService';

// Props for the UserGrowthChart component
interface UserGrowthChartProps {
  data: { date: string; count: number }[];
  isLoading?: boolean;
  onPeriodChange?: (period: TimePeriod) => void;
}

// Props for the MessageStatsChart component
interface MessageStatsChartProps {
  data: { date: string; received: number; read: number }[];
  isLoading?: boolean;
  onPeriodChange?: (period: TimePeriod) => void;
}

// Chart loading skeleton
const ChartSkeleton = () => (
  <div className="w-full h-[300px] bg-gray-100 rounded-md animate-pulse flex items-center justify-center">
    <p className="text-gray-400">Loading chart data...</p>
  </div>
);

// User Growth Chart Component
export const UserGrowthChart = ({ 
  data, 
  isLoading = false,
  onPeriodChange 
}: UserGrowthChartProps) => {
  const [period, setPeriod] = useState<TimePeriod>('month');

  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">User Growth</CardTitle>
          <Tabs defaultValue={period} onValueChange={(value) => handlePeriodChange(value as TimePeriod)}>
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="day" className="text-xs">Day</TabsTrigger>
              <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
              <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="count" 
                name="New Users" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

// Message Statistics Chart Component
export const MessageStatsChart = ({ 
  data, 
  isLoading = false,
  onPeriodChange 
}: MessageStatsChartProps) => {
  const [period, setPeriod] = useState<TimePeriod>('month');

  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Message Activity</CardTitle>
          <Tabs defaultValue={period} onValueChange={(value) => handlePeriodChange(value as TimePeriod)}>
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="day" className="text-xs">Day</TabsTrigger>
              <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
              <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="received" name="Messages Received" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="read" name="Messages Read" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

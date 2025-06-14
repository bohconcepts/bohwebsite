import { Mail, Users, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardStats } from '@/integrations/supabase/services/dashboardService';

interface StatsCardsProps {
  stats: Partial<DashboardStats>;
  isLoading?: boolean;
  onCardClick?: (cardType: string) => void;
}

export const StatsCards = ({ stats, isLoading = false, onCardClick }: StatsCardsProps) => {
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="bg-gray-200 p-2 rounded-full animate-pulse">
                <div className="h-5 w-5"></div>
              </div>
            </div>
            <div className="h-8 w-16 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-2 w-full bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  // If loading, show skeleton
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  // Calculate percentages for progress bars
  const unreadPercentage = stats.totalMessages ? (stats.unreadMessages! / stats.totalMessages! * 100) : 0;
  const activeUserPercentage = stats.totalUsers ? (stats.activeUsers! / stats.totalUsers! * 100) : 0;
  
  // Handle card click
  const handleClick = (cardType: string) => {
    if (onCardClick) {
      onCardClick(cardType);
    }
  };
  
  // Otherwise show actual stats
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Messages Card */}
      <Card 
        className="border-none shadow-md transition-all hover:shadow-lg cursor-pointer" 
        onClick={() => handleClick('messages')}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">Messages</p>
            <div className="bg-blue-100 p-2 rounded-full">
              <Mail className="h-5 w-5 text-brand-blue" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalMessages || 0}</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Unread: {stats.unreadMessages || 0}</span>
              <span>{Math.round(unreadPercentage)}%</span>
            </div>
            <Progress value={unreadPercentage} className="h-1" />
          </div>
        </CardContent>
      </Card>
      
      {/* Users Card */}
      <Card 
        className="border-none shadow-md transition-all hover:shadow-lg cursor-pointer" 
        onClick={() => handleClick('users')}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">Users</p>
            <div className="bg-purple-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Active: {stats.activeUsers || 0}</span>
              <span>{Math.round(activeUserPercentage)}%</span>
            </div>
            <Progress value={activeUserPercentage} className="h-1" />
          </div>
        </CardContent>
      </Card>
      
      {/* Response Time Card */}
      <Card 
        className="border-none shadow-md transition-all hover:shadow-lg cursor-pointer" 
        onClick={() => handleClick('response')}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">Avg. Response Time</p>
            <div className="bg-amber-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-bold">{stats.averageResponseTime || 0}</p>
            <p className="text-sm text-gray-500 mb-1">hours</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Target: 24 hours</p>
        </CardContent>
      </Card>
      
      {/* Conversion Rate Card */}
      <Card 
        className="border-none shadow-md transition-all hover:shadow-lg cursor-pointer" 
        onClick={() => handleClick('conversion')}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-bold">{stats.conversionRate || 0}</p>
            <p className="text-sm text-gray-500 mb-1">%</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((stats.conversionRate || 0) > 10) ? 'Above target' : 'Below target'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

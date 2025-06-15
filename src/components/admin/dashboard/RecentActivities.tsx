import { Activity } from '@/integrations/supabase/services/dashboardService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, MessageSquare, Settings, Archive, 
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';

interface RecentActivitiesProps {
  activities: Activity[];
  isLoading?: boolean;
  maxItems?: number;
}

// Activity icon mapping
const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'user_created':
    case 'user_updated':
      return <User className="h-4 w-4" />;
    case 'message_received':
      return <MessageSquare className="h-4 w-4" />;
    case 'message_read':
      return <CheckCircle className="h-4 w-4" />;
    case 'message_archived':
      return <Archive className="h-4 w-4" />;
    case 'settings_updated':
      return <Settings className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

// Activity color mapping
const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'user_created':
      return 'bg-green-100 text-green-600';
    case 'user_updated':
      return 'bg-blue-100 text-blue-600';
    case 'message_received':
      return 'bg-purple-100 text-purple-600';
    case 'message_read':
      return 'bg-cyan-100 text-cyan-600';
    case 'message_archived':
      return 'bg-gray-100 text-gray-600';
    case 'settings_updated':
      return 'bg-amber-100 text-amber-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// Format date to relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const RecentActivities = ({ 
  activities, 
  isLoading = false,
  maxItems = 5
}: RecentActivitiesProps) => {
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array(maxItems).fill(0).map((_, index) => (
        <div key={index} className="flex items-start gap-3 border-b pb-3">
          <div className="rounded-full h-8 w-8 bg-gray-200 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
  
  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
      <h3 className="text-lg font-medium text-gray-900">No recent activity</h3>
      <p className="text-sm text-gray-500 max-w-sm">
        When there is activity in your admin panel, it will appear here.
      </p>
    </div>
  );
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : activities.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {activities.slice(0, maxItems).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

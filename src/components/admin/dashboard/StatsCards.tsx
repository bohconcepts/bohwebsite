import { Mail, EyeOff, Archive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  stats: {
    total: number;
    unread: number;
    archived: number;
  };
  isLoading?: boolean;
}

export const StatsCards = ({ stats, isLoading = false }: StatsCardsProps) => {
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((item) => (
        <Card key={item} className="border-none shadow-md">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-12 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="bg-gray-200 p-3 rounded-full animate-pulse">
              <div className="h-6 w-6"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  // If loading, show skeleton
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  // Otherwise show actual stats
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-none shadow-md">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Messages</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Mail className="h-6 w-6 text-brand-blue" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Unread Messages</p>
            <p className="text-2xl font-bold">{stats.unread}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <EyeOff className="h-6 w-6 text-brand-orange" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Archived Messages</p>
            <p className="text-2xl font-bold">{stats.archived}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <Archive className="h-6 w-6 text-gray-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { adminService } from "@/integrations/supabase/services/adminService";
import { dashboardService, TimePeriod, Activity } from "@/integrations/supabase/services/dashboardService";
import { useCompanyInfo } from "@/hooks/useLocalizedConstants";
import AdminLayout from "@/components/layout/AdminLayout";
import { StatsCards, UserGrowthChart, MessageStatsChart, RecentActivities } from "@/components/admin/dashboard";

const AdminDashboard = () => {
  const companyInfo = useCompanyInfo();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    archivedMessages: 0,
    totalUsers: 0,
    activeUsers: 0,
    recentActivities: [] as Activity[],
    conversionRate: 0,
    averageResponseTime: 0
  });
  const [userGrowthData, setUserGrowthData] = useState<{ date: string; count: number }[]>([]);
  const [messageStatsData, setMessageStatsData] = useState<{ date: string; received: number; read: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userGrowthPeriod, setUserGrowthPeriod] = useState<TimePeriod>('month');
  const [messageStatsPeriod, setMessageStatsPeriod] = useState<TimePeriod>('month');

  // Check authentication
  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
    } else {
      loadDashboardData();
    }
  }, [navigate]);

  // Load all dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log('Loading dashboard data...');
      
      // Load dashboard stats
      const stats = await dashboardService.getStats();
      console.log('Dashboard stats loaded:', stats);
      setDashboardStats(stats);
      
      // Load user growth data
      const growthData = await dashboardService.getUserGrowth(userGrowthPeriod);
      console.log('User growth data loaded:', growthData);
      setUserGrowthData(growthData);
      
      // Load message stats data
      const msgStatsData = await dashboardService.getMessageStats(messageStatsPeriod);
      console.log('Message stats data loaded:', msgStatsData);
      setMessageStatsData(msgStatsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle period change for user growth chart
  const handleUserGrowthPeriodChange = async (period: TimePeriod) => {
    setUserGrowthPeriod(period);
    try {
      const data = await dashboardService.getUserGrowth(period);
      setUserGrowthData(data);
    } catch (error) {
      console.error('Error loading user growth data:', error);
    }
  };
  
  // Handle period change for message stats chart
  const handleMessageStatsPeriodChange = async (period: TimePeriod) => {
    setMessageStatsPeriod(period);
    try {
      const data = await dashboardService.getMessageStats(period);
      setMessageStatsData(data);
    } catch (error) {
      console.error('Error loading message stats data:', error);
    }
  };
  
  // Handle stats card click
  const handleStatsCardClick = (cardType: string) => {
    switch (cardType) {
      case 'messages':
        navigate('/admin/messages');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      // Other card types can be handled here
      default:
        break;
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Admin Dashboard | ${companyInfo.name}`}</title>
      </Helmet>

      <AdminLayout title="Admin Dashboard">
        {/* Stats Cards */}
        <StatsCards 
          stats={dashboardStats} 
          isLoading={isLoading} 
          onCardClick={handleStatsCardClick}
        />

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserGrowthChart 
            data={userGrowthData} 
            isLoading={isLoading} 
            onPeriodChange={handleUserGrowthPeriodChange}
          />
          
          <MessageStatsChart 
            data={messageStatsData} 
            isLoading={isLoading} 
            onPeriodChange={handleMessageStatsPeriodChange}
          />
        </div>
        
        {/* Dashboard Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/admin/messages" className="block">
                <div className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                  <p className="font-medium">View Messages</p>
                  <p className="text-sm text-gray-500">
                    Check your inbox for new messages
                  </p>
                </div>
              </Link>
              <Link to="/admin/users" className="block">
                <div className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-gray-500">
                    Add, edit, or remove user accounts
                  </p>
                </div>
              </Link>
              <Link to="/admin/settings" className="block">
                <div className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                  <p className="font-medium">System Settings</p>
                  <p className="text-sm text-gray-500">
                    Configure application settings
                  </p>
                </div>
              </Link>
              <Link to="/admin/partnership-requests" className="block">
                <div className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                  <p className="font-medium">Partnership Requests</p>
                  <p className="text-sm text-gray-500">
                    Manage partnership inquiries
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <RecentActivities 
              activities={dashboardStats.recentActivities || []} 
              isLoading={isLoading}
              maxItems={8}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;

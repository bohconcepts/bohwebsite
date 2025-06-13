import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { adminService } from "@/integrations/supabase/services/adminService";
import { useCompanyInfo } from "@/hooks/useLocalizedConstants";
import AdminLayout from "@/components/layout/AdminLayout";
import { StatsCards } from "@/components/admin/dashboard";

const AdminDashboard = () => {
  const companyInfo = useCompanyInfo();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, unread: 0, archived: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
    } else {
      loadStats();
    }
  }, [navigate]);

  // Load dashboard stats
  const loadStats = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setStats(adminService.getStats());
      setIsLoading(false);
    }, 600);
  };

  return (
    <>
      <Helmet>
        <title>{`Admin Dashboard | ${companyInfo.name}`}</title>
      </Helmet>

      <AdminLayout title="Admin Dashboard">
        {/* Stats Cards */}
        <StatsCards stats={stats} isLoading={isLoading} />

        {/* Dashboard Content */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                <p>New user registration</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
                <p>System settings updated</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">May 30, 2:15 PM</p>
                <p>New message received</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;

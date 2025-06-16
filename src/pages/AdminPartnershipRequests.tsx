import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { adminService } from "@/integrations/supabase/services/adminService";
import { useCompanyInfo } from "@/hooks/useLocalizedConstants";
import AdminLayout from "@/components/layout/AdminLayout";
import { PartnershipRequestsManager } from "@/components/admin/PartnershipRequestsManager";

const AdminPartnershipRequests = () => {
  const companyInfo = useCompanyInfo();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>{`Partnership Requests | ${companyInfo.name} Admin`}</title>
      </Helmet>

      <AdminLayout title="Partnership Requests">
        <PartnershipRequestsManager />
      </AdminLayout>
    </>
  );
};

export default AdminPartnershipRequests;

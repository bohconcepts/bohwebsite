import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  adminService,
  Message,
} from "@/integrations/supabase/services/adminService";
import { useCompanyInfo } from "@/hooks/useLocalizedConstants";
import AdminLayout from "@/components/layout/AdminLayout";
import { MessageManagement } from "@/components/admin/dashboard";

const AdminMessages = () => {
  const companyInfo = useCompanyInfo();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, archived: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
    } else {
      loadMessages();
    }
  }, [navigate]);

  // Load messages and stats
  const loadMessages = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const allMessages = adminService.getMessages();
      setMessages(allMessages);
      setStats(adminService.getStats());
      setIsLoading(false);
    }, 600);
  };

  // Message actions
  const handleMarkAsRead = (id: string) => {
    adminService.markAsRead(id);
    loadMessages();
  };

  const handleMarkAsUnread = (id: string) => {
    adminService.markAsUnread(id);
    loadMessages();
  };

  const handleArchive = (id: string) => {
    adminService.archiveMessage(id);
    loadMessages();
  };

  const handleRestore = (id: string) => {
    adminService.restoreMessage(id);
    loadMessages();
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this message? This action cannot be undone."
      )
    ) {
      adminService.deleteMessage(id);
      loadMessages();
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Messages | ${companyInfo.name} Admin`}</title>
      </Helmet>

      <AdminLayout title="Message Management">
        {/* Messages Section */}
        <MessageManagement
          messages={messages}
          stats={stats}
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAsUnread={handleMarkAsUnread}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onDelete={handleDelete}
          onRefresh={loadMessages}
          formatDate={formatDate}
        />
      </AdminLayout>
    </>
  );
};

export default AdminMessages;

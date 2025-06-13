import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  MessageSquare,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { adminService } from "@/integrations/supabase/services/adminService";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    adminService.logout();
    navigate("/admin/login");
  };

  // Navigation state and items
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      active: currentPath === "/admin/dashboard",
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      active: currentPath === "/admin/messages",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      active: currentPath === "/admin/users",
    },
    {
      name: "Content",
      href: "/admin/content",
      icon: FileText,
      disabled: true,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      active: currentPath === "/admin/settings",
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`bg-brand-blue text-white fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex-shrink-0 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div
            className={`flex items-center justify-between h-16 px-4 border-b border-white/10 ${
              sidebarOpen ? "px-6" : "px-2 justify-center"
            }`}
          >
            {sidebarOpen ? (
              <div className="flex items-center">
                <MessageSquare className="h-6 w-6 text-brand-orange" />
                <span className="ml-2 text-lg font-semibold">Admin Panel</span>
              </div>
            ) : (
              <MessageSquare className="h-6 w-6 text-brand-orange" />
            )}

            <button
              onClick={toggleSidebar}
              className="text-white/70 hover:text-white lg:block hidden"
            >
              <ChevronRight
                className={`h-5 w-5 transition-transform duration-300 ${
                  sidebarOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {navigationItems.map((item) => {
                const isActive = item.active;
                return (
                  <Link
                    key={item.name}
                    to={item.disabled ? "#" : item.href}
                    className={`group flex items-center ${
                      sidebarOpen ? "px-3" : "px-2 justify-center"
                    } py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <item.icon
                      className={`${sidebarOpen ? "mr-3" : "mr-0"} h-5 w-5 ${
                        isActive
                          ? "text-brand-orange"
                          : "text-white/70 group-hover:text-white"
                      }`}
                    />
                    {sidebarOpen && <span>{item.name}</span>}
                    {sidebarOpen && item.disabled && (
                      <span className="ml-auto text-xs text-white/50">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div
            className={`p-4 border-t border-white/10 ${
              sidebarOpen ? "px-6" : "px-2 text-center"
            }`}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 px-4 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <LogOut className={`h-5 w-5 ${sidebarOpen ? "mr-2" : "mr-0"}`} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-3 lg:ml-0 text-xl font-bold text-gray-900">
                {title}
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4 text-center text-sm">
          <div className="container mx-auto">
            <p>Admin Panel &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService } from "@/integrations/supabase/services/adminService";
import { useCompanyInfo } from "@/hooks/useLocalizedConstants";

const AdminLogin = () => {
  const companyInfo = useCompanyInfo();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (adminService.isAuthenticated()) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate network delay
    setTimeout(() => {
      const success = adminService.login(
        credentials.username,
        credentials.password
      );
      setIsLoading(false);

      if (success) {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid username or password");
      }
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>{`Admin Login | ${companyInfo.name}`}</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="shadow-xl border-none">
            <CardHeader className="text-center bg-brand-blue text-white rounded-t-lg">
              <div className="mx-auto mb-4 bg-white/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <Lock className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={credentials.username}
                    onChange={handleChange}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LogIn size={18} className="mr-2" />
                      Login
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Default credentials: admin / admin123</p>
                <p className="mt-2">
                  <a href="/" className="text-brand-blue hover:underline">
                    Return to Website
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;

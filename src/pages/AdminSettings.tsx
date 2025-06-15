import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import {
  Save,
  User,
  Moon,
  Sun,
  Monitor,
  Languages,
  Lock,
  AlertTriangle,
} from "lucide-react";
import {
  adminService,
  Settings,
} from "@/integrations/supabase/services/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import AdminLayout from "@/components/layout/AdminLayout";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  // Check authentication
  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    
    // Load settings
    loadSettings();
    
    // Get current user safely
    const user = adminService.getCurrentUser();
    
    if (user) {
      setCurrentUser(user);
    } else {
      // If getCurrentUser returns null, try to get the current user from Supabase
      console.log('Getting current user from Supabase auth');
      
      // Use the current authenticated user from Supabase
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          // Get profile data
          supabase.from('profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile) {
                // Create a user object from profile data
                const userData = {
                  id: profile.id,
                  username: profile.email,
                  fullName: profile.full_name,
                  email: profile.email,
                  role: profile.role === 'admin' ? 'Administrator' : 
                        profile.role === 'operator' ? 'Editor' : 'Viewer',
                  active: profile.is_active,
                  createdAt: new Date(profile.created_at)
                };
                
                setCurrentUser(userData);
                console.log('Set current user from Supabase profile:', userData);
              } else {
                console.error('No profile found for current user');
                navigate("/admin/login");
              }
            });
        } else {
          console.error('No authenticated user found');
          navigate("/admin/login");
        }
      });
    }
  }, [navigate]);

  // Load settings
  const loadSettings = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const appSettings = adminService.getSettings();
      setSettings(appSettings);
      setIsLoading(false);
    }, 600);
  };

  // Handle settings change
  const handleSettingChange = (key: keyof Settings, value: any) => {
    if (!settings) return;

    setSettings({
      ...settings,
      [key]: value,
    });
  };

  // Save settings
  const saveSettings = () => {
    if (!settings) return;

    setIsSaving(true);

    // Simulate network delay
    setTimeout(() => {
      adminService.updateSettings(settings);
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    }, 800);
  };

  // Validate password
  const validatePassword = () => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Change password
  const changePassword = () => {
    if (!validatePassword() || !currentUser) return;

    const success = adminService.changePassword(
      currentUser.id,
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (success) {
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
    } else {
      setPasswordErrors({
        currentPassword: "Current password is incorrect",
        ...passwordErrors,
      });
    }
  };

  if (isLoading || !settings) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings | Admin Panel</title>
      </Helmet>

      <AdminLayout title="Settings">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general settings for the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) =>
                      handleSettingChange("siteName", e.target.value)
                    }
                  />
                  <p className="text-sm text-gray-500">
                    This name will be displayed in the browser tab and various
                    places in the admin panel.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      handleSettingChange("contactEmail", e.target.value)
                    }
                  />
                  <p className="text-sm text-gray-500">
                    This email will be used for system notifications and as a
                    reply-to address.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messageRetention">
                    Message Retention (Days)
                  </Label>
                  <Input
                    id="messageRetention"
                    type="number"
                    min="1"
                    max="365"
                    value={settings.messageRetentionDays}
                    onChange={(e) =>
                      handleSettingChange(
                        "messageRetentionDays",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <p className="text-sm text-gray-500">
                    Number of days to keep messages before they are
                    automatically deleted.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoArchive"
                    checked={settings.autoArchiveMessages}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoArchiveMessages", checked)
                    }
                  />
                  <Label htmlFor="autoArchive">Auto-archive old messages</Label>
                </div>

                <Separator />

                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentUser && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="bg-brand-blue rounded-full p-3">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">
                            {currentUser.fullName}
                          </h3>
                          <p className="text-gray-500">{currentUser.email}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                              {currentUser.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Security</h3>

                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Password</h4>
                          <p className="text-sm text-gray-500">
                            Change your account password
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setShowPasswordDialog(true)}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Session</h4>
                          <p className="text-sm text-gray-500">
                            End all active sessions and sign out from all
                            devices
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            adminService.logout();
                            navigate("/admin/login");
                          }}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Sign Out Everywhere
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.notificationsEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("notificationsEnabled", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-medium">Notification Types</h3>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="newMessage" className="flex-grow">
                        New message notifications
                      </Label>
                      <Switch
                        id="newMessage"
                        checked={true}
                        disabled={!settings.notificationsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="userActivity" className="flex-grow">
                        User activity notifications
                      </Label>
                      <Switch
                        id="userActivity"
                        checked={false}
                        disabled={!settings.notificationsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="systemUpdates" className="flex-grow">
                        System updates
                      </Label>
                      <Switch
                        id="systemUpdates"
                        checked={true}
                        disabled={!settings.notificationsEnabled}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Theme</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        settings.theme === "light"
                          ? "border-brand-blue bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSettingChange("theme", "light")}
                    >
                      <div className="flex justify-center mb-2">
                        <Sun className="h-8 w-8 text-orange-400" />
                      </div>
                      <p className="text-center font-medium">Light</p>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        settings.theme === "dark"
                          ? "border-brand-blue bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSettingChange("theme", "dark")}
                    >
                      <div className="flex justify-center mb-2">
                        <Moon className="h-8 w-8 text-indigo-600" />
                      </div>
                      <p className="text-center font-medium">Dark</p>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        settings.theme === "system"
                          ? "border-brand-blue bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSettingChange("theme", "system")}
                    >
                      <div className="flex justify-center mb-2">
                        <Monitor className="h-8 w-8 text-gray-600" />
                      </div>
                      <p className="text-center font-medium">System</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Language</h3>

                  <div className="flex items-center space-x-4">
                    <Languages className="h-5 w-5 text-gray-500" />
                    <Select
                      value={settings.language}
                      onValueChange={(value: "en" | "es") =>
                        handleSettingChange("language", value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Change Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and a new password to update your
                credentials.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPasswordDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={changePassword}>Update Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </AdminLayout>
    </>
  );
};

export default AdminSettings;

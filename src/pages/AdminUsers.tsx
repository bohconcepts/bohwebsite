import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import {
  Users as UsersIcon,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  X,
  RefreshCw,
  Shield,
  Eye,
  PenSquare,
} from "lucide-react";

import {
  adminService,
  User,
} from "@/integrations/supabase/services/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/components/layout/AdminLayout";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: "Viewer" as "Administrator" | "Editor" | "Viewer",
    active: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Check authentication
  useEffect(() => {
    if (!adminService.isAuthenticated()) {
      navigate("/admin/login");
    } else {
      loadUsers();
    }
  }, [navigate]);

  // Load users
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Get users from Supabase
      const allUsers = await adminService.getUsers();
      console.log('Loaded users:', allUsers); // Debug log
      
      // Ensure we have an array
      const usersArray = Array.isArray(allUsers) ? allUsers : [];
      
      setUsers(usersArray);
      applyFilters(usersArray, searchQuery, roleFilter, statusFilter);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  const applyFilters = (
    userList: User[],
    query: string,
    role: string,
    status: string
  ) => {
    let filtered = [...userList];

    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerQuery) ||
          user.fullName.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply role filter
    if (role !== "all") {
      filtered = filtered.filter((user) => user.role === role);
    }

    // Apply status filter
    if (status !== "all") {
      const isActive = status === "active";
      filtered = filtered.filter((user) => user.active === isActive);
    }

    setFilteredUsers(filtered);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(users, query, roleFilter, statusFilter);
  };

  // Handle role filter
  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    applyFilters(users, searchQuery, value, statusFilter);
  };

  // Handle status filter
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(users, searchQuery, roleFilter, value);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    applyFilters(users, "", "all", "all");
  };

  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Validate form
  const validateForm = (data: typeof newUser) => {
    const errors: Record<string, string> = {};

    if (!data.username.trim()) {
      errors.username = "Username is required";
    } else if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!showEditUserDialog && !data.password.trim()) {
      errors.password = "Password is required";
    } else if (!showEditUserDialog && data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!data.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add user
  const handleAddUser = () => {
    if (!validateForm(newUser)) return;

    adminService.addUser(newUser);
    loadUsers();
    setShowAddUserDialog(false);
    setNewUser({
      username: "",
      password: "",
      fullName: "",
      email: "",
      role: "Viewer" as "Administrator" | "Editor" | "Viewer",
      active: true,
    });
    setFormErrors({});
  };

  // Handle edit user
  const handleEditUser = () => {
    if (!currentUser || !validateForm({ ...currentUser, password: "dummy" }))
      return;

    adminService.updateUser(currentUser.id, currentUser);
    loadUsers();
    setShowEditUserDialog(false);
    setCurrentUser(null);
    setFormErrors({});
  };

  // Handle delete user
  const handleDeleteUser = () => {
    if (!currentUser) return;

    adminService.deleteUser(currentUser.id);
    loadUsers();
    setShowDeleteDialog(false);
    setCurrentUser(null);
  };

  // Handle toggle user status
  const handleToggleStatus = (user: User) => {
    adminService.updateUser(user.id, { active: !user.active });
    loadUsers();
  };

  // Role badge color
  const getRoleBadgeColor = (role: "Administrator" | "Editor" | "Viewer") => {
    switch (role) {
      case "Administrator":
        return "bg-red-500";
      case "Editor":
        return "bg-blue-500";
      case "Viewer":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <Helmet>
        <title>User Management | Admin Panel</title>
      </Helmet>

      <AdminLayout title="User Management">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-none shadow-md">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UsersIcon className="h-6 w-6 text-brand-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold">
                  {users.filter((user) => user.active).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>User Management</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowAddUserDialog(true)}
                  className="bg-brand-blue hover:bg-brand-blue/90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-3"
                    onClick={() => {
                      setSearchQuery("");
                      applyFilters(users, "", roleFilter, statusFilter);
                    }}
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={handleRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetFilters}
                  title="Reset filters"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Users Table */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <UsersIcon className="h-12 w-12 mb-2 text-gray-300" />
                <p>No users found</p>
                {(searchQuery ||
                  roleFilter !== "all" ||
                  statusFilter !== "all") && (
                  <Button
                    variant="ghost"
                    className="mt-2 text-brand-blue"
                    onClick={resetFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              @{user.username}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.active ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-gray-500 border-gray-300"
                            >
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(user)}
                              title={
                                user.active
                                  ? "Deactivate user"
                                  : "Activate user"
                              }
                            >
                              {user.active ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentUser(user);
                                setShowEditUserDialog(true);
                              }}
                              title="Edit user"
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentUser(user);
                                setShowDeleteDialog(true);
                              }}
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with appropriate permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
                {formErrors.username && (
                  <p className="text-sm text-red-500">{formErrors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                />
                {formErrors.fullName && (
                  <p className="text-sm text-red-500">{formErrors.fullName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(
                    value: "Administrator" | "Editor" | "Viewer"
                  ) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-red-500" />
                        Administrator
                      </div>
                    </SelectItem>
                    <SelectItem value="Editor">
                      <div className="flex items-center">
                        <PenSquare className="h-4 w-4 mr-2 text-blue-500" />
                        Editor
                      </div>
                    </SelectItem>
                    <SelectItem value="Viewer">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-green-500" />
                        Viewer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newUser.active}
                  onCheckedChange={(checked) =>
                    setNewUser({ ...newUser, active: checked })
                  }
                />
                <Label htmlFor="active">Active Account</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddUserDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user account details and permissions.
              </DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    placeholder="username"
                    value={currentUser.username}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        username: e.target.value,
                      })
                    }
                  />
                  {formErrors.username && (
                    <p className="text-sm text-red-500">
                      {formErrors.username}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Full Name</Label>
                  <Input
                    id="edit-fullName"
                    placeholder="John Doe"
                    value={currentUser.fullName}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        fullName: e.target.value,
                      })
                    }
                  />
                  {formErrors.fullName && (
                    <p className="text-sm text-red-500">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="john@example.com"
                    value={currentUser.email}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, email: e.target.value })
                    }
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={currentUser.role}
                    onValueChange={(
                      value: "Administrator" | "Editor" | "Viewer"
                    ) => setCurrentUser({ ...currentUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-red-500" />
                          Administrator
                        </div>
                      </SelectItem>
                      <SelectItem value="Editor">
                        <div className="flex items-center">
                          <PenSquare className="h-4 w-4 mr-2 text-blue-500" />
                          Editor
                        </div>
                      </SelectItem>
                      <SelectItem value="Viewer">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-green-500" />
                          Viewer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={currentUser.active}
                    onCheckedChange={(checked) =>
                      setCurrentUser({ ...currentUser, active: checked })
                    }
                  />
                  <Label htmlFor="edit-active">Active Account</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditUserDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="py-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="font-medium">{currentUser.fullName}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                  <p className="text-xs text-gray-400">
                    @{currentUser.username}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </>
  );
};

export default AdminUsers;

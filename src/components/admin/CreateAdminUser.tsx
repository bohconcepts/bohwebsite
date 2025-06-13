import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { adminService } from '@/integrations/supabase/services/adminService';
import { toast } from '@/components/ui/use-toast';

const CreateAdminUser: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Creating admin user with:', { 
        email: formData.email, 
        passwordLength: formData.password?.length || 0,
        fullName: formData.fullName
      });
      
      const success = await adminService.createAdminUser(
        formData.email, 
        formData.password,
        formData.fullName
      );
      
      if (success) {
        toast({
          title: "Admin User Created",
          description: "The admin user was created successfully!",
        });
        // Clear the form
        setFormData({
          email: '',
          password: '',
          fullName: '',
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create admin user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Admin User</CardTitle>
        <CardDescription>Create a new admin user with full access to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Admin User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAdminUser;

import React from 'react';
import CreateAdminUser from '@/components/admin/CreateAdminUser';
import { Toaster } from '@/components/ui/toaster';

const AdminSetup: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Setup</h1>
        <CreateAdminUser />
      </div>
      <Toaster />
    </div>
  );
};

export default AdminSetup;

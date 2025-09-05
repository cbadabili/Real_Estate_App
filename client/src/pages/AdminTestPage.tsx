
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AdminTestPage() {
  const { login, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loginAsAdmin = async () => {
    setIsLoading(true);
    try {
      await login('admin@beedab.com', 'admin123');
      toast({
        title: 'Success',
        description: 'Logged in as admin successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to login as admin',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testAdminAPI = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${user.id}`,
        },
      });

      if (response.ok) {
        const users = await response.json();
        toast({
          title: 'Success',
          description: `Admin API working! Found ${users.length} users`,
        });
      } else {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Admin API test failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Admin Functionality Test</CardTitle>
          <CardDescription>
            Test the admin panel functionality and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 1: Login as Admin</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Use the test admin credentials:
                </p>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm"><strong>Email:</strong> admin@beedab.com</p>
                  <p className="text-sm"><strong>Password:</strong> admin123</p>
                </div>
              </div>
              <Button 
                onClick={loginAsAdmin} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Logging in...' : 'Login as Test Admin'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">
                  ✅ Logged in as: {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-green-600">
                  Role: {user.role} | Type: {user.userType}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 2: Test Admin Features</h3>
                
                <Button onClick={testAdminAPI} className="w-full">
                  Test Admin API Access
                </Button>

                <Button 
                  onClick={() => window.open('/admin', '_blank')} 
                  className="w-full"
                  variant="outline"
                >
                  Open Admin Panel
                </Button>

                <div className="space-y-2">
                  <h4 className="font-medium">Manual Testing Checklist:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Navigate to /admin to access the admin dashboard</li>
                    <li>• Check Users tab for user management</li>
                    <li>• Check Reviews tab for content moderation</li>
                    <li>• Check Audit Log tab for system activity</li>
                    <li>• Check Statistics tab for dashboard metrics</li>
                    <li>• Test user verification/deactivation controls</li>
                    <li>• Test review approval/rejection functionality</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Test Regular User Access</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Try accessing /admin with a regular user account to verify access control
            </p>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <p><strong>Test User:</strong> buyer@test.com</p>
              <p><strong>Password:</strong> user123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

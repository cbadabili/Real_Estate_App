import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBasedComponent } from '@/components/auth/ProtectedRoute';

const AuthTestPage: React.FC = () => {
  const { user, login } = useAuth();
  const [testRole, setTestRole] = useState<string>('buyer');

  const testRoles = [
    'buyer',
    'seller', 
    'agent',
    'fsbo',
    'moderator',
    'admin',
    'super_admin'
  ];

  const handleRoleTest = async (role: string) => {
    // Simulate login with different roles for testing
    await login({
      email: `test-${role}@beedab.com`,
      password: 'test123',
      role: role,
      userType: role === 'agent' ? 'agent' : 'individual'
    });
    setTestRole(role);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Role-Based Authorization Test Page
          </h1>

          {/* Current User Info */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current User Status</h2>
            {user ? (
              <div>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>User Type:</strong> {user.userType}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            ) : (
              <p>Not logged in</p>
            )}
          </div>

          {/* Role Testing Buttons */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Different Roles</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {testRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleTest(role)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    testRole === role
                      ? 'bg-beedab-blue text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Authorization Test Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Sell Access Test */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">Sell Access</h3>
              <RoleBasedComponent 
                allowedRoles={['seller', 'agent', 'fsbo', 'admin', 'super_admin']}
                fallback={<p className="text-red-600">❌ No access</p>}
              >
                <p className="text-green-600">✅ Can access sell features</p>
              </RoleBasedComponent>
            </div>

            {/* Agent Only Features */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">Agent Features</h3>
              <RoleBasedComponent 
                allowedRoles={['agent', 'admin', 'super_admin']}
                fallback={<p className="text-red-600">❌ No access</p>}
              >
                <p className="text-green-600">✅ Agent listing access</p>
              </RoleBasedComponent>
            </div>

            {/* FSBO Features */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">FSBO Features</h3>
              <RoleBasedComponent 
                allowedRoles={['seller', 'fsbo', 'admin', 'super_admin']}
                fallback={<p className="text-red-600">❌ No access</p>}
              >
                <p className="text-green-600">✅ Direct seller access</p>
              </RoleBasedComponent>
            </div>

            {/* Moderator Access */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">Moderation</h3>
              <RoleBasedComponent 
                allowedRoles={['moderator', 'admin', 'super_admin']}
                fallback={<p className="text-red-600">❌ No access</p>}
              >
                <p className="text-green-600">✅ Moderation access</p>
              </RoleBasedComponent>
            </div>

            {/* Admin Only */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">Admin Panel</h3>
              <RoleBasedComponent 
                allowedRoles={['admin', 'super_admin']}
                fallback={<p className="text-red-600">❌ No access</p>}
              >
                <p className="text-green-600">✅ Admin panel access</p>
              </RoleBasedComponent>
            </div>

            {/* Super Admin Only */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">Super Admin</h3>
              <RoleBasedComponent 
                allowedRoles={['super_admin']}
                fallback={<p className="text-red-600">❌ No access</p>}
              >
                <p className="text-green-600">✅ Super admin access</p>
              </RoleBasedComponent>
            </div>

            {/* Service Provider Registration */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">Service Provider</h3>
              <RoleBasedComponent 
                allowedRoles={['agent', 'admin', 'super_admin']}
                fallback={<p className="text-red-600">❌ No access</p>}
              >
                <p className="text-green-600">✅ Can register as service provider</p>
              </RoleBasedComponent>
            </div>

            {/* Rent Out Property */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">Rent Out Property</h3>
              <RoleBasedComponent 
                allowedRoles={['seller', 'agent', 'fsbo', 'admin', 'super_admin']}
                fallback={<p className="text-red-600">❌ No access</p>}
              >
                <p className="text-green-600">✅ Can rent out property</p>
              </RoleBasedComponent>
            </div>

            {/* Review Management */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">Review Management</h3>
              <RoleBasedComponent 
                allowedRoles={['moderator', 'admin', 'super_admin']}
                fallback={<p className="text-red-600">❌ No access</p>}
              >
                <p className="text-green-600">✅ Can moderate reviews</p>
              </RoleBasedComponent>
            </div>
          </div>

          {/* Authorization Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Role Hierarchy Summary</h3>
            <div className="text-sm space-y-2">
              <p><strong>Buyer:</strong> Browse properties, view listings, contact sellers</p>
              <p><strong>Seller:</strong> Create listings, manage properties, rent out property</p>
              <p><strong>Agent:</strong> Professional listings, service provider registration, client management</p>
              <p><strong>FSBO:</strong> Direct seller features, property management</p>
              <p><strong>Moderator:</strong> Content moderation, review management</p>
              <p><strong>Admin:</strong> Platform administration, user management, system oversight</p>
              <p><strong>Super Admin:</strong> Full system access, configuration management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
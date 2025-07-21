
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType;
  gridSize?: 'small' | 'medium' | 'large';
}

interface BaseDashboardLayoutProps {
  userRole: 'agent' | 'fsbo' | 'landlord' | 'renter';
  userName: string;
  widgets: DashboardWidget[];
  quickActions?: React.ReactNode;
  sidebarItems?: Array<{ label: string; href: string; icon: React.ComponentType<any> }>;
}

const BaseDashboardLayout: React.FC<BaseDashboardLayoutProps> = ({
  userRole,
  userName,
  widgets,
  quickActions,
  sidebarItems = []
}) => {
  const roleDisplayName = {
    agent: 'Real Estate Agent',
    fsbo: 'FSBO Seller',
    landlord: 'Landlord',
    renter: 'Renter'
  }[userRole];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="BeeDab" className="h-8 w-auto" />
                <span className="ml-2 text-xl font-bold text-beedab-blue">BeeDab</span>
              </Link>
              <div className="ml-8">
                <h1 className="text-lg font-medium text-gray-900">{roleDisplayName} Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {userName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{userName}</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarItems.length > 0 && (
          <aside className="w-64 bg-white shadow-sm min-h-screen">
            <nav className="mt-8 px-4">
              <ul className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Quick Actions */}
          {quickActions && (
            <div className="mb-8">
              {quickActions}
            </div>
          )}

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.map((widget) => {
              const Component = widget.component;
              const gridSize = widget.gridSize || 'medium';
              const sizeClasses = {
                small: 'md:col-span-1',
                medium: 'md:col-span-1 lg:col-span-1',
                large: 'md:col-span-2 lg:col-span-2'
              }[gridSize];

              return (
                <motion.div
                  key={widget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${sizeClasses}`}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{widget.title}</h3>
                  <Component />
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BaseDashboardLayout;

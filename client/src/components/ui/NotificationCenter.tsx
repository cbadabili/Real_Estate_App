
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Heart,
  MessageSquare,
  Calendar,
  TrendingUp,
  Home,
  Users,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'property' | 'message' | 'appointment' | 'market';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  propertyId?: number;
  userId?: number;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'property' | 'messages'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'property':
        return <Home className="h-5 w-5 text-beedab-blue" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'market':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'property':
        return notification.type === 'property';
      case 'messages':
        return notification.type === 'message';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'property', label: 'Properties' },
                  { key: 'messages', label: 'Messages' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                      filter === tab.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="w-full mt-3 py-2 text-sm text-beedab-blue hover:text-beedab-darkblue font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Bell className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="text-sm">No notifications found</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        notification.read
                          ? 'bg-gray-50 hover:bg-gray-100'
                          : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-beedab-blue'
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          onMarkAsRead(notification.id);
                        }
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-2 ml-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-beedab-blue rounded-full" />
                              )}
                            </div>
                          </div>
                          <p className={`text-sm mt-1 ${
                            notification.read ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Notification Hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'property',
        title: 'New property match',
        message: 'Found a 3-bedroom house in Gaborone West matching your criteria',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        read: false,
        actionUrl: '/properties/123'
      },
      {
        id: '2',
        type: 'message',
        title: 'New inquiry received',
        message: 'Thabo Molefe is interested in your property listing',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        read: false,
        actionUrl: '/dashboard/inquiries'
      },
      {
        id: '3',
        type: 'appointment',
        title: 'Viewing scheduled',
        message: 'Property viewing confirmed for tomorrow at 2:00 PM',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        read: true,
        actionUrl: '/dashboard/appointments'
      },
      {
        id: '4',
        type: 'market',
        title: 'Market update',
        message: 'Properties in your area increased by 5% this month',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: true,
        actionUrl: '/market-insights'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isOpen,
    setIsOpen,
    markAsRead,
    markAllAsRead,
    unreadCount
  };
};

export default NotificationCenter;

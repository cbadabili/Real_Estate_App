import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save,
  Bell,
  Shield,
  CreditCard,
  Settings,
  Star,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'Austin, TX',
    bio: 'Experienced real estate professional with over 10 years in the industry.',
    reacNumber: 'REAC-2024-001234'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const achievements = [
    { icon: Star, label: 'Top Performer', description: '5-star average rating' },
    { icon: Award, label: 'Verified Agent', description: 'REAC certified professional' },
    { icon: TrendingUp, label: 'Rising Star', description: '50+ successful transactions' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save profile data
    console.log('Saving profile:', profileData);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Profile Settings</h1>
          <p className="text-neutral-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 p-1 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mt-3">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-neutral-600 text-sm">
                  {user?.type === 'agent' ? 'Licensed Agent' : 'Property Owner'}
                </p>
                {user?.type === 'agent' && (
                  <p className="text-xs text-neutral-500 mt-1">
                    REAC: {profileData.reacNumber}
                  </p>
                )}
              </div>

              {/* Achievements */}
              {user?.type === 'agent' && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Achievements</h4>
                  <div className="space-y-2">
                    {achievements.map((achievement, index) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-neutral-50 rounded-lg">
                          <Icon className="h-4 w-4 text-primary-600" />
                          <div>
                            <div className="text-xs font-medium text-neutral-900">{achievement.label}</div>
                            <div className="text-xs text-neutral-600">{achievement.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8"
            >
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {user?.type === 'agent' && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          REAC Registration Number
                        </label>
                        <input
                          type="text"
                          value={profileData.reacNumber}
                          onChange={(e) => handleInputChange('reacNumber', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          'New property matches',
                          'Price changes on saved properties',
                          'New messages from agents',
                          'Market updates and insights',
                          'Weekly property digest'
                        ].map((item, index) => (
                          <label key={index} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              defaultChecked={index < 3}
                              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-neutral-700">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Push Notifications</h3>
                      <div className="space-y-3">
                        {[
                          'Instant property alerts',
                          'New messages',
                          'Appointment reminders',
                          'Market alerts'
                        ].map((item, index) => (
                          <label key={index} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              defaultChecked={index < 2}
                              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-neutral-700">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Two-Factor Authentication</h3>
                      <p className="text-neutral-600 mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <button className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Billing & Subscription</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-neutral-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Current Plan</h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-primary-600">
                            {user?.type === 'agent' ? 'Professional' : 'FSBO Premium'}
                          </p>
                          <p className="text-neutral-600">
                            {user?.type === 'agent' ? '$99/month' : '$299 one-time'}
                          </p>
                        </div>
                        <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-colors">
                          Change Plan
                        </button>
                      </div>
                    </div>

                    <div className="border border-neutral-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Payment Method</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-primary-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-neutral-600">Expires 12/26</p>
                        </div>
                        <button className="ml-auto px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-colors">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-6">General Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Language
                          </label>
                          <select className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                            <option>English</option>
                            <option>Setswana</option>
                            <option>Afrikaans</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Currency
                          </label>
                          <select className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                            <option>USD ($)</option>
                            <option>BWP (P)</option>
                            <option>ZAR (R)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Time Zone
                          </label>
                          <select className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                            <option>Central Time (CT)</option>
                            <option>Eastern Time (ET)</option>
                            <option>Pacific Time (PT)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="border border-error-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-error-900 mb-4">Danger Zone</h3>
                      <p className="text-error-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg font-medium transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
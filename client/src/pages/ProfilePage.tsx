import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit, Save, Camera, Settings, Home, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../lib/queryClient';
import { getToken } from '@/lib/storage';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    savedProperties: 0,
    propertiesViewed: 0,
    inquiriesSent: 0,
    activeListings: 0
  });
  const [savedProperties, setSavedProperties] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    type: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
        location: 'Gaborone, Botswana', // Default location
        type: user.userType,
        bio: user.bio || ''
      });
      
      // Fetch user stats
      fetchUserStats();
      fetchSavedProperties();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await apiRequest('/api/dashboard/stats');
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const fetchSavedProperties = async () => {
    if (!user) return;
    try {
      const response = await apiRequest(`/api/users/${user.id}/saved-properties`);
      setSavedProperties(response || []);
    } catch (error) {
      console.error('Failed to fetch saved properties:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const nameParts = userInfo.name.split(' ');
      const updates = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: userInfo.phone,
        bio: userInfo.bio
      };
      
      const token = getToken();
      if (!token) {
        alert('Please log in again to save changes.');
        return;
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update failed:', errorData);
        throw new Error(`Failed to update profile: ${response.status}`);
      }
      
      const updatedUser = await response.json();
      
      // Update the user context with new data
      updateUser({
        ...user,
        firstName: updates.firstName,
        lastName: updates.lastName,
        phone: updates.phone,
        bio: updates.bio
      });
      
      // Update local state
      setUserInfo({
        ...userInfo,
        name: `${updates.firstName} ${updates.lastName}`.trim()
      });
      
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={userInfo.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-beedab-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userInfo.name ? userInfo.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
              )}
              <button 
                onClick={() => {
                  // TODO: Implement photo upload functionality
                  alert('Photo upload functionality coming soon!');
                }}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-beedab-blue"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      className="text-2xl font-bold text-gray-900 border border-gray-300 rounded px-2 py-1 mb-2"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{userInfo.name}</h1>
                  )}
                  <span className="inline-block px-2 py-1 bg-beedab-blue/10 text-beedab-blue text-sm rounded-full capitalize">
                    {userInfo.type}
                  </span>
                </div>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors"
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  <span>{isEditing ? 'Save' : 'Edit'}</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled
                      title="Email cannot be changed"
                    />
                  ) : (
                    <span>{userInfo.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span>{userInfo.phone}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={userInfo.location}
                      onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span>{userInfo.location}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {isEditing ? (
              <textarea
                value={userInfo.bio}
                onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            ) : (
              <p className="text-gray-600">{userInfo.bio}</p>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* My Activity */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Home className="h-5 w-5 mr-2 text-beedab-blue" />
              My Activity
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Properties Listed</p>
                  <p className="text-sm text-gray-600">Active listings</p>
                </div>
                <span className="text-2xl font-bold text-beedab-blue">{stats.activeListings}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Saved Properties</p>
                  <p className="text-sm text-gray-600">Favorites</p>
                </div>
                <span className="text-2xl font-bold text-beedab-blue">{stats.savedProperties}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Inquiries Sent</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
                <span className="text-2xl font-bold text-beedab-blue">{stats.inquiriesSent}</span>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full mt-4 px-4 py-2 border border-beedab-blue text-beedab-blue rounded-lg hover:bg-beedab-blue hover:text-white transition-colors"
            >
              View All Activity
            </button>
          </motion.div>

          {/* Saved Properties */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-beedab-blue" />
              Recent Saves
            </h2>
            
            <div className="space-y-3">
              {savedProperties.length > 0 ? savedProperties.slice(0, 2).map((property, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => window.location.href = `/property/${property.id}`}
                >
                  <img
                    src={property.imageUrl || 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
                    alt={property.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{property.title}</p>
                    <p className="text-xs text-gray-600">{property.location}</p>
                    <p className="text-sm font-semibold text-beedab-blue">P{property.price?.toLocaleString()}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No saved properties yet</p>
                  <button 
                    onClick={() => window.location.href = '/buy'}
                    className="text-beedab-blue text-sm hover:underline mt-1"
                  >
                    Start browsing properties
                  </button>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => window.location.href = '/my-properties?tab=saved'}
              className="w-full mt-4 px-4 py-2 border border-beedab-blue text-beedab-blue rounded-lg hover:bg-beedab-blue hover:text-white transition-colors"
            >
              View All Saved
            </button>
          </motion.div>
        </div>

        {/* Account Settings */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-beedab-blue" />
            Account Settings
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => alert('Notification preferences coming soon!')}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-beedab-blue hover:bg-beedab-blue/5 transition-colors"
            >
              <span className="font-medium text-gray-900">Notification Preferences</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button 
              onClick={() => alert('Privacy settings coming soon!')}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-beedab-blue hover:bg-beedab-blue/5 transition-colors"
            >
              <span className="font-medium text-gray-900">Privacy Settings</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button 
              onClick={() => {
                const newPassword = prompt('Enter new password:');
                if (newPassword) {
                  alert('Password change functionality coming soon!');
                }
              }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-beedab-blue hover:bg-beedab-blue/5 transition-colors"
            >
              <span className="font-medium text-gray-900">Change Password</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion functionality coming soon!');
                }
              }}
              className="flex items-center justify-between p-4 border border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
            >
              <span className="font-medium text-red-600">Delete Account</span>
              <span className="text-red-400">→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
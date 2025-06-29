import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit, Save, Camera, Settings, Home, Heart } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+267 7123 4567',
    location: 'Gaborone, Botswana',
    type: 'buyer',
    bio: 'Looking for a family home in Gaborone area with good schools nearby.'
  });

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

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the data to your backend
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
              <div className="w-24 h-24 bg-beedab-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-beedab-blue">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{userInfo.name}</h1>
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
                <span className="text-2xl font-bold text-beedab-blue">3</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Saved Properties</p>
                  <p className="text-sm text-gray-600">Favorites</p>
                </div>
                <span className="text-2xl font-bold text-beedab-blue">7</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Inquiries Sent</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
                <span className="text-2xl font-bold text-beedab-blue">12</span>
              </div>
            </div>
            
            <button className="w-full mt-4 px-4 py-2 border border-beedab-blue text-beedab-blue rounded-lg hover:bg-beedab-blue hover:text-white transition-colors">
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
              {[
                {
                  title: 'Modern Family Home',
                  location: 'Gaborone West',
                  price: 'P2,500,000',
                  image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
                },
                {
                  title: 'Luxury Apartment',
                  location: 'Francistown CBD',
                  price: 'P1,800,000',
                  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
                }
              ].map((property, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{property.title}</p>
                    <p className="text-xs text-gray-600">{property.location}</p>
                    <p className="text-sm font-semibold text-beedab-blue">{property.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 px-4 py-2 border border-beedab-blue text-beedab-blue rounded-lg hover:bg-beedab-blue hover:text-white transition-colors">
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
            <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-beedab-blue hover:bg-beedab-blue/5 transition-colors">
              <span className="font-medium text-gray-900">Notification Preferences</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-beedab-blue hover:bg-beedab-blue/5 transition-colors">
              <span className="font-medium text-gray-900">Privacy Settings</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-beedab-blue hover:bg-beedab-blue/5 transition-colors">
              <span className="font-medium text-gray-900">Change Password</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-beedab-blue hover:bg-beedab-blue/5 transition-colors">
              <span className="font-medium text-gray-900">Delete Account</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
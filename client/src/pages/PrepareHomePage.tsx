
import React from 'react';
import { motion } from 'framer-motion';
import { Home, CheckCircle, Camera, Paintbrush, Wrench, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrepareHomePage: React.FC = () => {
  const navigate = useNavigate();

  const preparationTips = [
    {
      icon: Paintbrush,
      title: 'Declutter and Clean',
      description: 'Remove personal items and deep clean every room to help buyers envision themselves in the space.',
      checklist: ['Remove family photos', 'Clear countertops', 'Deep clean carpets', 'Organize closets']
    },
    {
      icon: Wrench,
      title: 'Make Minor Repairs',
      description: 'Fix small issues that could become red flags during inspections.',
      checklist: ['Fix leaky faucets', 'Repair cracked tiles', 'Touch up paint', 'Replace broken fixtures']
    },
    {
      icon: Camera,
      title: 'Enhance Curb Appeal',
      description: 'First impressions matter - make sure your home looks inviting from the street.',
      checklist: ['Maintain the garden', 'Clean windows', 'Power wash exterior', 'Update front door']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-500 hover:text-beedab-blue"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Prepare Your Home</h1>
              <p className="text-gray-600">Get your property ready for sale with our staging and improvement guide</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {preparationTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-beedab-blue rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-gray-900">{tip.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{tip.description}</p>
                  
                  <div className="space-y-2">
                    {tip.checklist.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 bg-beedab-blue/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Services</h3>
            <p className="text-gray-600 mb-4">
              Need help preparing your home? Our network of professionals can assist with staging, repairs, and improvements.
            </p>
            <div className="flex space-x-4">
              <button className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
                Find Staging Services
              </button>
              <button className="border border-beedab-blue text-beedab-blue px-6 py-2 rounded-lg hover:bg-beedab-blue hover:text-white transition-colors">
                Find Contractors
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrepareHomePage;

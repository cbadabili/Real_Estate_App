
import React from 'react';
import ServiceCard from './ServiceCard';

const SectionContent = ({ 
  selectedCategory, 
  categories, 
  services, 
  featuredServices,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories
          .filter(cat => cat.type === selectedCategory)
          .map(category => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-blue-600 font-medium">
                  {category.providerCount} providers available
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Featured Services */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Featured Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices
            .filter(service => service.category === selectedCategory)
            .map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
        </div>
      </div>

      {/* All Services */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">All Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter(service => service.category === selectedCategory)
            .map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SectionContent;

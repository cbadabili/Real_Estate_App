import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Scale, 
  Truck, 
  Calculator, 
  Shield, 
  Home,
  ArrowRight,
  Star,
  Award
} from 'lucide-react';

interface ServiceShowcaseProps {
  className?: string;
}

const ServicesShowcase: React.FC<ServiceShowcaseProps> = ({ className = '' }) => {
  const sampleServices = [
    {
      id: 1,
      companyName: "Motswana Visuals",
      serviceCategory: "Photography",
      rating: "4.8",
      reviewCount: 47,
      reacCertified: true,
      verified: true,
      description: "Professional property photography and virtual tours across Botswana.",
      icon: Camera,
      featured: true
    },
    {
      id: 2,
      companyName: "Mogapi & Associates",
      serviceCategory: "Legal",
      rating: "4.9",
      reviewCount: 156,
      reacCertified: true,
      verified: true,
      description: "Leading property law firm specializing in conveyancing and real estate transactions.",
      icon: Scale,
      featured: true
    },
    {
      id: 3,
      companyName: "Diamond Movers",
      serviceCategory: "Moving",
      rating: "4.5",
      reviewCount: 78,
      reacCertified: false,
      verified: true,
      description: "Professional moving services across Botswana with full insurance coverage.",
      icon: Truck,
      featured: false
    },
    {
      id: 4,
      companyName: "BotsBond Mortgage Brokers",
      serviceCategory: "Finance",
      rating: "4.8",
      reviewCount: 234,
      reacCertified: true,
      verified: true,
      description: "Leading mortgage brokers helping secure the best home loan rates.",
      icon: Calculator,
      featured: true
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Verified Service Providers
        </h3>
        <p className="text-gray-600">
          Connect with trusted professionals for all your property needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleServices.map((service, index) => {
          const Icon = service.icon;
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-beedab-blue/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-beedab-blue" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {service.companyName}
                    </h4>
                    {service.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{service.serviceCategory}</p>
                  
                  <div className="flex items-center space-x-3 mb-2">
                    {service.verified && (
                      <span className="flex items-center space-x-1 text-green-600 text-xs">
                        <Shield className="h-3 w-3" />
                        <span>Verified</span>
                      </span>
                    )}
                    {service.reacCertified && (
                      <span className="flex items-center space-x-1 text-blue-600 text-xs">
                        <Award className="h-3 w-3" />
                        <span>REAC</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium">{service.rating}</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      ({service.reviewCount} reviews)
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {service.description}
                  </p>
                  
                  <button className="text-beedab-blue text-xs font-medium hover:text-beedab-darkblue flex items-center space-x-1">
                    <span>View Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <a
          href="/services"
          className="inline-flex items-center space-x-2 bg-beedab-blue text-white px-6 py-3 rounded-lg hover:bg-beedab-darkblue transition-colors"
        >
          <span>Browse All Services</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default ServicesShowcase;

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, Wrench, GraduationCap, Briefcase, Users, Star, TrendingUp, Clock } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';

const MarketplacePage: React.FC = () => {
  const marketplaceCategories = [
    {
      id: 'professionals',
      title: 'Find a Pro',
      emoji: '🏠',
      description: 'Professional services for your property journey',
      subcategories: ['Real Estate Agents', 'Lawyers & Conveyancers', 'Architects', 'Property Valuers', 'Financial Advisors'],
      stats: { providers: 150, reviews: 1200, avgRating: 4.8 },
      link: '/marketplace/professionals',
      color: 'blue'
    },
    {
      id: 'suppliers',
      title: 'Find a Supplier',
      emoji: '🧱',
      description: 'Building materials and construction supplies',
      subcategories: ['Building Materials', 'Hardware & Tools', 'Plumbing Supplies', 'Electrical Materials', 'Landscaping'],
      stats: { providers: 85, reviews: 650, avgRating: 4.6 },
      link: '/marketplace/suppliers',
      color: 'green'
    },
    {
      id: 'trades',
      title: 'Find a Trade',
      emoji: '🔨',
      description: 'Skilled tradespeople and artisans',
      subcategories: ['Plumbers', 'Electricians', 'Carpenters', 'Painters', 'Roofers', 'Tilers'],
      stats: { providers: 200, reviews: 1800, avgRating: 4.7 },
      link: '/marketplace/trades',
      color: 'orange'
    },
    {
      id: 'training',
      title: 'Find a Course',
      emoji: '🎓',
      description: 'Training and skill development programs',
      subcategories: ['Construction Skills', 'Real Estate Courses', 'Business Training', 'Digital Skills', 'Certification Programs'],
      stats: { providers: 45, reviews: 320, avgRating: 4.9 },
      link: '/marketplace/training',
      color: 'purple'
    }
  ];

  const recentActivity = [
    { type: 'project', title: 'Kitchen Renovation in Gaborone', budget: 'P15,000 - P25,000', time: '2 hours ago' },
    { type: 'training', title: 'Property Management Certification', price: 'P2,500', time: '4 hours ago' },
    { type: 'supplier', title: 'Bulk Cement Order - Francistown', quantity: '50 bags', time: '6 hours ago' },
    { type: 'professional', title: 'Conveyancing Services Needed', location: 'Maun', time: '8 hours ago' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="BeeDab Marketplace" 
        subtitle="Your one-stop destination for all property ecosystem services in Botswana"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Marketplace Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {marketplaceCategories.map((category) => (
            <Link 
              key={category.id} 
              to={category.link}
              className={`block p-6 border-2 rounded-xl transition-all duration-200 ${getColorClasses(category.color)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{category.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 3).map((sub, index) => (
                    <span key={index} className="px-2 py-1 bg-white rounded-full text-xs text-gray-600 border">
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="px-2 py-1 bg-white rounded-full text-xs text-gray-500 border">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {category.stats.providers} providers
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {category.stats.avgRating}
                  </span>
                </div>
                <span className="text-blue-600 font-medium">Browse →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Project Requests Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Project Requests</h2>
                <p className="text-gray-600">Post your project and get proposals from qualified professionals</p>
              </div>
            </div>
            <Link 
              to="/marketplace/projects/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post Project
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">120+</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">24h</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-gray-600">Latest requests and opportunities in the marketplace</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      {activity.budget && <span>Budget: {activity.budget}</span>}
                      {activity.price && <span>Price: {activity.price}</span>}
                      {activity.quantity && <span>Quantity: {activity.quantity}</span>}
                      {activity.location && <span>Location: {activity.location}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              to="/marketplace/activity"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Activity →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;

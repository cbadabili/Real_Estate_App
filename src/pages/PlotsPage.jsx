import { useState } from 'react';
import { Search, Filter, MapPin, Ruler, Zap, Droplets } from 'lucide-react';

const PlotsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    minSize: '',
    maxSize: '',
    sizeUnit: 'm²',
    minPrice: '',
    maxPrice: '',
    plotType: '',
    hasWater: false,
    hasElectricity: false,
    serviced: false
  });

  // Sample plots data
  const plots = [
    {
      id: 1,
      title: 'Residential Plot in Mogoditshane Block 5',
      location: 'Mogoditshane Block 5',
      size: 1000,
      sizeUnit: 'm²',
      price: 'P85,000',
      plotType: 'Residential',
      hasWater: true,
      hasElectricity: true,
      serviced: true,
      description: 'Prime residential plot in established area. All utilities available, tarred road access. Close to schools and shopping centers.',
      sellerName: 'Thabo Mogami',
      contactPhone: '71234567',
      postedDate: '2 days ago',
      image: 'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'Farm Land - Mahalapye District',
      location: 'Mahalapye',
      size: 5,
      sizeUnit: 'hectares',
      price: 'P120,000',
      plotType: 'Farm',
      hasWater: false,
      hasElectricity: false,
      serviced: false,
      description: 'Excellent farming land suitable for cattle ranching or crop farming. Good soil quality, seasonal access road.',
      sellerName: 'Keabetswe Mthombeni',
      contactPhone: '72345678',
      postedDate: '1 week ago',
      image: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      title: 'Commercial Plot - Pitsane Junction',
      location: 'Pitsane',
      size: 2000,
      sizeUnit: 'm²',
      price: 'P150,000',
      plotType: 'Commercial',
      hasWater: true,
      hasElectricity: true,
      serviced: true,
      description: 'Strategic commercial plot at busy junction. Perfect for retail or service business. High visibility location.',
      sellerName: 'Neo Seretse',
      contactPhone: '73456789',
      postedDate: '3 days ago',
      image: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const popularLocations = [
    'Mogoditshane Block 5',
    'Manyana Plateau', 
    'Mahalapye',
    'Pitsane',
    'Gaborone',
    'Francistown'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plots & Land</h1>
              <p className="text-gray-600 mt-1">Find your perfect plot in Botswana's prime locations</p>
            </div>
            
            <button className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
              List Your Plot
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-beedab-blue" />
                <h3 className="text-lg font-semibold text-gray-900">Search Plots</h3>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  {popularLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Plot Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="inline h-4 w-4 mr-1" />
                  Plot Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minSize}
                    onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxSize}
                    onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  />
                  <select
                    value={filters.sizeUnit}
                    onChange={(e) => setFilters({ ...filters, sizeUnit: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  >
                    <option value="m²">m²</option>
                    <option value="hectares">hectares</option>
                  </select>
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (BWP)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                  />
                </div>
              </div>

              {/* Plot Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plot Type
                </label>
                <select
                  value={filters.plotType}
                  onChange={(e) => setFilters({ ...filters, plotType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                >
                  <option value="">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="farm">Farm Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Amenities Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities Available
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasWater}
                      onChange={(e) => setFilters({ ...filters, hasWater: e.target.checked })}
                      className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
                    />
                    <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-sm">Water Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasElectricity}
                      onChange={(e) => setFilters({ ...filters, hasElectricity: e.target.checked })}
                      className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
                    />
                    <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="text-sm">Electricity Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.serviced}
                      onChange={(e) => setFilters({ ...filters, serviced: e.target.checked })}
                      className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
                    />
                    <span className="text-sm">Fully Serviced Plot</span>
                  </label>
                </div>
              </div>

              <button className="w-full bg-beedab-blue text-white py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Plots Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {plots.length} plots found
              </h2>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue">
                <option>Sort by: Most Recent</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Size: Largest First</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plots.map(plot => (
                <div key={plot.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{plot.title}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{plot.location}</span>
                        </div>
                      </div>
                      
                      {/* Service Status Badge */}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plot.serviced 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {plot.serviced ? 'Serviced' : 'Unserviced'}
                      </div>
                    </div>

                    {/* Key Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          {plot.size} {plot.sizeUnit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-beedab-blue">
                          {plot.price}
                        </span>
                      </div>
                    </div>

                    {/* Plot Type & Amenities */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                        {plot.plotType}
                      </span>
                      
                      {plot.hasWater && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center">
                          <Droplets className="h-3 w-3 mr-1" />
                          Water
                        </span>
                      )}
                      
                      {plot.hasElectricity && (
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          Power
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {plot.description}
                    </p>

                    {/* Seller Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>Posted by {plot.sellerName}</span>
                      <span>{plot.postedDate}</span>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                        Call Seller
                      </button>
                      
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotsPage;